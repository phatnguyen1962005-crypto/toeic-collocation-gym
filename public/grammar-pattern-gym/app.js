const patterns = [
// CORE 1–20
{id:1,category:"Core",meaning:"Mặc dù / dù cho … nhưng …",hint:"Nối hai ý tương phản.",formula:"Although / Even though + S + V, S + V",example:"Although the service is convenient, it can be expensive."},
{id:2,category:"Core",meaning:"Trong khi / trái lại …",hint:"Đối chiếu hai nhóm hoặc hai quan điểm.",formula:"While / Whereas + S + V, S + V",example:"While working from home saves time, working in an office allows better communication."},
{id:3,category:"Core",meaning:"Nếu … thì có thể / sẽ …",hint:"Điều kiện và kết quả có thể xảy ra.",formula:"If + S + V, S + will / can + V",example:"If companies provide flexible schedules, employees can achieve a better work-life balance."},
{id:4,category:"Core",meaning:"Trừ khi / nếu không …",hint:"Có nghĩa gần với “if … not”.",formula:"Unless + S + V, S + will / may + V",example:"Unless companies improve their services, they may lose customers."},
{id:5,category:"Core",meaning:"Bằng cách làm gì đó, ai đó có thể …",hint:"Giải pháp → lợi ích.",formula:"By + V-ing, S + can + V",example:"By using public transportation, people can reduce transportation costs."},
{id:6,category:"Core",meaning:"Cho phép / tạo điều kiện cho ai làm gì",hint:"Một thứ giúp người khác thực hiện hành động.",formula:"S + allow / enable + O + to V",example:"Technology allows employees to work remotely."},
{id:7,category:"Core",meaning:"Làm cho việc ai đó làm gì trở nên + tính từ",hint:"Diễn đạt tác động của công nghệ, chính sách, dịch vụ.",formula:"S + make it + adjective + for O + to V",example:"The Internet makes it easier for people to access information."},
{id:8,category:"Core",meaning:"Thật + tính từ + đối với ai đó để làm gì",hint:"Đánh giá mức độ quan trọng, khó, dễ, cần thiết.",formula:"It is + adjective + for O + to V",example:"It is important for companies to listen to their customers."},
{id:9,category:"Core",meaning:"Không còn nghi ngờ gì rằng …",hint:"Nhấn mạnh một nhận định khá chắc chắn.",formula:"There is no doubt that + S + V",example:"There is no doubt that technology plays an important role in modern life."},
{id:10,category:"Core",meaning:"Một trong những lý do chính tại sao … là vì …",hint:"Triển khai nguyên nhân trong essay.",formula:"One of the main reasons why + S + V + is that + S + V",example:"One of the main reasons why people prefer online shopping is that it saves time."},
{id:11,category:"Core",meaning:"Càng … thì càng …",hint:"Hai thay đổi có quan hệ với nhau.",formula:"The more + clause, the more + clause",example:"The more employees are trained, the more productive they become."},
{id:12,category:"Core",meaning:"Không những … mà còn …",hint:"Bổ sung hai lợi ích, đặc điểm hoặc hành động song song.",formula:"Not only + X + but also + Y",example:"Working from home not only saves commuting time but also reduces transportation costs."},
{id:13,category:"Core",meaning:"So với …",hint:"Mở đầu một câu so sánh.",formula:"Compared with / to + N, S + V",example:"Compared with traditional shopping, online shopping is more convenient."},
{id:14,category:"Core",meaning:"Thay vì làm A, chọn / làm B",hint:"Nhấn mạnh lựa chọn B thay cho A.",formula:"Rather than + V / V-ing, S + V",example:"Rather than driving to work, employees can use public transportation."},
{id:15,category:"Core",meaning:"Thay vì làm gì đó …",hint:"Sau instead of thường là danh từ hoặc V-ing.",formula:"Instead of + V-ing / N, S + V",example:"Instead of spending money on advertising, companies can invest in product quality."},
{id:16,category:"Core",meaning:"Có xu hướng làm gì",hint:"Tránh khẳng định tuyệt đối.",formula:"S + tend(s) to + V",example:"Younger consumers tend to shop online."},
{id:17,category:"Core",meaning:"Có khả năng sẽ làm gì",hint:"Diễn đạt khả năng / xu hướng có thể xảy ra.",formula:"S + be likely to + V",example:"Satisfied customers are likely to purchase from the company again."},
{id:18,category:"Core",meaning:"Dẫn đến / gây ra …",hint:"Nối nguyên nhân với kết quả.",formula:"S + lead to / result in + N / V-ing",example:"Long working hours can lead to stress."},
{id:19,category:"Core",meaning:"…, điều mà / việc này …",hint:"Mệnh đề quan hệ bổ sung kết quả hoặc thông tin.",formula:"Main clause, which + V ...",example:"The company introduced flexible working hours, which improved employee satisfaction."},
{id:20,category:"Core",meaning:"Sau khi đã làm xong …, ai đó …",hint:"Perfect participle: hành động hoàn tất trước hành động chính.",formula:"Having + V3, S + V",example:"Having completed the training program, employees can perform their tasks more efficiently."},

// EMAIL 21–40
{id:21,category:"Email",meaning:"Tôi viết email này để … / liên quan đến …",hint:"Mở email và nêu mục đích một cách lịch sự.",formula:"I am writing to + V / I am writing regarding + N",example:"I am writing to ask about the training program."},
{id:22,category:"Email",meaning:"Cảm ơn bạn vì …",hint:"Mở đầu hoặc phản hồi email tích cực.",formula:"Thank you for + N / V-ing",example:"Thank you for informing me about the schedule change."},
{id:23,category:"Email",meaning:"Tôi muốn biết liệu …",hint:"Hỏi thông tin lịch sự, dùng rất rộng trong email.",formula:"I would like to know whether / if + S + V",example:"I would like to know whether breakfast is included in the room rate."},
{id:24,category:"Email",meaning:"Bạn có thể vui lòng cho tôi biết …?",hint:"Request thông tin bằng wh-clause.",formula:"Could you please let me know + wh-clause?",example:"Could you please let me know when the package will arrive?"},
{id:25,category:"Email",meaning:"Bạn có thể cho tôi biết cái gì / khi nào / ở đâu / như thế nào …?",hint:"Question frame rất tái sử dụng.",formula:"Could you tell me what / when / where / how + S + V?",example:"Could you tell me what documents I need to bring?"},
{id:26,category:"Email",meaning:"Tôi muốn hỏi liệu …",hint:"Cách hỏi mềm hơn, tự nhiên trong email.",formula:"I was wondering if / whether + S + V",example:"I was wondering if I could change my reservation date."},
{id:27,category:"Email",meaning:"Liệu có thể … được không?",hint:"Request lịch sự, phù hợp đổi lịch / hoàn tiền / gửi lại.",formula:"Would it be possible to + V?",example:"Would it be possible to reschedule the meeting for Friday?"},
{id:28,category:"Email",meaning:"Bạn vui lòng làm … được không?",hint:"Request trực tiếp nhưng lịch sự.",formula:"Could you please + V ...?",example:"Could you please send me a copy of the invoice?"},
{id:29,category:"Email",meaning:"Tôi sẽ rất cảm kích nếu bạn có thể …",hint:"Một trong những request frame mạnh nhất cho email.",formula:"I would appreciate it if + S + could + V",example:"I would appreciate it if you could confirm my reservation."},
{id:30,category:"Email",meaning:"Nếu có thể, bạn có thể …?",hint:"Làm request mềm và tự nhiên hơn.",formula:"If possible, could you + V ...?",example:"If possible, could you deliver the order before noon?"},
{id:31,category:"Email",meaning:"Vui lòng cho tôi biết nếu / liệu …",hint:"Dùng để yêu cầu xác nhận hoặc thông tin tiếp theo.",formula:"Please let me know if / whether + S + V",example:"Please let me know if you need any additional information."},
{id:32,category:"Email",meaning:"Vui lòng đảm bảo rằng …",hint:"Dùng cho hướng dẫn, yêu cầu, xác nhận.",formula:"Please make sure that + S + V",example:"Please make sure that the form is submitted by Friday."},
{id:33,category:"Email",meaning:"Tôi rất tiếc phải thông báo rằng …",hint:"Thông báo tin xấu một cách chuyên nghiệp.",formula:"I am sorry to inform you that + S + V",example:"I am sorry to inform you that your order has been delayed."},
{id:34,category:"Email",meaning:"Chúng tôi xin lỗi vì …",hint:"Apology frame phổ biến trong customer service.",formula:"We apologize for + N / V-ing",example:"We apologize for the inconvenience caused by the delay."},
{id:35,category:"Email",meaning:"Do / bởi vì + danh từ, …",hint:"Giải thích lý do ngắn gọn trong email.",formula:"Due to / Because of + N, S + V",example:"Due to a system error, your payment could not be processed."},
{id:36,category:"Email",meaning:"Được lên lịch để làm gì",hint:"Rất phổ biến với meeting, delivery, event, maintenance.",formula:"S + be scheduled to + V",example:"The maintenance work is scheduled to begin at 8 a.m."},
{id:37,category:"Email",meaning:"Được yêu cầu phải làm gì",hint:"Quy định / thủ tục / training.",formula:"S + be required to + V",example:"All employees are required to complete the safety training."},
{id:38,category:"Email",meaning:"Có những tiện nghi / dịch vụ / lựa chọn nào tại …?",hint:"Pattern kiểu “what amenities are available” mà bạn vừa hỏi.",formula:"What + N + is / are available at / in + place?",example:"What amenities are available at the hotel?"},
{id:39,category:"Email",meaning:"Nơi / công ty này cung cấp loại … nào?",hint:"Hỏi loại dịch vụ, phòng, khóa học, phương tiện…",formula:"What kind / type of + N + do / does + S + offer?",example:"What types of rooms does the hotel offer?"},
{id:40,category:"Email",meaning:"Mất bao nhiêu tiền / bao lâu để …?",hint:"Question frame dùng cho phí, thời gian xử lý, giao hàng.",formula:"How much does it cost to + V? / How long does it take to + V?",example:"How long does it take to process a refund?"},

// ESSAY 41–60
{id:41,category:"Essay",meaning:"Theo ý kiến của tôi, …",hint:"Nêu lập trường rõ ràng.",formula:"In my opinion, + S + V",example:"In my opinion, companies should offer flexible working hours."},
{id:42,category:"Essay",meaning:"Tôi tin rằng …",hint:"Nêu quan điểm tự nhiên, dễ tái sử dụng.",formula:"I believe that + S + V",example:"I believe that public transportation should be improved."},
{id:43,category:"Essay",meaning:"Có một số lý do tại sao …",hint:"Mở body và báo trước nhiều luận điểm.",formula:"There are several reasons why + S + V",example:"There are several reasons why online learning is becoming more popular."},
{id:44,category:"Essay",meaning:"Một lý do chính là …",hint:"Đưa luận điểm 1 rõ ràng.",formula:"One of the main reasons is that + S + V",example:"One of the main reasons is that employees can save commuting time."},
{id:45,category:"Essay",meaning:"Một lý do khác là …",hint:"Chuyển sang luận điểm tiếp theo.",formula:"Another reason is that + S + V",example:"Another reason is that flexible schedules can reduce stress."},
{id:46,category:"Essay",meaning:"Một lợi ích của … là …",hint:"Frame tủ cho bài advantages / opinion.",formula:"One advantage of + N / V-ing + is that + S + V",example:"One advantage of working from home is that employees can save time."},
{id:47,category:"Essay",meaning:"Một bất lợi của … là …",hint:"Frame tủ cho downside / counterpoint.",formula:"One disadvantage of + N / V-ing + is that + S + V",example:"One disadvantage of online shopping is that customers cannot inspect products directly."},
{id:48,category:"Essay",meaning:"Điều này là bởi vì …",hint:"Giải thích trực tiếp cho câu trước.",formula:"This is because + S + V",example:"This is because employees do not have to spend time commuting."},
{id:49,category:"Essay",meaning:"Điều này có nghĩa là …",hint:"Mở rộng hệ quả hoặc giải thích ý nghĩa.",formula:"This means that + S + V",example:"This means that workers can spend more time with their families."},
{id:50,category:"Essay",meaning:"Ví dụ, …",hint:"Đưa ví dụ cụ thể để support luận điểm.",formula:"For example / For instance, + S + V",example:"For example, employees can use the time saved from commuting to exercise."},
{id:51,category:"Essay",meaning:"Kết quả là, …",hint:"Nối nguyên nhân → kết quả ở cấp câu.",formula:"As a result, + S + V",example:"As a result, employees may become more productive."},
{id:52,category:"Essay",meaning:"Vì lý do này, …",hint:"Kết luận hệ quả từ luận điểm ngay trước đó.",formula:"For this reason, + S + V",example:"For this reason, companies should invest in employee training."},
{id:53,category:"Essay",meaning:"Điều này đặc biệt quan trọng đối với …",hint:"Nhấn mạnh nhóm đối tượng chịu tác động.",formula:"This is especially important for + N",example:"This is especially important for employees with young children."},
{id:54,category:"Essay",meaning:"Giúp ai làm gì",hint:"Benefit pattern cực phổ biến.",formula:"S + help + O + (to) V",example:"Flexible schedules help employees manage their time more effectively."},
{id:55,category:"Essay",meaning:"Khuyến khích ai làm gì",hint:"Dùng cho policy, education, workplace, health.",formula:"S + encourage + O + to V",example:"Companies should encourage employees to participate in training programs."},
{id:56,category:"Essay",meaning:"Cung cấp cho ai cái gì",hint:"Rất hữu ích với benefits, services, resources.",formula:"S + provide + O + with + N",example:"Online courses provide students with greater flexibility."},
{id:57,category:"Essay",meaning:"Cho ai cơ hội làm gì",hint:"Mở rộng benefit tự nhiên hơn help.",formula:"S + give + O + the opportunity to + V",example:"Remote work gives employees the opportunity to spend more time with their families."},
{id:58,category:"Essay",meaning:"Ngăn ai khỏi làm gì",hint:"Dùng cho problem / solution / safety.",formula:"S + prevent + O + from + V-ing",example:"Clear instructions can prevent employees from making unnecessary mistakes."},
{id:59,category:"Essay",meaning:"Tiết kiệm cho ai thời gian / tiền bạc",hint:"Benefit cực dễ tái sử dụng.",formula:"S + save + O + time / money",example:"Public transportation can save commuters both time and money."},
{id:60,category:"Essay",meaning:"Vì những lý do này, tôi tin rằng …",hint:"Kết luận opinion essay gọn và an toàn.",formula:"For these reasons, I believe that + S + V",example:"For these reasons, I believe that companies should allow employees to work remotely when possible."}
];

