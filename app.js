(() => {
  'use strict';

  // ================= แก้ชื่อ / รูป / ข้อความได้ตรงนี้ =================
  const NAME = 'มุกมุก';          // ชื่อแฟน
  const FROM = 'โดสโดส';         // ลงชื่อท้ายจดหมาย
  const CANDLES = 5;           // จำนวนเทียน
  const PHOTO_DIR = 'photos/'; // โฟลเดอร์รูป (เอารูปจาก Drive "Moo" มาใส่)
  // เพลงประกอบ: วางไฟล์ชื่อ music.mp3 / music.mp4 (คลิปวิดีโอก็ได้ ใช้แค่เสียง) / music.m4a ไว้ข้าง index.html
  // ถ้าไม่มีไฟล์ จะใช้เพลงกล่องดนตรีแทน
  const MUSIC = ['music.mp3', 'music.mp4', 'music.m4a'];
  const MUSIC_START = 0;       // เล่นเฉพาะท่อนไฮไลต์: วินาทีที่เริ่ม (เช่น 1:00 = 60)
  const MUSIC_VOLUME = 0.35;   // ความดังเพลง 0–1 (เดิม 0.7) อยากเบาลงอีกก็ลดตัวเลข
  const MUSIC_END = 42;      // วินาทีที่จบ แล้ววนกลับไป MUSIC_START (0 = เล่นทั้งเพลง)
  const PHOTOS = [
    'Screenshot_20260725_150733_RoV.jpg',
    'IMG_20260728_192824_884.jpg',
    'IMG_20260729_233722_942.jpg',
    'IMG_20260806_013304_975.jpg',
    'IMG_20260806_162234_486.jpg',
    'IMG_20260806_162237_573.jpg',
    'IMG_20260806_162240_569.jpg',
    'IMG_20260807_133818_899.jpg',
    'IMG_20260807_133818_900.jpg',
    'IMG_20260810_102510_641.jpg',
    'IMG_20260811_125256_771.jpg',
    'IMG_20260813_164856_510.jpg',
    'IMG_20260813_164950_491.jpg',
    'IMG_20260817_084527_520.jpg',
    'IMG_20260825_064139_782.jpg',
    'IMG_20260825_064143_888.jpg',
    'IMG_20260828_150938_744.jpg',
    'IMG_20260907_193735_412.jpg',
    'IMG_20260907_193738_530.jpg',
    'IMG_20260908_172236_679.jpg',
    'IMG_20260921_083330_827.jpg',
    'IMG_20260922_054429_963.jpg',
    'IMG_20260922_054438_827.jpg',
    'd87f93ff5013482994944b3d505b7687.webp',
  ];
  const LETTER = `ถึง ${NAME} ที่รักของ${FROM} 💕

สุขสันต์วันเกิดนะ ขอบคุณที่เกิดมาเป็นคนน่ารักแบบนี้ ขอบคุณที่อยู่ข้างกันทั้งวันที่ดีและวันที่แย่

รูปทั้งหมดในอัลบั้มนี้ คือรูป${NAME}ที่${FROM}แอบเซฟเก็บไว้ทีละรูปๆ เพราะทุกครั้งที่เห็น${NAME}ยิ้ม ${FROM}ก็อดยิ้มตามไม่ได้ทุกที 🤭

ขอให้ปีนี้ใจดีกับ${NAME}ที่สุด สุขภาพแข็งแรง เจอแต่เรื่องดีๆ ฝันอะไรไว้ขอให้ได้หมดเลย และขอให้${FROM}ได้อยู่ข้างๆ ${NAME}แบบนี้ไปอีกนานๆ นะ

รัก${NAME}ที่สุดในโลก 🐷💗

— จาก ${FROM}`;
  // ===================================================================

  const STEPS = ['เริ่ม', 'เค้กมาแล้ว', 'ปักเทียน', 'จุดเทียน', 'เป่าเทียน', 'เปิดของขวัญ', 'อัลบั้มรูป', 'จดหมาย'];
  const THAI_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const COLORS = ['#7cc6fe', '#ffd166', '#b8f2a1', '#c9a7ff', '#ff9fb2'];

  const $ = s => document.querySelector(s);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  const photos = PHOTOS.map(file => {
    const m = file.match(/(20\d{2})(\d{2})(\d{2})/);
    const caption = m ? `${+m[3]} ${THAI_MONTHS[+m[2] - 1]} ${+m[1] + 543} 💗` : '💗';
    return { src: PHOTO_DIR + file, caption };
  });

  // ---------------- หมูโดส ----------------
  const HEART = '<path d="M100 205 C74 190 68 170 84 165 C92 162 98 168 100 173 C102 168 108 162 116 165 C132 170 126 190 100 205Z" fill="#ff4d6d" stroke="#d63a5a" stroke-width="3"/>';
  const HAT = `<g transform="rotate(-14 100 36)">
      <path d="M100 -12 L126 40 L74 40 Z" fill="#8fd3ff" stroke="#4aa3e0" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="92" cy="22" r="3" fill="#fff"/><circle cx="106" cy="30" r="3" fill="#ffd166"/><circle cx="101" cy="8" r="2.5" fill="#ff8fab"/>
      <circle cx="100" cy="-12" r="7" fill="#ffd166"/></g>`;

  function pigSVG({ hat = false, hold = '' } = {}) {
    const S = 'stroke="#e98aa6" stroke-width="4" stroke-linejoin="round"';
    return `<svg class="pig-svg" viewBox="0 -24 200 234" aria-hidden="true"><g class="pig-body">
      <ellipse cx="72" cy="192" rx="20" ry="11" fill="#f7a3bc" ${S}/>
      <ellipse cx="128" cy="192" rx="20" ry="11" fill="#f7a3bc" ${S}/>
      <path d="M50 64 L38 16 Q72 22 86 46 Z" fill="#ffb3c9" ${S}/>
      <path d="M150 64 L162 16 Q128 22 114 46 Z" fill="#ffb3c9" ${S}/>
      <circle cx="100" cy="112" r="78" fill="#ffc6d6" ${S}/>
      <g class="eyes">
        <ellipse cx="70" cy="98" rx="8" ry="10" fill="#4a2c36"/><ellipse cx="130" cy="98" rx="8" ry="10" fill="#4a2c36"/>
        <circle cx="73" cy="94" r="3" fill="#fff"/><circle cx="133" cy="94" r="3" fill="#fff"/>
      </g>
      <ellipse cx="50" cy="126" rx="13" ry="8" fill="#ff8fab" opacity=".55"/>
      <ellipse cx="150" cy="126" rx="13" ry="8" fill="#ff8fab" opacity=".55"/>
      <ellipse cx="100" cy="128" rx="30" ry="21" fill="#ffa3bd" ${S}/>
      <ellipse cx="89" cy="128" rx="5" ry="8" fill="#c9587a"/><ellipse cx="111" cy="128" rx="5" ry="8" fill="#c9587a"/>
      <path d="M88 158 Q100 168 112 158" fill="none" stroke="#c9587a" stroke-width="4" stroke-linecap="round"/>
      ${hold === 'heart' ? HEART : ''}
      <ellipse class="arm-l" cx="30" cy="150" rx="14" ry="22" fill="#ffb3c9" ${S}/>
      <ellipse class="arm-r" cx="170" cy="150" rx="14" ry="22" fill="#ffb3c9" ${S}/>
      ${hat ? HAT : ''}
    </g></svg>`;
  }
  document.querySelectorAll('.pig').forEach(el => {
    el.innerHTML = pigSVG({ hat: el.dataset.hat === '1', hold: el.dataset.hold });
  });
  function pigPose(el, pose) {
    el.classList.remove('wave', 'jump', 'hold', 'bounce');
    el.classList.add(...pose.split(' '));
  }

  // ---------------- ธงประดับ ----------------
  function buildBunting() {
    const b = $('#bunting');
    const w = innerWidth;
    const n = Math.max(7, Math.round(w / 48));
    let html = '<svg viewBox="0 0 100 60" preserveAspectRatio="none"><path d="M0 4 Q50 60 100 4" fill="none" stroke="#e98aa6" stroke-width="1.5" vector-effect="non-scaling-stroke"/></svg>';
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n;
      const y = 4 + 56 * 2 * t * (1 - t) - 1;
      const angle = Math.atan2(112 * (1 - 2 * t), w) * 180 / Math.PI;
      html += `<span style="left:${t * 100}%;top:${y}px;background:${COLORS[i % COLORS.length]};transform:rotate(${angle}deg)"></span>`;
    }
    b.innerHTML = html;
  }
  buildBunting();
  addEventListener('resize', buildBunting);

  // ---------------- เสียง (สร้างเองด้วย Web Audio) ----------------
  const Sound = (() => {
    let ctx = null, out, bus, pass = null, loopTimer = null, muted = false;
    let mode = 'off', bgmWasPlaying = false;
    // <source> children: if one file is missing the browser falls through to the next
    const bgm = MUSIC.length ? new Audio() : null;
    let bgmFailed = false;
    if (bgm) MUSIC.forEach(src => { const s = document.createElement('source'); s.src = src; bgm.appendChild(s); });
    // When every source fails the element just waits (play() never rejects), so fall back on the last source's error.
    if (bgm) bgm.lastChild.addEventListener('error', () => { bgmFailed = true; if (mode === 'bgm') play(); });
    // iOS ignores audio.volume, so when served over http(s) the song goes through a Web Audio gain instead (see init).
    // Not on file:// — Chrome treats local media as cross-origin there and the gain would output silence.
    let bgmGain = null;
    const setBgmLevel = v => { if (bgmGain) bgmGain.gain.value = v; else bgm.volume = v; };
    if (bgm) {
      bgm.loop = true; bgm.volume = 0; bgm.preload = 'auto';
      // Loop only the highlight [MUSIC_START, MUSIC_END] with a short fade in/out.
      const FADE = 1.5;
      bgm.addEventListener('timeupdate', () => {
        const t = bgm.currentTime;
        if (t < MUSIC_START - 0.3 || (MUSIC_END && t >= MUSIC_END)) { bgm.currentTime = MUSIC_START; return; }
        const fadeIn = (t - MUSIC_START) / FADE;
        const fadeOut = MUSIC_END ? (MUSIC_END - t) / FADE : 1;
        setBgmLevel(MUSIC_VOLUME * Math.max(0, Math.min(1, fadeIn, fadeOut)));
      });
    }
    const NOTE = { G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99 };
    const SONG = [
      ['G4', .75], ['G4', .25], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2],
      ['G4', .75], ['G4', .25], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
      ['G4', .75], ['G4', .25], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 2],
      ['F5', .75], ['F5', .25], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 3],
    ];

    function init() {
      if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      out = ctx.createGain(); out.connect(ctx.destination);
      bus = ctx.createGain(); bus.gain.value = 0.6; bus.connect(out);
      // เอคโค่เบาๆ ให้ฟีลกล่องดนตรี
      const delay = ctx.createDelay(); delay.delayTime.value = 0.27;
      const fb = ctx.createGain(); fb.gain.value = 0.25;
      bus.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(out);
      if (bgm && /^https?:$/.test(location.protocol)) {
        bgmGain = ctx.createGain(); bgmGain.gain.value = 0;
        ctx.createMediaElementSource(bgm).connect(bgmGain);
        bgmGain.connect(out);
        bgm.volume = 1;
      }
    }

    function bell(freq, t, dur = 1, dest = bus, vol = 0.22) {
      [[1, 1], [2, .35], [3.01, .12]].forEach(([m, g]) => {
        const o = ctx.createOscillator(), a = ctx.createGain();
        o.type = 'sine'; o.frequency.value = freq * m;
        a.gain.setValueAtTime(0.0001, t);
        a.gain.exponentialRampToValueAtTime(vol * g, t + 0.008);
        a.gain.exponentialRampToValueAtTime(0.0001, t + (0.5 + dur) / m);
        o.connect(a); a.connect(dest); o.start(t); o.stop(t + 0.6 + dur);
      });
    }

    function play() {
      if (!ctx) return;
      stop();
      pass = ctx.createGain(); pass.connect(bus);
      const beat = 0.46;
      let t = ctx.currentTime + 0.15;
      SONG.forEach(([n, b]) => { bell(NOTE[n], t, b * beat, pass); t += b * beat; });
      loopTimer = setTimeout(play, (t - ctx.currentTime + beat * 2) * 1000);
    }

    function stop() {
      clearTimeout(loopTimer); loopTimer = null;
      if (!pass) return;
      const p = pass; pass = null;
      p.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
      setTimeout(() => p.disconnect(), 500);
    }

    // 'bgm' = mp3 (falls back to the music box if the file is missing), 'hbd' = music box Happy Birthday, 'off'
    function music(m) {
      mode = m;
      if (m === 'bgm' && bgm && !bgmFailed) {
        stop();
        bgm.play().catch(() => { if (mode === 'bgm') play(); });
        return;
      }
      if (bgm) bgm.pause();
      if (m === 'off') stop(); else play();
    }

    function tone(f1, f2, dur, type = 'sine', vol = 0.3) {
      if (!ctx) return;
      const t = ctx.currentTime, o = ctx.createOscillator(), a = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(f1, t);
      o.frequency.exponentialRampToValueAtTime(f2, t + dur);
      a.gain.setValueAtTime(vol, t);
      a.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(a); a.connect(bus); o.start(t); o.stop(t + dur + 0.05);
    }

    function noise(dur, freq, vol = 0.3) {
      if (!ctx) return;
      const t = ctx.currentTime;
      const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), a = ctx.createGain();
      src.buffer = buf; f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 0.8;
      a.gain.setValueAtTime(vol, t); a.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(f); f.connect(a); a.connect(bus); src.start(t);
    }

    async function listen(onLevel) {
      init();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
      const src = ctx.createMediaStreamSource(stream);
      const an = ctx.createAnalyser(); an.fftSize = 1024; src.connect(an);
      const data = new Float32Array(an.fftSize);
      let on = true;
      (function tick() {
        if (!on) return;
        an.getFloatTimeDomainData(data);
        let s = 0;
        for (let i = 0; i < data.length; i++) s += data[i] * data[i];
        onLevel(Math.sqrt(s / data.length));
        requestAnimationFrame(tick);
      })();
      return () => { on = false; src.disconnect(); stream.getTracks().forEach(tr => tr.stop()); };
    }

    return {
      init, music, listen,
      toggleMute() {
        muted = !muted;
        if (out) out.gain.value = muted ? 0 : 1;
        if (bgm) bgm.muted = muted;
        return muted;
      },
      suspend(hidden) {
        if (ctx) hidden ? ctx.suspend() : ctx.resume();
        if (!bgm) return;
        if (hidden) { bgmWasPlaying = !bgm.paused; bgm.pause(); }
        else if (bgmWasPlaying && mode === 'bgm') bgm.play().catch(() => {});
      },
      pop: () => tone(500, 1100, 0.12, 'sine', 0.35),
      light: () => noise(0.25, 2600, 0.25),
      shake: () => tone(240, 170, 0.1, 'triangle', 0.25),
      chime() { if (!ctx) return; const t = ctx.currentTime; [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => bell(f, t + i * 0.09, 0.8)); },
    };
  })();

  // ---------------- พลุกระดาษ ----------------
  const Confetti = (() => {
    const c = $('#confetti'), g = c.getContext('2d');
    const palette = ['#ff8fb1', '#ffd166', '#8fd3ff', '#b8f2a1', '#c9a7ff', '#ff4d6d', '#fff'];
    let parts = [], running = false, dpr = 1;
    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      c.width = innerWidth * dpr; c.height = innerHeight * dpr;
    }
    resize(); addEventListener('resize', resize);
    function add(p) { parts.push(p); if (!running) { running = true; requestAnimationFrame(loop); } }
    function burst(x, y, n = 90, power = 1) {
      for (let i = 0; i < n; i++) {
        add({
          x, y, vx: rand(-7, 7) * power, vy: rand(-14, -4) * power,
          w: rand(6, 11), h: rand(4, 7), rot: rand(0, 6.28), vr: rand(-.3, .3),
          color: pick(palette), circle: Math.random() < .3,
        });
      }
    }
    function rain(n = 120) {
      for (let i = 0; i < n; i++) {
        add({
          x: rand(0, innerWidth), y: rand(-innerHeight * .6, -10), vx: rand(-1, 1), vy: rand(1, 3),
          w: rand(6, 11), h: rand(4, 7), rot: rand(0, 6.28), vr: rand(-.2, .2),
          color: pick(palette), circle: Math.random() < .3,
        });
      }
    }
    function loop() {
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, innerWidth, innerHeight);
      parts = parts.filter(p => p.y < innerHeight + 30);
      for (const p of parts) {
        p.vy = Math.min(p.vy + 0.25, 6); p.vx *= 0.985;
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        g.save(); g.translate(p.x, p.y); g.rotate(p.rot); g.fillStyle = p.color;
        if (p.circle) { g.beginPath(); g.arc(0, 0, p.h / 2, 0, 6.28); g.fill(); }
        else g.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.rot * 2)) + 1);
        g.restore();
      }
      if (parts.length) requestAnimationFrame(loop);
      else { running = false; g.clearRect(0, 0, innerWidth, innerHeight); }
    }
    return { burst, rain };
  })();

  // ---------------- หัวใจลอย ----------------
  function floatHeart(x, y, { rise = 240, spread = 160 } = {}) {
    const s = document.createElement('span');
    s.className = 'heart';
    s.textContent = pick(['💗', '💖', '💕', '💞', '❤️']);
    s.style.left = x + 'px'; s.style.top = y + 'px';
    s.style.fontSize = rand(16, 34) + 'px';
    $('#fx').appendChild(s);
    const dx = rand(-spread / 2, spread / 2), dy = -rise - rand(0, 120);
    s.animate([
      { transform: 'translate(-50%,-50%) scale(.3)', opacity: 0 },
      { opacity: 1, offset: .15 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1)`, opacity: 0 },
    ], { duration: rand(1800, 3000), easing: 'ease-out', fill: 'both' }).onfinish = () => s.remove();
  }
  function heartBurst(x, y, n = 14) { for (let i = 0; i < n; i++) setTimeout(() => floatHeart(x, y), i * 60); }
  let ambient = null;
  function startAmbient() {
    if (ambient) return;
    ambient = setInterval(() => floatHeart(rand(0, innerWidth), innerHeight + 20, { rise: innerHeight * .6, spread: 80 }), 900);
  }
  function centerOf(el) { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }

  // ---------------- ตัวช่วย UI ----------------
  function show(id) { document.querySelectorAll('.scene').forEach(s => s.classList.toggle('active', s.id === id)); }
  function setStep(i) {
    $('#progress').classList.add('show');
    $('#dots').innerHTML = STEPS.map((_, k) => `<i class="${k < i ? 'done' : k === i ? 'now' : ''}"></i>`).join('');
    $('#stepLabel').textContent = `ขั้นที่ ${i + 1}/${STEPS.length} · ${STEPS[i]}`;
  }
  function say(sel, html, pop = true) {
    const el = $(sel);
    el.innerHTML = html;
    if (!pop) return;
    el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
  }
  function btn(label, fn, cls = '') {
    const b = document.createElement('button');
    b.className = 'btn ' + cls; b.innerHTML = label;
    b.addEventListener('click', e => { e.stopPropagation(); fn(b); }, { once: true });
    return b;
  }
  function hint(text) {
    const p = document.createElement('p');
    p.className = 'hint pulse'; p.textContent = text;
    return p;
  }
  function controls(sel, nodes) { const c = $(sel); c.innerHTML = ''; nodes.forEach(n => c.appendChild(n)); }

  // ---------------- 1. หน้าเปิด ----------------
  $('#cakeName').textContent = NAME;
  $('#startBtn').addEventListener('click', () => {
    Sound.init(); Sound.chime(); Sound.music('bgm');
    photos.forEach(p => { new Image().src = p.src; });
    goCake();
  }, { once: true });
  $('#mute').addEventListener('click', e => {
    Sound.init();
    const m = Sound.toggleMute();
    e.currentTarget.textContent = m ? '🔇' : '🔊';
    e.currentTarget.setAttribute('aria-label', m ? 'เปิดเสียง' : 'ปิดเสียง');
  });
  document.addEventListener('visibilitychange', () => Sound.suspend(document.hidden));

  // ---------------- 2-5. เค้ก ----------------
  const NS = 'http://www.w3.org/2000/svg';
  const wrap = $('#cakeWrap');
  const cakePig = $('#cakePig');
  const candles = [];
  const slots = Array.from({ length: CANDLES }, (_, i) => {
    const gap = CANDLES > 1 ? Math.min(18, 96 / (CANDLES - 1)) : 0;
    return [120 + (i - (CANDLES - 1) / 2) * gap, 80 + (i % 2 ? 3 : -1)];
  });
  let phase = 'idle';
  let stopMic = null;

  function svgEl(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    parent.appendChild(e);
    return e;
  }

  function plantCandle() {
    const i = candles.length;
    const [x, y] = slots[i];
    const pos = svgEl('g', { transform: `translate(${x} ${y})` }, $('#candles'));
    const g = svgEl('g', { class: 'candle drop' }, pos);
    svgEl('rect', { x: -3.5, y: -30, width: 7, height: 30, rx: 2, fill: COLORS[i % COLORS.length] }, g);
    svgEl('rect', { x: -3.5, y: -23, width: 7, height: 3, fill: 'rgba(255,255,255,.75)' }, g);
    svgEl('rect', { x: -3.5, y: -13, width: 7, height: 3, fill: 'rgba(255,255,255,.75)' }, g);
    svgEl('line', { x1: 0, y1: -30, x2: 0, y2: -35, stroke: '#6b4a3a', 'stroke-width': 1.6, 'stroke-linecap': 'round' }, g);
    const f = svgEl('g', { class: 'flame' }, g);
    svgEl('path', { d: 'M0 -52 C6 -44 7 -38 0 -34 C-7 -38 -6 -44 0 -52Z', fill: '#ffb703' }, f);
    svgEl('path', { d: 'M0 -46 C3 -41 3.5 -38 0 -36 C-3.5 -38 -3 -41 0 -46Z', fill: '#fff4b8' }, f);
    candles.push({ g, lit: false });
  }

  const litCount = () => candles.filter(c => c.lit).length;
  const updateGlow = () => { $('#glow').style.opacity = litCount() / CANDLES; };

  async function goCake() {
    show('cake'); setStep(1); phase = 'arrive';
    wrap.classList.add('arrive');
    say('#cakeSay', `ทาดา~ หมูโดสอบเค้กมาให้${NAME}เองเลยนะ 🎂`);
    await sleep(1000);
    controls('#cakeCtl', [btn('ปักเทียนกัน 🕯️', startPlant)]);
  }

  function startPlant() {
    phase = 'plant'; setStep(2);
    wrap.classList.add('tappable');
    say('#cakeSay', `แตะที่เค้กเพื่อปักเทียน 🕯️ (0/${CANDLES})`);
    controls('#cakeCtl', [hint('แตะที่เค้กเลย 👆')]);
  }

  function startLight() {
    phase = 'light'; setStep(3);
    document.body.classList.add('lights-off');
    wrap.classList.add('tappable');
    say('#cakeSay', `ปิดไฟแล้ว~ แตะเค้กเพื่อจุดเทียน 🔥 (0/${CANDLES})`);
    controls('#cakeCtl', [hint('แตะทีละครั้ง จุดทีละเล่ม 👆')]);
  }

  wrap.addEventListener('click', () => {
    if (phase === 'plant') {
      plantCandle(); Sound.pop();
      const n = candles.length;
      if (n < CANDLES) { say('#cakeSay', `แตะที่เค้กเพื่อปักเทียน 🕯️ (${n}/${CANDLES})`, false); return; }
      phase = 'wait'; wrap.classList.remove('tappable');
      say('#cakeSay', 'ปักครบแล้ว! ปิดไฟแล้วจุดเทียนกันเถอะ 🔥');
      controls('#cakeCtl', [btn('ปิดไฟ & จุดเทียน 💡', startLight)]);
    } else if (phase === 'light') {
      const c = candles.find(x => !x.lit);
      if (!c) return;
      c.lit = true; c.g.classList.add('lit'); Sound.light(); updateGlow();
      const n = litCount();
      if (n < CANDLES) { say('#cakeSay', `ปิดไฟแล้ว~ แตะเค้กเพื่อจุดเทียน 🔥 (${n}/${CANDLES})`, false); return; }
      phase = 'wait'; wrap.classList.remove('tappable');
      say('#cakeSay', 'ว้าว~ สวยจัง ✨<br>ก่อนเป่า อย่าลืมอธิษฐานนะ');
      controls('#cakeCtl', [btn('อธิษฐานแล้ว เป่าเลย! 🌬️', startBlow)]);
    }
  });

  function startBlow() {
    phase = 'blow'; setStep(4);
    Sound.music('off');
    say('#cakeSay', 'หลับตาอธิษฐาน… 🙏<br>แล้วเป่าใส่ไมค์แรงๆ เลย!');
    startMic(0);
  }

  // Mic only. A tap fallback appears only after the mic fails twice, so she can never get stuck here.
  async function startMic(fails) {
    const box = document.createElement('div');
    box.className = 'mic-box';
    box.innerHTML = '<div class="meter"><i></i></div><span>กำลังเปิดไมค์… กด "อนุญาต" ด้วยนะ</span>';
    controls('#cakeCtl', [box]);
    const bar = box.querySelector('i'), label = box.querySelector('span');
    const flames = $('#candles');
    let blowMs = 0, last = performance.now();
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('no mic');
      stopMic = await Sound.listen(level => {
        const now = performance.now(), dt = now - last;
        last = now;
        bar.style.width = Math.min(level / 0.2, 1) * 100 + '%';
        flames.style.setProperty('--wind', Math.min(level / 0.15, 1).toFixed(2));
        // ต้องเป่าต่อเนื่องสักพักเทียนถึงจะดับทีละเล่ม (กันเสียงพูดเบาๆ ไปดับเทียน)
        if (level > 0.08) {
          blowMs += dt;
          if (blowMs > 170) { blowMs = 0; blowOut(1); }
        } else blowMs = Math.max(0, blowMs - dt);
      });
      label.textContent = 'เป่าใส่ไมค์เลย~ 🌬️';
    } catch (err) {
      box.querySelector('.meter').remove();
      label.textContent = 'เปิดไมค์ไม่ได้ 🥲 อนุญาตให้ใช้ไมค์แล้วลองใหม่นะ';
      const nodes = [box, btn('ลองเปิดไมค์อีกครั้ง 🎤', () => startMic(fails + 1))];
      if (fails >= 1) nodes.push(btn('เป่าไม่ได้จริงๆ แตะตรงนี้ 💨', tapBlow, 'ghost'));
      controls('#cakeCtl', nodes);
    }
  }

  function tapBlow(b) {
    blowOut(1);
    if (phase === 'blow') b.addEventListener('click', e => { e.stopPropagation(); tapBlow(b); }, { once: true });
  }

  function blowOut(k) {
    if (phase !== 'blow') return;
    for (let j = 0; j < k; j++) {
      const lit = candles.filter(c => c.lit);
      if (!lit.length) break;
      const c = pick(lit);
      c.lit = false; c.g.classList.remove('lit');
      const smoke = svgEl('path', { d: 'M0 -36 q-4 -6 0 -12 q4 -6 0 -12', class: 'smoke', fill: 'none', stroke: '#d8d0d4', 'stroke-width': 2, 'stroke-linecap': 'round' }, c.g);
      setTimeout(() => smoke.remove(), 1400);
    }
    updateGlow();
    if (!litCount()) celebrate();
  }

  async function celebrate() {
    phase = 'party';
    if (stopMic) { stopMic(); stopMic = null; }
    $('#candles').style.setProperty('--wind', 0);
    await sleep(500);
    document.body.classList.remove('lights-off');
    pigPose(cakePig, 'jump');
    Sound.chime();
    setTimeout(() => Sound.music('hbd'), 700);
    const [cx, cy] = centerOf(wrap);
    Confetti.burst(cx, cy, 110, 1.1);
    setTimeout(() => Confetti.burst(innerWidth * .15, innerHeight * .7, 60), 300);
    setTimeout(() => Confetti.burst(innerWidth * .85, innerHeight * .7, 60), 500);
    setTimeout(() => Confetti.rain(140), 700);
    heartBurst(cx, cy, 12);
    say('#cakeSay', `<span class="big">Happy Birthday ${NAME}! 🎉</span>ขอให้คำอธิษฐานเป็นจริงทุกข้อเลยนะ`);
    controls('#cakeCtl', []);
    await sleep(1800);
    pigPose(cakePig, 'bounce');
    controls('#cakeCtl', [btn('ไปเปิดของขวัญกัน 🎁', goGift)]);
  }

  // ---------------- 6. ของขวัญ ----------------
  const giftBox = $('#giftBox');
  let giftTaps = 0;

  function goGift() {
    show('gift'); setStep(5);
    Sound.music('bgm');
    say('#giftSay', `หมูโดสห่อของขวัญมาให้${NAME}ด้วย~<br>แตะกล่อง 3 ครั้งเพื่อเปิด! 🎁`);
    controls('#giftCtl', [hint('แตะที่กล่องเลย 👆')]);
  }

  giftBox.addEventListener('click', () => {
    if (giftTaps >= 3 || !$('#gift').classList.contains('active')) return;
    giftTaps++;
    giftBox.classList.remove('shake'); void giftBox.offsetWidth; giftBox.classList.add('shake');
    Sound.shake();
    if (giftTaps === 1) say('#giftSay', 'อีก 2 ครั้ง! 🤭');
    else if (giftTaps === 2) say('#giftSay', 'อีกครั้งเดียว!! 😆');
    else openGift();
  });

  async function openGift() {
    controls('#giftCtl', []);
    await sleep(350);
    giftBox.classList.add('open');
    Sound.chime();
    const [x, y] = centerOf(giftBox);
    photoBurst(x, y);
    heartBurst(x, y, 18);
    Confetti.burst(x, y, 70, .9);
    pigPose($('#giftPig'), 'jump');
    say('#giftSay', `ในกล่องมีแต่รูป${NAME}ที่${FROM}แอบเก็บไว้เต็มเลย 🤭💗`);
    await sleep(2000);
    pigPose($('#giftPig'), 'bounce');
    controls('#giftCtl', [btn(`ดูรูป${NAME} 📸`, goAlbum)]);
  }

  function photoBurst(x, y) {
    photos.slice(0, 9).forEach((p, i) => {
      const img = new Image();
      img.src = p.src; img.className = 'fly-photo'; img.alt = '';
      img.onerror = () => img.remove();
      img.style.left = x + 'px'; img.style.top = y + 'px';
      $('#fx').appendChild(img);
      const ang = -Math.PI / 2 + (i - 4) * 0.3;
      const dist = rand(160, 250);
      const dx = Math.cos(ang) * dist, dy = Math.sin(ang) * dist;
      const rot = rand(-25, 25);
      img.animate([
        { transform: 'translate(-50%,-50%) scale(.2)', opacity: 0 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1) rotate(${rot}deg)`, opacity: 1, offset: .4 },
        { transform: `translate(calc(-50% + ${dx * 1.1}px), calc(-50% + ${dy * 1.1 + 70}px)) scale(.9) rotate(${rot}deg)`, opacity: 0 },
      ], { duration: 2800, delay: i * 80, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'both' }).onfinish = () => img.remove();
    });
  }

  // ---------------- 7. อัลบั้ม: แตะทีละครั้ง รูปโผล่ทีละใบจนเต็มหน้า ----------------
  const board = $('#board');
  let revealed = 0, layout = [];

  function goAlbum() {
    show('album'); setStep(6);
    startAmbient();
    layoutBoard();
    say('#albumSay', `แตะตรงไหนก็ได้ รูปจะค่อยๆ โผล่มา 📸 (0/${photos.length})`);
  }

  // Scatter one slot per photo over a grid (with jitter) so the photos end up covering the whole board.
  function layoutBoard() {
    const W = board.clientWidth, H = board.clientHeight, n = photos.length;
    const cols = Math.max(2, Math.round(Math.sqrt(n * (W / H) / 0.8)));
    const rows = Math.ceil(n / cols);
    const cw = W / cols, ch = H / rows;
    const cardW = Math.min(cw * 1.3, ch * 1.3 * 0.8, W * 0.62);
    const cardH = cardW * 1.31;
    const cells = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) cells.push([c, r]);
    for (let i = cells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cells[i], cells[j]] = [cells[j], cells[i]];
    }
    const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
    layout = cells.slice(0, n).map(([c, r]) => ({
      x: clamp((c + .5 + rand(-.1, .1)) * cw, cardW / 2, W - cardW / 2) / W * 100,
      y: clamp((r + .5 + rand(-.1, .1)) * ch, cardH / 2, H - cardH / 2) / H * 100,
      w: cardW / W * 100,
      rot: rand(-14, 14),
    }));
  }

  function photoBox(p) {
    const box = document.createElement('div');
    box.className = 'photo';
    const img = new Image();
    img.alt = p.caption; img.draggable = false;
    img.onerror = () => box.classList.add('missing');
    img.src = p.src;
    box.appendChild(img);
    return box;
  }

  function revealNext() {
    const i = revealed++;
    const L = layout[i];
    const s = document.createElement('figure');
    s.className = 'snap'; s.dataset.i = i;
    // padding % is relative to the board width, so scale it by the card's width share
    const pad = L.w * 0.05, padBottom = L.w * 0.16;
    s.style.cssText = `left:${L.x}%;top:${L.y}%;width:${L.w}%;padding:${pad}% ${pad}% ${padBottom}%;--rot:${L.rot.toFixed(1)}deg;z-index:${i + 1}`;
    s.appendChild(photoBox(photos[i]));
    board.appendChild(s);
    $('#boardHint').style.display = 'none';
    Sound.pop();
    const [x, y] = centerOf(s);
    heartBurst(x, y, 3);
    if (revealed < photos.length) {
      say('#albumSay', `แตะตรงไหนก็ได้ รูปจะค่อยๆ โผล่มา 📸 (${revealed}/${photos.length})`, false);
      return;
    }
    Sound.chime();
    Confetti.burst(innerWidth / 2, innerHeight / 2, 60, .8);
    say('#albumSay', 'ครบทุกรูปแล้ว 🥹<br>แตะรูปไหนก็ได้เพื่อดูใหญ่ๆ');
    controls('#albumCtl', [btn('มีจดหมายด้วยนะ 💌', goLetter)]);
  }

  board.addEventListener('click', e => {
    if (!layout.length) return;
    if (revealed < photos.length) { revealNext(); return; }
    const snap = e.target.closest('.snap');
    if (snap) openLightbox(+snap.dataset.i);
  });

  function openLightbox(i) {
    const p = photos[i];
    $('#lbPhoto').classList.remove('missing');
    $('#lbImg').onerror = () => $('#lbPhoto').classList.add('missing');
    $('#lbImg').src = p.src;
    $('#lbCap').textContent = p.caption;
    $('#lightbox').classList.add('show');
  }
  $('#lightbox').addEventListener('click', () => $('#lightbox').classList.remove('show'));

  // ---------------- 8. จดหมาย ----------------
  let opened = false, skipTyping = false;

  function goLetter() { show('letter'); setStep(7); }

  $('#envelope').addEventListener('click', async e => {
    if (opened) return;
    opened = true;
    e.currentTarget.classList.add('open');
    $('#letterSay').classList.add('gone');
    Sound.chime();
    heartBurst(...centerOf(e.currentTarget), 16);
    await sleep(1500);
    $('#letterFull').classList.add('show');
    await sleep(500);
    await typeText($('#letterText'), LETTER);
    $('#letterEnd').classList.add('show');
    Confetti.rain(100);
    heartBurst(innerWidth / 2, innerHeight * .8, 20);
  });
  $('#letterCard').addEventListener('click', () => { skipTyping = true; });
  $('#replay').addEventListener('click', () => location.reload());

  async function typeText(node, text) {
    const parts = window.Intl && Intl.Segmenter
      ? Array.from(new Intl.Segmenter('th', { granularity: 'grapheme' }).segment(text), s => s.segment)
      : Array.from(text);
    const card = $('#letterCard');
    let shown = '';
    for (const ch of parts) {
      if (skipTyping) break;
      shown += ch;
      node.textContent = shown;
      card.scrollTop = card.scrollHeight;
      await sleep(ch === '\n' ? 200 : 40);
    }
    node.textContent = text;
  }
})();
