const patterns = [
{id:1,meaning:"Mặc dù / dù cho … nhưng …",hint:"Nối hai ý tương phản.",formula:"Although / Even though + S + V, S + V",example:"Although the service is convenient, it can be expensive."},
{id:2,meaning:"Trong khi / trái lại …",hint:"Đối chiếu hai nhóm hoặc hai quan điểm.",formula:"While / Whereas + S + V, S + V",example:"While working from home saves time, working in an office allows better communication."},
{id:3,meaning:"Nếu … thì có thể / sẽ …",hint:"Điều kiện và kết quả có thể xảy ra.",formula:"If + S + V, S + will / can + V",example:"If companies provide flexible schedules, employees can achieve a better work-life balance."},
{id:4,meaning:"Trừ khi / nếu không …",hint:"Có nghĩa gần với “if … not”.",formula:"Unless + S + V, S + will / may + V",example:"Unless companies improve their services, they may lose customers."},
{id:5,meaning:"Bằng cách làm gì đó, ai đó có thể …",hint:"Giải pháp → lợi ích.",formula:"By + V-ing, S + can + V",example:"By using public transportation, people can reduce transportation costs."},
{id:6,meaning:"Cho phép / tạo điều kiện cho ai làm gì",hint:"Một thứ giúp người khác thực hiện hành động.",formula:"S + allow / enable + O + to V",example:"Technology allows employees to work remotely."},
{id:7,meaning:"Làm cho việc ai đó làm gì trở nên + tính từ",hint:"Diễn đạt tác động của công nghệ, chính sách, dịch vụ.",formula:"S + make it + adjective + for O + to V",example:"The Internet makes it easier for people to access information."},
{id:8,meaning:"Thật + tính từ + đối với ai đó để làm gì",hint:"Đánh giá mức độ quan trọng, khó, dễ, cần thiết.",formula:"It is + adjective + for O + to V",example:"It is important for companies to listen to their customers."},
{id:9,meaning:"Không còn nghi ngờ gì rằng …",hint:"Nhấn mạnh một nhận định khá chắc chắn.",formula:"There is no doubt that + S + V",example:"There is no doubt that technology plays an important role in modern life."},
{id:10,meaning:"Một trong những lý do chính tại sao … là vì …",hint:"Triển khai nguyên nhân trong essay.",formula:"One of the main reasons why + S + V + is that + S + V",example:"One of the main reasons why people prefer online shopping is that it saves time."},
{id:11,meaning:"Càng … thì càng …",hint:"Hai thay đổi có quan hệ với nhau.",formula:"The more + clause, the more + clause",example:"The more employees are trained, the more productive they become."},
{id:12,meaning:"Không những … mà còn …",hint:"Bổ sung hai lợi ích, đặc điểm hoặc hành động song song.",formula:"Not only + X + but also + Y",example:"Working from home not only saves commuting time but also reduces transportation costs."},
{id:13,meaning:"So với …",hint:"Mở đầu một câu so sánh.",formula:"Compared with / to + N, S + V",example:"Compared with traditional shopping, online shopping is more convenient."},
{id:14,meaning:"Thay vì làm A, chọn / làm B",hint:"Nhấn mạnh lựa chọn B thay cho A.",formula:"Rather than + V / V-ing, S + V",example:"Rather than driving to work, employees can use public transportation."},
{id:15,meaning:"Thay vì làm gì đó …",hint:"Sau instead of thường là danh từ hoặc V-ing.",formula:"Instead of + V-ing / N, S + V",example:"Instead of spending money on advertising, companies can invest in product quality."},
{id:16,meaning:"Có xu hướng làm gì",hint:"Tránh khẳng định tuyệt đối.",formula:"S + tend(s) to + V",example:"Younger consumers tend to shop online."},
{id:17,meaning:"Có khả năng sẽ làm gì",hint:"Diễn đạt khả năng / xu hướng có thể xảy ra.",formula:"S + be likely to + V",example:"Satisfied customers are likely to purchase from the company again."},
{id:18,meaning:"Dẫn đến / gây ra …",hint:"Nối nguyên nhân với kết quả.",formula:"S + lead to / result in + N / V-ing",example:"Long working hours can lead to stress."},
{id:19,meaning:"…, điều mà / việc này …",hint:"Mệnh đề quan hệ bổ sung kết quả hoặc thông tin.",formula:"Main clause, which + V ...",example:"The company introduced flexible working hours, which improved employee satisfaction."},
{id:20,meaning:"Sau khi đã làm xong …, ai đó …",hint:"Perfect participle: hành động hoàn tất trước hành động chính.",formula:"Having + V3, S + V",example:"Having completed the training program, employees can perform their tasks more efficiently."}
];