const malformedDistractors = [
"Despite + S + V, S + V","Because of + S + V, S + V","Although + N / V-ing, S + V","If + S + will V, S + V",
"Unless + S + will V, S + V","By + to V, S + can + V","S + allow + O + V-ing","S + make + O + to V",
"There has no doubt that + S + V","The more + adjective, the most + adjective","Not only + X + and also + Y",
"Rather than + to V, S + V","Instead of + to V, S + V","S + tend + V-ing","S + be likely + V-ing",
"I would like know if + S + V","Could you please to + V?","I appreciate if you could + V","Would it possible to + V?",
"Please let me know that if + S + V","We apologize about + V-ing","S + be scheduled for + V","S + be required + V-ing",
"What amenities available at + place?","What kind of + N + does + S + offers?","How long it takes to + V?",
"In my opinion that + S + V","One advantage of + N + that + S + V","This because + S + V","As result, + S + V",
"S + encourage + O + V-ing","S + provide + O + N","S + prevent + O + to V","S + save time for O"
];

const defaultData = {
  correct:0, wrong:0, streak:0, best:0, marked:[], errorLog:[],
  perPattern:{}, settings:{sound:true,fx:true,adaptive:true}
};
let data = loadData();
let active=[], index=0, score=0, roundWrong=[], locked=false, mode="mix";
const $=id=>document.getElementById(id);

