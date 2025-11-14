const TOKEN_KEY = "emailbot-access-token";
const STATE_KEY = "emailbot-auth-state";

const qid = (id) => document.getElementById(id);

const statusEl = qid("dashboard-status");
const loginButton = qid("login-button");
const logoutButton = qid("logout-button");
const profileSection = qid("profile-section");
const guildsSection = qid("guilds-section");
const settingsSection = qid("settings-section");
const guildList = qid("guild-list");
const refreshGuildsButton = qid("refresh-guilds");
const refreshSettingsButton = qid("refresh-settings");
const settingsStatusEl = qid("settings-status");

const profileAvatar = qid("profile-avatar");
const profileUsername = qid("profile-username");
const profileId = qid("profile-id");

const notificationsField = qid("notifications-enabled");
const languageField = qid("language-select");
const timezoneField = qid("timezone-select");
const settingsForm = qid("settings-form");
const settingsGuildName = qid("settings-guild-name");
const settingsGuildId = qid("settings-guild-id");

let selectedGuildId = null;

const setStatus = (message, type = "info") => {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.dataset.state = type;
};

const setSettingsStatus = (message, type = "info") => {
  if (!settingsStatusEl) return;
  settingsStatusEl.textContent = message;
  settingsStatusEl.dataset.state = type;
};

const getToken = () => localStorage.getItem(TOKEN_KEY);
const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const handleUnauthorized = (message) => {
  clearToken();
  sessionStorage.removeItem(STATE_KEY);
  updateAuthUI(false);
  setStatus(message || "세션이 만료되었습니다. 다시 로그인해주세요.", "error");
  setSettingsStatus("", "info");
};

const fetchJSON = async (input, init = {}) => {
  const res = await fetch(input, init);
  if (!res.ok) {
    const contentType = res.headers.get("content-type");
    let message = res.statusText || "요청이 실패했습니다.";
    if (contentType && contentType.includes("application/json")) {
      const data = await res.json().catch(() => null);
      message = data?.message || message;
    }
    const error = new Error(message || "요청이 실패했습니다.");
    error.status = res.status;
    throw error;
  }
  return res.json();
};

const fetchAuthed = async (url, options = {}) => {
  const token = getToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }
  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${token}`);
  return fetchJSON(url, { ...options, headers });
};

const updateAuthUI = (authenticated) => {
  if (authenticated) {
    loginButton.hidden = true;
    logoutButton.hidden = false;
    profileSection.hidden = false;
    guildsSection.hidden = false;
  } else {
    loginButton.hidden = false;
    logoutButton.hidden = true;
    profileSection.hidden = true;
    guildsSection.hidden = true;
    settingsSection.hidden = true;
    guildList.innerHTML = "";
    selectedGuildId = null;
  }
};

const startLogin = async () => {
  try {
    setStatus("로그인 페이지로 이동 중입니다...", "info");
    const { data } = await fetchJSON("/auth/login");
    if (!data?.authorization_url || !data?.state) {
      throw new Error("로그인 정보를 받아오지 못했습니다.");
    }
    sessionStorage.setItem(STATE_KEY, data.state);
    window.location.href = data.authorization_url;
  } catch (error) {
    console.error(error);
    setStatus(error.message || "로그인 과정에서 오류가 발생했습니다.", "error");
  }
};

const handleCallback = async () => {
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state) {
    return false;
  }

  const expectedState = sessionStorage.getItem(STATE_KEY);
  if (!expectedState) {
    setStatus("세션이 만료되었습니다. 다시 로그인해주세요.", "error");
    url.searchParams.delete("code");
    url.searchParams.delete("state");
    window.history.replaceState({}, document.title, url.toString());
    return true;
  }

  if (expectedState !== state) {
    setStatus("state 값이 일치하지 않습니다. 다시 시도해주세요.", "error");
    url.searchParams.delete("code");
    url.searchParams.delete("state");
    window.history.replaceState({}, document.title, url.toString());
    return true;
  }

  try {
    setStatus("계정을 연결하는 중입니다...", "info");
    const { data } = await fetchJSON(`/auth/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`);
    if (!data?.access_token) {
      throw new Error("토큰을 받지 못했습니다.");
    }
    setToken(data.access_token);
    sessionStorage.removeItem(STATE_KEY);
    setStatus("로그인이 완료되었습니다!", "success");

    // URL 정리
    url.searchParams.delete("code");
    url.searchParams.delete("state");
    window.history.replaceState({}, document.title, url.toString());
    return true;
  } catch (error) {
    console.error(error);
    setStatus(error.message || "로그인 처리 중 오류가 발생했습니다.", "error");
    return true;
  }
};

const loadProfile = async () => {
  try {
    const { data } = await fetchAuthed("/api/me");
    profileUsername.textContent = data?.username ? `${data.username}#${data.discriminator ?? "????"}` : "-";
    profileId.textContent = data?.id ?? "-";
    if (data?.avatar_url) {
      profileAvatar.src = data.avatar_url;
    } else {
      profileAvatar.src = "https://cdn.discordapp.com/embed/avatars/0.png";
    }
    profileAvatar.alt = data?.username ? `${data.username}의 아바타` : "디스코드 아바타";
  } catch (error) {
    if (error.status === 401) {
      handleUnauthorized("세션이 만료되었습니다. 다시 로그인해주세요.");
      throw error;
    }
    setStatus(error.message || "프로필을 불러오지 못했습니다.", "error");
    throw error;
  }
};