const distractors = [
"Despite + S + V, S + V","Because of + S + V, S + V","Although + N / V-ing, S + V","While + N + to V, S + V",
"If + S + will V, S + V","Unless + S + will V, S + V","By + to V, S + can + V","S + allow + O + V-ing",
"S + enable + O + V-ing","S + make + O + to V","It is + adjective + O + V","There has no doubt that + S + V",
"One of the main reason + S + V","The more + adjective, the most + adjective","Not only + X + and also + Y",
"Compared + N, S + V","Rather than + to V, S + V","Instead of + to V, S + V","S + tend + V-ing",
"S + be likely + V-ing","S + lead / result + N","Main clause, what + V ...","Having + V2, S + V",
"Because + N / V-ing, S + V","Due to + S + V, S + V","S + capable to + V","S + possible to + V",
"It makes easier + O + to V"
];

const defaultData = {
  correct:0, wrong:0, streak:0, best:0, marked:[], errorLog:[],
  perPattern:{}, settings:{sound:true,fx:true,adaptive:true}
};
let data = loadData();
let active=[], index=0, score=0, roundWrong=[], locked=false, mode="all";

const $=id=>document.getElementById(id);

function loadData(){
  try{
    const old=JSON.parse(localStorage.getItem("grammarGymProData")||"null");
    if(!old) return JSON.parse(JSON.stringify(defaultData));
    return {
      ...defaultData,...old,
      settings:{...defaultData.settings,...(old.settings||{})},
      perPattern:old.perPattern||{}, marked:old.marked||[], errorLog:old.errorLog||[]
    };
  }catch(e){return JSON.parse(JSON.stringify(defaultData));}
}
function save(){localStorage.setItem("grammarGymProData",JSON.stringify(data));renderGlobalStats();}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function statFor(id){if(!data.perPattern[id])data.perPattern[id]={correct:0,wrong:0};return data.perPattern[id]}
function accuracyFor(id){const s=statFor(id),t=s.correct+s.wrong;return t?s.correct/t:null}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function renderGlobalStats(){
  const total=data.correct+data.wrong;
  $("sCorrect").textContent=data.correct;
  $("sWrong").textContent=data.wrong;
  $("sAcc").textContent=total?Math.round(data.correct/total*100)+"%":"0%";
  $("sStreak").textContent=data.streak;
  $("sMarked").textContent=data.marked.length;
  $("soundTop").textContent=data.settings.sound?"🔊 Âm thanh":"🔇 Âm thanh";
  setSwitch("soundSwitch",data.settings.sound); setSwitch("fxSwitch",data.settings.fx); setSwitch("adaptiveSwitch",data.settings.adaptive);
}
function setSwitch(id,on){$(id).classList.toggle("on",!!on)}
function generateOptions(correct){return shuffle([correct,...shuffle(distractors.filter(x=>x!==correct)).slice(0,3)])}

