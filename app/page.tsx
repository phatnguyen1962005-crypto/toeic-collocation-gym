"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { collocations, type Collocation } from "./collocations";

type Screen = "setup" | "quiz" | "result";
type DeckFilter = "all" | "core" | "noun" | "email" | "verb-pattern" | "preposition" | "saved" | "speaking";
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
  if (item.kind === "speaking") {
    const sameStep = collocations.filter(
      (candidate) => candidate.kind === "speaking" && candidate.en !== item.en && candidate.chunkStep === item.chunkStep,
    );
    const distractors = [...new Set(shuffle(sameStep).map((candidate) => candidate.en))].slice(0, 3);
    return shuffle([item.en, ...distractors]);
  }
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
  if ((item.kind === "verb-pattern" || item.kind === "speaking") && item.pattern) {
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
  { id: "saved", label: "Đã lưu", icon: "★" },
  { id: "speaking", label: "Idea Sprint", icon: "⚡" },
];

function filterDeck(filter: DeckFilter, savedIds: number[] = []) {
  if (filter === "all") return collocations.filter((item) => item.kind !== "speaking");
  if (filter === "core") return collocations.filter((item) => !item.topic.startsWith("Cụm danh từ") && !item.kind);
  if (filter === "noun") return collocations.filter((item) => item.topic.startsWith("Cụm danh từ"));
  if (filter === "email") return collocations.filter((item) => item.topic.includes("Email"));
  if (filter === "verb-pattern") return collocations.filter((item) => item.kind === "verb-pattern");
  if (filter === "preposition") return collocations.filter((item) => item.kind === "preposition");
  if (filter === "saved") return collocations.filter((item) => savedIds.includes(item.id) && item.kind !== "speaking");
  return collocations.filter((item) => item.kind === "speaking");
}

