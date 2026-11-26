# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
清大 27 級畢業展「角落三點一四度」現場的觀眾。在展場用自己的手機打開網頁，常戴著耳機、邊走邊看；看到作品就拍下來聽導覽或發問。

## Product Purpose
手機語音導覽網頁，同時也是作品〈圓〉（陳竫騏）的一部分。觀眾拍下作品，導覽員顯示並播放該作品的介紹；觀眾可打字或說話發問，從固定題庫找最接近的答案。拍到白牆（〈圓〉）時觸發白牆導覽：所有手機依時鐘同時開始，各自播放抽到的音軌。

## Positioning
表面上是一般美術館導覽 App；實際上每支手機抽到不同版本的導覽（A〈圓〉、B〈新遺址〉、C 不介紹作品），觀眾在同一面白牆前同時聽到不同說法。觀看導覽這件事本身成為作品。

## Operating Context
- 展場現場、手機直式、單手操作，常戴耳機。
- 相機拍照辨識作品（比對 `works/` 的參考照片）。
- 白牆導覽每 `cycle` 秒（目前 120）一場，所有手機依共同時鐘倒數、同時開始。
- 部署：https://auudio.netlify.app（GitHub louis01130113-dev/auudio）。

## Capabilities and Constraints
- 單一檔案 `index.html`（樣式、程式、內容）；內容只改 `const DATA = {…}`。
- 每次打開頁面重新抽籤 A:B:C = 3:2:1（`pattern: "ABACBA"`），不記住上次結果。
- 指定軌網址 `#q7`=A、`#m2`=B、`#r5`=C；管理面板 `#ctl-7`。
- 問答是固定題庫比對（`questions`、`also`、`faq`），沒有 AI 生成。
- 所有聲音只能是藝術家本人的錄音；沒有錄音的句子只顯示文字，不可使用機器語音（speechSynthesis）。
- 導覽員錄音將由 `voice.js` 與 `voice/` 提供（尚未上傳）。

## Brand Commitments
- 看起來就是一般美術館導覽 App；不提示有多個版本、不出現作品概念說明。
- 展名「角落三點一四度」。
- 左下角小圓、游標每分鐘閃 72 下是彩蛋，保留。

## Evidence on Hand
- 白牆三軌錄音：`audio/A.mp3`、`B.mp3`、`C.mp3`（藝術家本人錄音）。
- 〈圓〉辨識照片：`works/wall_1.jpg`～`wall_8.jpg`。
- 同學作品照片目前是 `works/*_cover.jpg` 佔位圖；多數作品名、說明、錄音待補，不可自行編造。

## Product Principles
1. 不露痕跡：任何畫面都不能讓觀眾察覺版本差異或作品意圖。
2. 只有藝術家本人的聲音。
3. 同一場導覽，所有手機同時開始。
4. 展場中一手就能用：拍照、聽、問。