function prioritizedAll(){
  let arr=[...patterns];
  if(data.settings.adaptive){
    arr.sort((a,b)=>{
      const aa=accuracyFor(a.id),bb=accuracyFor(b.id);
      const va=aa===null?.55:aa, vb=bb===null?.55:bb;
      return va-vb || Math.random()-.5;
    });
    for(let i=0;i<arr.length-1;i+=3){
      const sub=shuffle(arr.slice(i,i+3)); arr.splice(i,sub.length,...sub);
    }
    return arr;
  }
  return shuffle(arr);
}
function getWeak(){
  const attempted=patterns.filter(p=>{const s=statFor(p.id);return s.correct+s.wrong>0});
  const weak=attempted.filter(p=>{
    const s=statFor(p.id),t=s.correct+s.wrong;
    return t>=1 && (s.correct/t<0.75 || s.wrong>=2);
  }).sort((a,b)=>(accuracyFor(a.id)??1)-(accuracyFor(b.id)??1));
  return weak;
}
function startQuiz(newMode="all"){
  mode=newMode;
  if(mode==="all") active=prioritizedAll();
  if(mode==="wrong"){
    const ids=[...new Set(data.errorLog.map(e=>e.id))];
    active=shuffle(patterns.filter(p=>ids.includes(p.id)));
  }
  if(mode==="weak") active=getWeak();
  if(mode==="marked") active=shuffle(patterns.filter(p=>data.marked.includes(p.id)));
  if(!active.length){
    alert(mode==="marked"?"Bạn chưa đánh dấu cấu trúc nào.":mode==="weak"?"Chưa có cấu trúc yếu đủ dữ liệu. Hãy luyện thêm trước.":"Chưa có lỗi sai để ôn.");
    mode="all"; active=prioritizedAll();
  }
  index=0;score=0;roundWrong=[];locked=false;
  $("quizBox").style.display="block";$("resultBox").style.display="none";
  renderQuestion();
}
function renderQuestion(){
  if(index>=active.length){showResult();return}
  locked=false;
  const q=active[index];
  $("progress").style.width=(index/active.length*100)+"%";
  $("counter").textContent=`${index+1} / ${active.length}`;
  $("meaning").textContent=q.meaning;$("hint").textContent=q.hint;
  $("feedback").classList.remove("show");$("nextBtn").style.display="none";$("options").innerHTML="";
  updateMarkButton(q.id);
  generateOptions(q.formula).forEach((opt,i)=>{
    const b=document.createElement("button");b.className="option";b.dataset.value=opt;
    b.innerHTML=`<span class="letter">${i+1}</span><span>${esc(opt)}</span>`;
    b.onclick=()=>answer(opt,b);$("options").appendChild(b);
  });
}
function answer(selected,btn){
  if(locked)return;locked=true;
  const q=active[index], ok=selected===q.formula, ps=statFor(q.id);
  [...$("options").children].forEach(b=>{b.disabled=true;if(b.dataset.value===q.formula)b.classList.add("correct")});
  if(ok){
    score++;data.correct++;data.streak++;data.best=Math.max(data.best,data.streak);ps.correct++;
    $("feedbackTitle").textContent="✓ Chính xác";$("feedbackTitle").className="feedback-title good";
    playSound("good");
    if(data.streak>0 && data.streak%5===0) burstConfetti(22);
  }else{
    data.wrong++;data.streak=0;ps.wrong++;btn.classList.add("wrong");
    roundWrong.push(q);
    data.errorLog.unshift({id:q.id,meaning:q.meaning,selected,correct:q.formula,time:new Date().toISOString()});
    data.errorLog=data.errorLog.slice(0,150);
    $("feedbackTitle").textContent="✗ Chưa đúng — đã lưu vào Sổ lỗi sai";$("feedbackTitle").className="feedback-title bad";
    playSound("bad");
  }
  $("formula").textContent=q.formula;$("example").innerHTML=`<b>Ví dụ:</b> ${esc(q.example)}`;
  $("feedback").classList.add("show");$("nextBtn").style.display="inline-flex";
  $("progress").style.width=((index+1)/active.length*100)+"%";
  save();
}
function showResult(){
  $("quizBox").style.display="none";$("resultBox").style.display="block";
  const total=active.length,pct=total?Math.round(score/total*100):0;
  $("scoreBig").textContent=`${score}/${total}`;
  $("scoreNote").textContent=pct>=90?"Rất chắc pattern. Có thể chuyển dần sang tự viết câu.":pct>=80?"Khá tốt. Ôn lại các câu sai để khóa cấu trúc.":pct>=65?"Đã có nền, nhưng vẫn còn vài pattern dễ lẫn.":"Nên ôn riêng câu sai và cấu trúc yếu trước khi làm lại đủ 20.";
  if(pct>=80)burstConfetti(70);
  const uniq=[...new Map(roundWrong.map(x=>[x.id,x])).values()];
  $("roundWrongList").innerHTML=uniq.length?uniq.map(q=>`<div class="item"><b>${esc(q.meaning)}</b><small>${esc(q.formula)}<br>${esc(q.example)}</small></div>`).join(""):`<div class="empty">Không có câu sai trong lượt này 🎉</div>`;
}

