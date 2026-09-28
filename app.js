/* =========================================================================
 * app.js — state, view rendering, interaction (single-page SPA)
 *
 * Reads data through the api.js stub layer (localStorage). No real backend.
 * Views render into the <section data-view> containers in index.html.
 * Tab switch toggles .view--active + re-renders the target view.
 * ========================================================================= */
(function () {
  "use strict";

  /* ---------- Inline Lucide icons (offline, no CDN) ---------- */
  const I = (name, size) => {
    const s = size || 20;
    const o = (inner) =>
      `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
    const PATHS = {
      home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9 22V12h6v10"/>',
      list: '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',
      gift: '<rect width="20" height="5" x="2" y="7" rx="1"/><path d="M5 12v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9"/><line x1="12" x2="12" y1="22" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>',
      users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
      plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
      check: '<path d="M20 6 9 17l-5-5"/>',
      checkCircle: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
      star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
      coin: '<circle cx="12" cy="12" r="9"/><path d="M14.5 9.5a2.5 2.5 0 0 0-2.5-1.5h-1A2 2 0 0 0 9 10c0 2.5 5 2.5 5 5a2 2 0 0 1-2 2h-1a2.5 2.5 0 0 1-2.5-1.5"/><path d="M12 7v2"/><path d="M12 15v2"/>',
      clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
      trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
      x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
      sparkles: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>',
      chevronRight: '<path d="m9 18 6-6-6-6"/>',
      chevronDown: '<path d="m6 9 6 6 6-6"/>',
      alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>',
      trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 19.35 7 20.99 7 22.5"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 19.35 17 20.99 17 22.5"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
      zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
      target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
      bookOpen: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
      dumbbell: '<path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/>',
      sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
      droplet: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
      tag: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
      swap: '<path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/>',
      userPlus: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>',
      user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
      download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
      upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
      shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
      heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/>',
      listPlus: '<path d="M11 12H3"/><path d="M11 18H3"/><path d="M11 6H3"/><path d="M18 9v6"/><path d="M21 12h-6"/>',
      minus: '<path d="M5 12h14"/>',
      pencil: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
      trendingUp: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
      shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.5-2.8a1 1 0 0 1 1 0c2 1.6 4.5 2.8 6.5 2.8a1 1 0 0 1 1 1Z"/>',
      lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
      settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
      barChart: '<line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/>',
      pieChart: '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>',
    };
    return o(PATHS[name] || PATHS.sparkles);
  };

  // map task type → lucide icon name
  const TYPE_ICON = {
    chore: "droplet",
    study: "bookOpen",
    sport: "dumbbell",
    habit: "sun",
    other: "tag",
  };

  /* ---------- App state ---------- */
  const api = window.__api__;
  const AVATARS = window.__AVATAR_PRESETS__;
  const TASK_TYPES = window.__SEED__.taskTypes;

  const state = {
    db: null,            // cached full db
    view: "home",
    tasksFilter: "all",  // type id or "all"
    rewardsTab: "all",   // "all" | "custom"
    statPeriod: "day",   // "day" | "week" | "month" | "custom"
    statDate: "",        // YYYY-MM-DD when statPeriod === "custom"
    loading: true,
    modal: null,         // current modal id
  };

  // shortcuts
  const members = () => state.db.members;
  const tasks = () => state.db.tasks;
  const rewards = () => state.db.rewards;
  const activities = () => state.db.activities;
  const currentMember = () =>
    members().find((m) => m.id === state.db.state.currentMemberId) || null;
  const typeById = (id) => TASK_TYPES.find((t) => t.id === id) || TASK_TYPES[4];

  /* ---------- Permissions (妈妈 = admin) ---------- */
  const isAdmin = (mem) => {
    const m = mem || currentMember();
    return !!m && m.role === "admin";
  };
  // a member can be edited by the admin OR by themselves
  const canEditMember = (m) => {
    const cur = currentMember();
    return !!cur && (cur.role === "admin" || cur.id === m.id);
  };
  // only admins manage tasks (add/edit/delete); everyone can complete them
  const canManageTasks = () => isAdmin();
  const canDeleteMember = (m) => {
    const cur = currentMember();
    return !!cur && cur.role === "admin" && cur.id !== m.id;
  };

  /* ---------- Small helpers ---------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function timeAgo(ts) {
    const d = Date.now() - ts;
    const m = Math.floor(d / 60000);
    if (m < 1) return "刚刚";
    if (m < 60) return m + " 分钟前";
    const h = Math.floor(m / 60);
    if (h < 24) return h + " 小时前";
    const day = Math.floor(h / 24);
    if (day < 7) return day + " 天前";
    const date = new Date(ts);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }

  function isSameDay(a, b) {
    const da = new Date(a), db = new Date(b);
    return (
      da.getFullYear() === db.getFullYear() &&
      da.getMonth() === db.getMonth() &&
      da.getDate() === db.getDate()
    );
  }

  // has the member completed this task today? (for daily/weekly "today" view)
  function doneToday(taskId, memberId) {
    const now = Date.now();
    return activities().some(
      (a) =>
        a.type === "earn" &&
        a.refId === taskId &&
        a.memberId === memberId &&
        isSameDay(a.ts, now)
    );
  }

  // completed count / redeemed count for a member
  function memberStats(memberId) {
    let earnCount = 0, redeemCount = 0, totalEarned = 0;
    activities().forEach((a) => {
      if (a.memberId !== memberId) return;
      if (a.type === "earn") { earnCount++; totalEarned += a.points; }
      else if (a.type === "redeem") redeemCount++;
    });
    return { earnCount, redeemCount, totalEarned };
  }

  /* ---------- Period stats (今日 / 本周 / 本月) ---------- */
  // Returns the inclusive start timestamp for a period (Monday-start week).
  function periodStart(period) {
    const now = new Date();
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (period === "day") return d.getTime();
    if (period === "month") return new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    if (period === "custom") {
      // statDate is "YYYY-MM-DD"; clamp to start of that day
      const [y, mo, da] = (state.statDate || todayStr()).split("-").map(Number);
      if (y && mo && da) return new Date(y, mo - 1, da).getTime();
      return d.getTime();
    }
    // week: back up to Monday
    const day = d.getDay() || 7; // Sun=0 → 7
    d.setDate(d.getDate() - (day - 1));
    return d.getTime();
  }

  // for the "custom" single-day mode, activities must also be < end of that day
  function periodEnd(period) {
    if (period !== "custom") return Infinity;
    return periodStart(period) + 24 * 60 * 60 * 1000; // +1 day
  }

  // today as YYYY-MM-DD (local time)
  function todayStr() {
    const n = new Date();
    const m = String(n.getMonth() + 1).padStart(2, "0");
    const d = String(n.getDate()).padStart(2, "0");
    return n.getFullYear() + "-" + m + "-" + d;
  }

  // aggregated earn / redeem / deduct figures for a member over a period
  function statsForPeriod(memberId, period) {
    const start = periodStart(period);
    const end = periodEnd(period);
    let earnPts = 0, earnCnt = 0, redeemPts = 0, redeemCnt = 0, deductPts = 0;
    activities().forEach((a) => {
      if (a.memberId !== memberId || a.ts < start || a.ts >= end) return;
      if (a.type === "earn") { earnPts += a.points; earnCnt++; }
      else if (a.type === "redeem") { redeemPts += -a.points; redeemCnt++; }
      else if (a.type === "deduct") { deductPts += -a.points; }
    });
    const net = earnPts - redeemPts - deductPts;
    return { earnPts, earnCnt, redeemPts, redeemCnt, deductPts, net };
  }

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg, kind) {
    const el = $("#toast");
    el.className = "toast" + (kind ? " toast--" + kind : "");
    el.innerHTML =
      (kind === "success" ? I("checkCircle", 16)
        : kind === "error" ? I("alert", 16)
        : kind === "warn" ? I("alert", 16) : "") +
      `<span>${esc(msg)}</span>`;
    requestAnimationFrame(() => el.classList.add("toast--show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("toast--show"), 2200);
  }

  /* ---------- Modal ---------- */
  const overlay = $("#modalOverlay");
  const modalEl = $("#modal");

  function openModal(html, opts) {
    modalEl.innerHTML = '<div class="modal__handle"></div>' + html;
    overlay.classList.add("modal-overlay--open");
    overlay.setAttribute("aria-hidden", "false");
    state.modal = opts && opts.id ? opts.id : "custom";
    document.body.style.overflow = "hidden";
  }
  function closeModal(after) {
    overlay.classList.remove("modal-overlay--open");
    overlay.setAttribute("aria-hidden", "true");
    state.modal = null;
    document.body.style.overflow = "";
    // clear immediately so a chained openModal() in the same tick isn't
    // wiped by the delayed cleanup. The slide-out animation is on the
    // overlay class, not on innerHTML, so this is safe.
    modalEl.innerHTML = "";
    if (typeof after === "function") after();
  }
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && state.modal) closeModal(); });

  // date picker change (home stats — "指定日" mode)
  document.addEventListener("change", (e) => {
    if (e.target && e.target.id === "stat-date") {
      state.statDate = e.target.value || todayStr();
      renderHome();
    }
  });

  /* ---------- View routing ---------- */
  const VIEWS = ["home", "tasks", "rewards", "members"];
  function setView(view) {
    if (!VIEWS.includes(view)) return;
    state.view = view;
    document.body.dataset.page = view;
    $$(".view").forEach((v) =>
      v.classList.toggle("view--active", v.dataset.view === view)
    );
    $$(".tab").forEach((t) =>
      t.classList.toggle("tab--active", t.dataset.tab === view)
    );
    renderView(view);
    updateFab();
    api.saveState({ activeView: view });
  }

  function renderView(view) {
    const map = { home: renderHome, tasks: renderTasks, rewards: renderRewards, members: renderMembers };
    (map[view] || renderHome)();
  }

  function updateFab() {
    const fab = $("#fab");
    // task, member & reward management are all admin-only
    const ACTIONS = {
      tasks: canManageTasks() ? "task" : null,
      rewards: isAdmin() ? "wish" : null,
      members: isAdmin() ? "member" : null,
    };
    const action = ACTIONS[state.view] || null;
    if (action) {
      fab.hidden = false;
      fab.dataset.action = action;
    } else {
      fab.hidden = true;
      fab.dataset.action = "";
    }
  }

  /* ---------- App bar (current user) ---------- */
  function renderAppBar() {
    const m = currentMember();
    const name = $("#appBarUserName");
    const av = $("#appBarUserAvatar");
    if (!m) {
      name.textContent = "未选择";
      av.textContent = "?";
      av.className = "app-bar__user-avatar av-1";
      return;
    }
    name.textContent = m.name;
    av.textContent = m.emoji;
    av.className = "app-bar__user-avatar " + m.avatarClass;
  }

  /* ============================================================
     VIEW: 首页 (Home)
     ============================================================ */
  function renderHome() {
    const root = $("#view-home");
    const m = currentMember();
    if (!m) {
      root.innerHTML = emptyState("userPlus", "还没有家庭成员", "点击右下角按钮，添加第一个家庭成员吧", "btn--primary", "添加成员", () => openMemberModal());
      return;
    }
    const st = memberStats(m.id);
    const pending = tasks().filter(
      (t) => (t.frequency === "daily" || t.frequency === "weekly") && !doneToday(t.id, m.id)
    );
    const affordable = rewards().filter((r) => (m.points || 0) >= r.points).length;
    const feed = activities().slice(0, 6);
    const pts = m.points || 0;
    const neg = pts < 0;
    const ps = statsForPeriod(m.id, state.statPeriod);
    const periodLabel =
      state.statPeriod === "day" ? "今日"
      : state.statPeriod === "week" ? "本周"
      : state.statPeriod === "month" ? "本月"
      : (state.statDate || todayStr());

    root.innerHTML = `
      <div class="hero">
        <div class="hero__row">
          <div class="hero__avatar">${m.emoji}</div>
          <div>
            <div class="hero__name">${esc(m.name)}${m.role === "admin" ? ` <span class="member__role-tag">${I("shield", 10)}管理员</span>` : ""}</div>
            <div class="hero__sub">${neg ? "再加油攒回正分吧" : "今天也要加油哦"}</div>
          </div>
        </div>
        <div class="hero__points">
          <span class="hero__points-num ${neg ? "hero__points-num--neg" : ""}">${pts}</span>
          <span class="hero__points-label">积分余额</span>
        </div>
        <div class="hero__stats">
          <div class="hero__stat">
            <div class="hero__stat-num">${st.earnCount}</div>
            <div class="hero__stat-label">完成任务</div>
          </div>
          <div class="hero__stat">
            <div class="hero__stat-num">${st.redeemCount}</div>
            <div class="hero__stat-label">兑换愿望</div>
          </div>
          <div class="hero__stat">
            <div class="hero__stat-num">+${st.totalEarned}</div>
            <div class="hero__stat-label">累计获得</div>
          </div>
        </div>
      </div>

      <div class="section-head">
        <div class="section-head__title">${I("trendingUp", 18)} ${state.statPeriod === "custom" ? "指定日" : periodLabel}统计</div>
      </div>
      <div class="card">
        <div class="segment mb-12" style="grid-template-columns:repeat(4,1fr)">
          <button class="segment__opt ${state.statPeriod === "day" ? "segment__opt--active" : ""}" data-stat-period="day">今日</button>
          <button class="segment__opt ${state.statPeriod === "week" ? "segment__opt--active" : ""}" data-stat-period="week">本周</button>
          <button class="segment__opt ${state.statPeriod === "month" ? "segment__opt--active" : ""}" data-stat-period="month">本月</button>
          <button class="segment__opt ${state.statPeriod === "custom" ? "segment__opt--active" : ""}" data-stat-period="custom">指定日</button>
        </div>
        ${state.statPeriod === "custom" ? `
          <div class="field mb-12" style="margin-bottom:12px">
            <label class="field__label">选择日期</label>
            <input class="input" type="date" id="stat-date" value="${state.statDate || todayStr()}" max="${todayStr()}" />
          </div>
        ` : ""}
        <div class="stat-grid">
          <div class="stat-cell">
            <div class="stat-cell__num stat-cell__num--earn">+${ps.earnPts}</div>
            <div class="stat-cell__label">获得积分</div>
          </div>
          <div class="stat-cell">
            <div class="stat-cell__num">${ps.earnCnt}</div>
            <div class="stat-cell__label">完成任务</div>
          </div>
          <div class="stat-cell">
            <div class="stat-cell__num stat-cell__num--spend">-${ps.redeemPts}</div>
            <div class="stat-cell__label">兑换积分</div>
          </div>
          <div class="stat-cell">
            <div class="stat-cell__num">${ps.redeemCnt}</div>
            <div class="stat-cell__label">兑换愿望</div>
          </div>
        </div>
        <div class="stat-net">
          <span>${state.statPeriod === "custom" ? "当日" : periodLabel}净变化${ps.deductPts ? ` · 含扣 ${ps.deductPts}` : ""}</span>
          <span class="stat-net__num">${ps.net >= 0 ? "+" : ""}${ps.net}</span>
        </div>
      </div>

      <div class="quick-row mt-16">
        <button class="quick-card" data-quick="tasks">
          <div class="quick-card__icon" style="background:${typeById("chore").soft};color:${typeById("chore").color}">${I("list", 20)}</div>
          <div class="quick-card__title">今日待办</div>
          <div class="quick-card__sub">${pending.length} 个任务等你完成</div>
        </button>
        <button class="quick-card" data-quick="rewards">
          <div class="quick-card__icon" style="background:var(--gold-soft);color:var(--gold-deep)">${I("gift", 20)}</div>
          <div class="quick-card__title">可兑换</div>
          <div class="quick-card__sub">${affordable} 个愿望可立即兑换</div>
        </button>
      </div>

      ${pending.length ? `
        <div class="section-head">
          <div class="section-head__title">${I("zap", 18)} 今日待办</div>
          <button class="section-head__action" data-goto="tasks">全部 ${I("chevronRight", 14)}</button>
        </div>
        ${pending.slice(0, 3).map(taskCard).join("")}
      ` : `
        <div class="section-head">
          <div class="section-head__title">${I("checkCircle", 18)} 今日任务</div>
        </div>
        ${emptyStateInline("checkCircle", "今天的任务都完成啦", "去兑换中心选个愿望奖励自己吧")}
      `}

      <div class="section-head">
        <div class="section-head__title">${I("clock", 18)} 最近动态</div>
      </div>
      ${feed.length ? `<div class="card">${feedHtml(feed)}</div>` : emptyStateInline("clock", "还没有动态", "完成任务或兑换愿望后会显示在这里")}
    `;
  }

  // assignedMemberIds: null/empty → everyone; array → only those members
  // (admins may always complete any task).
  function canCompleteTask(t, m) {
    if (!m) return false;
    if (isAdmin(m)) return true;
    const ids = t.assignedMemberIds;
    if (!ids || !ids.length) return true;       // unassigned = everyone
    return ids.includes(m.id);
  }

  function taskAssigneeLabel(t) {
    const ids = t.assignedMemberIds;
    if (!ids || !ids.length) return "全员";
    const names = ids.map((id) => {
      const mem = members().find((m) => m.id === id);
      return mem ? mem.name : "—";
    });
    return names.length <= 2 ? names.join("、") : names[0] + " 等" + names.length;
  }

  function taskCard(t) {
    const ty = typeById(t.typeId);
    const m = currentMember();
    const done = m && doneToday(t.id, m.id);
    const freqText = t.frequency === "daily" ? "每日" : t.frequency === "weekly" ? "每周" : "一次性";
    const canManage = canManageTasks();
    const canComplete = canCompleteTask(t, m);
    const disabled = done || !m || !canComplete;
    const assigned = !!(t.assignedMemberIds && t.assignedMemberIds.length);
    return `
      <div class="task">
        <div class="task__icon" style="background:${ty.soft};color:${ty.color}">${I(TYPE_ICON[ty.id] || "tag", 20)}</div>
        <div class="task__main">
          <div class="task__name">${esc(t.name)}</div>
          <div class="task__meta">
            <span class="task__type" style="background:${ty.soft};color:${ty.color}">${esc(ty.name)}</span>
            <span class="task__freq">${I("clock", 12)} ${freqText}</span>
            ${assigned ? `<span class="task__assign" title="${esc(taskAssigneeLabel(t))}">${I("user", 12)} ${esc(taskAssigneeLabel(t))}</span>` : `<span class="task__assign task__assign--all">${I("users", 12)} 全员</span>`}
          </div>
        </div>
        <span class="points">${I("coin", 14)}+${t.points}</span>
        ${canManage ? `<button class="task__edit" data-edit-task="${t.id}" aria-label="编辑任务" title="编辑">${I("pencil", 16)}</button>` : ""}
        <button class="task__done ${done ? "task__done--done" : ""} ${!done && !canComplete ? "task__done--locked" : ""}" data-complete="${t.id}" ${disabled ? "disabled" : ""}>
          ${done ? I("check", 16) + "已完成" : canComplete ? I("check", 16) + "完成" : I("lock", 16) + "未指派"}
        </button>
      </div>`;
  }

  function feedHtml(items) {
    return items.map((a) => {
      const mem = members().find((m) => m.id === a.memberId) || { name: "—", emoji: "?", avatarClass: "av-1" };
      const isEarn = a.type === "earn";
      const isDeduct = a.type === "deduct";
      const ty = a.typeId ? typeById(a.typeId) : null;
      const iconCls = isEarn ? "feed__icon--earn" : isDeduct ? "feed__icon--deduct" : "feed__icon--redeem";
      const verb = isEarn ? "完成了" : isDeduct ? "被扣分" : "兑换了";
      return `
        <div class="feed__item">
          <div class="feed__icon ${iconCls}">
            ${isEarn ? I("check", 17) : isDeduct ? I("alert", 17) : I("gift", 17)}
          </div>
          <div class="feed__body">
            <div class="feed__text">${esc(mem.name)} ${verb} <b>${esc(a.refName)}</b>${ty ? ` <span class="task__type" style="background:${ty.soft};color:${ty.color}">${esc(ty.name)}</span>` : ""}</div>
            <div class="feed__time">${timeAgo(a.ts)}</div>
          </div>
          <div class="feed__delta ${isEarn ? "feed__delta--earn" : isDeduct ? "feed__delta--deduct" : "feed__delta--redeem"}">${isEarn ? "+" : ""}${a.points}</div>
        </div>`;
    }).join("");
  }

  /* ============================================================
     VIEW: 任务 (Tasks)
     ============================================================ */
  function renderTasks() {
    const root = $("#view-tasks");
    const chips = [{ id: "all", name: "全部", color: "#8a7b6a" }].concat(TASK_TYPES);
    const list = state.tasksFilter === "all"
      ? tasks()
      : tasks().filter((t) => t.typeId === state.tasksFilter);
    const canManage = canManageTasks();

    root.innerHTML = `
      <div class="section-head">
        <div class="section-head__title">${I("list", 18)} 任务清单</div>
        ${canManage ? "" : `<span class="muted-2" style="font-size:var(--fs-12)">仅查看，管理请切换妈妈</span>`}
      </div>
      <div class="chip-row">
        ${chips.map((c) => `
          <button class="chip ${state.tasksFilter === c.id ? "chip--active" : ""}" data-filter="${c.id}">
            <span class="chip__dot" style="background:${c.color}"></span>${esc(c.name)}
          </button>`).join("")}
      </div>
      ${list.length ? list.map(taskCard).join("") : emptyStateInline("list", "这个类别还没有任务", canManage ? "点击右下角添加一个吧" : "")}
    `;
  }

  /* ============================================================
     VIEW: 兑换 (Rewards)
     ============================================================ */
  function renderRewards() {
    const root = $("#view-rewards");
    const m = currentMember();
    const admin = isAdmin();
    const list = state.rewardsTab === "custom"
      ? rewards().filter((r) => r.isCustom)
      : rewards();

    root.innerHTML = `
      <div class="section-head">
        <div class="section-head__title">${I("gift", 18)} 愿望兑换</div>
        ${admin ? "" : `<span class="muted-2" style="font-size:var(--fs-12)">管理愿望请切换妈妈</span>`}
      </div>
      <div class="segment segment--col-2 mb-12">
        <button class="segment__opt ${state.rewardsTab === "all" ? "segment__opt--active" : ""}" data-reward-tab="all">全部愿望</button>
        <button class="segment__opt ${state.rewardsTab === "custom" ? "segment__opt--active" : ""}" data-reward-tab="custom">自定义愿望</button>
      </div>
      ${list.length ? list.map((r) => rewardCard(r, m, admin)).join("") : emptyStateInline("gift", state.rewardsTab === "custom" ? "还没有自定义愿望" : "暂无愿望", admin && state.rewardsTab === "custom" ? "点击右下角添加一个自己的小愿望" : "")}
    `;
  }

  function rewardCard(r, m, admin) {
    const canAfford = m && (m.points || 0) >= r.points;
    return `
      <div class="reward">
        <div class="reward__head">
          <div class="reward__emoji">${r.emoji || "🎁"}</div>
          <div class="reward__title-wrap">
            <div class="row row--between">
              <div class="reward__title">${esc(r.name)}</div>
              <div class="row" style="gap:6px">
                <span class="reward__badge ${r.isCustom ? "reward__badge--custom" : "reward__badge--system"}">${r.isCustom ? "自定义" : "系统"}</span>
                ${admin ? `<button class="task__edit" data-edit-reward="${r.id}" title="编辑愿望" aria-label="编辑愿望">${I("pencil", 16)}</button>` : ""}
              </div>
            </div>
            ${r.description ? `<div class="reward__desc">${esc(r.description)}</div>` : ""}
          </div>
        </div>
        <div class="reward__foot">
          <div class="reward__cost">
            ${I("coin", 18)}
            <span class="reward__cost-num">${r.points}</span>
            <span class="reward__cost-label">积分</span>
          </div>
          <button class="reward__redeem" data-redeem="${r.id}" ${canAfford ? "" : "disabled"}>
            ${I("gift", 16)} 兑换
          </button>
        </div>
      </div>`;
  }

  /* ============================================================
     VIEW: 成员 (Members)
     ============================================================ */
  function renderMembers() {
    const root = $("#view-members");
    const list = members();
    const cur = currentMember();
    const curActs = cur ? activities().filter((a) => a.memberId === cur.id).slice(0, 4) : [];

    root.innerHTML = `
      <div class="section-head">
        <div class="section-head__title">${I("users", 18)} 家庭成员</div>
        <span class="muted-2" style="font-size:var(--fs-12)">${list.length} 位</span>
      </div>
      ${list.length ? `
        <div class="member-grid">
          ${list.map((m) => memberCard(m, cur)).join("")}
        </div>` : emptyStateInline("users", "还没有家庭成员", isAdmin() ? "点击右下角添加成员" : "请妈妈登录后添加成员")}

      ${cur ? `
        <div class="section-head">
          <div class="section-head__title">${I("clock", 18)} ${esc(cur.name)} 的动态</div>
        </div>
        ${curActs.length ? `<div class="card">${feedHtml(curActs)}</div>` : emptyStateInline("clock", "还没有动态", "完成任务后会显示在这里")}
      ` : ""}
    `;
  }

  function memberCard(m, cur) {
    const st = memberStats(m.id);
    const isCur = cur && m.id === cur.id;
    const pts = m.points || 0;
    const neg = pts < 0;
    const admin = isAdmin();
    const editable = canEditMember(m);
    const deletable = canDeleteMember(m);
    const acts = [];
    if (editable) acts.push(`<button class="member__act" data-edit-member="${m.id}">${I("pencil", 13)} 编辑</button>`);
    if (admin && !isCur) acts.push(`<button class="member__act member__act--deduct" data-deduct="${m.id}">${I("minus", 13)} 扣分</button>`);
    return `
      <div class="member ${isCur ? "member--current" : ""}" data-switch="${m.id}">
        ${isCur ? '<span class="member__current-tag">当前</span>' : ""}
        ${m.role === "admin" ? '<span class="member__role-tag">管理员</span>' : ""}
        <div class="member__avatar ${m.avatarClass}">${m.emoji}</div>
        <div class="member__name">${esc(m.name)}</div>
        <div class="member__points"><span class="points ${neg ? "points--neg" : ""}">${I("coin", 14)}${pts}</span></div>
        <div class="member__stats">
          <span>完成 <b>${st.earnCount}</b></span>
          <span>兑换 <b>${st.redeemCount}</b></span>
        </div>
        ${acts.length ? `<div class="member__actions">${acts.join("")}</div>` : (isCur ? "" : `<div class="member__switch-hint">点击切换</div>`)}
        ${deletable ? `<div class="member__actions" style="margin-top:6px"><button class="member__act member__act--deduct" data-del-member="${m.id}">${I("trash", 13)} 删除</button></div>` : ""}
      </div>`;
  }

  /* ============================================================
     Empty states
     ============================================================ */
  function emptyState(icon, title, text, btnClass, btnLabel, onClick) {
    return `
      <div class="card center" style="margin-top:24px">
        <div class="empty">
          <div class="empty__icon">${I(icon, 26)}</div>
          <div class="empty__title">${esc(title)}</div>
          <div class="empty__text">${esc(text)}</div>
          <button class="btn ${btnClass} mt-16" style="width:auto;padding:10px 20px" id="emptyAction">${I("plus", 18)} ${esc(btnLabel)}</button>
        </div>
      </div>`;
  }
  function emptyStateInline(icon, title, text) {
    return `
      <div class="empty">
        <div class="empty__icon">${I(icon, 26)}</div>
        <div class="empty__title">${esc(title)}</div>
        ${text ? `<div class="empty__text">${esc(text)}</div>` : ""}
      </div>`;
  }

  /* ============================================================
     Modals: task (add/edit) / reward (wish) / member (add/edit) /
             deduct / switch / confirm
     ============================================================ */
  function openTaskModal(task) {
    if (!canManageTasks()) { toast("只有管理员（妈妈）可以管理任务", "warn"); return; }
    const editing = !!task;
    const types = TASK_TYPES;
    openModal(`
      <div class="modal__head">
        <div class="modal__title">${editing ? "编辑任务" : "添加任务"}</div>
        <button class="modal__close" data-close aria-label="关闭">${I("x", 18)}</button>
      </div>
      <div class="field">
        <label class="field__label">任务名称 <span class="req">*</span></label>
        <input class="input" id="f-task-name" placeholder="例如：整理书桌" maxlength="30" value="${editing ? esc(task.name) : ""}" />
      </div>
      <div class="field">
        <label class="field__label">任务类型 <span class="req">*</span></label>
        <div class="type-grid" id="f-task-type">
          ${types.map((t) => `
            <button type="button" class="type-opt" data-type="${t.id}">
              <div class="type-opt__bar" style="background:${t.color}"></div>
              ${esc(t.name)}
            </button>`).join("")}
        </div>
      </div>
      <div class="field">
        <label class="field__label">奖励积分 <span class="req">*</span></label>
        <div class="stepper">
          <button type="button" class="stepper__btn" data-step="-5">${I("minus", 18)}</button>
          <input type="number" class="stepper__input" id="f-task-points" value="${editing ? task.points : 5}" min="0" max="999" inputmode="numeric" />
          <button type="button" class="stepper__btn" data-step="5">${I("plus", 18)}</button>
        </div>
      </div>
      <div class="field">
        <label class="field__label">完成频率</label>
        <div class="segment">
          <button type="button" class="segment__opt segment__opt--active" data-freq="daily">每日</button>
          <button type="button" class="segment__opt" data-freq="weekly">每周</button>
          <button type="button" class="segment__opt" data-freq="once">一次性</button>
        </div>
      </div>
      <div class="field">
        <label class="field__label">指派给谁完成</label>
        <div class="segment mb-8">
          <button type="button" class="segment__opt segment__opt--active" data-assign-mode="all">全员</button>
          <button type="button" class="segment__opt" data-assign-mode="pick">指定成员</button>
        </div>
        <div class="assign-picker" id="f-assign-list" hidden>
          ${members().map((mm) => `
            <button type="button" class="assign-chip" data-assign="${mm.id}">
              <span class="assign-chip__avatar ${mm.avatarClass}">${mm.emoji}</span>
              <span class="assign-chip__name">${esc(mm.name)}</span>
              ${I("check", 14)}
            </button>
          `).join("")}
        </div>
      </div>
      <button class="btn btn--primary mt-8" id="f-task-save">${editing ? I("check", 18) + " 保存修改" : I("plus", 18) + " 添加任务"}</button>
      ${editing ? `<button class="btn btn--danger-soft mt-8" id="f-task-del">${I("trash", 18)} 删除任务</button>` : ""}
    `, { id: editing ? "editTask" : "addTask" });

    // local modal state — seeded from the task when editing
    const ms = {
      typeId: editing ? task.typeId : "chore",
      points: editing ? task.points : 5,
      frequency: editing ? task.frequency : "daily",
      assignMode: editing && task.assignedMemberIds && task.assignedMemberIds.length ? "pick" : "all",
      assignedIds: editing && task.assignedMemberIds ? task.assignedMemberIds.slice() : [],
    };
    const setType = (id) => {
      ms.typeId = id;
      $$("#f-task-type .type-opt", modalEl).forEach((b) =>
        b.classList.toggle("type-opt--active", b.dataset.type === id)
      );
    };
    const setFreq = (f) => {
      ms.frequency = f;
      $$("[data-freq]", modalEl).forEach((b) =>
        b.classList.toggle("segment__opt--active", b.dataset.freq === f)
      );
    };
    const setPoints = (v) => {
      ms.points = Math.max(0, Math.min(999, v));
      $("#f-task-points", modalEl).value = ms.points;
    };
    $("#f-task-points", modalEl).addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      ms.points = Number.isNaN(v) ? 0 : Math.max(0, Math.min(999, v));
    });
    const setAssignMode = (mode) => {
      ms.assignMode = mode;
      $$("[data-assign-mode]", modalEl).forEach((b) =>
        b.classList.toggle("segment__opt--active", b.dataset.assignMode === mode)
      );
      const list = $("#f-assign-list", modalEl);
      if (list) list.hidden = mode !== "pick";
      renderAssignChips();
    };
    const renderAssignChips = () => {
      $$("#f-assign-list .assign-chip", modalEl).forEach((chip) => {
        const id = chip.dataset.assign;
        chip.classList.toggle("assign-chip--active", ms.assignedIds.includes(id));
      });
    };
    const toggleAssign = (id) => {
      const i = ms.assignedIds.indexOf(id);
      if (i >= 0) ms.assignedIds.splice(i, 1);
      else ms.assignedIds.push(id);
      renderAssignChips();
    };
    setType(ms.typeId);
    setFreq(ms.frequency);
    setPoints(ms.points);
    setAssignMode(ms.assignMode);

    modalEl.querySelector("#f-task-type").addEventListener("click", (e) => {
      const b = e.target.closest("[data-type]"); if (b) setType(b.dataset.type);
    });
    modalEl.querySelector(".stepper").addEventListener("click", (e) => {
      const b = e.target.closest("[data-step]"); if (!b) return;
      setPoints(ms.points + Number(b.dataset.step));
    });
    $$("[data-freq]", modalEl).forEach((b) =>
      b.addEventListener("click", () => setFreq(b.dataset.freq))
    );
    $$("[data-assign-mode]", modalEl).forEach((b) =>
      b.addEventListener("click", () => setAssignMode(b.dataset.assignMode))
    );
    $("#f-assign-list", modalEl)?.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-assign]"); if (!chip) return;
      toggleAssign(chip.dataset.assign);
    });
    $("#f-task-save", modalEl).addEventListener("click", async () => {
      const name = $("#f-task-name", modalEl).value.trim();
      if (!name) { toast("请填写任务名称", "warn"); return; }
      if (ms.assignMode === "pick" && ms.assignedIds.length === 0) {
        toast("指定成员模式下至少选一位", "warn"); return;
      }
      const payload = {
        name, typeId: ms.typeId, points: ms.points, frequency: ms.frequency,
        assignedMemberIds: ms.assignMode === "pick" ? ms.assignedIds : null,
      };
      if (editing) await api.updateTask(task.id, payload);
      else await api.addTask(payload);
      closeModal();
      await refresh();
      toast(editing ? "任务已更新" : "任务已添加", "success");
    });
    if (editing) {
      $("#f-task-del", modalEl).addEventListener("click", () => {
        closeModal();
        openDelete("task", task.id, task.name);
      });
    }
  }

  function openWishModal(reward) {
    if (!isAdmin()) { toast("只有管理员（妈妈）可以管理愿望", "warn"); return; }
    const editing = !!reward;
    openModal(`
      <div class="modal__head">
        <div class="modal__title">${editing ? "编辑愿望" : "添加愿望"}</div>
        <button class="modal__close" data-close aria-label="关闭">${I("x", 18)}</button>
      </div>
      <div class="field">
        <label class="field__label">愿望名称 <span class="req">*</span></label>
        <input class="input" id="f-wish-name" placeholder="例如：去一次游乐园" maxlength="30" value="${editing ? esc(reward.name) : ""}" />
      </div>
      <div class="field">
        <label class="field__label">需要积分 <span class="req">*</span></label>
        <div class="stepper">
          <button type="button" class="stepper__btn" data-step="-10">${I("minus", 18)}</button>
          <input type="number" class="stepper__input" id="f-wish-points" value="${editing ? reward.points : 50}" min="0" max="99999" inputmode="numeric" />
          <button type="button" class="stepper__btn" data-step="10">${I("plus", 18)}</button>
        </div>
      </div>
      <div class="field">
        <label class="field__label">描述（可选）</label>
        <textarea class="textarea" id="f-wish-desc" placeholder="补充一些说明..." maxlength="80">${editing ? esc(reward.description || "") : ""}</textarea>
      </div>
      <div class="field">
        <label class="field__label">图标</label>
        <div class="avatar-row" id="f-wish-emoji">
          ${["🎁","🎯","🎮","📚","🍪","🌙","🎢","🏀","🛍️","🍭","🐠","🚲"].map((e) =>
            `<button type="button" class="avatar-opt ${editing && reward.emoji === e ? "avatar-opt--active" : ""}" data-emoji="${e}" style="background:var(--surface-2);color:var(--text);font-size:20px;border:1px solid var(--border)">${e}</button>`
          ).join("")}
        </div>
      </div>
      <button class="btn btn--primary mt-8" id="f-wish-save">${editing ? I("check", 18) + " 保存修改" : I("plus", 18) + " 添加愿望"}</button>
      ${editing ? `<button class="btn btn--danger-soft mt-8" id="f-wish-del">${I("trash", 18)} 删除愿望</button>` : ""}
    `, { id: editing ? "editWish" : "addWish" });

    const ms = {
      points: editing ? reward.points : 50,
      emoji: editing ? (reward.emoji || "🎁") : "🎁",
    };
    if (!editing || !reward.emoji) {
      $$("#f-wish-emoji .avatar-opt", modalEl)[0]?.classList.add("avatar-opt--active");
    }
    const setPoints = (v) => {
      ms.points = Math.max(1, Math.min(99999, v));
      $("#f-wish-points", modalEl).value = ms.points;
    };
    setPoints(ms.points);
    $("#f-wish-points", modalEl).addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      ms.points = Number.isNaN(v) ? 0 : Math.max(1, Math.min(99999, v));
    });
    modalEl.querySelector(".stepper").addEventListener("click", (e) => {
      const b = e.target.closest("[data-step]"); if (!b) return;
      setPoints(ms.points + Number(b.dataset.step));
    });
    modalEl.querySelector("#f-wish-emoji").addEventListener("click", (e) => {
      const b = e.target.closest("[data-emoji]"); if (!b) return;
      ms.emoji = b.dataset.emoji;
      $$("#f-wish-emoji .avatar-opt", modalEl).forEach((x) =>
        x.classList.toggle("avatar-opt--active", x.dataset.emoji === ms.emoji)
      );
    });
    $("#f-wish-save", modalEl).addEventListener("click", async () => {
      const name = $("#f-wish-name", modalEl).value.trim();
      if (!name) { toast("请填写愿望名称", "warn"); return; }
      const payload = { name, points: ms.points, description: $("#f-wish-desc", modalEl).value.trim(), emoji: ms.emoji };
      if (editing) {
        await api.updateReward(reward.id, payload);
      } else {
        await api.addReward(payload);
        state.rewardsTab = "custom";
      }
      closeModal();
      await refresh();
      toast(editing ? "愿望已更新" : "愿望已添加", "success");
    });
    if (editing) {
      $("#f-wish-del", modalEl).addEventListener("click", () => {
        closeModal();
        openDelete("reward", reward.id, reward.name);
      });
    }
  }

  function openMemberModal(member) {
    const editing = !!member;
    // permission: editing requires canEditMember(member); adding requires admin
    // (bootstrap exception: anyone may add the very first member)
    if (editing && !canEditMember(member)) { toast("无权编辑该成员", "warn"); return; }
    if (!editing && !isAdmin() && members().length > 0) {
      toast("只有管理员（妈妈）可以添加成员", "warn"); return;
    }
    const admin = isAdmin();
    // when editing someone else as admin, allow toggling their admin role
    const canToggleRole = editing && admin && member.id !== currentMember().id;
    openModal(`
      <div class="modal__head">
        <div class="modal__title">${editing ? "编辑成员" : "添加成员"}</div>
        <button class="modal__close" data-close aria-label="关闭">${I("x", 18)}</button>
      </div>
      <div class="field">
        <label class="field__label">成员名称 <span class="req">*</span></label>
        <input class="input" id="f-mem-name" placeholder="例如：爸爸 / 小宝" maxlength="10" value="${editing ? esc(member.name) : ""}" />
      </div>
      <div class="field">
        <label class="field__label">头像</label>
        <div class="avatar-row" id="f-mem-avatars">
          ${AVATARS.map((a, i) => `
            <button type="button" class="avatar-opt ${editing && member.avatarClass === a.class ? "avatar-opt--active" : i === 0 && !editing ? "avatar-opt--active" : ""} ${a.class}" data-idx="${i}">${a.emoji}</button>
          `).join("")}
        </div>
      </div>
      ${canToggleRole ? `
        <div class="field">
          <label class="field__label">权限</label>
          <button type="button" class="check-row ${member.role === "admin" ? "check-row--on" : ""}" id="f-mem-admin">
            <span class="check-row__box">${I("check", 13)}</span>
            <span class="check-row__text"><b>管理员</b><small>可添加/删除成员、管理任务与扣分</small></span>
          </button>
        </div>
      ` : ""}
      ${editing ? `
        <div class="card" style="background:var(--surface-2);border-color:var(--border)">
          <div class="row" style="justify-content:space-between">
            <div>
              <div style="font-weight:700;font-size:var(--fs-13)">当前积分</div>
              <div class="muted" style="font-size:11px">编辑不会重置积分</div>
            </div>
            <span class="points ${member.points < 0 ? "points--neg" : ""}">${I("coin", 14)}${member.points || 0}</span>
          </div>
        </div>
      ` : ""}
      <button class="btn btn--primary mt-8" id="f-mem-save">${editing ? I("check", 18) + " 保存修改" : I("userPlus", 18) + " 添加成员"}</button>
      ${editing && canDeleteMember(member) ? `<button class="btn btn--danger-soft mt-8" id="f-mem-del">${I("trash", 18)} 删除成员</button>` : ""}
    `, { id: editing ? "editMember" : "addMember" });

    // local modal state
    const initialAvatar = editing
      ? AVATARS.find((a) => a.class === member.avatarClass) || AVATARS[0]
      : AVATARS[0];
    const ms = {
      avatar: initialAvatar,
      role: editing ? member.role : "member",
    };
    const setAvatar = (idx) => {
      ms.avatar = AVATARS[idx];
      $$("#f-mem-avatars .avatar-opt", modalEl).forEach((x, i) =>
        x.classList.toggle("avatar-opt--active", i === idx)
      );
    };
    modalEl.querySelector("#f-mem-avatars").addEventListener("click", (e) => {
      const b = e.target.closest("[data-idx]"); if (!b) return;
      setAvatar(Number(b.dataset.idx));
    });
    if (canToggleRole) {
      const row = $("#f-mem-admin", modalEl);
      row.addEventListener("click", () => {
        ms.role = ms.role === "admin" ? "member" : "admin";
        row.classList.toggle("check-row--on", ms.role === "admin");
      });
    }
    $("#f-mem-save", modalEl).addEventListener("click", async () => {
      const name = $("#f-mem-name", modalEl).value.trim();
      if (!name) { toast("请填写成员名称", "warn"); return; }
      const payload = { name, avatarClass: ms.avatar.class, emoji: ms.avatar.emoji };
      if (canToggleRole) payload.role = ms.role;
      if (editing) {
        await api.updateMember(member.id, payload);
        closeModal();
        await refresh();
        toast("成员已更新", "success");
      } else {
        const m = await api.addMember(payload);
        await api.saveState({ currentMemberId: m.id });
        closeModal();
        await refresh();
        toast("成员已添加并切换", "success");
      }
    });
    if (editing && canDeleteMember(member)) {
      $("#f-mem-del", modalEl).addEventListener("click", () => {
        closeModal();
        openDelete("member", member.id, member.name);
      });
    }
  }

  function openDeductModal(member) {
    if (!isAdmin()) { toast("只有管理员（妈妈）可以扣分", "warn"); return; }
    openModal(`
      <div class="modal__head">
        <div class="modal__title">扣分 — ${esc(member.name)}</div>
        <button class="modal__close" data-close aria-label="关闭">${I("x", 18)}</button>
      </div>
      <div class="card" style="background:var(--surface-2);border-color:var(--border)">
        <div class="row" style="justify-content:space-between">
          <div style="font-weight:700;font-size:var(--fs-13)">当前积分</div>
          <span class="points ${member.points < 0 ? "points--neg" : ""}">${I("coin", 14)}${member.points || 0}</span>
        </div>
      </div>
      <div class="field mt-16">
        <label class="field__label">扣除积分 <span class="req">*</span></label>
        <div class="stepper">
          <button type="button" class="stepper__btn" data-step="-5">${I("minus", 18)}</button>
          <div class="stepper__val" id="f-deduct-points">5</div>
          <button type="button" class="stepper__btn" data-step="5">${I("plus", 18)}</button>
        </div>
      </div>
      <div class="field">
        <label class="field__label">原因（可选）</label>
        <input class="input" id="f-deduct-reason" placeholder="例如：没有按时完成作业" maxlength="30" />
      </div>
      <div class="muted" style="font-size:11px;margin-bottom:12px">提示：积分可扣至负数（欠分），表示需要补回。</div>
      <button class="btn btn--danger-soft" id="f-deduct-confirm">${I("minus", 18)} 确认扣分</button>
    `, { id: "deduct" });

    const ms = { points: 5 };
    const setPoints = (v) => {
      ms.points = Math.max(1, Math.min(999, v));
      $("#f-deduct-points", modalEl).textContent = ms.points;
    };
    modalEl.querySelector(".stepper").addEventListener("click", (e) => {
      const b = e.target.closest("[data-step]"); if (!b) return;
      setPoints(ms.points + Number(b.dataset.step));
    });
    $("#f-deduct-confirm", modalEl).addEventListener("click", async () => {
      try {
        const res = await api.deductPoints(member.id, ms.points, $("#f-deduct-reason", modalEl).value);
        closeModal();
        await refresh();
        toast(`已扣 ${ms.points} 分 · 余额 ${res.member.points}`, "success");
      } catch (err) { toast(err.message || "扣分失败", "error"); }
    });
  }

  // Fixed admin password (per requirement). Switching INTO an admin account
  // from a non-admin session requires it.
  const ADMIN_PASSWORD = "20180206";

  function openSwitchMember() {
    const list = members();
    if (!list.length) { openMemberModal(); return; }
    const admin = isAdmin();
    openModal(`
      <div class="modal__head">
        <div class="modal__title">切换成员</div>
        <button class="modal__close" data-close aria-label="关闭">${I("x", 18)}</button>
      </div>
      <div class="member-grid" style="grid-template-columns:1fr 1fr">
        ${list.map((m) => {
          const isCur = m.id === state.db.state.currentMemberId;
          // lock icon shown on admin accounts when switching from a non-admin
          const locked = !admin && m.role === "admin" && !isCur;
          return `
            <button class="member ${isCur ? "member--current" : ""}" data-switch="${m.id}" data-locked="${locked ? "1" : "0"}" style="width:100%">
              ${isCur ? '<span class="member__current-tag">当前</span>' : ""}
              ${locked ? '<span class="member__current-tag" style="background:var(--text);right:8px;left:auto;top:8px">' + I("lock", 11) + '</span>' : ""}
              <div class="member__avatar ${m.avatarClass}">${m.emoji}</div>
              <div class="member__name">${esc(m.name)}</div>
              <div class="member__points"><span class="points ${m.points < 0 ? "points--neg" : ""}">${I("coin", 14)}${m.points || 0}</span></div>
              ${locked ? '<div class="member__switch-hint">需密码</div>' : ""}
            </button>`;
        }).join("")}
      </div>
      ${admin ? `<button class="btn btn--ghost mt-16" id="f-mem-add2">${I("userPlus", 18)} 添加新成员</button>` : ""}
    `, { id: "switchMember" });
    const add2 = $("#f-mem-add2", modalEl);
    if (add2) add2.addEventListener("click", () => { closeModal(); openMemberModal(); });
  }

  function openAdminPassword(targetId) {
    const target = members().find((m) => m.id === targetId);
    if (!target) return;
    openModal(`
      <div class="modal__head">
        <div class="modal__title">${I("lock", 18)} 切换到管理员</div>
        <button class="modal__close" data-close aria-label="关闭">${I("x", 18)}</button>
      </div>
      <div class="card" style="background:var(--primary-soft);border-color:transparent">
        <div class="row" style="gap:12px;align-items:center">
          <div class="member__avatar ${target.avatarClass}" style="width:40px;height:40px;font-size:22px;margin:0">${target.emoji}</div>
          <div>
            <div style="font-weight:800">${esc(target.name)} <span class="member__role-tag">管理员</span></div>
            <div class="muted" style="font-size:11px;margin-top:2px">切换管理员需要输入密码</div>
          </div>
        </div>
      </div>
      <div class="field mt-16">
        <label class="field__label">管理密码 <span class="req">*</span></label>
        <input class="input" id="f-pw" type="password" inputmode="numeric" placeholder="请输入管理密码" autocomplete="off" />
      </div>
      <button class="btn btn--primary" id="f-pw-confirm">${I("check", 18)} 确认切换</button>
      <div class="muted center" style="font-size:11px;margin-top:10px">提示：默认密码 20180206</div>
    `, { id: "adminPw" });
    const input = $("#f-pw", modalEl);
    setTimeout(() => input.focus(), 120);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") $("#f-pw-confirm", modalEl).click(); });
    $("#f-pw-confirm", modalEl).addEventListener("click", async () => {
      const val = $("#f-pw", modalEl).value.trim();
      if (val !== ADMIN_PASSWORD) { toast("密码错误", "error"); input.value = ""; input.focus(); return; }
      await api.saveState({ currentMemberId: targetId });
      closeModal();
      await refresh();
      toast("已切换到 " + target.name, "success");
    });
  }

  function openDelete(kind, id, name) {
    openModal(`
      <div class="modal__head">
        <div class="modal__title">确认删除</div>
        <button class="modal__close" data-close aria-label="关闭">${I("x", 18)}</button>
      </div>
      <div class="card" style="background:var(--danger-soft);border-color:transparent">
        <div style="display:flex;gap:12px;align-items:flex-start">
          <div style="color:var(--danger);flex-shrink:0">${I("alert", 22)}</div>
          <div>
            <div style="font-weight:700">${esc(name)}</div>
            <div class="muted mt-8" style="font-size:var(--fs-13)">${kind === "member" ? "将删除该成员及其所有动态记录，无法恢复。" : kind === "task" ? "将删除该任务，已完成记录会保留。" : "将删除该自定义愿望。"}</div>
          </div>
        </div>
      </div>
      <div class="btn-row mt-16">
        <button class="btn btn--ghost" data-close>取消</button>
        <button class="btn btn--danger" id="del-confirm">删除</button>
      </div>
    `, { id: "delete" });
    $("#del-confirm", modalEl).addEventListener("click", async () => {
      if (kind === "member") await api.deleteMember(id);
      else if (kind === "task") await api.deleteTask(id);
      else if (kind === "reward") await api.deleteReward(id);
      closeModal();
      await refresh();
      toast("已删除", "success");
    });
  }

  /* ---------- Settings ---------- */
  function openSettings() {
    const m = currentMember();
    const admin = isAdmin();
    const totalEarn = activities().filter((a) => a.type === "earn").reduce((s, a) => s + a.points, 0);
    const totalRedeem = activities().filter((a) => a.type === "redeem").reduce((s, a) => s + -a.points, 0);
    openModal(`
      <div class="modal__head">
        <div class="modal__title">${I("settings", 18)} 设置</div>
        <button class="modal__close" data-close aria-label="关闭">${I("x", 18)}</button>
      </div>

      <div class="settings-section">
        <div class="settings-section__title">当前账号</div>
        <div class="card" style="padding:14px">
          <div class="row" style="gap:12px;align-items:center">
            <div class="member__avatar ${m ? m.avatarClass : "av-1"}" style="width:44px;height:44px;font-size:24px;margin:0">${m ? m.emoji : "?"}</div>
            <div style="flex:1">
              <div style="font-weight:800">${m ? esc(m.name) : "未选择"} ${admin ? '<span class="member__role-tag">管理员</span>' : ""}</div>
              <div class="muted" style="font-size:11px;margin-top:2px">余额 ${m ? (m.points || 0) : 0} 分</div>
            </div>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <div class="settings-section__title">数据概览</div>
        <div class="stat-grid">
          <div class="stat-cell">
            <div class="stat-cell__num stat-cell__num--earn">${members().length}</div>
            <div class="stat-cell__label">家庭成员</div>
          </div>
          <div class="stat-cell">
            <div class="stat-cell__num">${tasks().length}</div>
            <div class="stat-cell__label">任务数</div>
          </div>
          <div class="stat-cell">
            <div class="stat-cell__num stat-cell__num--earn">+${totalEarn}</div>
            <div class="stat-cell__label">累计获得</div>
          </div>
          <div class="stat-cell">
            <div class="stat-cell__num stat-cell__num--spend">-${totalRedeem}</div>
            <div class="stat-cell__label">累计兑换</div>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <div class="settings-section__title">数据备份</div>
        <button class="settings-item" id="set-export">
          <div class="settings-item__icon" style="background:var(--success-soft);color:var(--success)">${I("download", 18)}</div>
          <div class="settings-item__main">
            <div class="settings-item__title">导出备份</div>
            <div class="settings-item__sub">下载 JSON 文件保存到手机/云盘</div>
          </div>
          ${I("chevronRight", 16)}
        </button>
        <button class="settings-item" id="set-import">
          <div class="settings-item__icon" style="background:var(--primary-soft);color:var(--primary)">${I("upload", 18)}</div>
          <div class="settings-item__main">
            <div class="settings-item__title">导入备份</div>
            <div class="settings-item__sub">从备份文件恢复数据（覆盖当前）</div>
          </div>
          ${I("chevronRight", 16)}
        </button>
      </div>

      <div class="settings-section">
        <div class="settings-section__title">管理</div>
        <button class="settings-item" id="set-switch">
          <div class="settings-item__icon" style="background:var(--primary-soft);color:var(--primary)">${I("swap", 18)}</div>
          <div class="settings-item__main">
            <div class="settings-item__title">切换成员</div>
            <div class="settings-item__sub">换一位家庭成员登录</div>
          </div>
          ${I("chevronRight", 16)}
        </button>
        ${admin ? `
          <button class="settings-item settings-item--danger" id="set-clear">
            <div class="settings-item__icon">${I("trash", 18)}</div>
            <div class="settings-item__main">
              <div class="settings-item__title">清除所有积分与记录</div>
              <div class="settings-item__sub">成员/任务/愿望保留，只清空积分和动态</div>
            </div>
          </button>
          <button class="settings-item settings-item--danger" id="set-reset">
            <div class="settings-item__icon">${I("alert", 18)}</div>
            <div class="settings-item__main">
              <div class="settings-item__title">恢复出厂设置</div>
              <div class="settings-item__sub">全部清空并恢复到默认家庭</div>
            </div>
          </button>
        ` : `
          <button class="settings-item settings-item--locked" disabled>
            <div class="settings-item__icon">${I("lock", 18)}</div>
            <div class="settings-item__main">
              <div class="settings-item__title">清除数据</div>
              <div class="settings-item__sub">需管理员（妈妈）账号</div>
            </div>
          </button>
        `}
      </div>
    `, { id: "settings" });

    $("#set-switch", modalEl).addEventListener("click", () => { closeModal(openSwitchMember); });
    if (admin) {
      $("#set-clear", modalEl).addEventListener("click", () => { closeModal(() => openClearData(false)); });
      $("#set-reset", modalEl).addEventListener("click", () => { closeModal(() => openClearData(true)); });
    }

    // 导出备份：下载 JSON 文件
    $("#set-export", modalEl).addEventListener("click", async () => {
      try {
        const json = await api.exportData();
        const date = new Date().toISOString().slice(0, 10);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `family-points-backup-${date}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        toast("备份已导出，请保存到安全位置", "success");
      } catch (err) { toast("导出失败：" + (err.message || ""), "error"); }
    });

    // 导入备份：选文件 → 确认 → 恢复
    $("#set-import", modalEl).addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json,application/json";
      input.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const text = await file.text();
        closeModal(() => openImportConfirm(text, file.name));
      });
      input.click();
    });
  }

  function openImportConfirm(jsonText, fileName) {
    openModal(`
      <div class="modal__head">
        <div class="modal__title">${I("upload", 18)} 导入备份</div>
        <button class="modal__close" data-close aria-label="关闭">${I("x", 18)}</button>
      </div>
      <div class="card" style="background:var(--danger-soft);border-color:transparent">
        <div style="display:flex;gap:12px;align-items:flex-start">
          <div style="color:var(--danger);flex-shrink:0">${I("alert", 22)}</div>
          <div>
            <div style="font-weight:700">${esc(fileName)}</div>
            <div class="muted mt-8" style="font-size:var(--fs-13)">导入后当前所有数据（积分、任务、动态）将被备份内容覆盖，无法撤销。</div>
          </div>
        </div>
      </div>
      <div class="btn-row mt-16">
        <button class="btn btn--ghost" data-close>取消</button>
        <button class="btn btn--primary" id="f-import-ok">${I("check", 18)} 确认导入</button>
      </div>
    `, { id: "importConfirm" });
    $("#f-import-ok", modalEl).addEventListener("click", async () => {
      try {
        await api.importData(jsonText);
        closeModal();
        await refresh();
        toast("备份已导入，数据已恢复", "success");
      } catch (err) { toast("导入失败：" + (err.message || ""), "error"); }
    });
  }

  function openClearData(factoryReset) {
    if (!isAdmin()) { toast("只有管理员可以清除数据", "warn"); return; }
    const confirmWord = factoryReset ? "恢复出厂" : "确认清除";
    openModal(`
      <div class="modal__head">
        <div class="modal__title">${factoryReset ? "恢复出厂设置" : "清除积分与记录"}</div>
        <button class="modal__close" data-close aria-label="关闭">${I("x", 18)}</button>
      </div>
      <div class="card" style="background:var(--danger-soft);border-color:transparent">
        <div style="display:flex;gap:12px;align-items:flex-start">
          <div style="color:var(--danger);flex-shrink:0">${I("alert", 22)}</div>
          <div>
            <div style="font-weight:700">${factoryReset ? "将清空所有数据" : "将清空积分和动态"}</div>
            <div class="muted mt-8" style="font-size:var(--fs-13)">
              ${factoryReset
                ? "包括全部成员、任务、愿望和所有动态，恢复到默认家庭（爸爸/妈妈/小宝）。无法撤销。"
                : "所有成员的积分归零，所有完成/兑换/扣分记录清空。成员、任务、愿望清单保留。无法撤销。"}
            </div>
          </div>
        </div>
      </div>
      <div class="confirm-word">为防止误操作，请输入 <b>${confirmWord}</b> 后再点确认。</div>
      <div class="field mt-12">
        <input class="input" id="f-clear-input" placeholder="请输入 ${confirmWord}" autocomplete="off" />
      </div>
      <div class="btn-row mt-16">
        <button class="btn btn--ghost" data-close>取消</button>
        <button class="btn btn--danger" id="clear-confirm" disabled>${factoryReset ? "恢复出厂" : "确认清除"}</button>
      </div>
    `, { id: "clearData" });

    const input = $("#f-clear-input", modalEl);
    const btn = $("#clear-confirm", modalEl);
    setTimeout(() => input.focus(), 120);
    input.addEventListener("input", () => {
      btn.disabled = input.value.trim() !== confirmWord;
    });
    input.addEventListener("keydown", (e) => { if (e.key === "Enter" && !btn.disabled) btn.click(); });
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      try {
        if (factoryReset) {
          await api.reset();
        } else {
          await api.clearAllData();
        }
        state.statPeriod = "day";
        closeModal();
        await refresh();
        toast(factoryReset ? "已恢复出厂设置" : "已清除积分与记录", "success");
      } catch (err) {
        toast(err.message || "操作失败", "error");
        btn.disabled = false;
      }
    });
  }

  /* ---------- event delegation (one listener on document) ---------- */
  // set true by long-press so the synthetic click that follows is swallowed
  let suppressNextClick = false;
  document.addEventListener("click", async (e) => {
    if (suppressNextClick) { suppressNextClick = false; return; }
    // generic close
    if (e.target.closest("[data-close]")) { closeModal(); return; }
    // empty-action button (home when no members)
    if (e.target.closest("#emptyAction")) { openMemberModal(); return; }

    const nav = e.target.closest("[data-tab]");
    if (nav) { setView(nav.dataset.tab); return; }

    const q = e.target.closest("[data-quick]");
    if (q) { setView(q.dataset.quick); return; }
    const g = e.target.closest("[data-goto]");
    if (g) { setView(g.dataset.goto); return; }

    // stats period toggle (home)
    const sp = e.target.closest("[data-stat-period]");
    if (sp) {
      state.statPeriod = sp.dataset.statPeriod;
      if (state.statPeriod === "custom" && !state.statDate) state.statDate = todayStr();
      renderHome();
      return;
    }

    // edit task (admin)
    const et = e.target.closest("[data-edit-task]");
    if (et) {
      const t = tasks().find((x) => x.id === et.dataset.editTask);
      if (t) openTaskModal(t);
      return;
    }
    // edit reward (admin)
    const er = e.target.closest("[data-edit-reward]");
    if (er) {
      const r = rewards().find((x) => x.id === er.dataset.editReward);
      if (r) openWishModal(r);
      return;
    }
    // edit member (admin or self)
    const em = e.target.closest("[data-edit-member]");
    if (em) {
      const m = members().find((x) => x.id === em.dataset.editMember);
      if (m) openMemberModal(m);
      return;
    }
    // deduct (admin)
    const dc = e.target.closest("[data-deduct]");
    if (dc) {
      const m = members().find((x) => x.id === dc.dataset.deduct);
      if (m) openDeductModal(m);
      return;
    }
    // delete member from card button (admin, not self)
    const dm = e.target.closest("[data-del-member]");
    if (dm) {
      const m = members().find((x) => x.id === dm.dataset.delMember);
      if (m) openDelete("member", m.id, m.name);
      return;
    }

    // member card tap = switch active member. Switching INTO an admin account
    // from a non-admin session requires the password gate first.
    // Computed from LIVE member roles (not the template data-attr) so it stays
    // correct even if the rendered lock badge is stale.
    const sw = e.target.closest("[data-switch]");
    if (sw) {
      const targetId = sw.dataset.switch;
      const target = members().find((x) => x.id === targetId);
      const cur = currentMember();
      const needsPw =
        target && target.role === "admin" &&
        (!cur || cur.role !== "admin") &&
        (!cur || cur.id !== targetId);
      if (needsPw) {
        if (state.modal) closeModal();
        openAdminPassword(targetId);
        return;
      }
      await api.saveState({ currentMemberId: targetId });
      if (state.modal) closeModal();
      await refresh();
      const m = currentMember();
      toast("已切换到 " + (m ? m.name : ""), "success");
      return;
    }

    const flt = e.target.closest("[data-filter]");
    if (flt) { state.tasksFilter = flt.dataset.filter; renderTasks(); return; }

    const rt = e.target.closest("[data-reward-tab]");
    if (rt) { state.rewardsTab = rt.dataset.rewardTab; renderRewards(); return; }

    const comp = e.target.closest("[data-complete]");
    if (comp && !comp.disabled) {
      const m = currentMember();
      if (!m) { toast("请先选择成员", "warn"); return; }
      const task = tasks().find((t) => t.id === comp.dataset.complete);
      comp.disabled = true;
      try {
        await api.completeTask(comp.dataset.complete, m.id);
        toast("完成「" + (task ? task.name : "") + "」 +" + (task ? task.points : 0), "success");
      } catch (err) { toast(err.message || "失败", "error"); comp.disabled = false; }
      await refresh();
      return;
    }

    const red = e.target.closest("[data-redeem]");
    if (red && !red.disabled) {
      const m = currentMember();
      if (!m) { toast("请先选择成员", "warn"); return; }
      red.disabled = true;
      try {
        const r = rewards().find((x) => x.id === red.dataset.redeem);
        await api.redeemReward(red.dataset.redeem, m.id);
        toast("兑换成功：" + (r ? r.name : ""), "success");
      } catch (err) { toast(err.message || "积分不足", "error"); red.disabled = false; }
      await refresh();
      return;
    }
  });

  // long-press delete fallback — admin-gated for tasks & members
  let pressTimer;
  document.addEventListener("touchstart", (e) => {
    // ignore presses starting on action buttons (edit/deduct/delete)
    if (e.target.closest("[data-edit-task], [data-edit-member], [data-deduct], [data-del-member]")) return;
    const task = e.target.closest(".task");
    if (task) {
      if (!canManageTasks()) return;
      const id = task.querySelector("[data-complete]")?.dataset.complete;
      const name = task.querySelector(".task__name")?.textContent;
      pressTimer = setTimeout(() => { suppressNextClick = true; if (id) openDelete("task", id, name); }, 600);
      return;
    }
    const mem = e.target.closest(".member[data-switch]");
    if (mem && state.view === "members") {
      const id = mem.dataset.switch;
      const target = members().find((m) => m.id === id);
      if (!target || !canDeleteMember(target)) return;
      const name = mem.querySelector(".member__name")?.textContent;
      pressTimer = setTimeout(() => { suppressNextClick = true; openDelete("member", id, name); }, 600);
      return;
    }
    const rew = e.target.closest(".reward");
    if (rew && state.view === "rewards") {
      const r = rewards().find((x) => x.id === rew.querySelector("[data-redeem]")?.dataset.redeem);
      if (r && r.isCustom) {
        pressTimer = setTimeout(() => { suppressNextClick = true; openDelete("reward", r.id, r.name); }, 600);
      }
    }
  }, { passive: true });
  document.addEventListener("touchend", () => clearTimeout(pressTimer));
  document.addEventListener("touchmove", () => clearTimeout(pressTimer));

  // right-click delete fallback (desktop) — admin-gated
  document.addEventListener("contextmenu", (e) => {
    if (e.target.closest("[data-edit-task], [data-edit-member], [data-deduct], [data-del-member]")) return;
    const task = e.target.closest(".task");
    if (task) {
      if (!canManageTasks()) return;
      e.preventDefault();
      const id = task.querySelector("[data-complete]")?.dataset.complete;
      const name = task.querySelector(".task__name")?.textContent;
      if (id) openDelete("task", id, name);
      return;
    }
    const mem = e.target.closest(".member[data-switch]");
    if (mem && state.view === "members") {
      const target = members().find((m) => m.id === mem.dataset.switch);
      if (!target || !canDeleteMember(target)) return;
      e.preventDefault();
      openDelete("member", mem.dataset.switch, mem.querySelector(".member__name")?.textContent);
      return;
    }
    const rew = e.target.closest(".reward");
    if (rew && state.view === "rewards") {
      const r = rewards().find((x) => x.id === rew.querySelector("[data-redeem]")?.dataset.redeem);
      if (r && r.isCustom) { e.preventDefault(); openDelete("reward", r.id, r.name); }
    }
  });

  // FAB — context-aware + permission-gated
  $("#fab").addEventListener("click", () => {
    const a = $("#fab").dataset.action;
    if (a === "task") openTaskModal();
    else if (a === "wish") openWishModal();
    else if (a === "member") openMemberModal();
  });
  // app bar user pill is display-only (switch happens via Settings).
  // app bar settings button → settings
  $("#appBarSettings").addEventListener("click", () => openSettings());

  /* ---------- refresh + boot ---------- */
  async function refresh() {
    state.db = await api.getDb();
    renderAppBar();
    renderView(state.view);
  }

  async function boot() {
    state.db = await api.getDb();
    // restore last view if valid
    if (state.db.state && VIEWS.includes(state.db.state.activeView)) {
      state.view = state.db.state.activeView;
    }
    renderAppBar();
    setView(state.view);
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
