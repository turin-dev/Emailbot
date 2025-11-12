const STATUS_API_URL = "https://mailbot.up.railway.app/api/status";
const REQUEST_TIMEOUT = 8000;

const indicator = () => document.getElementById("status-indicator");
const summaryEl = () => document.getElementById("status-summary");
const updatedAtEl = () => document.getElementById("status-updated-at");
const startedAtEl = () => document.getElementById("status-started-at");
const uptimeEl = () => document.getElementById("status-uptime");
const latencyEl = () => document.getElementById("status-latency");
const alertEl = () => document.getElementById("status-alert");

const chipEls = {
  database: () => document.getElementById("database-chip"),
  bot: () => document.getElementById("bot-chip"),
  system: () => document.getElementById("system-chip"),
};

const textEls = {
  databaseStatus: () => document.getElementById("database-status"),
  databaseLatency: () => document.getElementById("database-latency"),
  databaseNote: () => document.getElementById("database-note"),
  botReady: () => document.getElementById("bot-ready"),
  botConnected: () => document.getElementById("bot-connected"),
  botGuilds: () => document.getElementById("bot-guilds"),
  botCommands: () => document.getElementById("bot-commands"),
  botCogs: () => document.getElementById("bot-cogs"),
  botMembers: () => document.getElementById("bot-members"),
  botUser: () => document.getElementById("bot-user"),
  systemPlatform: () => document.getElementById("system-platform"),
  systemRelease: () => document.getElementById("system-release"),
  systemLoad: () => document.getElementById("system-load"),
  systemMemory: () => document.getElementById("system-memory"),
  versionPython: () => document.getElementById("version-python"),
  versionDiscord: () => document.getElementById("version-discord"),
};

const setIndicator = (state) => {
  const el = indicator();
  if (!el) return;
  const states = ["loading", "online", "degraded", "offline"];
  states.forEach((name) => el.classList.remove(`status-indicator--${name}`));
  el.classList.add(`status-indicator--${state}`);

  const textMap = {
    loading: "확인 중",
    online: "온라인",
    degraded: "주의 필요",
    offline: "오프라인",
  };
  el.textContent = textMap[state] || textMap.loading;
  el.setAttribute("data-state", state);
};

const setChipState = (chip, state) => {
  if (!chip) return;
  chip.classList.remove("status-chip--success", "status-chip--warning", "status-chip--danger");
  const labelMap = {
    success: { label: "정상", className: "status-chip--success" },
    warning: { label: "확인 필요", className: "status-chip--warning" },
    danger: { label: "오프라인", className: "status-chip--danger" },
    idle: { label: "대기 중", className: "" },
  };
  const next = labelMap[state] || labelMap.idle;
  if (next.className) {
    chip.classList.add(next.className);
  }
  chip.textContent = next.label;
};