function toggleMark(id){
  if(data.marked.includes(id))data.marked=data.marked.filter(x=>x!==id);
  else data.marked.push(id);
  save();renderMarked();if(active[index]?.id===id)updateMarkButton(id);
}
function updateMarkButton(id){
  const on=data.marked.includes(id);
  $("markCurrent").textContent=on?"★":"☆";$("markCurrent").classList.toggle("active",on);
}
function renderErrors(){
  const el=$("errorList");
  if(!data.errorLog.length){el.innerHTML='<div class="empty">Chưa có lỗi sai nào được lưu.</div>';return}
  el.innerHTML='<div class="list">'+data.errorLog.map((e,i)=>{
    const p=patterns.find(x=>x.id===e.id);
    const d=new Date(e.time);
    return `<div class="item">
      <div class="item-head"><b>#${e.id} — ${esc(e.meaning)}</b><span class="chip bad">${d.toLocaleDateString("vi-VN")}</span></div>
      <small><span class="error-choice">Bạn chọn: ${esc(e.selected)}</span><br><span class="correct-choice">Đúng: ${esc(e.correct)}</span>${p?`<br>Ví dụ: ${esc(p.example)}`:""}</small>
    </div>`;
  }).join("")+'</div>';
}
function renderMarked(){
  const list=patterns.filter(p=>data.marked.includes(p.id));
  const el=$("markedList");
  if(!list.length){el.innerHTML='<div class="empty">Chưa có cấu trúc nào được đánh dấu.</div>';return}
  el.innerHTML='<div class="list">'+list.map(p=>`<div class="item">
    <div class="item-head"><div><b>#${p.id} — ${esc(p.meaning)}</b><small>${esc(p.formula)}<br>${esc(p.example)}</small></div>
    <button class="icon-btn active" onclick="toggleMark(${p.id})">★</button></div>
  </div>`).join("")+'</div>';
}
function renderStatsTable(){
  const tbody=$("statsBody");
  let ranked=[];
  tbody.innerHTML=patterns.map(p=>{
    const s=statFor(p.id),t=s.correct+s.wrong,acc=t?Math.round(s.correct/t*100):null;
    if(t)ranked.push({p,acc,t});
    let status=acc===null?'<span class="chip">Chưa học</span>':acc>=85?'<span class="chip good">Mạnh</span>':acc<70?'<span class="chip bad">Yếu</span>':'<span class="chip">Đang ổn</span>';
    return `<tr><td>${p.id}</td><td>${esc(p.meaning)}<br><small>${esc(p.formula)}</small></td><td>${s.correct}</td><td>${s.wrong}</td>
      <td><span class="rate">${acc===null?"—":acc+"%"}</span>${acc!==null?`<div class="bar-bg"><div class="bar" style="width:${acc}%"></div></div>`:""}</td><td>${status}</td></tr>`;
  }).join("");
  ranked.sort((a,b)=>a.acc-b.acc);
  $("weakestText").textContent=ranked.length?`#${ranked[0].p.id} ${ranked[0].p.meaning} — ${ranked[0].acc}%`:"Chưa đủ dữ liệu";
  ranked.sort((a,b)=>b.acc-a.acc||b.t-a.t);
  $("strongestText").textContent=ranked.length?`#${ranked[0].p.id} ${ranked[0].p.meaning} — ${ranked[0].acc}%`:"Chưa đủ dữ liệu";
}
function renderAll(){renderGlobalStats();renderErrors();renderMarked();renderStatsTable()}