function loadData(){
  try{
    const old=JSON.parse(localStorage.getItem("grammarGymProData")||"null");
    if(!old) return JSON.parse(JSON.stringify(defaultData));
    return {...defaultData,...old,settings:{...defaultData.settings,...(old.settings||{})},perPattern:old.perPattern||{},marked:old.marked||[],errorLog:old.errorLog||[]};
  }catch(e){return JSON.parse(JSON.stringify(defaultData));}
}
function save(){localStorage.setItem("grammarGymProData",JSON.stringify(data));renderGlobalStats();}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function statFor(id){if(!data.perPattern[id])data.perPattern[id]={correct:0,wrong:0};return data.perPattern[id]}
function accuracyFor(id){const s=statFor(id),t=s.correct+s.wrong;return t?s.correct/t:null}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function categoryLabel(c){return c==="Email"?"EMAIL":c==="Essay"?"ESSAY":"CORE"}
function renderGlobalStats(){
  const total=data.correct+data.wrong;
  $("sCorrect").textContent=data.correct;$("sWrong").textContent=data.wrong;
  $("sAcc").textContent=total?Math.round(data.correct/total*100)+"%":"0%";
  $("sStreak").textContent=data.streak;$("sMarked").textContent=data.marked.length;
  $("soundTop").textContent=data.settings.sound?"🔊 Âm thanh":"🔇 Âm thanh";
  setSwitch("soundSwitch",data.settings.sound);setSwitch("fxSwitch",data.settings.fx);setSwitch("adaptiveSwitch",data.settings.adaptive);
}
function setSwitch(id,on){$(id).classList.toggle("on",!!on)}
function generateOptions(q){
  const same=patterns.filter(p=>p.id!==q.id&&p.category===q.category).map(p=>p.formula);
  const other=patterns.filter(p=>p.id!==q.id&&p.category!==q.category).map(p=>p.formula);
  const pool=[...shuffle(same).slice(0,8),...shuffle(malformedDistractors).slice(0,8),...shuffle(other).slice(0,4)];
  return shuffle([q.formula,...shuffle([...new Set(pool.filter(x=>x!==q.formula))]).slice(0,3)]);
}
function prioritized(pool){
  let arr=[...pool];
  if(data.settings.adaptive){
    arr.sort((a,b)=>{const aa=accuracyFor(a.id),bb=accuracyFor(b.id);return (aa===null?.55:aa)-(bb===null?.55:bb)||Math.random()-.5});
    for(let i=0;i<arr.length-1;i+=3){const sub=shuffle(arr.slice(i,i+3));arr.splice(i,sub.length,...sub)}
    return arr;
  }
  return shuffle(arr);
}
function getWeak(){
  return patterns.filter(p=>{const s=statFor(p.id),t=s.correct+s.wrong;return t>=1&&(s.correct/t<0.75||s.wrong>=2)}).sort((a,b)=>(accuracyFor(a.id)??1)-(accuracyFor(b.id)??1));
}
function poolByMode(m){
  if(m==="core")return patterns.filter(p=>p.category==="Core");
  if(m==="email")return patterns.filter(p=>p.category==="Email");
  if(m==="essay")return patterns.filter(p=>p.category==="Essay");
  if(m==="all")return patterns;
  return patterns;
}
function startQuiz(newMode="mix"){
  mode=newMode;
  if(["core","email","essay","all"].includes(mode))active=prioritized(poolByMode(mode));
  if(mode==="mix")active=prioritized(patterns).slice(0,20);
  if(mode==="wrong"){
    const ids=[...new Set(data.errorLog.map(e=>e.id))];active=prioritized(patterns.filter(p=>ids.includes(p.id)));
  }
  if(mode==="weak")active=getWeak();
  if(mode==="marked")active=prioritized(patterns.filter(p=>data.marked.includes(p.id)));
  if(!active.length){
    alert(mode==="marked"?"Bạn chưa đánh dấu cấu trúc nào.":mode==="weak"?"Chưa có cấu trúc yếu đủ dữ liệu. Hãy luyện thêm trước.":"Chưa có lỗi sai để ôn.");
    mode="mix";active=prioritized(patterns).slice(0,20);
  }
  index=0;score=0;roundWrong=[];locked=false;$("quizBox").style.display="block";$("resultBox").style.display="none";renderQuestion();
}
function renderQuestion(){
  if(index>=active.length){showResult();return}
  locked=false;const q=active[index];
  $("progress").style.width=(index/active.length*100)+"%";$("counter").textContent=`${index+1} / ${active.length}`;
  $("meaning").textContent=q.meaning;$("hint").textContent=q.hint;
  if($("categoryBadge"))$("categoryBadge").textContent=categoryLabel(q.category);
  $("feedback").classList.remove("show");$("nextBtn").style.display="none";$("options").innerHTML="";updateMarkButton(q.id);
  generateOptions(q).forEach((opt,i)=>{const b=document.createElement("button");b.className="option";b.dataset.value=opt;b.innerHTML=`<span class="letter">${i+1}</span><span>${esc(opt)}</span>`;b.onclick=()=>answer(opt,b);$("options").appendChild(b)});
}
function answer(selected,btn){
  if(locked)return;locked=true;const q=active[index],ok=selected===q.formula,ps=statFor(q.id);
  [...$("options").children].forEach(b=>{b.disabled=true;if(b.dataset.value===q.formula)b.classList.add("correct")});
  if(ok){score++;data.correct++;data.streak++;data.best=Math.max(data.best,data.streak);ps.correct++;$("feedbackTitle").textContent="✓ Chính xác";$("feedbackTitle").className="feedback-title good";playSound("good");if(data.streak>0&&data.streak%5===0)burstConfetti(22)}
  else{data.wrong++;data.streak=0;ps.wrong++;btn.classList.add("wrong");roundWrong.push(q);data.errorLog.unshift({id:q.id,meaning:q.meaning,selected,correct:q.formula,time:new Date().toISOString()});data.errorLog=data.errorLog.slice(0,200);$("feedbackTitle").textContent="✗ Chưa đúng — đã lưu vào Sổ lỗi sai";$("feedbackTitle").className="feedback-title bad";playSound("bad")}
  $("formula").textContent=q.formula;$("example").innerHTML=`<b>Ví dụ:</b> ${esc(q.example)}`;$("feedback").classList.add("show");$("nextBtn").style.display="inline-flex";$("progress").style.width=((index+1)/active.length*100)+"%";save();
}
function showResult(){
  $("quizBox").style.display="none";$("resultBox").style.display="block";const total=active.length,pct=total?Math.round(score/total*100):0;
  $("scoreBig").textContent=`${score}/${total}`;$("scoreNote").textContent=pct>=90?"Rất chắc pattern. Có thể chuyển dần sang tự viết câu.":pct>=80?"Khá tốt. Ôn lại các câu sai để khóa cấu trúc.":pct>=65?"Đã có nền, nhưng vẫn còn vài pattern dễ lẫn.":"Nên ưu tiên câu sai và cấu trúc yếu trước khi làm lại.";
  if(pct>=80)burstConfetti(70);const uniq=[...new Map(roundWrong.map(x=>[x.id,x])).values()];
  $("roundWrongList").innerHTML=uniq.length?uniq.map(q=>`<div class="item"><b><span class="chip">${categoryLabel(q.category)}</span> ${esc(q.meaning)}</b><small>${esc(q.formula)}<br>${esc(q.example)}</small></div>`).join(""):`<div class="empty">Không có câu sai trong lượt này 🎉</div>`;
}
function toggleMark(id){if(data.marked.includes(id))data.marked=data.marked.filter(x=>x!==id);else data.marked.push(id);save();renderMarked();if(active[index]?.id===id)updateMarkButton(id)}
function updateMarkButton(id){const on=data.marked.includes(id);$("markCurrent").textContent=on?"★":"☆";$("markCurrent").classList.toggle("active",on)}
function renderErrors(){
  const el=$("errorList");if(!data.errorLog.length){el.innerHTML='<div class="empty">Chưa có lỗi sai nào được lưu.</div>';return}
  el.innerHTML='<div class="list">'+data.errorLog.map(e=>{const p=patterns.find(x=>x.id===e.id),d=new Date(e.time);return `<div class="item"><div class="item-head"><b>#${e.id} ${p?`<span class="chip">${categoryLabel(p.category)}</span>`:""} — ${esc(e.meaning)}</b><span class="chip bad">${d.toLocaleDateString("vi-VN")}</span></div><small><span class="error-choice">Bạn chọn: ${esc(e.selected)}</span><br><span class="correct-choice">Đúng: ${esc(e.correct)}</span>${p?`<br>Ví dụ: ${esc(p.example)}`:""}</small></div>`}).join("")+'</div>';
}
function renderMarked(){
  const list=patterns.filter(p=>data.marked.includes(p.id)),el=$("markedList");if(!list.length){el.innerHTML='<div class="empty">Chưa có cấu trúc nào được đánh dấu.</div>';return}
  el.innerHTML='<div class="list">'+list.map(p=>`<div class="item"><div class="item-head"><div><b>#${p.id} <span class="chip">${categoryLabel(p.category)}</span> — ${esc(p.meaning)}</b><small>${esc(p.formula)}<br>${esc(p.example)}</small></div><button class="icon-btn active" onclick="toggleMark(${p.id})">★</button></div></div>`).join("")+'</div>';
}
function renderStatsTable(){
  const tbody=$("statsBody");let ranked=[];
  tbody.innerHTML=patterns.map(p=>{const s=statFor(p.id),t=s.correct+s.wrong,acc=t?Math.round(s.correct/t*100):null;if(t)ranked.push({p,acc,t});let status=acc===null?'<span class="chip">Chưa học</span>':acc>=85?'<span class="chip good">Mạnh</span>':acc<70?'<span class="chip bad">Yếu</span>':'<span class="chip">Đang ổn</span>';return `<tr><td>${p.id}</td><td><span class="chip">${categoryLabel(p.category)}</span> ${esc(p.meaning)}<br><small>${esc(p.formula)}</small></td><td>${s.correct}</td><td>${s.wrong}</td><td><span class="rate">${acc===null?"—":acc+"%"}</span>${acc!==null?`<div class="bar-bg"><div class="bar" style="width:${acc}%"></div></div>`:""}</td><td>${status}</td></tr>`}).join("");
  ranked.sort((a,b)=>a.acc-b.acc);$("weakestText").textContent=ranked.length?`#${ranked[0].p.id} ${ranked[0].p.meaning} — ${ranked[0].acc}%`:"Chưa đủ dữ liệu";ranked.sort((a,b)=>b.acc-a.acc||b.t-a.t);$("strongestText").textContent=ranked.length?`#${ranked[0].p.id} ${ranked[0].p.meaning} — ${ranked[0].acc}%`:"Chưa đủ dữ liệu";
}
function renderAll(){renderGlobalStats();renderErrors();renderMarked();renderStatsTable()}
function playSound(kind){if(!data.settings.sound)return;try{const AC=window.AudioContext||window.webkitAudioContext,ctx=new AC(),osc=ctx.createOscillator(),gain=ctx.createGain();osc.connect(gain);gain.connect(ctx.destination);const t=ctx.currentTime;if(kind==="good"){osc.type="sine";osc.frequency.setValueAtTime(520,t);osc.frequency.exponentialRampToValueAtTime(780,t+.13);gain.gain.setValueAtTime(.09,t);gain.gain.exponentialRampToValueAtTime(.001,t+.18);osc.start(t);osc.stop(t+.19)}else{osc.type="triangle";osc.frequency.setValueAtTime(210,t);osc.frequency.exponentialRampToValueAtTime(120,t+.16);gain.gain.setValueAtTime(.08,t);gain.gain.exponentialRampToValueAtTime(.001,t+.2);osc.start(t);osc.stop(t+.21)}}catch(e){}}
function burstConfetti(n=50){if(!data.settings.fx)return;const chars=["#5b5cf0","#8b5cf6","#f59e0b","#22c55e","#06b6d4","#ef4444"];for(let i=0;i<n;i++){const c=document.createElement("div");c.className="confetti";c.style.left=Math.random()*100+"vw";c.style.background=chars[Math.floor(Math.random()*chars.length)];c.style.setProperty("--x",(Math.random()*260-130)+"px");c.style.animationDelay=(Math.random()*.35)+"s";c.style.transform=`rotate(${Math.random()*180}deg)`;document.body.appendChild(c);setTimeout(()=>c.remove(),2300)}}
function showTab(id){document.querySelectorAll(".panel").forEach(x=>x.classList.toggle("active",x.id===id));document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x.dataset.tab===id));if(id==="errorsPanel")renderErrors();if(id==="statsPanel")renderStatsTable();if(id==="markedPanel")renderMarked()}
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>showTab(b.dataset.tab));document.querySelectorAll(".modeBtn").forEach(b=>b.onclick=()=>startQuiz(b.dataset.mode));
$("nextBtn").onclick=()=>{index++;renderQuestion()};$("skipBtn").onclick=()=>{index++;renderQuestion()};$("againBtn").onclick=()=>startQuiz(mode);$("wrongAgainBtn").onclick=()=>startQuiz("wrong");$("weakAgainBtn").onclick=()=>startQuiz("weak");$("markCurrent").onclick=()=>{if(active[index])toggleMark(active[index].id)};
$("clearErrors").onclick=()=>{if(confirm("Xóa toàn bộ lịch sử lỗi sai?")){data.errorLog=[];save();renderErrors()}};$("resetAll").onclick=()=>{if(confirm("Reset toàn bộ điểm, lỗi sai, bookmark và thống kê?")){data=JSON.parse(JSON.stringify(defaultData));save();renderAll();startQuiz("mix")}};
function bindSwitch(id,key){$(id).onclick=()=>{data.settings[key]=!data.settings[key];save();renderGlobalStats()}}bindSwitch("soundSwitch","sound");bindSwitch("fxSwitch","fx");bindSwitch("adaptiveSwitch","adaptive");
$("soundTop").onclick=()=>{data.settings.sound=!data.settings.sound;save();renderGlobalStats();if(data.settings.sound)playSound("good")};
document.addEventListener("keydown",e=>{const quizVisible=$("quizPanel").classList.contains("active")&&$("quizBox").style.display!=="none";if(!quizVisible)return;if(["1","2","3","4"].includes(e.key)&&!locked){const b=$("options").children[Number(e.key)-1];if(b)b.click()}else if(e.key==="Enter"&&locked)$("nextBtn").click();else if(e.key.toLowerCase()==="m"&&active[index])toggleMark(active[index].id)});
renderAll();startQuiz("mix");