const setTextContent = (el, value) => {
  if (!el) return;
  el.textContent = value ?? "-";
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

const renderAlert = (message, variant = "warning") => {
  const el = alertEl();
  if (!el) return;
  if (!message) {
    el.hidden = true;
    el.textContent = "";
    el.removeAttribute("data-variant");
    return;
  }
  el.hidden = false;
  el.textContent = message;
  if (variant === "danger") {
    el.setAttribute("data-variant", "danger");
  } else {
    el.removeAttribute("data-variant");
  }
};

const determineOverallState = (data) => {
  if (!data) return { state: "offline", summary: "서비스 상태를 확인할 수 없습니다." };
  const botReady = data.bot?.ready;
  const botConnected = data.bot?.connected;
  const dbHealthy = data.database?.status === "연결됨";
  const allHealthy = botReady && botConnected && dbHealthy;
  if (allHealthy) {
    return { state: "online", summary: "모든 구성 요소가 정상적으로 동작하고 있습니다." };
  }
  const issues = [];
  if (!botReady) issues.push("봇이 아직 준비되지 않았습니다.");
  if (!botConnected) issues.push("디스코드 연결 상태를 확인하세요.");
  if (!dbHealthy) issues.push("데이터베이스 연결을 확인하세요.");
  return {
    state: "degraded",
    summary: issues.length ? issues.join(" ") : "일부 구성 요소가 점검 중일 수 있습니다.",
  };
};

const renderStatus = (payload) => {
  if (!payload || payload.status !== "ok") {
    handleOffline("상태 정보를 불러오지 못했습니다.");
    return;
  }

  const data = payload.data || {};
  const { state, summary } = determineOverallState(data);
  setIndicator(state);
  setTextContent(summaryEl(), summary);

  renderAlert(state === "degraded" ? summary : "");

  setTextContent(updatedAtEl(), formatDate(data.timestamp));
  setTextContent(startedAtEl(), formatDate(data.started_at));
  setTextContent(uptimeEl(), data.uptime?.human || `${data.uptime?.seconds ?? "-"} 초`);
  setTextContent(latencyEl(), data.latency?.websocket_text || `${data.latency?.websocket_ms?.toFixed?.(2) ?? "-"} ms`);

  const dbChip = chipEls.database();
  if (data.database) {
    const dbStatus = data.database.status;
    const dbState = dbStatus === "연결됨" ? "success" : dbStatus ? "warning" : "idle";
    setChipState(dbChip, dbState);
    setTextContent(textEls.databaseStatus(), dbStatus || "-");
    setTextContent(textEls.databaseLatency(), data.database.latency_text || "-");
    setTextContent(textEls.databaseNote(), data.database.note || "");
  } else {
    setChipState(dbChip, "idle");
  }

  const botChip = chipEls.bot();
  if (data.bot) {
    const botHealthy = data.bot.ready && data.bot.connected;
    setChipState(botChip, botHealthy ? "success" : "warning");
    setTextContent(textEls.botReady(), data.bot.ready ? "준비됨" : "대기 중");
    setTextContent(textEls.botConnected(), data.bot.connected ? "연결됨" : "연결 끊김");
    setTextContent(textEls.botGuilds(), data.bot.guild_count ?? "-");
    setTextContent(textEls.botCommands(), data.bot.command_count ?? "-");
    setTextContent(textEls.botCogs(), data.bot.cog_count ?? "-");
    setTextContent(textEls.botMembers(), data.bot.member_count ?? "-");
    const user = data.bot.user;
    setTextContent(
      textEls.botUser(),
      user ? `${user.display_name || user.username} (${user.id})` : "-"
    );
  } else {
    setChipState(botChip, "idle");
  }

  const systemChip = chipEls.system();
  if (data.system) {
    setChipState(systemChip, "success");
    setTextContent(textEls.systemPlatform(), data.system.platform || "-");
    setTextContent(textEls.systemRelease(), data.system.platform_release || "-");
    const load = data.system.load_average_text || (Array.isArray(data.system.load_average) ? data.system.load_average.join(" / ") : "-");
    setTextContent(textEls.systemLoad(), load);
    setTextContent(textEls.systemMemory(), data.system.process_memory_text || "-");
  } else {
    setChipState(systemChip, "idle");
  }

  if (data.versions) {
    setTextContent(textEls.versionPython(), data.versions.python || "-");
    setTextContent(textEls.versionDiscord(), data.versions.discord_py || "-");
  }
};

const handleOffline = (message) => {
  setIndicator("offline");
  setTextContent(summaryEl(), message || "서비스 상태를 확인할 수 없습니다.");
  renderAlert(message || "서비스 상태 확인에 실패했습니다. 다시 시도해주세요.", "danger");
  setTextContent(updatedAtEl(), "-");
  setTextContent(startedAtEl(), "-");
  setTextContent(uptimeEl(), "-");
  setTextContent(latencyEl(), "-");

  setChipState(chipEls.database(), "danger");
  setChipState(chipEls.bot(), "danger");
  setChipState(chipEls.system(), "danger");

  setTextContent(textEls.databaseStatus(), "확인 불가");
  setTextContent(textEls.databaseLatency(), "-");
  setTextContent(textEls.databaseNote(), "상태 정보를 확인할 수 없습니다.");
  setTextContent(textEls.botReady(), "확인 불가");
  setTextContent(textEls.botConnected(), "확인 불가");
  setTextContent(textEls.botGuilds(), "-");
  setTextContent(textEls.botCommands(), "-");
  setTextContent(textEls.botCogs(), "-");
  setTextContent(textEls.botMembers(), "-");
  setTextContent(textEls.botUser(), "-");
  setTextContent(textEls.systemPlatform(), "-");
  setTextContent(textEls.systemRelease(), "-");
  setTextContent(textEls.systemLoad(), "-");
  setTextContent(textEls.systemMemory(), "-");
  setTextContent(textEls.versionPython(), "-");
  setTextContent(textEls.versionDiscord(), "-");
};

const fetchWithTimeout = (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  const opts = { ...options, signal: controller.signal };
  return fetch(url, opts)
    .finally(() => clearTimeout(timeoutId));
};

const loadStatus = async () => {
  setIndicator("loading");
  renderAlert("상태를 확인하는 중입니다.");
  try {
    const response = await fetchWithTimeout(STATUS_API_URL, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`요청 실패: ${response.status}`);
    }
    const payload = await response.json();
    renderStatus(payload);
    renderAlert("");
  } catch (error) {
    const reason = error?.name === "AbortError" ? "요청 시간이 초과되었습니다." : "상태 정보를 불러오는 중 오류가 발생했습니다.";
    handleOffline(reason);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const reloadButton = document.getElementById("status-reload");
  if (reloadButton) {
    reloadButton.addEventListener("click", () => {
      loadStatus();
    });
  }
  loadStatus();
});
