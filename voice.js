/* ============================================================
   導覽員的聲音：只用藝術家本人的錄音（voice/ 資料夾）
   放在 index.html 最後一個 </script> 之後載入：
   <script src="voice.js"></script>
   ------------------------------------------------------------
   ・每一句會說出口的話，對應 voice/ 裡一個 mp3（檔名就是代號）
   ・找不到錄音的句子只顯示文字，不使用手機的機器語音
   ・同學作品的錄音：錄好後命名為「作品代號_talk.mp3」放進 voice/
     例如 voice/zhang_talk.mp3、voice/chen_talk.mp3；
     推薦問題的回答命名為 zhang_q1.mp3、zhang_q2.mp3 …
   ============================================================ */

// 1. 文稿換成錄音裡實際說的版本
DATA.faq[0].a = "看到想了解的作品，按相機把它拍下來，我會為你介紹。也可以直接打字或按麥克風。";
DATA.event.scripts = {
  A: [[1, "此作品創作於2026年，有一面貼著白圓的白牆，表面上就像未完成的作品，請靠近仔細觀看，這件作品名為〈圓〉，藝術家根據小時候美勞的經驗，如何剪出、畫出正圓是當時身同學之間可以炫耀的技能，常常在上課時比拚誰剪的最圓。藝術家將過去的經驗放置在牆上，強調界線的邊緣與實體物件存在的張力，連結現實與理想之間具備連結關係。當頭頂的燈照在這個圓上，它觸及的的地方背後，如同白圓邊緣的一圈影子；這圈邊緣是圓裡與圓外唯一的交界，它具備等同於直徑乘以圓周率的定理，也象徵小時候夢想與現實之間固定不變的道理。"]],
  B: [[1, "這件作品延續著一旁的作品《新遺址 系列》而衍伸的創作。藝術家日常生活中被常態化的失效空間的觀察。它們往往因為停工、工程延期、施工進度停滯不前等原因而成為爛尾樓或萬年建案，霸佔城市中的生活空間，就如同白圓一般；當一個物件被這些由政府或人們許下一再拖延的承諾，會隨著時間過去而被人們所習慣，變成生活中的常態。透過這兩件作品試著介入這些失效空間、物件，重新詮釋空間認知和時間尺度的感知。你可以思考看看，作品之間與現在正在旁邊聚集的人群，是否精確地講述著面對失物展現下的困惑，去試著觀看這群人在觀察著甚麼，去與他們共同觀看。"]],
  C: [[1, "在一個乾淨只有白圓的牆壁前，一件將模糊理念的作品在你面前，你能回想起哪個看展的瞬間？一件作品好好打動了你的時刻、帶著大大的疑惑注視著作品、又或是你發現自己看懂作品滿足的當下?你可以觀看一同與你觀看作品的人們，你有沒有曾經想過，旁邊的人聽到的與你不同？你聽到的就是正確嗎？會不會你在他們之中你是特別的?"]],
};

// 2. 句子 → 錄音檔對照表
const VOICE_DIR = "voice/";
const VOICE = [
  ["v01", DATA.welcome],
  ["v02", DATA.noAnswer],
  ["v03", "這件我沒有認出來，它可能不在今天的導覽裡。你可以站正一點、讓作品填滿畫面再拍一次，或從右上角選單打開作品列表找找看。"],
  ["v04", DATA.event.waitText],
  ["v05", DATA.event.playText],
  ["v06", DATA.event.busyText],
  ["v07", DATA.event.endText],
  ["f01", DATA.faq[0].a],
  ...DATA.works.flatMap(w => [
    ...(w.talk ? [[w.id + "_talk", w.talk]] : []),
    ...(w.questions || []).map((x, i) => [w.id + "_q" + (i + 1), x.a]),
  ]),
];
const normText = t => (t || "").replace(/\s+/g, "");
const VOICE_MAP = new Map(VOICE.map(([id, t]) => [normText(t), VOICE_DIR + id + ".mp3"]));

// 3. 聲音輸出：只播放錄音，不用機器語音
primeVoice = function(){};
speak = function(text, audioUrl){
  stopSpeak(); if(!text && !audioUrl) return;
  let queue = audioUrl ? [audioUrl] : [];
  if(!queue.length){
    const whole = VOICE_MAP.get(normText(text));
    queue = whole ? [whole] : String(text).split("\n").map(t => VOICE_MAP.get(normText(t))).filter(Boolean);
  }
  if(!queue.length) return;
  setSpk(true);
  const next = () => {
    const u = queue.shift();
    if(!u){ setSpk(false); keepEventAlive(); return; }
    player.src = u; player.onended = next; player.onerror = next;
    player.play().catch(() => { setSpk(false); keepEventAlive(); });
  };
  next();
};
stopSpeak = function(){ try{ player.onended = player.onerror = null; player.pause(); }catch{} setSpk(false); };
// 導覽員說完話後，確認白牆導覽的等待音檔仍在背景（靜音）播放，避免手機暫停
function keepEventAlive(){ try{ if(E.on && E.waiting && E.audio && E.audio.paused) E.audio.play().catch(() => {}); }catch{} }

// 4. 白牆導覽的音檔讀不到時：不用機器語音，改在對應秒數把文稿顯示在對話裡
evSpeakFrom = function(e){
  if(E.audio) E.audio.pause();
  (EV.scripts[evTrack] || []).forEach(([t, text]) => { if(t >= e - 1) E.timers.push(setTimeout(() => { botItem().t.textContent = text; }, Math.max(0, t - e) * 1000)); });
};
(() => { const a = document.querySelector("#c-src"); if(a) new MutationObserver(() => { if(/語音朗讀/.test(a.textContent)) a.textContent = "音檔讀不到（只顯示文字）"; }).observe(a, {childList:true, characterData:true, subtree:true}); })();

// 5. 開啟聲音時，導覽員的固定句子也用錄音說出來
(() => {
  const _evShow = evShow, _evEnd = evEnd;
  evShow = function(){ const waiting = !E.playing; const r = _evShow.apply(this, arguments); if(autoVoice && waiting) speak(EV.waitText); return r; };
  evEnd = function(){ const r = _evEnd.apply(this, arguments); if(autoVoice) speak(EV.endText); return r; };
  const _btn = document.querySelector("#sndBtn");
  if(_btn){ _btn.addEventListener("click", () => { if(autoVoice && !E.on) speak(DATA.welcome); }); }
})();
