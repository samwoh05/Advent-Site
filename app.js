(function () {
  "use strict";

  const A = window.ADVENT;
  const doc = document.documentElement;
  doc.classList.add("js");

  const params = new URLSearchParams(location.search);
  const PREVIEW = params.has("preview");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- dates ---------- */
  const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const key = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const fmtLong = (d) => d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  const fmtShort = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "long" });

  const realToday = new Date();
  const today = params.get("today") ? parse(params.get("today")) : new Date(realToday.getFullYear(), realToday.getMonth(), realToday.getDate());

  const start = parse(A.firstSunday);
  const ordinals = ["First", "Second", "Third", "Fourth"];
  const themes = ["Hope", "Peace", "Joy", "Love"];
  const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Build the list of days: first Sunday of Advent → Christmas Day
  const days = [];
  for (let d = start, n = 1; ; d = addDays(d, 1), n++) {
    const week = Math.min(4, Math.floor((n - 1) / 7) + 1);
    const isChristmas = d.getMonth() === 11 && d.getDate() === 25;
    const isSunday = d.getDay() === 0;
    let kind = "weekday";
    if (isChristmas) kind = "christmas";
    else if (isSunday) kind = week === A.roseSunday ? "rose" : "sunday";

    const data = A.days[key(d)] || {};
    const title = data.title || (isSunday
      ? `${ordinals[week - 1]} Sunday of Advent`
      : `${weekdayNames[d.getDay()]} of the ${ordinals[week - 1]} Week of Advent`);

    days.push({ n, date: d, key: key(d), week, kind, title, data });
    if (isChristmas) break;
  }
  const byKey = Object.fromEntries(days.map((x) => [x.key, x]));
  const todayEntry = byKey[key(today)];

  const isUnlocked = (day) => PREVIEW || !A.lockFutureDoors || day.date <= today;

  /* ---------- small SVG helpers ---------- */
  const STAR = '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 2l3.2 11.2L34 8l-5.2 10.8L38 20l-9.2 1.2L34 32l-10.8-5.2L20 38l-3.2-10.8L6 32l5.2-10.8L2 20l9.2-1.2L6 8l10.8 5.2z"/></svg>';
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* =================================================================
     HERO WREATH
     ================================================================= */
  function buildWreath() {
    const svg = document.getElementById("wreath");
    const NS = "http://www.w3.org/2000/svg";
    const cx = 240, cy = 228, rx = 168, ry = 48;

    let seed = 7;
    const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

    const defs = `
      <defs>
        <radialGradient id="flameG" cx="50%" cy="70%" r="60%">
          <stop offset="0" stop-color="#FFF6D6"/>
          <stop offset=".45" stop-color="#F4C55B"/>
          <stop offset="1" stop-color="#D9772B"/>
        </radialGradient>
        <radialGradient id="glowG">
          <stop offset="0" stop-color="#F7D98A" stop-opacity=".75"/>
          <stop offset="1" stop-color="#F7D98A" stop-opacity="0"/>
        </radialGradient>
      </defs>`;

    const leafColors = ["#2F4A30", "#3E5A3A", "#4D6A45", "#5B7350", "#293F2A"];
    const leaves = (front) => {
      let out = "";
      const count = 120;
      for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 2 + rand() * 0.05;
        const isFront = Math.sin(t) > 0;
        if (isFront !== front) { rand(); rand(); rand(); continue; }
        const jitter = (rand() - 0.5) * 30;
        const x = cx + Math.cos(t) * (rx + jitter);
        const y = cy + Math.sin(t) * (ry + jitter * 0.3) - 4;
        const rot = (t * 180) / Math.PI + 90 + (rand() - 0.5) * 120;
        const s = 0.9 + rand() * 0.7;
        const c = leafColors[Math.floor(rand() * leafColors.length)];
        out += `<path d="M0 0C6-5 16-5 24 0C16 5 6 5 0 0Z" fill="${c}" stroke="#1E2B1C" stroke-width=".6" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(0)}) scale(${s.toFixed(2)})"/>`;
      }
      // holly berries
      for (let i = 0; i < 10; i++) {
        const t = (i / 10) * Math.PI * 2 + 0.3;
        if ((Math.sin(t) > 0) !== front) continue;
        const x = cx + Math.cos(t) * (rx + 6), y = cy + Math.sin(t) * (ry + 2) - 2;
        out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="#9A2B1F" stroke="#4a140f" stroke-width=".8"/><circle cx="${(x + 6).toFixed(1)}" cy="${(y + 2).toFixed(1)}" r="3.4" fill="#9A2B1F" stroke="#4a140f" stroke-width=".8"/>`;
      }
      return out;
    };

    const candle = (x, baseY, h, fill, hi, week) => {
      const w = 24, top = baseY - h;
      return `
      <g class="candle" data-week="${week || ""}">
        <circle class="glow" cx="${x}" cy="${top - 18}" r="46" fill="url(#glowG)"/>
        <rect x="${x - w / 2}" y="${top}" width="${w}" height="${h}" fill="${fill}" stroke="#2B211C" stroke-width="1.4"/>
        <rect x="${x - w / 2 + 4}" y="${top + 4}" width="4" height="${h - 8}" fill="${hi}" opacity=".55"/>
        <ellipse cx="${x}" cy="${top}" rx="${w / 2}" ry="3.5" fill="${hi}" stroke="#2B211C" stroke-width="1.2"/>
        <path d="M${x} ${top - 1}v-7" stroke="#2B211C" stroke-width="1.6"/>
        <g class="flame"><path class="flame-inner" d="M${x} ${top - 40}C${x + 9} ${top - 24} ${x + 9} ${top - 12} ${x} ${top - 6}C${x - 9} ${top - 12} ${x - 9} ${top - 24} ${x} ${top - 40}Z" fill="url(#flameG)"/></g>
      </g>`;
    };

    const violet = ["#4A2C5E", "#7E5E95"], rose = ["#C27A8C", "#E6B5C0"], white = ["#F6EFDF", "#FFFFFF"];
    // lighting order goes round the wreath: front-left, back-left, back-right, front-right
    const spots = [
      { a: 162, week: 1 }, { a: 238, week: 2 }, { a: 302, week: 3 }, { a: 18, week: 4 }
    ].map((s) => {
      const r = (s.a * Math.PI) / 180;
      return { ...s, x: cx + Math.cos(r) * rx * 0.8, y: cy + Math.sin(r) * ry * 0.8 };
    });
    const colorFor = (w) => (w === A.roseSunday ? rose : violet);
    const back = spots.filter((s) => s.y < cy).sort((a, b) => a.y - b.y);
    const front = spots.filter((s) => s.y >= cy).sort((a, b) => a.y - b.y);
    const draw = (s) => candle(s.x.toFixed(1), s.y, 112, colorFor(s.week)[0], colorFor(s.week)[1], s.week);

    svg.innerHTML =
      defs +
      `<ellipse cx="${cx}" cy="${cy + 14}" rx="${rx + 22}" ry="${ry + 10}" fill="#2B211C" opacity=".07"/>` +
      leaves(false) +
      back.map(draw).join("") +
      candle(cx, cy + 4, 150, white[0], white[1], 0) +
      front.map(draw).join("") +
      leaves(true);

    // mark the rose week in the theme list
    const roseLi = document.querySelector(`#themes li[data-week="${A.roseSunday}"]`);
    if (roseLi) roseLi.classList.add("is-rose");
  }

  function lightCandles() {
    // How many candles to show lit: during Advent, the current week; otherwise all four.
    const inAdvent = todayEntry && todayEntry.kind !== "christmas";
    const upTo = inAdvent ? todayEntry.week : 4;
    const candles = [...document.querySelectorAll(".candle[data-week]")].filter((c) => c.dataset.week);
    const items = document.querySelectorAll("#themes li");
    const light = (w) => {
      candles.forEach((c) => { if (+c.dataset.week === w) c.classList.add("lit"); });
      items.forEach((li) => { if (+li.dataset.week === w) li.classList.add("lit"); });
    };
    if (todayEntry && todayEntry.kind === "christmas") {
      document.querySelector('.candle[data-week=""]').classList.add("lit");
    }
    if (reduceMotion) { for (let w = 1; w <= upTo; w++) light(w); return; }
    for (let w = 1; w <= upTo; w++) setTimeout(() => light(w), 1300 + (w - 1) * 900);
  }

  function heroStatus() {
    const el = document.getElementById("hero-status");
    if (today < start) {
      const n = Math.round((start - today) / 86400000);
      el.textContent = `Advent begins on Sunday ${fmtShort(start)}, ${n === 1 ? "tomorrow" : `in ${n} days`}.`;
    } else if (todayEntry && todayEntry.kind === "christmas") {
      el.textContent = "Christ is born. A blessed Christmas to you.";
    } else if (todayEntry) {
      el.textContent = `Today is day ${todayEntry.n} of Advent, in the ${ordinals[todayEntry.week - 1].toLowerCase()} week.`;
    } else {
      el.textContent = "Advent has ended. The calendar remains open to revisit.";
    }
  }

  /* =================================================================
     CALENDAR
     ================================================================= */
  function buildCalendar() {
    const host = document.getElementById("church");

    // Where each day sits on the church front (6 columns):
    //   rows 2, 4, 6, 8 – one storey of weekday windows per week, under a
    //                     stone band naming the week (rows 1, 3, 5, 7)
    //   row 9           – ground floor: the four Sunday doors
    //   Christmas       – the great central portal, columns 3–4, rising
    //                     through the fourth-week storey to the ground
    const w4 = days.filter((d) => d.week === 4 && d.kind === "weekday");
    const tallPortal = w4.length <= 4;
    const w4Slots = { 0: [], 1: [2], 2: [2, 5], 3: [1, 2, 5], 4: [1, 2, 5, 6] }[w4.length];
    const sundayCols = [1, 2, 5, 6];
    const place = (day) => {
      if (day.kind === "christmas") return tallPortal ? ["8 / span 2", "3 / span 2"] : ["9", "3 / span 2"];
      if (day.date.getDay() === 0) return ["9", String(sundayCols[day.week - 1])];
      if (day.week === 4 && tallPortal) return ["8", String(w4Slots[w4.indexOf(day)])];
      return [String(day.week * 2), String(day.date.getDay())];
    };

    host.innerHTML = `
      <svg class="gable" viewBox="0 0 600 196" aria-hidden="true">
        <defs>
          <pattern id="courses" width="600" height="18" patternUnits="userSpaceOnUse">
            <rect width="600" height="18" fill="#CDB993"/><rect y="17" width="600" height="1" fill="rgba(110,86,52,.22)"/>
          </pattern>
          <radialGradient id="roseGlass" cx="50%" cy="50%" r="50%">
            <stop offset="0" stop-color="#FFE9B0"/><stop offset=".55" stop-color="#E2C27A"/><stop offset="1" stop-color="#9C7432"/>
          </radialGradient>
          <radialGradient id="roseHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0" stop-color="rgba(226,194,122,.55)"/><stop offset="1" stop-color="rgba(226,194,122,0)"/>
          </radialGradient>
        </defs>
        <g class="gable-cross">
          <rect x="294" y="2" width="12" height="60" fill="#B38B3F" stroke="#6B5224" stroke-width="1.5"/>
          <rect x="279" y="16" width="42" height="11" fill="#B38B3F" stroke="#6B5224" stroke-width="1.5"/>
        </g>
        <polygon points="0,196 300,60 600,196" fill="url(#courses)"/>
        <polyline points="2,196 300,62 598,196" fill="none" stroke="#A28B63" stroke-width="12" stroke-linejoin="miter"/>
        <polyline points="16,196 300,76 584,196" fill="none" stroke="#E4D6B6" stroke-width="2"/>
        <circle cx="300" cy="146" r="62" fill="url(#roseHalo)"/>
        <circle cx="300" cy="146" r="42" fill="url(#roseGlass)" stroke="#7D6847" stroke-width="7"/>
        <g fill-opacity=".85" stroke="#7D6847" stroke-width="2.5">
          ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const a = (i * Math.PI) / 4, x = (300 + Math.cos(a) * 25).toFixed(1), y = (146 + Math.sin(a) * 25).toFixed(1);
            const fill = i === 2 ? "#C27A8C" : i % 2 ? "#3E6A86" : "#4A2C5E";
            return `<circle cx="${x}" cy="${y}" r="10" fill="${fill}"/>`;
          }).join("")}
        </g>
        <circle cx="300" cy="146" r="9" fill="#E2C27A" stroke="#7D6847" stroke-width="2.5"/>
      </svg>
      <div class="church-body">
        <ol class="facade" aria-label="Advent calendar, 29 November to 25 December"></ol>
      </div>
      <div class="steps" aria-hidden="true"><span></span><span></span></div>`;

    const facade = host.querySelector(".facade");
    const frag = document.createDocumentFragment();
    for (let w = 1; w <= 4; w++) {
      const band = document.createElement("li");
      band.className = "course";
      band.setAttribute("aria-hidden", "true");
      band.style.gridRow = String(w * 2 - 1);
      band.innerHTML = `<span>${ordinals[w - 1]} week</span><b>${themes[w - 1]}</b>`;
      frag.appendChild(band);
    }
    days.forEach((day) => {
      const li = buildDoor(day);
      const [row, col] = place(day);
      li.style.gridRow = row;
      li.style.gridColumn = col;
      frag.appendChild(li);
    });
    facade.appendChild(frag);

    if (PREVIEW) setStatus("Preview: every door is unlocked.");
  }

  function buildDoor(day) {
    const li = document.createElement("li");
    li.className = "cell";
    li.dataset.kind = day.kind;
    li.dataset.key = day.key;
    const unlocked = isUnlocked(day);
    if (!unlocked) li.classList.add("is-locked");
    if (todayEntry && todayEntry.key === day.key) li.classList.add("is-today");

    const month = day.date.getMonth() === 10 ? "<small>Nov</small>" : "";
    const caption = day.kind === "christmas" ? "Christmas"
      : (day.kind === "sunday" || day.kind === "rose") ? themes[day.week - 1] : "";
    const isToday = todayEntry && todayEntry.key === day.key;
    const insideWord = day.kind === "christmas" ? "Gloria!" : (day.date.getDay() === 0 ? themes[day.week - 1] : "");

    li.innerHTML = `
      <button class="door" type="button" aria-label="${esc(`${fmtLong(day.date)}${isToday ? " (today)" : ""}: ${day.title}${unlocked ? "" : " (opens on this day)"}`)}">
        <span class="lintel">${day.date.getDate()}${month}${caption ? `<em>${caption}</em>` : ""}</span>
        <span class="opening">
          <span class="inside">${STAR}${insideWord ? `<span>${insideWord}</span>` : ""}</span>
          <span class="leaf leaf-l"><span class="face front"><span class="knob"></span></span><span class="face back"></span></span>
          <span class="leaf leaf-r"><span class="face front"><span class="knob"></span></span><span class="face back"></span></span>
        </span>
      </button>`;

    li.querySelector(".door").addEventListener("click", () => onDoor(day, li));
    return li;
  }

  let statusTimer;
  function setStatus(msg) {
    const el = document.getElementById("cal-status");
    el.textContent = msg;
    clearTimeout(statusTimer);
    if (!PREVIEW) statusTimer = setTimeout(() => { el.textContent = ""; }, 4000);
  }

  function onDoor(day, li) {
    if (!isUnlocked(day)) {
      li.classList.remove("rattle");
      void li.offsetWidth;
      li.classList.add("rattle");
      setStatus(`This door opens on ${fmtLong(day.date)}.`);
      return;
    }
    if (dlg.open || closing || opening) return;
    opening = true;
    const alreadyOpen = li.classList.contains("is-open");
    li.classList.add("is-open");
    const wait = alreadyOpen || reduceMotion ? 0 : 700;
    setTimeout(() => openWindow(day, li), wait);
  }

  /* =================================================================
     WINDOW (dialog)
     ================================================================= */
  const dlg = document.getElementById("window");
  let returnTo = null;
  let originEl = null;
  let originCell = null;
  let closing = false;
  let opening = false;
  let stepping = false;
  let currentIdx = -1;   // index in `days` of the window last opened

  const songHTML = (song) => {
    if (!song || !song.title) return `<p class="placeholder">The song for this day will be added soon.</p>`;
    let html = `<p class="hymn-title">${esc(song.title)}</p>`;
    if (song.by) html += `<p class="hymn-by">${esc(song.by)}</p>`;
    if (song.spotifyId) {
      html += `<div class="player-frame player-spotify"><iframe src="https://open.spotify.com/embed/track/${encodeURIComponent(song.spotifyId)}" title="${esc(song.title)}" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe></div>`;
    } else if (song.youtubeId) {
      html += `<div class="player-frame"><iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(song.youtubeId)}" title="${esc(song.title)}" loading="lazy" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe></div>`;
    } else {
      html += `<p class="placeholder">A recording will be added here.</p>`;
    }
    return html;
  };

  function fillWindow(day) {
    const d = day.data;
    document.getElementById("win-day").textContent = day.date.getDate();
    document.getElementById("win-date").textContent = fmtLong(day.date);
    document.getElementById("win-title").textContent = day.title;
    document.getElementById("win-subtitle").textContent = d.subtitle || "";

    let reading = "";
    if (d.reading) reading += `<p class="reading-ref">${esc(d.reading)}</p>`;
    if (d.readingText) reading += `<p class="reading-text">${esc(d.readingText)}</p>`;
    document.getElementById("win-reading").innerHTML = reading || `<p class="placeholder">Today’s reading will be added soon.</p>`;

    // A day can have an activity instead of a reflection; the heading follows.
    const isActivity = !!d.activity;
    const body = isActivity ? d.activity : d.reflection;
    const refl = Array.isArray(body) ? body : (body ? [body] : []);
    document.getElementById("win-reflection-heading").textContent = isActivity ? "Activity" : "Reflection";
    document.getElementById("win-reflection").innerHTML = refl.length
      ? refl.map((p) => `<p>${esc(p)}</p>`).join("")
      : `<p class="placeholder">A reflection for this day will be added soon.</p>`;

    document.getElementById("win-song").innerHTML = songHTML(d.song);
  }

  function openWindow(day, li) {
    fillWindow(day);
    currentIdx = days.indexOf(day);
    returnTo = li.querySelector(".door");
    originEl = li.querySelector(".opening");
    originCell = li;
    opening = false;
    dlg.showModal();
    dlg.scrollTop = 0;
    document.body.style.overflow = "hidden";

    if (reduceMotion) return;
    const from = originEl.getBoundingClientRect();
    const to = dlg.getBoundingClientRect();
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    const sx = from.width / to.width, sy = from.height / to.height;
    dlg.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, opacity: 0.2 },
        { transform: "none", opacity: 1 }
      ],
      { duration: 520, easing: "cubic-bezier(.2,.8,.2,1)" }
    );
  }

  function closeWindow() {
    if (closing || !dlg.open) return;
    const done = () => {
      closing = false;
      dlg.close();
      document.body.style.overflow = "";
      if (originCell) originCell.classList.remove("is-open");   // swing the door shut
      if (returnTo) returnTo.focus({ preventScroll: true });
    };
    if (reduceMotion || !originEl) return done();
    closing = true;
    const from = dlg.getBoundingClientRect();
    const to = originEl.getBoundingClientRect();
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);
    const anim = dlg.animate(
      [
        { transform: "none", opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(${to.width / from.width}, ${to.height / from.height})`, opacity: 0 }
      ],
      { duration: 380, easing: "cubic-bezier(.5,0,.75,0)" }
    );
    anim.onfinish = done;
  }

  document.getElementById("win-close").addEventListener("click", closeWindow);
  dlg.addEventListener("cancel", (e) => { e.preventDefault(); closeWindow(); });
  dlg.addEventListener("click", (e) => { if (e.target === dlg) {
    // click on backdrop (the dialog element itself, outside its content box)
    const r = dlg.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeWindow();
  } });

  /* ---------- step to the next / previous day ----------
     Mouse side buttons (forward = next, back = previous), arrow keys, and
     Page Down / Page Up (presentation clickers). With the window open it
     swaps to the neighbouring day; with it closed, "next" opens the door
     after the one last viewed (or the first door). */
  const cellFor = (day) => document.querySelector(`.cell[data-key="${day.key}"]`);

  function step(dir) {
    if (closing || opening || stepping) return;
    const i = currentIdx < 0 ? 0 : currentIdx + dir;
    if (i < 0 || i >= days.length) return;
    const day = days[i], li = cellFor(day);
    if (!li) return;
    if (!dlg.open) return onDoor(day, li);
    if (!isUnlocked(day)) return;

    const swap = () => {
      if (originCell) originCell.classList.remove("is-open");
      li.classList.add("is-open");
      fillWindow(day);
      currentIdx = i;
      returnTo = li.querySelector(".door");
      originEl = li.querySelector(".opening");
      originCell = li;
      dlg.scrollTop = 0;
    };
    if (reduceMotion) return swap();

    stepping = true;
    const page = dlg.querySelector(".win-page");
    page.animate(
      [{ opacity: 1, transform: "none" }, { opacity: 0, transform: `translateX(${-dir * 24}px)` }],
      { duration: 140, easing: "ease-in" }
    ).onfinish = () => {
      swap();
      const back = page.animate(
        [{ opacity: 0, transform: `translateX(${dir * 24}px)` }, { opacity: 1, transform: "none" }],
        { duration: 220, easing: "ease-out" }
      );
      back.onfinish = () => { stepping = false; };
    };
  }

  // Mouse side buttons: 3 = back, 4 = forward. preventDefault stops the
  // browser from also going back/forward in its history.
  const sideButton = (e) => (e.button === 3 ? -1 : e.button === 4 ? 1 : 0);
  window.addEventListener("mousedown", (e) => { if (sideButton(e)) e.preventDefault(); });
  window.addEventListener("mouseup", (e) => {
    const dir = sideButton(e);
    if (!dir) return;
    e.preventDefault();
    step(dir);
  });
  window.addEventListener("auxclick", (e) => { if (sideButton(e)) e.preventDefault(); });

  window.addEventListener("keydown", (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    let dir = 0;
    if (e.key === "ArrowRight") dir = 1;
    else if (e.key === "ArrowLeft") dir = -1;
    else if (dlg.open && e.key === "PageDown") dir = 1;   // only while open, so
    else if (dlg.open && e.key === "PageUp") dir = -1;    // the page still scrolls
    if (!dir) return;
    e.preventDefault();
    step(dir);
  });

  /* ---------- go ---------- */
  buildWreath();
  heroStatus();
  buildCalendar();
  document.getElementById("year").textContent = A.year;

  requestAnimationFrame(() => {
    doc.classList.add("ready");
    lightCandles();
  });
})();
