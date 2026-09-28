/* =========================================================================
 * mock.js — seed/default data (single source of data; loaded on first run)
 * After first run the app persists everything to localStorage via api.js.
 * Schema frozen in design-contract.md.
 * ========================================================================= */

// Fixed catalog of task types. Stored once; pages read from here.
const TASK_TYPES = [
  { id: "chore",  name: "家务", color: "#5ba8e5", soft: "#e3f0fb", icon: "broom" },
  { id: "study",  name: "学习", color: "#9b6fe0", soft: "#eee4fa", icon: "book" },
  { id: "sport",  name: "运动", color: "#4caf7a", soft: "#e2f3ea", icon: "dumbbell" },
  { id: "habit",  name: "习惯", color: "#f5a623", soft: "#fdeecb", icon: "sun" },
  { id: "other",  name: "其他", color: "#8a7b6a", soft: "#efe9e2", icon: "sparkles" },
];

// Avatar presets (color class + emoji). Used when adding members.
const AVATAR_PRESETS = [
  { class: "av-1", emoji: "🐻" },
  { class: "av-2", emoji: "🐰" },
  { class: "av-3", emoji: "🦊" },
  { class: "av-4", emoji: "🐼" },
  { class: "av-5", emoji: "🐯" },
  { class: "av-6", emoji: "🦁" },
  { class: "av-7", emoji: "🐸" },
  { class: "av-8", emoji: "🐵" },
];

// System-default rewards (isCustom: false). Users can redeem these directly,
// and can also add their own custom wishes (isCustom: true).
const SYSTEM_REWARDS = [
  { id: "sys-1", name: "看一集动画片", points: 30, isCustom: false, emoji: "📺", description: "享受 30 分钟的动画片时间" },
  { id: "sys-2", name: "吃一次零食",   points: 20, isCustom: false, emoji: "🍪", description: "选择自己喜欢的一份小零食" },
  { id: "sys-3", name: "玩 30 分钟游戏", points: 50, isCustom: false, emoji: "🎮", description: "电子游戏半小时，开心一下" },
  { id: "sys-4", name: "周末晚睡 1 小时", points: 40, isCustom: false, emoji: "🌙", description: "周末当晚睡小达人" },
  { id: "sys-5", name: "选一顿晚餐菜单", points: 60, isCustom: false, emoji: "🍽️", description: "今天的晚餐由你来决定" },
  { id: "sys-6", name: "去公园玩",     points: 80, isCustom: false, emoji: "🏞️", description: "全家一起去公园玩耍" },
  { id: "sys-7", name: "买一本新书",   points: 100, isCustom: false, emoji: "📚", description: "挑一本自己喜欢的新书" },
  { id: "sys-8", name: "家庭电影之夜", points: 120, isCustom: false, emoji: "🎬", description: "全家一起看一部电影" },
];

// Seed members (a typical small family). role: "admin" can manage members
// and tasks; "妈妈" is the family admin by default. Users can add/remove.
const SEED_MEMBERS = [
  { id: "m-1", name: "爸爸", avatarClass: "av-1", emoji: "🐻", role: "member", points: 0, createdAt: 0 },
  { id: "m-2", name: "妈妈", avatarClass: "av-2", emoji: "🐰", role: "admin",  points: 0, createdAt: 0 },
  { id: "m-3", name: "小宝", avatarClass: "av-3", emoji: "🦊", role: "member", points: 0, createdAt: 0 },
];

// Seed tasks (a starter set across all 5 categories).
const SEED_TASKS = [
  { id: "t-1", name: "整理自己的房间", typeId: "chore",  points: 5,  frequency: "daily",  createdAt: 0 },
  { id: "t-2", name: "饭后擦桌子",     typeId: "chore",  points: 3,  frequency: "daily",  createdAt: 0 },
  { id: "t-3", name: "倒垃圾",         typeId: "chore",  points: 2,  frequency: "daily",  createdAt: 0 },
  { id: "t-4", name: "阅读 20 分钟",    typeId: "study",  points: 6,  frequency: "daily",  createdAt: 0 },
  { id: "t-5", name: "完成作业",       typeId: "study",  points: 10, frequency: "daily",  createdAt: 0 },
  { id: "t-6", name: "练习口算 10 道",  typeId: "study",  points: 4,  frequency: "daily",  createdAt: 0 },
  { id: "t-7", name: "跳绳 100 下",     typeId: "sport",  points: 8,  frequency: "daily",  createdAt: 0 },
  { id: "t-8", name: "户外运动 30 分钟", typeId: "sport",  points: 12, frequency: "daily",  createdAt: 0 },
  { id: "t-9", name: "早起不赖床",     typeId: "habit",  points: 5,  frequency: "daily",  createdAt: 0 },
  { id: "t-10", name: "按时上床睡觉",   typeId: "habit",  points: 5,  frequency: "daily",  createdAt: 0 },
  { id: "t-11", name: "饭前洗手",      typeId: "habit",  points: 2,  frequency: "daily",  createdAt: 0 },
  { id: "t-12", name: "整理书桌",      typeId: "chore",  points: 4,  frequency: "weekly", createdAt: 0 },
  { id: "t-13", name: "大扫除",        typeId: "chore",  points: 15, frequency: "weekly", createdAt: 0 },
];

// The full seed object. api.js merges this into localStorage on first run.
const SEED = {
  members: SEED_MEMBERS,
  taskTypes: TASK_TYPES,
  tasks: SEED_TASKS,
  rewards: SYSTEM_REWARDS,        // only system ones seed here; customs added later
  activities: [],                  // starts empty — fills as the family uses the app
  state: { currentMemberId: "m-1", activeView: "home" },
};

// Expose globally for api.js (no modules — pure static, double-click-openable).
window.__SEED__ = SEED;
window.__AVATAR_PRESETS__ = AVATAR_PRESETS;