function playSound(kind){
  if(!data.settings.sound)return;
  try{
    const AC=window.AudioContext||window.webkitAudioContext,ctx=new AC();
    const osc=ctx.createOscillator(),gain=ctx.createGain();
    osc.connect(gain);gain.connect(ctx.destination);
    const t=ctx.currentTime;
    if(kind==="good"){
      osc.type="sine";osc.frequency.setValueAtTime(520,t);osc.frequency.exponentialRampToValueAtTime(780,t+.13);
      gain.gain.setValueAtTime(.09,t);gain.gain.exponentialRampToValueAtTime(.001,t+.18);
      osc.start(t);osc.stop(t+.19);
    }else{
      osc.type="triangle";osc.frequency.setValueAtTime(210,t);osc.frequency.exponentialRampToValueAtTime(120,t+.16);
      gain.gain.setValueAtTime(.08,t);gain.gain.exponentialRampToValueAtTime(.001,t+.2);
      osc.start(t);osc.stop(t+.21);
    }
  }catch(e){}
}
function burstConfetti(n=50){
  if(!data.settings.fx)return;
  const chars=["#5b5cf0","#8b5cf6","#f59e0b","#22c55e","#06b6d4","#ef4444"];
  for(let i=0;i<n;i++){
    const c=document.createElement("div");c.className="confetti";
    c.style.left=Math.random()*100+"vw";c.style.background=chars[Math.floor(Math.random()*chars.length)];
    c.style.setProperty("--x",(Math.random()*260-130)+"px");c.style.animationDelay=(Math.random()*.35)+"s";
    c.style.transform=`rotate(${Math.random()*180}deg)`;
    document.body.appendChild(c);setTimeout(()=>c.remove(),2300);
  }
}
function showTab(id){
  document.querySelectorAll(".panel").forEach(x=>x.classList.toggle("active",x.id===id));
  document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x.dataset.tab===id));
  if(id==="errorsPanel")renderErrors();if(id==="statsPanel")renderStatsTable();if(id==="markedPanel")renderMarked();
}

document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>showTab(b.dataset.tab));
document.querySelectorAll(".modeBtn").forEach(b=>b.onclick=()=>startQuiz(b.dataset.mode));
$("nextBtn").onclick=()=>{index++;renderQuestion()};
$("skipBtn").onclick=()=>{index++;renderQuestion()};
$("againBtn").onclick=()=>startQuiz(mode);
$("wrongAgainBtn").onclick=()=>startQuiz("wrong");
$("weakAgainBtn").onclick=()=>startQuiz("weak");
$("markCurrent").onclick=()=>{if(active[index])toggleMark(active[index].id)};
$("clearErrors").onclick=()=>{if(confirm("Xóa toàn bộ lịch sử lỗi sai?")){data.errorLog=[];save();renderErrors()}};
$("resetAll").onclick=()=>{if(confirm("Reset toàn bộ điểm, lỗi sai, bookmark và thống kê?")){data=JSON.parse(JSON.stringify(defaultData));save();renderAll();startQuiz("all")}};

function bindSwitch(id,key){
  $(id).onclick=()=>{data.settings[key]=!data.settings[key];save();renderGlobalStats()};
}
bindSwitch("soundSwitch","sound");bindSwitch("fxSwitch","fx");bindSwitch("adaptiveSwitch","adaptive");
$("soundTop").onclick=()=>{data.settings.sound=!data.settings.sound;save();renderGlobalStats();if(data.settings.sound)playSound("good")};

document.addEventListener("keydown",e=>{
  const quizVisible=$("quizPanel").classList.contains("active") && $("quizBox").style.display!=="none";
  if(!quizVisible)return;
  if(["1","2","3","4"].includes(e.key)&&!locked){const b=$("options").children[Number(e.key)-1];if(b)b.click()}
  else if(e.key==="Enter"&&locked)$("nextBtn").click();
  else if(e.key.toLowerCase()==="m"&&active[index])toggleMark(active[index].id);
});

renderAll();startQuiz("all");