function buildSpeakingDeck(pool: Collocation[]) {
  const routes = [...new Set(pool.map((item) => item.topic))];
  return shuffle(routes).flatMap((route) =>
    pool
      .filter((item) => item.topic === route)
      .sort((first, second) => (first.chunkStep ?? 0) - (second.chunkStep ?? 0)),
  );
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("setup");
  const [deckFilter, setDeckFilter] = useState<DeckFilter>("all");
  const [questionCount, setQuestionCount] = useState(20);
  const [sessionSeconds, setSessionSeconds] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [questions, setQuestions] = useState<Collocation[]>([]);
  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const audioRef = useRef<AudioContext | null>(null);
  const answersRef = useRef<AnswerRecord[]>([]);
  const deadlineRef = useRef(0);

  useEffect(() => {
    const storedBest = window.localStorage.getItem("toeic-collocation-best");
    const storedSound = window.localStorage.getItem("toeic-collocation-sound");
    const storedSaved = window.localStorage.getItem("toeic-collocation-saved");
    // Restoring browser-only preferences after hydration is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (storedBest) setBestScore(Number(storedBest));
    if (storedSound) setSoundOn(storedSound === "on");
    if (storedSaved) {
      try {
        const parsed = JSON.parse(storedSaved);
        if (Array.isArray(parsed)) {
          const validWritingIds = parsed.filter((id): id is number =>
            typeof id === "number" && collocations.some((item) => item.id === id && item.kind !== "speaking"),
          );
          setSavedIds([...new Set(validWritingIds)]);
        }
      } catch {
        window.localStorage.removeItem("toeic-collocation-saved");
      }
    }
  }, []);

  const activePool = useMemo(() => filterDeck(deckFilter, savedIds), [deckFilter, savedIds]);
  const isSpeakingSetup = deckFilter === "speaking";
  const isSavedSetup = deckFilter === "saved";
  const isSpeakingSession = questions[0]?.kind === "speaking";
  const sessionChoices = useMemo(
    () => [...new Set([10, 20, 50, activePool.length])].filter((count) => count <= activePool.length),
    [activePool.length],
  );

  const current = questions[index];
  const correctCount = answers.filter((answer) => answer.correct).length;
  const progress = isSpeakingSession
    ? ((sessionSeconds - timeLeft) / sessionSeconds) * 100
    : questions.length ? ((index + (selected ? 1 : 0)) / questions.length) * 100 : 0;

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

  const toggleSaved = (itemId: number) => {
    setSavedIds((previous) => {
      const next = previous.includes(itemId)
        ? previous.filter((id) => id !== itemId)
        : [...previous, itemId];
      window.localStorage.setItem("toeic-collocation-saved", JSON.stringify(next));
      return next;
    });
  };

  const selectDeck = (filter: DeckFilter) => {
    const nextPoolLength = filterDeck(filter, savedIds).length;
    setDeckFilter(filter);
    setQuestionCount((previous) => {
      if (nextPoolLength === 0) return 0;
      if (previous === 0 || previous > nextPoolLength) return Math.min(20, nextPoolLength);
      return previous;
    });
  };

  const finishQuiz = useCallback(() => {
    const records = answersRef.current;
    const score = records.length
      ? Math.round((records.filter((answer) => answer.correct).length / records.length) * 100)
      : 0;
    setBestScore((previous) => {
      if (score <= previous) return previous;
      window.localStorage.setItem("toeic-collocation-best", String(score));
      return score;
    });
    setScreen("result");
  }, []);

  const startQuiz = useCallback((customQuestions?: Collocation[]) => {
    const deck = customQuestions ?? (deckFilter === "speaking"
      ? buildSpeakingDeck(activePool)
      : shuffle(activePool).slice(0, Math.min(questionCount, activePool.length)));
    if (!deck.length) return;
    setQuestions(deck);
    setIndex(0);
    setAnswers([]);
    answersRef.current = [];
    setStreak(0);
    setSelected(null);
    setOptions(buildOptions(deck[0]));
    setTimeLeft(sessionSeconds);
    deadlineRef.current = Date.now() + sessionSeconds * 1000;
    setScreen("quiz");
  }, [activePool, deckFilter, questionCount, sessionSeconds]);

  const chooseAnswer = useCallback((answer: string) => {
    if (!current || selected) return;
    const correct = answer === current.en;
    setSelected(answer);
    const record = { item: current, chosen: answer, correct };
    answersRef.current = [...answersRef.current, record];
    setAnswers(answersRef.current);
    setStreak((previous) => (correct ? previous + 1 : 0));
    playSound(correct);
  }, [current, playSound, selected]);

  const nextQuestion = useCallback(() => {
    if (!selected) return;
    if (index === questions.length - 1) {
      finishQuiz();
      return;
    }
    const nextIndex = index + 1;
    setIndex(nextIndex);
    setOptions(buildOptions(questions[nextIndex]));
    setSelected(null);
  }, [finishQuiz, index, questions, selected]);

  useEffect(() => {
    if (screen !== "quiz" || !isSpeakingSession) return;
    const timer = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        window.clearInterval(timer);
        finishQuiz();
      }
    }, 200);
    return () => window.clearInterval(timer);
  }, [finishQuiz, isSpeakingSession, screen]);

  useEffect(() => {
    if (screen !== "quiz" || !isSpeakingSession || !selected) return;
    const autoAdvance = window.setTimeout(nextQuestion, 650);
    return () => window.clearTimeout(autoAdvance);
  }, [isSpeakingSession, nextQuestion, screen, selected]);

  useEffect(() => {
    if (screen !== "quiz") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (!selected && ["1", "2", "3", "4"].includes(event.key)) {
        const answer = options[Number(event.key) - 1];
        if (answer) chooseAnswer(answer);
      } else if (selected && !isSpeakingSession && event.key === "Enter") {
        nextQuestion();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [chooseAnswer, isSpeakingSession, nextQuestion, options, screen, selected]);

  const wrongAnswers = useMemo(() => answers.filter((answer) => !answer.correct), [answers]);
  const finalPercent = answers.length ? Math.round((correctCount / answers.length) * 100) : 0;
  const isVerbPattern = current?.kind === "verb-pattern";
  const isSpeakingQuestion = current?.kind === "speaking";
  const questionLabel = isSpeakingQuestion
    ? "Choose the next chunk — keep the idea moving:"
    : isVerbPattern
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
          <span className="version-badge">V6</span>
        </button>
        <div className="top-stats" aria-label="Thống kê">
          <span><b>{collocations.length}</b> mục học</span>
          <span className="best-chip">Kỷ lục <b>{bestScore}%</b></span>
          <button className="saved-chip" onClick={() => { selectDeck("saved"); setScreen("setup"); }} title="Mở bộ Writing đã lưu">
            ★ <b>{savedIds.length}</b> đã lưu
          </button>
          <button className="sound-toggle" onClick={toggleSound} aria-label={soundOn ? "Tắt âm thanh" : "Bật âm thanh"} title={soundOn ? "Tắt âm thanh" : "Bật âm thanh"}>
            <span className={soundOn ? "sound-waves active" : "sound-waves"}>{soundOn ? "♪" : "×"}</span>
          </button>
        </div>
      </header>

      {screen === "setup" && (
        <section className="setup-grid screen-enter">
          <div className="hero-copy">
            <p className="eyebrow"><span className="live-dot" /> TOEIC WRITING + SPEAKING GYM</p>
            <h1>Nhìn mẫu, nối chunk.<br /><em>Bật ý thật nhanh.</em></h1>
            <p className="hero-description">
              Luyện collocation, V-pattern và giới từ cho Writing; bật Idea Sprint để nối chuỗi ý tiếng Anh
              có thể tái sử dụng cho nhiều chủ đề Speaking.
            </p>
            <div className="hero-metrics">
              <div><strong>{collocations.length}</strong><span>MỤC THỰC CHIẾN</span></div>
              <div><strong>{new Set(collocations.map((item) => item.topic)).size}</strong><span>NHÓM CHỦ ĐỀ</span></div>
              <div><strong>∞</strong><span>LƯỢT ÔN SAI</span></div>
            </div>
            <div className="feature-row">
              <span>V + V-ing / to V</span><i />
              <span>Cụm giới từ</span><i />
              <span>★ Lưu để ôn riêng</span><i />
              <span>Speaking idea chains</span>
            </div>
          </div>

          <div className="setup-card">
            <div className="card-number">{collocations.length}</div>
            <p className="label"><span>01</span> Chọn bộ muốn luyện</p>
            <div className="deck-picker" role="group" aria-label="Chọn bộ kiến thức">
              {deckLabels.map((deck) => {
                const count = filterDeck(deck.id, savedIds).length;
                const deckClass = [
                  deckFilter === deck.id ? "active" : "",
                  deck.id === "speaking" ? "speaking-deck" : "",
                  deck.id === "saved" ? "saved-deck" : "",
                ].filter(Boolean).join(" ");
                return (
                  <button key={deck.id} className={deckClass} onClick={() => selectDeck(deck.id)}>
                    <span className="deck-symbol">{deck.icon}</span>
                    <span><b>{deck.label}</b><small>{count} mục</small></span>
                  </button>
                );
              })}
            </div>

            <p className="label session-label"><span>02</span> {isSpeakingSetup ? "Chọn thời gian phản xạ" : "Chọn độ dài buổi tập"}</p>
            {isSavedSetup && activePool.length === 0 ? (
              <div className="empty-saved">
                <span>☆</span>
                <div><b>Chưa có mục nào được lưu</b><small>Vào một bộ Writing và bấm “Lưu ý” trên câu bạn muốn nhớ kỹ.</small></div>
              </div>
            ) : isSpeakingSetup ? (
              <div className="count-picker timer-picker" role="group" aria-label="Thời gian Speaking Sprint">
                {[30, 60, 90, 120].map((seconds) => (
                  <button key={seconds} className={sessionSeconds === seconds ? "active" : ""} onClick={() => setSessionSeconds(seconds)}>
                    <b>{seconds}</b><span>giây</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="count-picker" role="group" aria-label="Số lượng câu hỏi">
                {sessionChoices.map((count) => (
                  <button key={count} className={questionCount === count ? "active" : ""} onClick={() => setQuestionCount(count)}>
                    <b>{count === activePool.length ? "ALL" : count}</b>
                    <span>{count === activePool.length ? `${count} mục` : "câu"}</span>
                  </button>
                ))}
              </div>
            )}
            <button className="primary-button" onClick={() => startQuiz()} disabled={activePool.length === 0}>
              <span className="button-spark">✦</span> {activePool.length === 0 ? "Chưa có mục đã lưu" : isSpeakingSetup ? "Bắt đầu Idea Sprint" : isSavedSetup ? "Ôn bộ đã lưu" : "Bắt đầu luyện"} <span>→</span>
            </button>
            <p className="shortcut-note">
              {isSavedSetup && activePool.length === 0
                ? <>Dấu ★ được lưu ngay trên thiết bị này.</>
                : isSpeakingSetup
                ? <>Chọn bằng phím <kbd>1</kbd>–<kbd>4</kbd> · tự chuyển chunk sau 0.65 giây</>
                : <>Dùng phím <kbd>1</kbd>–<kbd>4</kbd> để chọn · <kbd>Enter</kbd> để tiếp tục</>}
            </p>
          </div>
        </section>
      )}

      {screen === "quiz" && current && (
        <section className="quiz-wrap screen-enter">
          <div className="quiz-meta">
            <button className="quiet-button" onClick={() => setScreen("setup")}>← Thoát</button>
            {isSpeakingSession ? (
              <div className={`sprint-timer ${timeLeft <= 10 ? "urgent" : ""}`}><span>TIME</span><b>{timeLeft}s</b></div>
            ) : (
              <div className="counter"><b>{String(index + 1).padStart(2, "0")}</b> / {String(questions.length).padStart(2, "0")}</div>
            )}
            <div className={`streak ${streak >= 3 ? "on-fire" : ""}`}>
              {isSpeakingSession ? <>⚡ <b>{answers.length}</b> chunks</> : <>🔥 <b>{streak}</b> streak</>}
            </div>
          </div>
          <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>

          <article key={`${current.id}-${index}`} className={`question-card question-enter ${!isSpeakingQuestion ? "writing-card" : ""} ${selected === current.en ? "correct-state" : selected ? "wrong-state" : ""}`}>
            {!isSpeakingQuestion && (
              <button
                className={`bookmark-button ${savedIds.includes(current.id) ? "saved" : ""}`}
                onClick={() => toggleSaved(current.id)}
                aria-label={savedIds.includes(current.id) ? "Bỏ khỏi bộ Writing đã lưu" : "Lưu mục Writing này để ôn riêng"}
                aria-pressed={savedIds.includes(current.id)}
                title={savedIds.includes(current.id) ? "Bỏ lưu" : "Lưu để ôn riêng"}
              >
                <span>{savedIds.includes(current.id) ? "★" : "☆"}</span>
                {savedIds.includes(current.id) ? "Đã lưu" : "Lưu ý"}
              </button>
            )}
            <div className="topic-line">
              <span>{current.topic}</span><i />
              <b>{isSpeakingQuestion ? `STEP ${(current.chunkStep ?? 0) + 1}/5` : `#${current.id}`}</b>
            </div>
            <p className="question-label">{questionLabel}</p>
            <h2 className={isVerbPattern || isSpeakingQuestion ? `pattern-question${isSpeakingQuestion ? " speaking-chain" : ""}` : ""}>
              {isVerbPattern || isSpeakingQuestion ? current.pattern : current.vi}
            </h2>
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
                  <b>{isSpeakingQuestion
                    ? selected === current.en ? "Clean connection — say the full chain aloud!" : "Reset fast — lock in the correct route:"
                    : selected === current.en ? (streak >= 3 ? `${streak} câu liên tiếp — quá bén!` : "Chuẩn bài!") : "Chưa đúng — khóa cụm này vào trí nhớ:"}</b>
                  <p>{isSpeakingQuestion ? formatAnswer(current) : <><span>{current.vi}</span> → {formatAnswer(current)}</>}</p>
                  {current.note && <small className="answer-note">⚑ {current.note}</small>}
                </div>
                {isSpeakingQuestion ? (
                  <div className="auto-next"><i /> NEXT CHUNK</div>
                ) : (
                  <button onClick={nextQuestion}>{index === questions.length - 1 ? "Xem kết quả" : "Câu tiếp theo"} <span>→</span></button>
                )}
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
          <p className="eyebrow">{isSpeakingSession ? "SPEAKING SPRINT COMPLETE" : "HOÀN THÀNH BUỔI TẬP"}</p>
          <h2>{isSpeakingSession
            ? finalPercent >= 80 ? "Your idea reflex is getting sharp." : finalPercent >= 60 ? "The chain is starting to flow." : "Repeat the routes and speed will follow."
            : finalPercent >= 80 ? "Phản xạ ngon rồi đó!" : finalPercent >= 60 ? "Đang lên tay rõ rệt." : "Luyện lại câu sai là nhớ ngay."}</h2>
          <p className="result-copy">{isSpeakingSession
            ? <>You processed <b>{answers.length} chunks</b> with <b>{correctCount}</b> correct connections.</>
            : <>Bạn đúng <b>{correctCount}/{answers.length}</b> câu và có <b>{wrongAnswers.length}</b> cụm cần ôn lại.</>}</p>
          <div className="result-actions">
            {wrongAnswers.length > 0 && (
              <button className="primary-button" onClick={() => startQuiz(shuffle(wrongAnswers.map((answer) => answer.item)))}>
                {isSpeakingSession ? "Repeat missed chunks" : "Luyện lại câu sai"} <span>↻</span>
              </button>
            )}
            <button className="secondary-button" onClick={() => startQuiz()}>{isSpeakingSession ? "Start another sprint" : "Làm bộ câu mới"}</button>
          </div>
          {wrongAnswers.length > 0 && (
            <div className="review-list">
              <div className="review-heading"><b>{isSpeakingSession ? "Routes to reconnect" : "Cụm cần ôn"}</b><span>{wrongAnswers.length} mục</span></div>
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