const renderGuilds = (guilds) => {
  guildList.innerHTML = "";
  if (!guilds.length) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "guild-list__empty";
    emptyItem.textContent = "표시할 길드가 없습니다.";
    guildList.appendChild(emptyItem);
    return;
  }

  guilds.forEach((guild) => {
    const item = document.createElement("li");
    item.className = "guild-list__item";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "guild-button";
    button.dataset.guildId = guild.id;
    button.innerHTML = `
      <span class="guild-button__name">${guild.name}</span>
      <span class="guild-button__meta">${guild.owner ? "소유자" : "관리자"}</span>
    `;

    if (selectedGuildId === guild.id) {
      button.classList.add("is-active");
    }

    button.addEventListener("click", () => {
      if (selectedGuildId !== guild.id) {
        selectGuild(guild);
      }
    });

    item.appendChild(button);
    guildList.appendChild(item);
  });
};

const loadGuilds = async () => {
  try {
    setStatus("길드 정보를 불러오는 중입니다...", "info");
    const { data } = await fetchAuthed("/api/me/guilds");
    const guilds = Array.isArray(data) ? data : [];
    renderGuilds(guilds);
    setStatus("길드 정보를 불러왔습니다.", "success");
  } catch (error) {
    console.error(error);
    if (error.status === 401) {
      handleUnauthorized("세션이 만료되었습니다. 다시 로그인해주세요.");
      return;
    }
    renderGuilds([]);
    setStatus(error.message || "길드 목록을 불러오지 못했습니다.", "error");
  }
};

const applySettingsToForm = (settings) => {
  notificationsField.checked = Boolean(settings?.notifications_enabled);
  if (settings?.language) {
    languageField.value = settings.language;
  }
  if (settings?.timezone) {
    timezoneField.value = settings.timezone;
  }
};

const loadGuildSettings = async (guildId) => {
  try {
    setSettingsStatus("설정을 불러오는 중입니다...", "info");
    const { data } = await fetchAuthed(`/api/guilds/${guildId}/settings`);
    applySettingsToForm(data);
    setSettingsStatus("최신 설정을 불러왔습니다.", "success");
  } catch (error) {
    console.error(error);
    if (error.status === 401) {
      handleUnauthorized("세션이 만료되었습니다. 다시 로그인해주세요.");
      return;
    }
    setSettingsStatus(error.message || "설정을 불러오지 못했습니다.", "error");
  }
};

const selectGuild = (guild) => {
  selectedGuildId = guild.id;
  settingsGuildName.textContent = guild.name;
  settingsGuildId.textContent = `Guild ID: ${guild.id}`;
  settingsSection.hidden = false;

  Array.from(document.querySelectorAll(".guild-button")).forEach((button) => {
    if (button.dataset.guildId === guild.id) {
      button.classList.add("is-active");
    } else {
      button.classList.remove("is-active");
    }
  });

  loadGuildSettings(guild.id);
};

const submitSettings = async (event) => {
  event.preventDefault();
  if (!selectedGuildId) {
    return;
  }

  const payload = {
    notifications_enabled: notificationsField.checked,
    language: languageField.value,
    timezone: timezoneField.value,
  };

  try {
    setSettingsStatus("설정을 저장하는 중입니다...", "info");
    const { data } = await fetchAuthed(`/api/guilds/${selectedGuildId}/settings`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    applySettingsToForm(data);
    setSettingsStatus("설정을 저장했습니다.", "success");
  } catch (error) {
    console.error(error);
    if (error.status === 401) {
      handleUnauthorized("세션이 만료되었습니다. 다시 로그인해주세요.");
      return;
    }
    setSettingsStatus(error.message || "설정을 저장하지 못했습니다.", "error");
  }
};

const handleLogout = () => {
  clearToken();
  sessionStorage.removeItem(STATE_KEY);
  updateAuthUI(false);
  setStatus("로그아웃되었습니다.", "info");
};

const init = async () => {
  loginButton?.addEventListener("click", startLogin);
  logoutButton?.addEventListener("click", handleLogout);
  refreshGuildsButton?.addEventListener("click", loadGuilds);
  refreshSettingsButton?.addEventListener("click", () => {
    if (selectedGuildId) {
      loadGuildSettings(selectedGuildId);
    }
  });
  settingsForm?.addEventListener("submit", submitSettings);

  const callbackHandled = await handleCallback();
  const token = getToken();
  const authenticated = Boolean(token);
  updateAuthUI(authenticated);

  if (!authenticated) {
    if (!callbackHandled) {
      setStatus("디스코드로 로그인하면 길드 설정을 관리할 수 있습니다.", "info");
    }
    return;
  }

  try {
    await loadProfile();
    await loadGuilds();
  } catch (error) {
    console.error(error);
  }
};

document.addEventListener("DOMContentLoaded", init);
