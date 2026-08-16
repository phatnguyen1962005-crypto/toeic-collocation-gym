"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { collocations, type Collocation } from "./collocations";

type Screen = "setup" | "quiz" | "result";
type DeckFilter = "all" | "core" | "noun" | "email" | "verb-pattern" | "preposition";
type AnswerRecord = { item: Collocation; chosen: string; correct: boolean };

const shuffle = <T,>(values: T[]) => {
  const next = [...values];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [next[index], next[swap]] = [next[swap], next[index]];
  }
  return next;
};

function buildOptions(item: Collocation) {
  const sameTopic = collocations.filter(
    (candidate) => candidate.en !== item.en && candidate.topic === item.topic,
  );
  const fallback = collocations.filter((candidate) => candidate.en !== item.en);
  const source = sameTopic.length >= 3 ? sameTopic : fallback;
  const uniqueDistractors = [...new Map(shuffle(source).map((candidate) => [candidate.en, candidate])).values()]
    .slice(0, 3)
    .map((candidate) => candidate.en);
  return shuffle([item.en, ...uniqueDistractors]);
}

function formatAnswer(item: Collocation) {
  if (item.kind === "verb-pattern" && item.pattern) {
    return item.pattern.replace("___", item.en);
  }
  return item.en;
}

const deckLabels: Array<{ id: DeckFilter; label: string; icon: string }> = [
  { id: "all", label: "Tất cả", icon: "✦" },
  { id: "core", label: "Collocation", icon: "↗" },
  { id: "noun", label: "Cụm danh từ", icon: "N" },
  { id: "email", label: "Email", icon: "@" },
  { id: "verb-pattern", label: "V-pattern", icon: "V" },
  { id: "preposition", label: "Giới từ", icon: "P" },
];

