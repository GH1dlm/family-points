/* =========================================================================
 * api.js — localStorage-backed data layer (stubbed API)
 *
 * Principle: every read/write goes through these async functions. The shapes
 * match a future REST API; later you can swap the body for `fetch(...)` and the
 * UI stays unchanged. Each function carries a `// TODO: replace` marker + its
 * intended HTTP method/path so a backend handoff can extract a contract.
 * ========================================================================= */

const STORE_KEY = "family-points-v1";

// --- internal helpers ------------------------------------------------------

function delay(ms = 120) {
  // simulate network latency so loading states are visible in the demo
  return new Promise((res) => setTimeout(res, ms));
}

function read() {
  const raw = localStorage.getItem(STORE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function write(db) {
  localStorage.setItem(STORE_KEY, JSON.stringify(db));
}

function uid(prefix) {
  return prefix + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// v1 → v2 migration: ensure every member has a `role` field.
// "妈妈"/"Mom" → admin; if none is admin, promote the first member.
function migrate(db) {
  let changed = false;
  if (db.members) {
    db.members.forEach((m) => {
      if (!m.role) {
        m.role =
          m.name === "妈妈" || m.name === "Mom" || m.name === "mom"
            ? "admin"
            : "member";
        changed = true;
      }
    });
    if (!db.members.some((m) => m.role === "admin") && db.members.length) {
      // no admin at all — prefer a "妈妈"-named member, else the first
      const mom = db.members.find((m) =>
        m.name === "妈妈" || m.name === "Mom" || m.name === "mom");
      (mom || db.members[0]).role = "admin";
      changed = true;
    }
  }
  return changed;
}

function ensureSeed() {
  // seed from mock.js on first run only
  let db = read();
  let fresh = false;
  if (!db) {
    db = JSON.parse(JSON.stringify(window.__SEED__));
    fresh = true;
  }
  const changed = migrate(db);
  if (fresh || changed) write(db); // persist migration / seed
  return db;
}

// --- public API (async, shape = future REST) -------------------------------

const api = {
  /**
   * GET /db  — full dump (this client keeps everything in one localStorage doc)
   * TODO: replace with fetch('/api/db'); in a real backend split into resources.
   */
  async getDb() {
    await delay(60);
    return ensureSeed();
  },

  /**
   * PUT /state  — persist app-level state (current member, active view)
   * TODO: replace with fetch('/api/state', { method: 'PUT', body })
   */
  async saveState(partial) {
    await delay(40);
    const db = ensureSeed();
    db.state = { ...db.state, ...partial };
    write(db);
    return db.state;
  },

  /**
   * POST /members
   * TODO: replace with fetch('/api/members', { method: 'POST', body })
   */
  async addMember({ name, avatarClass, emoji, role }) {
    await delay(120);
    const db = ensureSeed();
    // Auto-promote a "妈妈"-named member to admin so the family always has
    // a manageable admin (matches the user's mental model). An explicit role
    // passed from the edit modal still wins.
    const isAdminName = name === "妈妈" || name === "Mom" || name === "mom";
    const m = {
      id: uid("m"),
      name,
      avatarClass,
      emoji,
      role: role || (isAdminName ? "admin" : "member"),
      points: 0,
      createdAt: Date.now(),
    };
    db.members.push(m);
    write(db);
    return m;
  },

  /**
   * PUT /members/:id  — edit nickname / avatar / role
   * TODO: replace with fetch(`/api/members/${id}`, { method:'PUT', body })
   */
  async updateMember(id, { name, avatarClass, emoji, role }) {
    await delay(120);
    const db = ensureSeed();
    const m = db.members.find((x) => x.id === id);
    if (!m) throw new Error("member not found");
    if (name !== undefined) m.name = name;
    if (avatarClass !== undefined) m.avatarClass = avatarClass;
    if (emoji !== undefined) m.emoji = emoji;
    if (role !== undefined) m.role = role;
    write(db);
    return m;
  },

  /**
   * DELETE /members/:id  (also deletes that member's activities)
   * Guards: can't delete the last member; can't delete the currently-active
   * member (switch first). TODO: replace with fetch(`/api/members/${id}`, { method:'DELETE' })
   */
  async deleteMember(id) {
    await delay(100);
    const db = ensureSeed();
    if (db.members.length <= 1) throw new Error("至少保留一位家庭成员");
    if (id === db.state.currentMemberId) throw new Error("不能删除当前登录的成员，请先切换");
    // never leave the family without an admin
    const remaining = db.members.filter((m) => m.id !== id);
    if (!remaining.some((m) => m.role === "admin")) remaining[0].role = "admin";
    db.members = remaining;
    db.activities = db.activities.filter((a) => a.memberId !== id);
    if (db.state.currentMemberId === id) {
      db.state.currentMemberId = db.members[0] ? db.members[0].id : null;
    }
    write(db);
    return db;
  },

  /**
   * POST /tasks
   * TODO: replace with fetch('/api/tasks', { method: 'POST', body })
   */
  async addTask({ name, typeId, points, frequency, assignedMemberIds }) {
    await delay(120);
    const db = ensureSeed();
    const t = {
      id: uid("t"),
      name,
      typeId,
      points: Number(points) || 0,
      frequency: frequency || "once",
      // assignedMemberIds: array of member ids, or null/empty = everyone
      assignedMemberIds: Array.isArray(assignedMemberIds) && assignedMemberIds.length
        ? assignedMemberIds.slice()
        : null,
      createdAt: Date.now(),
    };
    db.tasks.push(t);
    write(db);
    return t;
  },

  /**
   * DELETE /tasks/:id
   * TODO: replace with fetch(`/api/tasks/${id}`, { method: 'DELETE' })
   */
  async deleteTask(id) {
    await delay(100);
    const db = ensureSeed();
    db.tasks = db.tasks.filter((t) => t.id !== id);
    write(db);
    return db;
  },

  /**
   * PUT /tasks/:id  — edit task name/type/points/frequency
   * TODO: replace with fetch(`/api/tasks/${id}`, { method:'PUT', body })
   */
  async updateTask(id, { name, typeId, points, frequency, assignedMemberIds }) {
    await delay(120);
    const db = ensureSeed();
    const t = db.tasks.find((x) => x.id === id);
    if (!t) throw new Error("task not found");
    if (name !== undefined) t.name = name;
    if (typeId !== undefined) t.typeId = typeId;
    if (points !== undefined) t.points = Number(points) || 0;
    if (frequency !== undefined) t.frequency = frequency;
    if (assignedMemberIds !== undefined) {
      t.assignedMemberIds = Array.isArray(assignedMemberIds) && assignedMemberIds.length
        ? assignedMemberIds.slice()
        : null;
    }
    write(db);
    return t;
  },

  /**
   * POST /members/:id/deduct — admin penalizes a member, spending points.
   * Records a "deduct" activity with negative points. Balance may go negative
   * (a debt) so the full penalty is always applied.
   * TODO: replace with fetch(`/api/members/${memberId}/deduct`, { method:'POST', body:{points,reason} })
   */
  async deductPoints(memberId, points, reason) {
    await delay(160);
    const db = ensureSeed();
    const m = db.members.find((x) => x.id === memberId);
    if (!m) throw new Error("member not found");
    const amt = Math.max(1, Number(points) || 0);
    m.points = (m.points || 0) - amt;
    const act = {
      id: uid("a"),
      type: "deduct",
      memberId,
      refId: null,
      refName: reason && reason.trim() ? reason.trim() : "扣分",
      points: -amt,
      ts: Date.now(),
    };
    db.activities.unshift(act);
    write(db);
    return { member: m, activity: act };
  },

  /**
   * POST /tasks/:id/complete  — member completes a task, earns points
   * TODO: replace with fetch(`/api/tasks/${taskId}/complete`, { method:'POST', body:{memberId} })
   * Records an activity +adjusts member points. Returns updated member + activity.
   */
  async completeTask(taskId, memberId) {
    await delay(140);
    const db = ensureSeed();
    const task = db.tasks.find((t) => t.id === taskId);
    const member = db.members.find((m) => m.id === memberId);
    if (!task || !member) throw new Error("task or member not found");
    // Gate: if the task is assigned to specific members, only those
    // members (or an admin) may complete it.
    if (Array.isArray(task.assignedMemberIds) && task.assignedMemberIds.length) {
      if (!task.assignedMemberIds.includes(memberId)) {
        throw new Error("这个任务没有指派给你");
      }
    }
    member.points = (member.points || 0) + task.points;
    const act = {
      id: uid("a"),
      type: "earn",
      memberId,
      refId: task.id,
      refName: task.name,
      typeId: task.typeId,
      points: task.points,
      ts: Date.now(),
    };
    db.activities.unshift(act);
    write(db);
    return { member, activity: act };
  },

  /**
   * POST /rewards            — add a custom wish
   * TODO: replace with fetch('/api/rewards', { method:'POST', body })
   */
  async addReward({ name, points, description, emoji }) {
    await delay(120);
    const db = ensureSeed();
    const r = {
      id: uid("r"),
      name,
      points: Number(points) || 0,
      description: description || "",
      emoji: emoji || "🎁",
      isCustom: true,
    };
    db.rewards.push(r);
    write(db);
    return r;
  },

  /**
   * DELETE /rewards/:id  — only custom rewards may be deleted
   * TODO: replace with fetch(`/api/rewards/${id}`, { method:'DELETE' })
   */
  async deleteReward(id) {
    await delay(100);
    const db = ensureSeed();
    db.rewards = db.rewards.filter((r) => r.id !== id);
    write(db);
    return db;
  },

  /**
   * PUT /rewards/:id  — edit a reward (admin). System rewards may be tweaked
   * (e.g. adjust cost); customs fully editable.
   * TODO: replace with fetch(`/api/rewards/${id}`, { method:'PUT', body })
   */
  async updateReward(id, { name, points, description, emoji }) {
    await delay(120);
    const db = ensureSeed();
    const r = db.rewards.find((x) => x.id === id);
    if (!r) throw new Error("reward not found");
    if (name !== undefined) r.name = name;
    if (points !== undefined) r.points = Number(points) || 0;
    if (description !== undefined) r.description = description;
    if (emoji !== undefined) r.emoji = emoji;
    write(db);
    return r;
  },

  /**
   * POST /rewards/:id/redeem — member redeems a reward, spends points
   * TODO: replace with fetch(`/api/rewards/${id}/redeem`, { method:'POST', body:{memberId} })
   * Validates the balance; throws if insufficient.
   */
  async redeemReward(rewardId, memberId) {
    await delay(160);
    const db = ensureSeed();
    const reward = db.rewards.find((r) => r.id === rewardId);
    const member = db.members.find((m) => m.id === memberId);
    if (!reward || !member) throw new Error("reward or member not found");
    if (member.points < reward.points) {
      throw new Error("积分不足");
    }
    member.points -= reward.points;
    const act = {
      id: uid("a"),
      type: "redeem",
      memberId,
      refId: reward.id,
      refName: reward.name,
      points: -reward.points,
      ts: Date.now(),
    };
    db.activities.unshift(act);
    write(db);
    return { member, activity: act };
  },

  // hard reset — wipe everything and re-seed (admin "clear all data")
  async reset() {
    await delay(80);
    localStorage.removeItem(STORE_KEY);
    return ensureSeed();
  },

  /**
   * POST /admin/clear-all  — wipe members' points + all activity history;
   * keep members/tasks/rewards catalog intact (so the family setup persists).
   * Returns the cleaned db. TODO: replace with fetch('/api/admin/clear-all', { method:'POST' })
   */
  async clearAllData() {
    await delay(160);
    const db = ensureSeed();
    db.members.forEach((m) => { m.points = 0; });
    db.activities = [];
    write(db);
    return db;
  },

  /**
   * 导出全部数据为 JSON 字符串（用于备份恢复）。
   * 任何成员都可以导出（只读，不改数据）。
   */
  async exportData() {
    const db = ensureSeed();
    return JSON.stringify({
      app: "family-points",
      version: 1,
      exportedAt: new Date().toISOString(),
      data: db,
    }, null, 2);
  },

  /**
   * 从备份 JSON 恢复数据（覆盖当前数据）。
   * 做基本格式校验，校验失败抛错。
   */
  async importData(jsonStr) {
    await delay(120);
    let parsed;
    try {
      parsed = typeof jsonStr === "string" ? JSON.parse(jsonStr) : jsonStr;
    } catch {
      throw new Error("文件格式错误，不是有效的 JSON");
    }
    const db = parsed && parsed.data ? parsed.data : parsed;
    if (!db || !Array.isArray(db.members) || !Array.isArray(db.tasks)) {
      throw new Error("备份文件数据不完整");
    }
    if (!db.state) {
      db.state = { currentMemberId: (db.members[0] && db.members[0].id) || null };
    }
    if (!Array.isArray(db.activities)) db.activities = [];
    if (!Array.isArray(db.rewards)) db.rewards = [];
    write(db);
    return db;
  },
};

window.__api__ = api;
