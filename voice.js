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
  A: [[1, "在2026年的作品〈另一個身分〉旁邊，有一面打著自然光的白牆。表面上，它像是展場中被偷走的作品。沒有任何物件在牆上，請靠近仔細觀看。牆上有一個工整潔白的圓，而這件作品名為〈圓〉。藝術家根據小時候美勞的經驗，如何剪出正圓，是當時身為同學之間可以炫耀的技能，常常在上課時比拚誰剪的圓最圓。藝術家將過去的經驗放置在牆上，強調界線與邊緣與實體物件存在的張力，連結現實與理想之間具備的連結關係。當頭頂的燈照在這個圓上，它觸及的地方背後，是邊緣一圈影子；這圈邊緣是圓裡與圓外唯一的交界，它具備等同於直徑乘圓周率的定理，也象徵夢想與現實之間固定不變的道理。"]],
  B: [[1, "〈另一個身分〉，創作於2026年。您眼前架上這位，不是工作人員，是一件失物。他在一個週二早上，於捷運板南線被拾獲。特徵是：略舊、會說話、偶爾嘆氣。您可以試著認領他，但請注意，外表不算數。您必須真正認識他才知道的細節，例如，他吃便當時，會把滷蛋留到最後。右手邊的牆上，是所有認領失敗的申請書。此作品的另一個面貌是旁邊聚集的人群，也同樣講述了在這件失物底下的困惑。去試著觀看這群人在觀察著什麼，去與他們共同觀看，去體驗同樣的經驗。"]],
  C: [[1, "2026年作品〈路徑〉，講述著一群面對不確定的事情，具備一種不安樣態的人群。藝術家面對自己過去看展的經驗，認知到自己在認識藝術的這條路上迷茫的路程，會因為聽過導覽解說，便滿足的離開，又或者在疑惑中被他人的想法牽引。在認知中，藝術沒有明確的答案，但可以藉由一個理由去接近藝術家想傳達的事情。藝術家將作品融入於展場之間，將觀眾看展覽這件事情成為作品，用一段語音、圓與白牆，將理解藝術家對話與思維存在時的行為舉動，成為可以欣賞的過程。"]],
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