function filterDeck(filter: DeckFilter) {
  if (filter === "core") return collocations.filter((item) => !item.topic.startsWith("Cụm danh từ") && !item.kind);
  if (filter === "noun") return collocations.filter((item) => item.topic.startsWith("Cụm danh từ"));
  if (filter === "email") return collocations.filter((item) => item.topic.includes("Email"));
  if (filter === "verb-pattern") return collocations.filter((item) => item.kind === "verb-pattern");
  if (filter === "preposition") return collocations.filter((item) => item.kind === "preposition");
  return collocations;
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("setup");
  const [deckFilter, setDeckFilter] = useState<DeckFilter>("all");
  const [questionCount, setQuestionCount] = useState(20);
  const [questions, setQuestions] = useState<Collocation[]>([]);
  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const storedBest = window.localStorage.getItem("toeic-collocation-best");
    const storedSound = window.localStorage.getItem("toeic-collocation-sound");
    // Restoring browser-only preferences after hydration is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (storedBest) setBestScore(Number(storedBest));
    if (storedSound) setSoundOn(storedSound === "on");
  }, []);

  const activePool = useMemo(() => filterDeck(deckFilter), [deckFilter]);
  const sessionChoices = useMemo(
    () => [...new Set([10, 20, 50, activePool.length])].filter((count) => count <= activePool.length),
    [activePool.length],
  );

  const current = questions[index];
  const correctCount = answers.filter((answer) => answer.correct).length;
  const progress = questions.length ? ((index + (selected ? 1 : 0)) / questions.length) * 100 : 0;

  const playSound = useCallback((correct: boolean) => {
    if (!soundOn || typeof window === "undefined" || !window.AudioContext) return;
    try {
      const context = audioRef.current ?? new window.AudioContext();
      audioRef.current = context;
      if (context.state === "suspended") void context.resume();
      const notes = correct ? [523.25, 659.25, 783.99] : [220, 164.81];
      const now = context.currentTime;
      notes.forEach((frequency, noteIndex) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const start = now + noteIndex * (correct ? 0.07 : 0.1);
        oscillator.type = correct ? "sine" : "triangle";
        oscillator.frequency.setValueAtTime(frequency, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(correct ? 0.12 : 0.085, start + 0.018);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(start);
        oscillator.stop(start + 0.17);
      });
    } catch {
      // Audio is a progressive enhancement; the quiz remains fully usable without it.
    }
  }, [soundOn]);

  const toggleSound = () => {
    setSoundOn((previous) => {
      const next = !previous;
      window.localStorage.setItem("toeic-collocation-sound", next ? "on" : "off");
      return next;
    });
  };

  const selectDeck = (filter: DeckFilter) => {
    const nextPoolLength = filterDeck(filter).length;
    setDeckFilter(filter);
    setQuestionCount((previous) => previous > nextPoolLength ? Math.min(20, nextPoolLength) : previous);
  };

  const startQuiz = useCallback((customQuestions?: Collocation[]) => {
    const deck = customQuestions ?? shuffle(activePool).slice(0, Math.min(questionCount, activePool.length));
    if (!deck.length) return;
    setQuestions(deck);
    setIndex(0);
    setAnswers([]);
    setStreak(0);
    setSelected(null);
    setOptions(buildOptions(deck[0]));
    setScreen("quiz");
  }, [activePool, questionCount]);

  const chooseAnswer = useCallback((answer: string) => {
    if (!current || selected) return;
    const correct = answer === current.en;
    setSelected(answer);
    setAnswers((previous) => [...previous, { item: current, chosen: answer, correct }]);
    setStreak((previous) => (correct ? previous + 1 : 0));
    playSound(correct);
  }, [current, playSound, selected]);

  const nextQuestion = useCallback(() => {
    if (!selected) return;
    if (index === questions.length - 1) {
      const finalScore = Math.round((correctCount / questions.length) * 100);
      if (finalScore > bestScore) {
        setBestScore(finalScore);
        window.localStorage.setItem("toeic-collocation-best", String(finalScore));
      }
      setScreen("result");
      return;
    }
    const nextIndex = index + 1;
    setIndex(nextIndex);
    setOptions(buildOptions(questions[nextIndex]));
    setSelected(null);
  }, [bestScore, correctCount, index, questions, selected]);

  useEffect(() => {
    if (screen !== "quiz") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (!selected && ["1", "2", "3", "4"].includes(event.key)) {
        const answer = options[Number(event.key) - 1];
        if (answer) chooseAnswer(answer);
      } else if (selected && event.key === "Enter") {
        nextQuestion();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [chooseAnswer, nextQuestion, options, screen, selected]);

  const wrongAnswers = useMemo(() => answers.filter((answer) => !answer.correct), [answers]);
  const finalPercent = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;
  const isVerbPattern = current?.kind === "verb-pattern";
  const questionLabel = isVerbPattern
    ? "Chọn động từ đúng để hoàn thành mẫu:"
    : current?.kind === "preposition"
      ? "Chọn cụm tiếng Anh đúng với nghĩa:"
      : "Chọn collocation tiếng Anh đúng với:";

  return (
    <main className="app-shell">
      <div className="ambient-orb orb-one" aria-hidden="true" />
      <div className="ambient-orb orb-two" aria-hidden="true" />
      <header className="topbar">
        <button className="brand" onClick={() => setScreen("setup")} aria-label="Về trang chính">
          <span className="brand-mark">C</span>
          <span>Collocation<span className="brand-accent">Gym</span></span>
          <span className="version-badge">V3</span>
        </button>
        <div className="top-stats" aria-label="Thống kê">
          <span><b>{collocations.length}</b> mục học</span>
          <span className="best-chip">Kỷ lục <b>{bestScore}%</b></span>
          <button className="sound-toggle" onClick={toggleSound} aria-label={soundOn ? "Tắt âm thanh" : "Bật âm thanh"} title={soundOn ? "Tắt âm thanh" : "Bật âm thanh"}>
            <span className={soundOn ? "sound-waves active" : "sound-waves"}>{soundOn ? "♪" : "×"}</span>
          </button>
        </div>
      </header>

      {screen === "setup" && (
        <section className="setup-grid screen-enter">
          <div className="hero-copy">
            <p className="eyebrow"><span className="live-dot" /> TOEIC WRITING PATTERN GYM</p>
            <h1>Nhìn nghĩa, nhìn mẫu.<br /><em>Bật đúng tiếng Anh.</em></h1>
            <p className="hero-description">
              Luyện collocation, cụm danh từ, V-pattern và giới từ theo đúng kiểu dùng trong TOEIC Writing.
              Sai ở đâu, gom lại luyện tiếp ở đó.
            </p>
            <div className="hero-metrics">
              <div><strong>{collocations.length}</strong><span>MỤC THỰC CHIẾN</span></div>
              <div><strong>{new Set(collocations.map((item) => item.topic)).size}</strong><span>NHÓM CHỦ ĐỀ</span></div>
              <div><strong>∞</strong><span>LƯỢT ÔN SAI</span></div>
            </div>
            <div className="feature-row">
              <span>V + V-ing / to V</span><i />
              <span>Cụm giới từ</span><i />
              <span>Ôn câu sai</span>
            </div>
          </div>

          <div className="setup-card">
            <div className="card-number">{collocations.length}</div>
            <p className="label"><span>01</span> Chọn bộ muốn luyện</p>
            <div className="deck-picker" role="group" aria-label="Chọn bộ kiến thức">
              {deckLabels.map((deck) => {
                const count = filterDeck(deck.id).length;
                return (
                  <button key={deck.id} className={deckFilter === deck.id ? "active" : ""} onClick={() => selectDeck(deck.id)}>
                    <span className="deck-symbol">{deck.icon}</span>
                    <span><b>{deck.label}</b><small>{count} mục</small></span>
                  </button>
                );
              })}
            </div>

            <p className="label session-label"><span>02</span> Chọn độ dài buổi tập</p>
            <div className="count-picker" role="group" aria-label="Số lượng câu hỏi">
              {sessionChoices.map((count) => (
                <button key={count} className={questionCount === count ? "active" : ""} onClick={() => setQuestionCount(count)}>
                  <b>{count === activePool.length ? "ALL" : count}</b>
                  <span>{count === activePool.length ? `${count} mục` : "câu"}</span>
                </button>
              ))}
            </div>
            <button className="primary-button" onClick={() => startQuiz()}>
              <span className="button-spark">✦</span> Bắt đầu luyện <span>→</span>
            </button>
            <p className="shortcut-note">Dùng phím <kbd>1</kbd>–<kbd>4</kbd> để chọn · <kbd>Enter</kbd> để tiếp tục</p>
          </div>
        </section>
      )}

      {screen === "quiz" && current && (
        <section className="quiz-wrap screen-enter">
          <div className="quiz-meta">
            <button className="quiet-button" onClick={() => setScreen("setup")}>← Thoát</button>
            <div className="counter"><b>{String(index + 1).padStart(2, "0")}</b> / {String(questions.length).padStart(2, "0")}</div>
            <div className={`streak ${streak >= 3 ? "on-fire" : ""}`}>🔥 <b>{streak}</b> streak</div>
          </div>
          <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>

          <article key={`${current.id}-${index}`} className={`question-card question-enter ${selected === current.en ? "correct-state" : selected ? "wrong-state" : ""}`}>
            <div className="topic-line"><span>{current.topic}</span><i /><b>#{current.id}</b></div>
            <p className="question-label">{questionLabel}</p>
            <h2 className={isVerbPattern ? "pattern-question" : ""}>{isVerbPattern ? current.pattern : current.vi}</h2>
            {isVerbPattern && <p className="question-hint">Nghĩa cần chọn: <b>{current.vi}</b></p>}
            <div className="answer-grid">
              {options.map((option, optionIndex) => {
                const isCorrect = Boolean(selected && option === current.en);
                const isWrong = selected === option && option !== current.en;
                return (
                  <button key={option} className={`answer-option ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`} onClick={() => chooseAnswer(option)} disabled={Boolean(selected)}>
                    <span className="option-key">{optionIndex + 1}</span>
                    <span>{option}</span>
                    {isCorrect && <b className="answer-icon">✓</b>}
                    {isWrong && <b className="answer-icon">×</b>}
                  </button>
                );
              })}
            </div>

            {selected && (
              <div className={`feedback feedback-enter ${selected === current.en ? "success" : "error"}`}>
                {selected === current.en && <div className="mini-burst" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>}
                <div>
                  <b>{selected === current.en ? (streak >= 3 ? `${streak} câu liên tiếp — quá bén!` : "Chuẩn bài!") : "Chưa đúng — khóa cụm này vào trí nhớ:"}</b>
                  <p><span>{current.vi}</span> → {formatAnswer(current)}</p>
                  {current.note && <small className="answer-note">⚑ {current.note}</small>}
                </div>
                <button onClick={nextQuestion}>{index === questions.length - 1 ? "Xem kết quả" : "Câu tiếp theo"} <span>→</span></button>
              </div>
            )}
          </article>
        </section>
      )}

      {screen === "result" && (
        <section className="result-wrap screen-enter">
          {finalPercent >= 70 && (
            <div className="confetti" aria-hidden="true">
              {Array.from({ length: 34 }, (_, piece) => (
                <i key={piece} style={{ "--x": `${(piece * 37) % 100}%`, "--delay": `${(piece % 9) * 0.08}s`, "--hue": `${(piece * 47) % 360}` } as React.CSSProperties} />
              ))}
            </div>
          )}
          <div className="score-orbit" style={{ "--score": `${finalPercent * 3.6}deg` } as React.CSSProperties}>
            <div><strong>{finalPercent}</strong><span>%</span><small>CHÍNH XÁC</small></div>
          </div>
          <p className="eyebrow">HOÀN THÀNH BUỔI TẬP</p>
          <h2>{finalPercent >= 80 ? "Phản xạ ngon rồi đó!" : finalPercent >= 60 ? "Đang lên tay rõ rệt." : "Luyện lại câu sai là nhớ ngay."}</h2>
          <p className="result-copy">Bạn đúng <b>{correctCount}/{questions.length}</b> câu và có <b>{wrongAnswers.length}</b> cụm cần ôn lại.</p>
          <div className="result-actions">
            {wrongAnswers.length > 0 && (
              <button className="primary-button" onClick={() => startQuiz(shuffle(wrongAnswers.map((answer) => answer.item)))}>
                Luyện lại câu sai <span>↻</span>
              </button>
            )}
            <button className="secondary-button" onClick={() => startQuiz()}>Làm bộ câu mới</button>
          </div>
          {wrongAnswers.length > 0 && (
            <div className="review-list">
              <div className="review-heading"><b>Cụm cần ôn</b><span>{wrongAnswers.length} mục</span></div>
              {wrongAnswers.map(({ item }) => (
                <div className="review-item" key={item.id}><span>{item.vi}</span><b>{formatAnswer(item)}</b></div>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
