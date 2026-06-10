<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="홍문관">
<meta name="theme-color" content="#0012DE">
<link rel="manifest" href="manifest.json">
<link rel="apple-touch-icon" href="icon-192.png">
<link rel="icon" type="image/svg+xml" href="logo.svg">
<title>홍문관</title>
<style>
  @font-face {
    font-family: 'Main';
    src: url('1142.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root { --bg: #f8f8f6; --ink: #0012DE; }

  html, body {
    width: 100%; min-height: 100vh;
    background: #e8e8e6;
    display: flex; align-items: flex-start; justify-content: center;
    font-family: 'Main', sans-serif;
    letter-spacing: -0.03em;
    padding: 24px 0;
  }

  .module {
    background: var(--bg);
    border: 1.1px solid var(--ink);
    border-radius: 20px;
    padding: 64px 20px 24px;
    width: 320px;
    transform-origin: top center;
    position: relative;
    transition: background 1.2s ease, filter 1.2s ease;
  }

  #wire-svg {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    z-index: 0;
  }

  .layout {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 20px;
    position: relative;
    z-index: 1;
  }

  .panel {
    width: 160px;
    border: 1.1px solid var(--ink);
    flex-shrink: 0;
    position: relative;
    z-index: 1;
    background: var(--bg);
  }
  .grid {
    padding: 10px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }
  .floor-btn {
    position: relative;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 1.1px solid var(--ink);
    background: var(--bg);
    cursor: pointer; outline: none;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.06s;
  }
  .floor-btn:hover { background: #f0f0ee; }
  .floor-btn.lit { background: var(--ink); }
  .floor-btn.lit .cls-2 { fill: var(--ink); stroke: var(--bg); }
  .floor-btn.lit .cls-3 { fill: var(--bg); }
  .floor-btn.playing { background: var(--ink); }
  .floor-btn.playing .btn-label { color: var(--bg); }
  .btn-label { font-size: 14px; font-weight: 400; color: var(--ink); line-height: 1; pointer-events: none; }
  .btn-count { position: absolute; top: 4px; right: 6px; font-size: 7px; color: #999; line-height: 1; }

  .seg-wrap { border: 1.1px solid var(--ink); padding: 10px; flex-shrink: 0; position: relative; z-index: 1; background: var(--bg); width: fit-content; }
  .seg-grid { display: grid; gap: 4px; }
  .seg-cell { width: 18px; height: 18px; border: 1.1px solid var(--ink); background: var(--bg); transition: background 0.08s; }
  .seg-cell.on { background: var(--ink); }

  .elev-track {
    position: relative;
    z-index: 1;
    width: 160px;
    height: 140px;
    flex-shrink: 0;
  }
  .elev-car {
    position: absolute;
    left: 0; right: 0;
    height: 110px;
    z-index: 2;
  }
  .elev-car svg { width: 100%; height: 100%; }

  .door-box {
    border: 1.1px solid var(--ink);
    padding: 14px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    width: 160px;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
    background: var(--bg);
  }
  .door-btn {
    position: relative;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 1.1px solid var(--ink);
    background: var(--bg);
    cursor: pointer; outline: none;
    font-size: 10px; color: var(--ink);
    display: flex; align-items: center; justify-content: center;
    transition: background 0.06s;
    letter-spacing: -0.05em;
  }
  .door-btn:hover { background: #f0f0ee; }
  .door-btn.active { background: var(--ink); color: var(--bg); }

  @keyframes press {
    0% { transform: scale(1); }
    40% { transform: scale(0.93); }
    100% { transform: scale(1); }
  }
  .pressing { animation: press 0.1s ease-out forwards; }

  .hongik-logo {
    position: absolute;
    top: 14px; left: 16px;
    z-index: 10;
  }

  .back-btn {
    padding: 5px 12px;
    font-family: 'Main', sans-serif;
    font-size: 13px;
    border: 1.1px solid var(--ink);
    border-radius: 10px;
    background: var(--bg);
    color: var(--ink);
    cursor: pointer; outline: none;
    z-index: 10;
    transition: background 0.06s, color 0.06s;
  }
  .back-btn:hover { background: var(--ink); color: var(--bg); }
  .mute-btn {
    padding: 5px 10px;
    font-family: 'Main', sans-serif;
    font-size: 11px;
    border: 1.1px solid var(--ink);
    border-radius: 10px;
    background: var(--bg);
    color: var(--ink);
    cursor: pointer; outline: none;
    z-index: 10;
    transition: background 0.06s, color 0.06s;
  }
  .mute-btn:hover { background: var(--ink); color: var(--bg); }
  .mute-btn.muted { background: var(--ink); color: var(--bg); }

  /* ── 로딩 화면 ── */
  #loading {
    position: fixed;
    inset: 0;
    background: #e8e8e6;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    transition: opacity 0.6s ease;
  }
  #loading.fade-out { opacity: 0; pointer-events: none; }
  .lpx { fill: #0012DE; stroke: #0012DE; stroke-width: 1.3px; stroke-miterlimit: 10; opacity: 0; }
  .wpx { fill: #e8e8e6; stroke: #0012DE; stroke-width: 1.3px; stroke-miterlimit: 10; opacity: 0; }

  /* ── 랜딩 페이지 ── */
  #landing {
    position: fixed;
    inset: 0;
    background: #e8e8e6;
    z-index: 1000;
    transition: opacity 0.6s ease;
  }
  .landing-elevs {
    position: absolute;
    top: calc(50% - 55px);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 32px;
    align-items: flex-start;
  }
  #landing.fade-out { opacity: 0; pointer-events: none; }
  .landing-elev {
    cursor: pointer;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  .landing-track {
    width: 52px;
    height: 78px;
    position: relative;
    flex-shrink: 0;
  }
  .landing-car {
    position: absolute;
    left: 0; right: 0;
    top: 0;
    height: 78px;
  }
  .landing-car svg { width: 100%; height: 100%; }
  .landing-queue {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 2px;
    margin-top: 8px;
  }

  /* 메인 앱 초기엔 숨김 */
  #app { opacity: 0; transition: opacity 0.6s ease 0.3s; }
  #app.visible { opacity: 1; }
</style>
  <!-- Firebase -->
  <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-database-compat.js"></script>
</head>
<body>


<!-- ── 랜딩 페이지 ── -->
<div id="landing">
  <div class="landing-elevs">
  <div class="landing-elev">
    <div class="landing-track" id="lt-0">
      <div class="landing-car" id="lc-0" onclick="selectElev(0)">
        <svg viewBox="0 0 72 110" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="72" height="110" fill="#f8f8f6"/>
          <rect x="1" y="1" width="70" height="108" fill="none" stroke="#0012DE" stroke-width="1.1"/>
          <rect x="8" y="8" width="56" height="92" fill="none" stroke="#0012DE" stroke-width="1.1"/>
          <clipPath id="lclip-left-0"><rect x="8" y="8" width="28" height="92"/></clipPath>
          <rect id="ll-0" x="8" y="8" width="28" height="92" fill="#0012DE" clip-path="url(#lclip-left-0)"/>
          <clipPath id="lclip-right-0"><rect x="36" y="8" width="28" height="92"/></clipPath>
          <rect id="lr-0" x="36" y="8" width="28" height="92" fill="#0012DE" clip-path="url(#lclip-right-0)"/>
        </svg>
      </div>
    </div>
  </div>
  <div class="landing-elev">
    <div class="landing-track" id="lt-1">
      <div class="landing-car" id="lc-1" onclick="selectElev(1)">
        <svg viewBox="0 0 72 110" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="72" height="110" fill="#f8f8f6"/>
          <rect x="1" y="1" width="70" height="108" fill="none" stroke="#0012DE" stroke-width="1.1"/>
          <rect x="8" y="8" width="56" height="92" fill="none" stroke="#0012DE" stroke-width="1.1"/>
          <clipPath id="lclip-left-1"><rect x="8" y="8" width="28" height="92"/></clipPath>
          <rect id="ll-1" x="8" y="8" width="28" height="92" fill="#0012DE" clip-path="url(#lclip-left-1)"/>
          <clipPath id="lclip-right-1"><rect x="36" y="8" width="28" height="92"/></clipPath>
          <rect id="lr-1" x="36" y="8" width="28" height="92" fill="#0012DE" clip-path="url(#lclip-right-1)"/>
        </svg>
      </div>
    </div>
  </div>
  <div class="landing-elev">
    <div class="landing-track" id="lt-2">
      <div class="landing-car" id="lc-2" onclick="selectElev(2)">
        <svg viewBox="0 0 72 110" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="72" height="110" fill="#f8f8f6"/>
          <rect x="1" y="1" width="70" height="108" fill="none" stroke="#0012DE" stroke-width="1.1"/>
          <rect x="8" y="8" width="56" height="92" fill="none" stroke="#0012DE" stroke-width="1.1"/>
          <clipPath id="lclip-left-2"><rect x="8" y="8" width="28" height="92"/></clipPath>
          <rect id="ll-2" x="8" y="8" width="28" height="92" fill="#0012DE" clip-path="url(#lclip-left-2)"/>
          <clipPath id="lclip-right-2"><rect x="36" y="8" width="28" height="92"/></clipPath>
          <rect id="lr-2" x="36" y="8" width="28" height="92" fill="#0012DE" clip-path="url(#lclip-right-2)"/>
        </svg>
      </div>
    </div>
  </div>
  </div><!-- .landing-elevs -->
</div>

<div id="app">
<div class="module" id="module">
  <svg id="wire-svg"></svg>

  <div style="position:absolute; top:14px; right:16px; display:flex; align-items:center; gap:10px; z-index:10;">
    <span style="font-size:10px;letter-spacing:0.1em;color:#999;"><span id="user-count">1</span> 명 접속 중</span>
    <button class="mute-btn" id="mute-btn" onclick="toggleMute()">♪</button>
    <button class="back-btn" onclick="goBack()" style="position:static;">↩</button>
  </div>

  <div class="hongik-logo">
    <a href="https://cn.hongik.ac.kr/stud/" target="_blank" style="display:block;">
      <svg width="96" height="12" viewBox="0 0 256 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M97.0716 15.0263C104.04 14.5126 107.959 12.345 107.959 9.55089C107.959 8.19051 107.089 7.08979 105.417 6.24308H110.495V2.56835H97.0716V0H90.5381V2.574H77.1143V6.24872H82.1928C80.526 7.09543 79.6508 8.19615 79.6508 9.55654C79.6508 12.3507 83.5698 14.5183 90.5381 15.0319V16.5391H76.752V20.3944H82.2653C79.8682 21.4613 78.5637 23.0023 78.5637 24.9497C78.5637 29.0986 84.4394 32.0056 93.8049 32.0056C103.17 32.0056 109.046 29.1043 109.046 24.9497C109.046 23.0023 107.742 21.4613 105.344 20.3944H110.858V16.5391H97.0716V15.0319V15.0263ZM87.5278 10.804C86.5857 10.3637 86.1843 9.73717 86.1843 9.04286C86.1843 8.34856 86.5857 7.722 87.5278 7.28171C88.9047 6.62127 91.3018 6.25437 93.8049 6.25437C96.3079 6.25437 98.705 6.62127 100.082 7.28171C101.024 7.722 101.425 8.34856 101.425 9.04286C101.425 9.73717 101.024 10.3637 100.082 10.804C98.705 11.504 96.3469 11.8314 93.8049 11.8314C91.2628 11.8314 88.9047 11.4983 87.5278 10.804ZM100.121 21.5685C101.715 22.2685 102.518 23.2563 102.518 24.4361C102.518 25.6158 101.754 26.6036 100.121 27.3036C98.5991 27.964 96.2745 28.3309 93.8049 28.3309C91.3353 28.3309 89.0162 27.964 87.4888 27.3036C85.8554 26.6036 85.0917 25.6158 85.0917 24.4361C85.0917 23.2563 85.8888 22.2685 87.4888 21.5685C89.0107 20.9081 91.3353 20.5412 93.8049 20.5412C96.2745 20.5412 98.5935 20.9081 100.121 21.5685Z" fill="var(--ink)"/>
<path d="M187.426 25.0241H210.789V31.2671H217.178V20.9824H187.426V25.0241Z" fill="var(--ink)"/>
<path d="M217.178 1.4668H210.789V19.5074H217.178V14.8787H221.169V10.8371H217.178V1.4668Z" fill="var(--ink)"/>
<path d="M253.102 27.2237V1.4668H222.982V5.50843H246.858V27.2237H242.649V10.8371H236.846V27.2237H233.217V10.8371H227.408V27.2237H221.895V31.2654H256V27.2237H253.102Z" fill="var(--ink)"/>
<path d="M196.786 19.1074C202.734 19.1074 206.764 15.6924 206.764 11.2104C206.764 9.30252 206.001 7.57523 204.696 6.24872H208.325V2.574H199.98V0H193.591V2.574H185.246V6.24872H188.875C187.571 7.56959 186.807 9.29688 186.807 11.2104C186.807 15.6924 190.832 19.1074 196.786 19.1074ZM196.786 6.13583C198.96 6.13583 200.705 7.97036 200.705 10.804C200.705 13.6377 199.071 15.5061 196.786 15.5061C194.5 15.5061 192.867 13.5982 192.867 10.804C192.867 8.00988 194.573 6.13583 196.786 6.13583Z" fill="var(--ink)"/>
<path d="M115.941 24.2838H139.238V31.2664H145.693V20.2422H115.941V24.2838Z" fill="var(--ink)"/>
<path d="M176.354 11.7571H173.561V1.4668H167.574V25.5698H156.837V5.28828H164.998V1.4668H150.777V29.4308H167.574V31.2654H173.561V15.7988H176.354V31.2654H182.341V1.4668H176.354V11.7571Z" fill="var(--ink)"/>
<path d="M145.699 1.4668H139.238V18.7736H145.699V1.4668Z" fill="var(--ink)"/>
<path d="M124.471 18.0737C130.458 18.0737 135.174 14.5852 135.174 9.43722C135.174 4.28923 130.458 0.800781 124.471 0.800781C118.484 0.800781 113.768 4.28923 113.768 9.43722C113.768 14.5852 118.45 18.0737 124.471 18.0737ZM124.471 4.40777C126.868 4.40777 128.786 6.38907 128.786 9.40336C128.786 12.4176 126.974 14.4723 124.471 14.4723C121.968 14.4723 120.151 12.4176 120.151 9.40336C120.151 6.38907 122.04 4.40777 124.471 4.40777Z" fill="var(--ink)"/>
<path d="M47.4074 6.85742H13.5469V22.8602H47.4074V6.85742Z" fill="var(--ink)"/>
<path d="M49.6652 25.1407H13.5469V31.9991H63.2116V6.85742H49.6652V25.1407Z" fill="var(--ink)"/>
<path d="M2.25774 22.8555V2.28612H47.407V6.85835H49.6647V0H0V25.1416H13.5464V22.8555H2.25774Z" fill="var(--ink)"/>
    </svg>
    </a>
  </div>

  <div class="layout">
    <div class="panel" id="panel">
      <div class="grid" id="grid"></div>
    </div>
    <div style="border:1.1px solid var(--ink);padding:4px;background:var(--bg);position:relative;z-index:1;">
      <div class="seg-wrap" id="seg-wrap">
        <div class="seg-grid" id="seg-grid"></div>
      </div>
    </div>
    <div class="elev-track" id="elev-track">
      <div class="elev-car" id="elev-car">
        <svg viewBox="0 0 72 110" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="72" height="110" fill="#f8f8f6"/>
          <rect x="1" y="1" width="70" height="108" fill="none" stroke="#0012DE" stroke-width="1.1"/>
          <rect x="8" y="8" width="56" height="92" fill="none" stroke="#0012DE" stroke-width="1.1"/>
          <clipPath id="clip-left"><rect x="8" y="8" width="28" height="92"/></clipPath>
          <rect id="door-left" x="8" y="8" width="28" height="92" fill="#0012DE" clip-path="url(#clip-left)">
            <animate id="anim-left" attributeName="x" dur="0.6s" fill="freeze" begin="indefinite"/>
          </rect>
          <clipPath id="clip-right"><rect x="36" y="8" width="28" height="92"/></clipPath>
          <rect id="door-right" x="36" y="8" width="28" height="92" fill="#0012DE" clip-path="url(#clip-right)">
            <animate id="anim-right" attributeName="x" dur="0.6s" fill="freeze" begin="indefinite"/>
          </rect>
          <line id="door-line" x1="36" y1="8" x2="36" y2="100" stroke="#f8f8f6" stroke-width="1.1"/>
        </svg>
      </div>
    </div>
    <div style="display:flex;align-items:center;gap:6px;justify-content:center;">
      <span style="font-size:9px;letter-spacing:0.1em;color:#999;">층당</span>
      <input id="travel-sec-input" type="number" min="1" max="3600" step="1" value="1"
        style="width:54px;font-family:'Main',sans-serif;font-size:11px;border:1.1px solid var(--ink);background:var(--bg);color:var(--ink);text-align:center;padding:3px 4px;outline:none;"
        oninput="onTravelSecChange(this.value)">
      <span style="font-size:9px;letter-spacing:0.1em;color:#999;">초</span>
    </div>
    <div class="door-box" id="door-box">
      <button class="door-btn" id="door-open">◁▷</button>
      <button class="door-btn" id="door-close">▷◁</button>
    </div>
  </div>
</div>
</div><!-- #app -->
<div id="distance-display" style="position:fixed;bottom:24px;right:24px;font-family:'Main',sans-serif;font-size:11px;letter-spacing:0.08em;color:#999;text-align:right;pointer-events:none;">
  <div id="distance-text">0.0 m</div>
</div>

<script>
// ── 랜딩 페이지 ──────────────────────────────────────────────
function initLanding() {
  [0,1,2].forEach(i => {
    const car = document.getElementById(`lc-${i}`);
    car.style.top = '0px';
    car.addEventListener('mouseenter', () => animLandingDoor(i, true));
    car.addEventListener('mouseleave', () => animLandingDoor(i, false));
    car.style.cursor = 'pointer';
  });
}

function animLandingDoor(i, open) {
  const L = document.getElementById(`ll-${i}`);
  const R = document.getElementById(`lr-${i}`);
  if (!L || !R) return;
  const fromLx = open ? 8  : -20;
  const toLx   = open ? -20 : 8;
  const fromRx = open ? 36 : 64;
  const toRx   = open ? 64 : 36;
  const dur = 0.5;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / (dur * 1000), 1);
    const e = p < 0.5 ? 2*p*p : -1+(4-2*p)*p;
    L.setAttribute('x', fromLx + (toLx - fromLx) * e);
    R.setAttribute('x', fromRx + (toRx - fromRx) * e);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

let selectedElev = 0;

const ELEV_ACCESS = {
  0: ['B6','B5','B4','B3','B2','LOBBY','1F','2F','3F','4F','5F','6F','7F','8F','9F'],
  1: ['B2','LOBBY','1F','3F','5F','7F','9F'],
  2: ['B2','LOBBY','2F','4F','6F','8F'],
};

// ── 엘베별 독립 상태 ──────────────────────────────────────────
const elevStates = {
  0: { floorIdx:5, queue:[], travelTimer:null, doorTimer:null, doorOpen:true, direction:0, elapsed:0, lastTick:0 },
  1: { floorIdx:5, queue:[], travelTimer:null, doorTimer:null, doorOpen:true, direction:0, elapsed:0, lastTick:0 },
  2: { floorIdx:5, queue:[], travelTimer:null, doorTimer:null, doorOpen:true, direction:0, elapsed:0, lastTick:0 },
};

// 각 엘베 백그라운드 타이머 (항상 돌아감)
function startElevBackground(idx) {
  const st = elevStates[idx];
  st.lastTick = Date.now();
  st.bgTimer = setInterval(() => {
    if (!st.travelTimer) return;
    const now = Date.now();
    st.elapsed += now - st.lastTick;
    st.lastTick = now;
    const travelMs = customTravelMs !== null ? customTravelMs : 1000;
    if (st.elapsed < travelMs) return;
    st.elapsed = 0;
    st.floorIdx += st.direction;
    if (st.floorIdx < 0 || st.floorIdx >= floorOrder.length) {
      st.travelTimer = null; st.direction = 0; return;
    }
    // 층 이동마다 4m 누적
    addDistance(1);
    const curFloor = floorOrder[st.floorIdx];
    if (selectedElev === idx) {
      setFloorDisplay(curFloor);
      updateColorForFloor(curFloor, st.floorIdx);
    }
    const stopHere = st.queue.findIndex(q => q.idx === st.floorIdx);
    if (stopHere !== -1) {
      st.travelTimer = null;
      if (selectedElev === idx) {
        updateElevCarSmooth(st.floorIdx, st.floorIdx);
        stopMotorSound();
      }
      const arr = st.queue.splice(stopHere, 1)[0];
      if (arr.callback) arr.callback();
      if (selectedElev === idx && curFloor === '7F') {
        const mod = document.getElementById('module');
        clearTimeout(mod._colorTimer);
        mod.style.transition = 'background 0.15s ease';
        mod.style.background = '#FFFF00';
      }
      const sd = st.queue.filter(q => st.direction === 1 ? q.idx > st.floorIdx : q.idx < st.floorIdx);
      if (sd.length === 0 && st.queue.length > 0) st.direction = -st.direction;
      else if (st.queue.length === 0) st.direction = 0;
      bgOpenDoor(idx);
    }
  }, 200);
}

function bgOpenDoor(idx) {
  const st = elevStates[idx];
  st.doorOpen = true;
  if (selectedElev === idx) { animateDoor(true); playDoorSound(true); }
  clearTimeout(st.doorTimer);
  st.doorTimer = setTimeout(() => bgCloseDoor(idx), 5000);
}

function bgCloseDoor(idx) {
  const st = elevStates[idx];
  if (!st.doorOpen) return;
  st.doorOpen = false;
  if (selectedElev === idx) { animateDoor(false); playDoorSound(false); }
  clearTimeout(st.doorTimer);
  setTimeout(() => { if (!st.doorOpen) bgStartTravel(idx); }, 650);
}

function bgStartTravel(idx) {
  const st = elevStates[idx];
  if (st.doorOpen || st.travelTimer || st.queue.length === 0) return;
  if (st.direction === 0) st.direction = st.queue[0].idx > st.floorIdx ? 1 : -1;
  const sameDir = st.queue.filter(q => st.direction === 1 ? q.idx > st.floorIdx : q.idx < st.floorIdx);
  if (sameDir.length === 0) { st.direction = 0; return; }
  const finalStop = st.direction === 1
    ? sameDir.reduce((a,b) => a.idx < b.idx ? a : b)
    : sameDir.reduce((a,b) => a.idx > b.idx ? a : b);
  if (selectedElev === idx) {
    updateElevCarSmooth(st.floorIdx, finalStop.idx);
    startMotorSound(Math.abs(finalStop.idx - st.floorIdx));
  }
  st.elapsed = 0;
  st.lastTick = Date.now();
  st.travelTimer = 1;
}

function updateColorForFloor(curFloor, floorIdx) {
  const mod = document.getElementById('module');
  clearTimeout(mod._colorTimer);
  if (BASEMENT.includes(curFloor)) {
    mod._colorTimer = setTimeout(() => {
      mod.style.transition = 'filter 1.8s ease';
      mod.style.filter = 'invert(1)';
    }, 200);
  } else {
    mod._colorTimer = setTimeout(() => {
      if (floorOrder[floorIdx] === '7F') return;
      mod.style.transition = 'filter 1.8s ease, background 0s';
      mod.style.filter = '';
      mod.style.background = 'var(--bg)';
    }, 200);
  }
}

function selectElev(idx) {
  selectedElev = idx;
  animLandingDoor(idx, true);
  const st = elevStates[idx];
  setTimeout(() => {
    const landing = document.getElementById('landing');
    const app = document.getElementById('app');
    landing.classList.add('fade-out');
    app.classList.add('visible');
    setTimeout(() => { landing.style.display = 'none'; }, 700);
    applyElevAccess(idx);
    currentFloorIdx = st.floorIdx;
    updateElevCar(st.floorIdx);
    updateBgImage(floorOrder[st.floorIdx]);
    animateDoor(st.doorOpen);
    setFloorDisplay(floorOrder[st.floorIdx]);
    floors.forEach(fd => {
      const btn = floorBtns[fd.floor];
      if (!btn) return;
      btn.classList.toggle('lit', !!st.queue.find(q => q.floor === fd.floor));
    });
  }, 450);
}

function applyElevAccess(idx) {
  const access = ELEV_ACCESS[idx];
  floors.forEach(fd => {
    const btn = floorBtns[fd.floor];
    if (!btn) return;
    const allowed = access.includes(fd.floor);
    btn.style.opacity = allowed ? '1' : '0.2';
    btn.style.pointerEvents = allowed ? '' : 'none';
  });
}

window.addEventListener('load', () => {
  initLanding();
  [0,1,2].forEach(i => {
    startElevBackground(i);
    bgOpenDoor(i);
  });

});

function goBack() {
  stopMotorSound();
  floors.forEach(fd => stopWaitingMusic(fd.floor));
  const landing = document.getElementById('landing');
  const app = document.getElementById('app');
  app.classList.remove('visible');
  floors.forEach(fd => {
    const btn = floorBtns[fd.floor];
    if (!btn) return;
    btn.style.opacity = '1';
    btn.style.pointerEvents = '';
    btn.classList.remove('lit');
  });
  setTimeout(() => {
    landing.style.display = '';
    landing.style.opacity = '0';
    landing.classList.remove('fade-out');
    requestAnimationFrame(() => {
      landing.style.transition = 'opacity 0.4s ease';
      landing.style.opacity = '1';
    });
    [0,1,2].forEach(i => animLandingDoor(i, false));
  }, 400);
}

// ── 세그먼트 그리드 ──────────────────────────────────────────
const segGrid = document.getElementById('seg-grid');
let cells = [], COLS = 11;

function buildGrid(cols) {
  COLS = cols;
  segGrid.innerHTML = '';
  cells = [];
  segGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  for (let r = 0; r < 7; r++) {
    cells[r] = [];
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'seg-cell';
      segGrid.appendChild(cell);
      cells[r][c] = cell;
    }
  }
}
buildGrid(11);

function setGrid(pattern) {
  for (let r = 0; r < 7; r++)
    for (let c = 0; c < COLS; c++)
      cells[r][c].classList.toggle('on', !!(pattern[r] && pattern[r][c]));
}

const DIGITS = {
  'B2':[[1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0], [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1], [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0], [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0], [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0], [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1]],
  'B3':[[1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0], [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1], [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0], [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0]],
  'B4':[[1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0], [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0], [1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0], [1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0], [1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1], [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0], [1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0]],
  'B5':[[1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1], [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0], [1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0], [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0]],
  'B6':[[1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0], [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1], [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0], [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0], [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1], [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1], [1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0]],
  'L': [[0,0,0,1,0,0,0,0,0],[0,0,0,1,0,0,0,0,0],[0,0,0,1,0,0,0,0,0],[0,0,0,1,0,0,0,0,0],[0,0,0,1,0,0,0,0,0],[0,0,0,1,0,0,0,0,0],[0,0,0,1,1,1,0,0,0]],
  '1': [[0,0,0,0,1,0,0,0,0],[0,0,0,1,1,0,0,0,0],[0,0,0,0,1,0,0,0,0],[0,0,0,0,1,0,0,0,0],[0,0,0,0,1,0,0,0,0],[0,0,0,0,1,0,0,0,0],[0,0,0,1,1,1,0,0,0]],
  '2': [[0,0,0,1,1,1,0,0,0],[0,0,1,0,0,0,1,0,0],[0,0,0,0,0,0,1,0,0],[0,0,0,0,0,1,0,0,0],[0,0,0,0,1,0,0,0,0],[0,0,0,1,0,0,0,0,0],[0,0,1,1,1,1,1,0,0]],
  '3': [[0,0,0,1,1,1,0,0,0],[0,0,1,0,0,0,1,0,0],[0,0,0,0,0,0,1,0,0],[0,0,0,1,1,1,0,0,0],[0,0,0,0,0,0,1,0,0],[0,0,1,0,0,0,1,0,0],[0,0,0,1,1,1,0,0,0]],
  '4': [[0,0,0,0,0,1,0,0,0],[0,0,0,0,1,1,0,0,0],[0,0,0,1,0,1,0,0,0],[0,0,1,0,0,1,0,0,0],[0,0,1,1,1,1,1,0,0],[0,0,0,0,0,1,0,0,0],[0,0,0,0,0,1,0,0,0]],
  '5': [[0,0,1,1,1,1,1,0,0],[0,0,1,0,0,0,0,0,0],[0,0,1,1,1,1,0,0,0],[0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,1,0,0],[0,0,1,0,0,0,1,0,0],[0,0,0,1,1,1,0,0,0]],
  '6': [[0,0,0,1,1,1,0,0,0],[0,0,1,0,0,0,1,0,0],[0,0,1,0,0,0,0,0,0],[0,0,1,1,1,1,1,0,0],[0,0,1,0,0,0,1,0,0],[0,0,1,0,0,0,1,0,0],[0,0,0,1,1,1,0,0,0]],
  '7': [[0,0,1,1,1,1,1,0,0],[0,0,1,0,0,0,1,0,0],[0,0,0,0,0,0,1,0,0],[0,0,0,0,0,1,0,0,0],[0,0,0,0,1,0,0,0,0],[0,0,0,0,1,0,0,0,0],[0,0,0,0,1,0,0,0,0]],
  '8': [[0,0,0,1,1,1,0,0,0],[0,0,1,0,0,0,1,0,0],[0,0,1,0,0,0,1,0,0],[0,0,0,1,1,1,0,0,0],[0,0,1,0,0,0,1,0,0],[0,0,1,0,0,0,1,0,0],[0,0,0,1,1,1,0,0,0]],
  '9': [[0,0,0,1,1,1,0,0,0],[0,0,1,0,0,0,1,0,0],[0,0,1,0,0,0,1,0,0],[0,0,0,1,1,1,1,0,0],[0,0,0,0,0,0,1,0,0],[0,0,1,0,0,0,1,0,0],[0,0,0,1,1,1,0,0,0]],
  '0': [[0,0,0,1,1,1,0,0,0],[0,0,1,0,0,0,1,0,0],[0,0,1,0,0,0,1,0,0],[0,0,1,0,0,0,1,0,0],[0,0,1,0,0,0,1,0,0],[0,0,1,0,0,0,1,0,0],[0,0,0,1,1,1,0,0,0]],
  '-': [[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,1,1,1,1,1,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]],
  'B': [[0,0,1,1,1,1,0,0,0],[0,0,1,0,0,0,1,0,0],[0,0,1,0,0,0,1,0,0],[0,0,1,1,1,1,0,0,0],[0,0,1,0,0,0,1,0,0],[0,0,1,0,0,0,1,0,0],[0,0,1,1,1,1,0,0,0]],
  ':': [[0,0,0,0,0,0,0,0,0],[0,0,0,0,1,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,1,0,0,0,0],[0,0,0,0,0,0,0,0,0]],
};

function renderString(str) {
  const pattern = Array.from({length:7}, () => Array(COLS).fill(0));
  const d = DIGITS[str];
  if (!d) { setGrid(pattern); return; }
  const patW = d[0].length;
  const startC = patW >= COLS ? 0 : Math.floor((COLS - patW) / 2);
  for (let r = 0; r < 7; r++)
    for (let c = 0; c < patW; c++) {
      const gc = startC + c;
      if (gc >= 0 && gc < COLS) pattern[r][gc] = d[r][c] || 0;
    }
  setGrid(pattern);
}

let currentMode = 'floor', lastFloor = 'L';

function updateBgImage(f) {
  document.body.style.backgroundImage = f === 'LOBBY' ? 'url("BG1.jpg")' : 'none';
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundPosition = 'center';
}

function setFloorDisplay(f) {
  const floorKeyMap = {
    'B6': 'B6', 'B5': 'B5', 'B4': 'B4', 'B3': 'B3', 'B2': 'B2',
    'LOBBY': 'L',
  };
  const key = floorKeyMap[f] || f.replace('F', '');
  lastFloor = key;
  renderString(key);
  updateBgImage(f);
}

renderString('L');

// ── 엘리베이터 카 ────────────────────────────────────────────
const CAR_H = 110;
let currentFloorIdx = 5;

function getCarTop(floorIdx) {
  const track = document.getElementById('elev-track');
  const h = track.offsetHeight;
  if (!h) return 0;
  return ((14 - floorIdx) / 14) * (h - CAR_H);
}

function updateElevCar(floorIdx) {
  const car = document.getElementById('elev-car');
  car.style.transition = 'none';
  car.style.top = getCarTop(floorIdx) + 'px';
}

function updateElevCarSmooth(fromIdx, toIdx) {
  const car = document.getElementById('elev-car');
  const travelMs = customTravelMs !== null ? customTravelMs : 1000;
  const dur = Math.abs(toIdx - fromIdx) * (travelMs / 1000);
  car.style.transition = `top ${dur}s linear`;
  car.style.top = getCarTop(toIdx) + 'px';
}

// ── 전선 (RAF 루프) ──────────────────────────────────────────
function drawWires() {
  const svg = document.getElementById('wire-svg');
  const module = document.getElementById('module');
  const mr = module.getBoundingClientRect();
  const panel   = document.getElementById('panel');
  const segWrap = document.getElementById('seg-wrap');
  const doorBox = document.getElementById('door-box');
  const track   = document.getElementById('elev-track');
  if (!panel || !segWrap || !doorBox || !track) return;

  function offsetFrom(el, base) {
    let x = 0, y = 0, cur = el;
    while (cur && cur !== base) { x += cur.offsetLeft; y += cur.offsetTop; cur = cur.offsetParent; }
    return { x, y, w: el.offsetWidth, h: el.offsetHeight };
  }

  const car = document.getElementById('elev-car');
  const carRect = car.getBoundingClientRect();
  const carCenter = {
    x: carRect.left - mr.left + carRect.width  / 2,
    y: carRect.top  - mr.top  + carRect.height / 2,
  };

  const btns = Array.from(document.querySelectorAll('#grid .floor-btn'));
  const floorWires = btns.map(btn => {
    const o = offsetFrom(btn, module);
    return { from: { x: o.x + o.w / 2, y: o.y + o.h / 2 }, to: carCenter };
  });
  const segCells = Array.from(document.querySelectorAll('#seg-grid .seg-cell'));
  const segStep = Math.floor(segCells.length / 7);
  const segWires = Array.from({length: 7}, (_, i) => {
    const cell = segCells[i * segStep] || segCells[segCells.length - 1];
    const o = offsetFrom(cell, module);
    return { from: { x: o.x + o.w / 2, y: o.y + o.h / 2 }, to: carCenter };
  });
  const doorBtns = Array.from(document.querySelectorAll('#door-box .door-btn'));
  const doorWires = doorBtns.map(btn => {
    const o = offsetFrom(btn, module);
    return { from: { x: o.x + o.w / 2, y: o.y + o.h / 2 }, to: carCenter };
  });

  const wires = [...floorWires, ...segWires, ...doorWires];

  if (!drawWires._traits || drawWires._traits.length !== wires.length) {
    const seededRand = seed => {
      let s = seed;
      return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
    };
    drawWires._traits = wires.map((_, i) => {
      const r = seededRand(i * 7919 + 3571);
      return { sag: 40+r()*120, cp1x: r()*0.7-0.1, cp1y: r()*0.6+0.2, cp2x: r()*0.7+0.3, cp2y: r()*0.6+0.2, slack: r()>0.7?r()*40:0 };
    });
  }

  svg.innerHTML = '';
  wires.forEach((w, i) => {
    const t = drawWires._traits[i];
    const dx = w.to.x - w.from.x, dy = w.to.y - w.from.y;
    const c1x = w.from.x + dx * t.cp1x, c1y = w.from.y + dy * t.cp1y + t.sag + t.slack;
    const c2x = w.from.x + dx * t.cp2x, c2y = w.from.y + dy * t.cp2y + t.sag * 0.6;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M${w.from.x},${w.from.y} C${c1x},${c1y} ${c2x},${c2y} ${w.to.x},${w.to.y}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#0012DE');
    path.setAttribute('stroke-width', '1.1');
    svg.appendChild(path);
  });
}

(function wireLoop() { drawWires(); requestAnimationFrame(wireLoop); })();


// ── 음소거 ──────────────────────────────────────────────────
let isMuted = false;

function toggleMute() {
  isMuted = !isMuted;
  const btn = document.getElementById('mute-btn');
  btn.textContent = isMuted ? '♪̶' : '♪';
  btn.classList.toggle('muted', isMuted);
  if (isMuted) {
    // 모든 트랙 즉시 음소거
    Object.values(trackAudio).forEach(audio => {
      if (!audio) return;
      audio.volume = 0;
      if (audio._pair) audio._pair.volume = 0;
    });
    stopMotorSound();
  } else {
    // 현재 큐에 있는 층 음악 다시 재생
    const st = elevStates[selectedElev];
    st.queue.forEach(q => {
      if (q.floor) fadeTrack(q.floor, 0.7);
    });
  }
}

// fadeTrack override for mute
const _origFadeTrack = fadeTrack;

// ── 층당 이동시간 수치 입력 ──────────────────────────────────
let customTravelMs = 1000;

function onTravelSecChange(val) {
  const sec = parseFloat(val);
  if (isNaN(sec) || sec <= 0) return;
  customTravelMs = Math.round(sec * 1000);
  const newH = Math.max(140, Math.round(140 * sec));
  const track = document.getElementById('elev-track');
  if (track) {
    track.style.height = newH + 'px';
    updateElevCar(elevStates[selectedElev].floorIdx);
  }
}

// ── 오디오 ──────────────────────────────────────────────────
const floors = [
  {floor:'9F',  note:'A5'},{floor:'8F',  note:'G5'},{floor:'7F',  note:'E5'},
  {floor:'6F',  note:'D5'},{floor:'5F',  note:'C5'},{floor:'4F',  note:'A4'},
  {floor:'3F',  note:'G4'},{floor:'2F',  note:'E4'},{floor:'1F',  note:'D4'},
  {floor:'LOBBY',note:'C4'},
  {floor:'B2', note:'A3'},{floor:'B3', note:'G3'},
  {floor:'B4', note:'E3'},{floor:'B5', note:'D3'},{floor:'B6', note:'C3'},
];
const counts = {}; floors.forEach(f => counts[f.floor] = 0);
const PREVIEW_BEAT = 60/90;
const floorOrder=['B6','B5','B4','B3','B2','LOBBY','1F','2F','3F','4F','5F','6F','7F','8F','9F'];
const BASEMENT=['B2','B3','B4','B5','B6'];
let actx = null;
let tracksInitialized = false;

function getCtx() {
  if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
  if (actx.state === 'suspended') actx.resume();
  return actx;
}
const semitones = {C:0,D:2,E:4,F:5,G:7,A:9,B:11};
function toFreq(note) {
  const m = note.match(/([A-G])(b?)(\d)/);
  if (!m) return 440;
  const base = semitones[m[1]] + (m[2] === 'b' ? -1 : 0);
  return 440 * Math.pow(2, (base + (parseInt(m[3]) - 4) * 12) / 12);
}

let _motorNodes = null;
function startMotorSound(numFloors) {
  stopMotorSound();
  const c = getCtx();
  const t = c.currentTime;
  const dur = Math.max(numFloors, 1) * (customTravelMs/1000) + 0.5;
  const osc = c.createOscillator(), osc2 = c.createOscillator(), oscGain = c.createGain();
  osc.connect(oscGain); osc2.connect(oscGain); oscGain.connect(c.destination);
  osc.type = 'sine'; osc.frequency.value = 42;
  osc2.type = 'sine'; osc2.frequency.value = 47;
  oscGain.gain.setValueAtTime(0, t);
  oscGain.gain.linearRampToValueAtTime(0.18, t + 0.8);
  oscGain.gain.setValueAtTime(0.18, t + dur - 0.6);
  oscGain.gain.linearRampToValueAtTime(0, t + dur);
  osc.start(t); osc.stop(t + dur + 0.1);
  osc2.start(t); osc2.stop(t + dur + 0.1);
  _motorNodes = { gain: oscGain, noiseGain: { gain: { value: 0, cancelScheduledValues:()=>{}, setValueAtTime:()=>{}, linearRampToValueAtTime:()=>{} } } };
}

function stopMotorSound() {
  if (!_motorNodes) return;
  const c = getCtx(), t = c.currentTime;
  try {
    _motorNodes.gain.gain.cancelScheduledValues(t);
    _motorNodes.gain.gain.setValueAtTime(_motorNodes.gain.gain.value, t);
    _motorNodes.gain.gain.linearRampToValueAtTime(0, t + 0.3);
  } catch(e) {}
  _motorNodes = null;
}

function playDoorSound(opening) {
  const c = getCtx(), t = c.currentTime;
  const bufLen = c.sampleRate * 0.7;
  const buf = c.createBuffer(1, bufLen, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1);
  const noise = c.createBufferSource();
  noise.buffer = buf;
  const filter = c.createBiquadFilter();
  filter.type = 'bandpass'; filter.Q.value = 3;
  const gain = c.createGain();
  noise.connect(filter); filter.connect(gain); gain.connect(c.destination);
  if (opening) {
    filter.frequency.setValueAtTime(400, t);
    filter.frequency.linearRampToValueAtTime(1200, t + 0.6);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.05);
    gain.gain.linearRampToValueAtTime(0.06, t + 0.4);
    gain.gain.linearRampToValueAtTime(0, t + 0.65);
  } else {
    filter.frequency.setValueAtTime(1200, t);
    filter.frequency.linearRampToValueAtTime(300, t + 0.5);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.1, t + 0.04);
    gain.gain.linearRampToValueAtTime(0.05, t + 0.4);
    gain.gain.linearRampToValueAtTime(0, t + 0.55);
  }
  noise.start(t); noise.stop(t + 0.7);
}

function playTone(freq, t, dur, vol=0.05) {
  const c = getCtx();
  const o = c.createOscillator(), g = c.createGain();
  o.connect(g); g.connect(c.destination);
  o.type = 'sine'; o.frequency.value = freq;
  g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol,t+0.02);
  g.gain.setValueAtTime(vol,t+dur*0.6); g.gain.linearRampToValueAtTime(0,t+dur*1.4);
  o.start(t); o.stop(t+dur*1.5);
}

// ── 층별 대기음악 ────────────────────────────────────────────
const trackAudio = {};

function initAllTracks() {
  floors.forEach(fd => {
    const a = new Audio(`${fd.floor}.mp3`);
    const b = new Audio(`${fd.floor}.mp3`);
    a.volume = 0; b.volume = 0;
    a.addEventListener('timeupdate', () => {
      if (a.duration && a.currentTime > a.duration - 0.1) {
        b.currentTime = 0; b.volume = a.volume; b.play().catch(() => {});
      }
    });
    b.addEventListener('timeupdate', () => {
      if (b.duration && b.currentTime > b.duration - 0.1) {
        a.currentTime = 0; a.volume = b.volume; a.play().catch(() => {});
      }
    });
    a._pair = b; b._pair = a;
    a.play().catch(() => {});
    trackAudio[fd.floor] = a;
  });
}

function fadeTrack(floor, targetVol, duration=300) {
  if (isMuted && targetVol > 0) return;
  const audio = trackAudio[floor];
  if (!audio) return;
  const steps = 20, interval = duration / steps;
  const startVol = audio.volume, delta = (targetVol - startVol) / steps;
  let step = 0;
  const timer = setInterval(() => {
    step++;
    const v = Math.max(0, Math.min(1, startVol + delta * step));
    audio.volume = v;
    if (audio._pair) audio._pair.volume = v;
    if (step >= steps) clearInterval(timer);
  }, interval);
}

function startWaitingMusic(floor) { fadeTrack(floor, 0.7); }
function stopWaitingMusic(floor)  { fadeTrack(floor, 0); }

// ── UI 도어 애니메이션 ───────────────────────────────────────
function animateDoor(open) {
  const animL=document.getElementById('anim-left'),animR=document.getElementById('anim-right'),line=document.getElementById('door-line');
  if(open){animL.setAttribute('from','8');animL.setAttribute('to','-20');animR.setAttribute('from','36');animR.setAttribute('to','64');line.setAttribute('stroke','transparent');}
  else{animL.setAttribute('from','-20');animL.setAttribute('to','8');animR.setAttribute('from','64');animR.setAttribute('to','36');line.setAttribute('stroke','#f8f8f6');}
  animL.beginElement();animR.beginElement();
}

// ── UI 버튼 ─────────────────────────────────────────────────
const floorBtns={};
floors.forEach(fd=>{
const BTN_SVGS = {
  '9F': `<circle class="cls-2" cx="33" cy="33" r="31"/><g transform="translate(0.45,0.34)"><path class="cls-3" d="M31.05,39.76l-1.5-1.11,3.23-4.4c-.17.02-.32.04-.45.05s-.22.02-.3.02c-1.09,0-2.04-.42-2.83-1.25-.79-.83-1.19-1.83-1.19-2.99,0-1.24.44-2.3,1.32-3.18.89-.89,1.95-1.33,3.18-1.33s2.3.44,3.21,1.31c.91.87,1.36,1.9,1.36,3.08,0,1.05-.44,2.18-1.33,3.4l-4.72,6.4ZM30,29.92c0,.73.25,1.34.74,1.84.5.5,1.11.75,1.81.75s1.31-.25,1.8-.74c.5-.5.75-1.1.75-1.81s-.25-1.31-.75-1.81c-.5-.5-1.1-.74-1.81-.74s-1.3.25-1.79.74c-.5.5-.75,1.09-.75,1.78Z"/></g>`,
  '8F': `<circle class="cls-2" cx="33" cy="33" r="31"/><g transform="translate(-123.36,0.45)"><path class="cls-3" d="M153.94,32.28c-.99-.7-1.49-1.65-1.49-2.86,0-1.1.38-2.01,1.13-2.75.76-.73,1.7-1.1,2.83-1.1s2.05.37,2.8,1.1c.75.73,1.12,1.65,1.12,2.76s-.49,2.11-1.48,2.84c.54.29.97.72,1.28,1.28.31.56.47,1.19.47,1.89,0,1.2-.39,2.18-1.17,2.94-.78.76-1.78,1.15-3,1.15s-2.28-.38-3.09-1.15c-.82-.77-1.22-1.74-1.22-2.9,0-1.52.61-2.58,1.83-3.18ZM154.12,35.4c0,.62.21,1.16.65,1.61.44.44.97.66,1.59.66s1.15-.22,1.58-.66c.44-.44.66-.97.66-1.59s-.22-1.15-.66-1.59-.97-.66-1.58-.66-1.14.22-1.58.66c-.44.44-.66.96-.66,1.57ZM154.37,29.41c0,.58.19,1.06.59,1.45s.87.59,1.43.59,1.03-.2,1.43-.59c.4-.4.59-.87.59-1.43s-.2-1.03-.59-1.43c-.4-.4-.87-.59-1.43-.59s-1.03.2-1.43.59c-.4.4-.59.86-.59,1.4Z"/></g>`,
  '7F': `<circle class="cls-2" cx="33" cy="33" r="31"/><g transform="translate(-247.36,0.45)"><path class="cls-3" d="M282.02,27.47h-6.67v-1.91h10.07l-8.52,13.97-1.62-1.02,6.74-11.04Z"/></g>`,
  '6F': `<circle class="cls-2" cx="33" cy="33" r="31"/><g transform="translate(-371.36,0.45)"><path class="cls-3" d="M405.86,25.45l1.5,1.12-3.23,4.39c.17-.02.32-.04.45-.05s.22-.02.29-.02c1.1,0,2.04.42,2.84,1.26.79.83,1.19,1.83,1.19,2.99,0,1.24-.44,2.3-1.33,3.18s-1.94,1.32-3.18,1.32-2.3-.43-3.22-1.3c-.9-.87-1.36-1.9-1.36-3.09,0-1.07.44-2.2,1.32-3.39l4.72-6.41ZM406.91,35.28c0-.72-.25-1.32-.74-1.82-.5-.5-1.11-.75-1.81-.75s-1.32.25-1.81.74c-.5.5-.74,1.1-.74,1.8s.25,1.31.74,1.8c.49.5,1.1.74,1.82.74s1.3-.25,1.79-.74.75-1.09.75-1.78Z"/></g>`,
  '5F': `<circle class="cls-2" cx="33" cy="33" r="31"/><g transform="translate(-495.36,0.45)"><path class="cls-3" d="M532.8,27.59h-4.16l-.66,2.24c.1-.01.19-.02.28-.03.09,0,.17,0,.25,0,1.31,0,2.39.44,3.23,1.33.84.88,1.27,2.01,1.27,3.39s-.48,2.6-1.43,3.52c-.96.92-2.16,1.38-3.61,1.38-1.79,0-3.2-.84-4.23-2.52l1.54-1.3c.42.72.85,1.23,1.29,1.53.43.29.96.44,1.58.44.82,0,1.5-.29,2.06-.86.55-.59.83-1.3.83-2.14s-.27-1.57-.82-2.12c-.55-.57-1.23-.85-2.06-.85-.92,0-1.71.4-2.37,1.2h-.67l2.13-7.1h5.58v1.91Z"/></g>`,
  '4F': `<circle class="cls-2" cx="33" cy="33" r="31"/><g transform="translate(-619.36,0.45)"><path class="cls-3" d="M655.98,36.04h1.43v1.85h-1.43v1.92h-2.04v-1.92h-6.63l8.67-12.6v10.74ZM653.94,36.04v-4.52l-3.11,4.52h3.11Z"/></g>`,
  '3F': `<circle class="cls-2" cx="33" cy="33" r="31"/><g transform="translate(-743.36,0.45)"><path class="cls-3" d="M775.93,33.04v-1.74c.86,0,1.44-.1,1.74-.29.53-.34.8-.88.8-1.63,0-.58-.19-1.05-.58-1.41-.38-.37-.87-.55-1.48-.55-.57,0-1,.14-1.31.41-.3.28-.52.75-.66,1.42h-2.03c.21-1.27.64-2.2,1.29-2.79.65-.59,1.57-.89,2.74-.89s2.15.35,2.9,1.05c.75.69,1.12,1.59,1.12,2.69,0,1.24-.49,2.2-1.47,2.89,1.12.66,1.68,1.73,1.68,3.21,0,1.21-.41,2.2-1.22,2.97-.82.77-1.86,1.15-3.14,1.15-1.63,0-2.83-.6-3.62-1.79-.33-.5-.53-1.2-.62-2.08h1.97c.1.65.36,1.15.76,1.5.41.35.93.52,1.59.52s1.2-.22,1.64-.66c.43-.45.65-1.02.65-1.71,0-.91-.32-1.56-.97-1.94-.38-.22-.97-.33-1.76-.33Z"/></g>`,
  '2F': `<circle class="cls-2" cx="33" cy="33" r="31"/><g transform="translate(-867.36,0.45)"><path class="cls-3" d="M899.86,37.5h5.03v1.92h-9.07l4.69-5.68c.46-.57.85-1.06,1.16-1.47.31-.41.55-.76.71-1.04.33-.55.5-1.04.5-1.48,0-.63-.22-1.16-.66-1.58-.44-.43-.99-.64-1.64-.64-1.36,0-2.15.81-2.34,2.42h-2.03c.33-2.85,1.76-4.27,4.31-4.27,1.23,0,2.26.39,3.1,1.17.84.78,1.26,1.75,1.26,2.9,0,.73-.2,1.45-.59,2.16-.2.37-.49.8-.87,1.31-.38.5-.86,1.1-1.45,1.79l-2.1,2.48Z"/></g>`,
  '1F': `<circle class="cls-2" cx="33" cy="33" r="31"/><g transform="translate(-991.36,0.45)"><path class="cls-3" d="M1024.51,27.7h-2.34l1.12-1.91h3.25v13.51h-2.04v-11.6Z"/></g>`,
  'LOBBY': `<circle class="cls-2" cx="33" cy="33" r="31"/><g transform="translate(-1115.36,0.45)"><path class="cls-3" d="M1147.39,25.8v11.59h3.97v1.92h-6.01v-13.51h2.04Z"/></g>`,
  'B2': `<circle class="cls-2" cx="33" cy="33" r="31"/><g transform="translate(-1239.36,0.45)"><path class="cls-3" d="M1263.11,39.42v-13.51h2.03c.9,0,1.62.07,2.16.21.54.14,1,.38,1.37.71.38.34.68.77.9,1.29.23.52.34,1.04.34,1.57,0,.97-.37,1.79-1.11,2.46.72.24,1.28.67,1.7,1.29.42.61.63,1.31.63,2.12,0,1.06-.37,1.95-1.12,2.68-.45.45-.95.76-1.51.94-.61.17-1.38.25-2.3.25h-3.09ZM1265.15,31.71h.64c.76,0,1.31-.17,1.67-.5.35-.33.53-.83.53-1.48s-.18-1.12-.54-1.45c-.36-.33-.89-.49-1.57-.49h-.72v3.93ZM1265.15,37.5h1.26c.92,0,1.6-.18,2.03-.54.45-.39.68-.89.68-1.49s-.22-1.07-.66-1.47c-.43-.39-1.19-.59-2.28-.59h-1.03v4.09Z"/><path class="cls-3" d="M1276.57,37.5h5.03v1.92h-9.07l4.69-5.68c.46-.57.85-1.06,1.16-1.47.31-.41.55-.76.71-1.04.33-.55.5-1.04.5-1.48,0-.63-.22-1.16-.66-1.58-.44-.43-.99-.64-1.64-.64-1.36,0-2.15.81-2.34,2.42h-2.03c.33-2.85,1.76-4.27,4.31-4.27,1.23,0,2.26.39,3.1,1.17.84.78,1.26,1.75,1.26,2.9,0,.73-.2,1.45-.59,2.16-.2.37-.49.8-.87,1.31-.38.5-.86,1.1-1.45,1.79l-2.1,2.48Z"/></g>`,
  'B3': `<circle class="cls-2" cx="33" cy="33" r="31"/><g transform="translate(-1363.36,0.45)"><path class="cls-3" d="M1387.18,39.31v-13.51h2.03c.9,0,1.62.07,2.16.21.54.14,1,.38,1.37.71.38.34.68.77.9,1.29.23.52.34,1.04.34,1.57,0,.97-.37,1.79-1.11,2.46.72.24,1.28.67,1.7,1.29.42.61.63,1.31.63,2.12,0,1.06-.37,1.95-1.12,2.68-.45.45-.95.76-1.51.94-.61.17-1.38.25-2.3.25h-3.09ZM1389.22,31.61h.64c.76,0,1.31-.17,1.67-.5.35-.33.53-.83.53-1.48s-.18-1.12-.54-1.45c-.36-.33-.89-.49-1.57-.49h-.72v3.93ZM1389.22,37.4h1.26c.92,0,1.6-.18,2.03-.54.45-.39.68-.89.68-1.49s-.22-1.07-.66-1.47c-.43-.39-1.19-.59-2.28-.59h-1.03v4.09Z"/><path class="cls-3" d="M1400.8,33.04v-1.74c.86,0,1.44-.1,1.74-.29.53-.34.8-.88.8-1.63,0-.58-.19-1.05-.58-1.41-.38-.37-.87-.55-1.48-.55-.57,0-1,.14-1.31.41-.3.28-.52.75-.66,1.42h-2.03c.21-1.27.64-2.2,1.29-2.79.65-.59,1.57-.89,2.74-.89s2.15.35,2.9,1.05c.75.69,1.12,1.59,1.12,2.69,0,1.24-.49,2.2-1.47,2.89,1.12.66,1.68,1.73,1.68,3.21,0,1.21-.41,2.2-1.22,2.97-.82.77-1.86,1.15-3.14,1.15-1.63,0-2.83-.6-3.62-1.79-.33-.5-.53-1.2-.62-2.08h1.97c.1.65.36,1.15.76,1.5.41.35.93.52,1.59.52s1.2-.22,1.64-.66c.43-.45.65-1.02.65-1.71,0-.91-.32-1.56-.97-1.94-.38-.22-.97-.33-1.76-.33Z"/></g>`,
  'B4': `<circle class="cls-2" cx="33" cy="33" r="31"/><g transform="translate(-1487.36,0.45)"><path class="cls-3" d="M1510.73,39.81v-13.51h2.03c.9,0,1.62.07,2.16.21.54.14,1,.38,1.37.71.38.34.68.77.9,1.29.23.52.34,1.04.34,1.57,0,.97-.37,1.79-1.11,2.46.72.24,1.28.67,1.7,1.29.42.61.63,1.31.63,2.12,0,1.06-.37,1.95-1.12,2.68-.45.45-.95.76-1.51.94-.61.17-1.38.25-2.3.25h-3.09ZM1512.77,32.1h.64c.76,0,1.31-.17,1.67-.5.35-.33.53-.83.53-1.48s-.18-1.12-.54-1.45c-.36-.33-.89-.49-1.57-.49h-.72v3.93ZM1512.77,37.89h1.26c.92,0,1.6-.18,2.03-.54.45-.39.68-.89.68-1.49s-.22-1.07-.66-1.47c-.42-.39-1.19-.59-2.28-.59h-1.03v4.09Z"/><path class="cls-3" d="M1528.55,36.04h1.43v1.85h-1.43v1.92h-2.04v-1.92h-6.63l8.67-12.6v10.74ZM1526.51,36.04v-4.52l-3.11,4.52h3.11Z"/></g>`,
  'B5': `<circle class="cls-2" cx="33" cy="33" r="31"/><g transform="translate(-1611.36,0.45)"><path class="cls-3" d="M1635.06,39.2v-13.51h2.03c.9,0,1.62.07,2.16.21.54.14,1,.38,1.37.71.38.34.68.77.9,1.29.23.52.34,1.04.34,1.57,0,.97-.37,1.79-1.11,2.46.72.24,1.28.67,1.7,1.29.42.61.63,1.31.63,2.12,0,1.06-.37,1.95-1.12,2.68-.45.45-.95.76-1.51.94-.61.17-1.38.25-2.3.25h-3.09ZM1637.1,31.49h.64c.76,0,1.31-.17,1.67-.5.35-.33.53-.83.53-1.48s-.18-1.12-.54-1.45c-.36-.33-.89-.49-1.57-.49h-.72v3.93ZM1637.1,37.28h1.26c.92,0,1.6-.18,2.03-.54.45-.39.68-.89.68-1.49s-.22-1.07-.66-1.47c-.42-.39-1.19-.59-2.28-.59h-1.03v4.09Z"/><path class="cls-3" d="M1653.46,27.59h-4.16l-.66,2.24c.1-.01.19-.02.28-.03.09,0,.17,0,.25,0,1.31,0,2.39.44,3.23,1.33.85.88,1.27,2.01,1.27,3.39s-.48,2.6-1.43,3.52c-.96.92-2.16,1.38-3.61,1.38-1.79,0-3.2-.84-4.23-2.52l1.54-1.3c.43.72.85,1.23,1.29,1.53.43.29.96.44,1.58.44.82,0,1.5-.29,2.06-.86.55-.59.83-1.3.83-2.14s-.27-1.57-.82-2.12c-.55-.57-1.23-.85-2.06-.85-.91,0-1.71.4-2.37,1.2h-.67l2.13-7.1h5.58v1.91Z"/></g>`,
  'B6': `<circle class="cls-2" cx="33" cy="33" r="31"/><g transform="translate(-1735.36,0.45)"><path class="cls-3" d="M1758.83,39.43v-13.51h2.03c.9,0,1.62.07,2.16.21.54.14,1,.38,1.37.71.38.34.68.77.9,1.29.23.52.34,1.04.34,1.57,0,.97-.37,1.79-1.11,2.46.72.24,1.28.67,1.7,1.29.42.61.63,1.31.63,2.12,0,1.06-.37,1.95-1.12,2.68-.45.45-.95.76-1.51.94-.61.17-1.38.25-2.3.25h-3.09ZM1760.87,31.72h.64c.76,0,1.31-.17,1.67-.5.35-.33.53-.83.53-1.48s-.18-1.12-.54-1.45c-.36-.33-.89-.49-1.57-.49h-.72v3.93ZM1760.87,37.52h1.26c.92,0,1.6-.18,2.03-.54.45-.39.68-.89.68-1.49s-.22-1.07-.66-1.47c-.43-.39-1.19-.59-2.28-.59h-1.03v4.09Z"/><path class="cls-3" d="M1774.85,25.45l1.5,1.12-3.23,4.39c.17-.02.32-.04.45-.05s.22-.02.29-.02c1.1,0,2.04.42,2.84,1.26.79.83,1.19,1.83,1.19,2.99,0,1.24-.44,2.3-1.33,3.18s-1.94,1.32-3.18,1.32-2.3-.43-3.22-1.3c-.9-.87-1.36-1.9-1.36-3.09,0-1.07.44-2.2,1.32-3.39l4.72-6.41ZM1775.9,35.28c0-.72-.25-1.32-.74-1.82-.5-.5-1.11-.75-1.81-.75s-1.32.25-1.81.74c-.5.5-.74,1.1-.74,1.8s.25,1.31.74,1.8c.49.5,1.1.74,1.82.74s1.3-.25,1.79-.74.75-1.09.75-1.78Z"/></g>`,
  'door-open': `<circle class="cls-2" cx="33" cy="33" r="31"/><g transform="translate(-1859.36,0.45)"><polygon class="cls-3" points="1882.31 32.55 1891.27 37.73 1891.27 27.37 1882.31 32.55"/><polygon class="cls-3" points="1902.41 32.55 1893.44 27.37 1893.44 37.73 1902.41 32.55"/></g>`,
  'door-close': `<circle class="cls-2" cx="33" cy="33" r="31"/><g transform="translate(-1983.36,0.45)"><polygon class="cls-3" points="2015.73 32.55 2006.76 27.37 2006.76 37.73 2015.73 32.55"/><polygon class="cls-3" points="2016.99 32.55 2025.95 37.73 2025.95 27.37 2016.99 32.55"/></g>`,
};

  const btn=document.createElement('button');
  btn.className='floor-btn';
  const btnSvg = BTN_SVGS[fd.floor];
  if (btnSvg) {
    btn.innerHTML = `<svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;"><defs><style>.cls-2{fill:#f8f8f6;stroke:#0012de;stroke-width:1.1px;}.cls-3{fill:#0012de;}</style></defs>${btnSvg}</svg>`;
  } else {
    const label=document.createElement('span');label.className='btn-label';
    label.textContent=fd.floor==='LOBBY'?'L':fd.floor.replace('F','');
    btn.appendChild(label);
  }
  const count=document.createElement('span');count.className='btn-count';
  btn.appendChild(count);
  btn.addEventListener('click',()=>{
    const st = elevStates[selectedElev];
    const ti=floorOrder.indexOf(fd.floor);
    if(!ELEV_ACCESS[selectedElev].includes(fd.floor)) return;
    if(ti===st.floorIdx||st.queue.find(q=>q.idx===ti)||btn.classList.contains('lit')) return;
    playTone(toFreq(fd.note),getCtx().currentTime+0.03,PREVIEW_BEAT*0.8);
    btn.classList.add('pressing');setTimeout(()=>btn.classList.remove('pressing'),100);
    btn.classList.add('lit');
    if (!tracksInitialized) { tracksInitialized = true; initAllTracks(); }
    startWaitingMusic(fd.floor);
    st.queue.push({floor:fd.floor,idx:ti,callback:()=>{
      btn.classList.remove('lit');
      stopWaitingMusic(fd.floor);
    }});
    if(!st.doorOpen) bgStartTravel(selectedElev);
    counts[fd.floor]++;count.textContent=counts[fd.floor];
  });
  floorBtns[fd.floor]=btn;
  document.getElementById('grid').appendChild(btn);
});

document.getElementById('door-open').innerHTML = `<svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;"><defs><style>.cls-2{fill:#f8f8f6;stroke:#0012de;stroke-width:1.1px;}.cls-3{fill:#0012de;}</style></defs><circle class="cls-2" cx="33" cy="33" r="31"/><g transform="translate(-1859.36,0.45)"><polygon class="cls-3" points="1882.31 32.55 1891.27 37.73 1891.27 27.37 1882.31 32.55"/><polygon class="cls-3" points="1902.41 32.55 1893.44 27.37 1893.44 37.73 1902.41 32.55"/></g></svg>`;
document.getElementById('door-close').innerHTML = `<svg viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;"><defs><style>.cls-2{fill:#f8f8f6;stroke:#0012de;stroke-width:1.1px;}.cls-3{fill:#0012de;}</style></defs><circle class="cls-2" cx="33" cy="33" r="31"/><g transform="translate(-1983.36,0.45)"><polygon class="cls-3" points="2015.73 32.55 2006.76 27.37 2006.76 37.73 2015.73 32.55"/><polygon class="cls-3" points="2016.99 32.55 2025.95 37.73 2025.95 27.37 2016.99 32.55"/></g></svg>`;
document.getElementById('door-open').addEventListener('click',()=>{
  document.getElementById('door-open').classList.add('active');
  setTimeout(()=>document.getElementById('door-open').classList.remove('active'),200);
  bgOpenDoor(selectedElev);
});
document.getElementById('door-close').addEventListener('click',()=>{
  document.getElementById('door-close').classList.add('active');
  setTimeout(()=>document.getElementById('door-close').classList.remove('active'),200);
  bgCloseDoor(selectedElev);
});

window.addEventListener('load',()=>updateElevCar(5));

// ── 누적 이동 거리 (Firebase 연동) ──────────────────────────
function updateDistanceDisplay(meters) {
  const el = document.getElementById('distance-text');
  if (!el) return;
  if (meters < 1000) {
    el.textContent = meters.toFixed(1) + ' m';
  } else {
    el.textContent = (meters / 1000).toFixed(2) + ' km';
  }
}

function addDistance(floors) {
  const meters = floors * 4;
  db.ref('totalDistance').transaction(current => (current || 0) + meters);
}

// 실시간 거리 표시 — Firebase 초기화 후 바로 실행
db.ref('totalDistance').on('value', snap => {
  updateDistanceDisplay(snap.val() || 0);
});

// ── Firebase 실시간 연동 ─────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyAsY3EB9ZeOC4yfLS_Q4GpdGmD5MuzY6Nw",
  authDomain: "hongmungwan.firebaseapp.com",
  databaseURL: "https://hongmungwan-default-rtdb.firebaseio.com",
  projectId: "hongmungwan",
  storageBucket: "hongmungwan.firebasestorage.app",
  messagingSenderId: "538326168904",
  appId: "1:538326168904:web:ca9bbe38cdbbeb2480af7d"
};
firebase.initializeApp(firebaseConfig);
var db = firebase.database();

const userRef = db.ref('activeUsers').push(true);
userRef.onDisconnect().remove();
db.ref('activeUsers').on('value', snap => {
  const el = document.getElementById('user-count');
  if (el) el.textContent = snap.numChildren();
});

// ── Service Worker 등록 ──────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(() => console.log('SW registered'))
      .catch(err => console.log('SW error:', err));
  });
}
</script>
</body>
</html>