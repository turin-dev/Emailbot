const THEME_KEY = "emailbot-theme";

const getPreferredTheme = () => {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const applyTheme = (theme) => {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
};

const renderLayout = () => {
  const header = document.createElement("header");
  header.innerHTML = `
    <div class="header-inner">
      <a class="brand" href="index.html">E-mail</a>
      <nav aria-label="주요 링크">
        <a href="index.html">홈</a>
        <a href="status.html">서비스 상태</a>
        <a href="helpserver.html">지원 서버</a>
        <a href="privacy.html">개인정보처리방침</a>
        <a href="terms.html">이용약관</a>
      </nav>
      <button class="theme-toggle" type="button" aria-label="테마 전환">
        <span aria-hidden="true">🌞</span>
        <span class="toggle-text">라이트 모드</span>
      </button>
    </div>
  `;

  const footer = document.createElement("footer");
  footer.innerHTML = `
    <div class="footer-inner">
      <p>© ${new Date().getFullYear()} <a>team 마시멜로</a> 모든 권리 소유</p>
      <p>
        문제나 아이디어가 있다면 언제든지 <a href="https://discord.gg/FRCVnR3Vtk">디스코드 서버</a>로 알려주세요.
      </p>
    </div>
  `;

  document.body.prepend(header);
  document.body.append(footer);

  return header.querySelector(".theme-toggle");
};

const syncToggleLabel = (button, theme) => {
  const icon = theme === "dark" ? "🌙" : "🌞";
  const label = theme === "dark" ? "다크 모드" : "라이트 모드";
  button.querySelector("span[aria-hidden='true']").textContent = icon;
  button.querySelector(".toggle-text").textContent = label;
  button.setAttribute("aria-label", `${label} 사용 중 · 테마 전환`);
};

document.addEventListener("DOMContentLoaded", () => {
  const theme = getPreferredTheme();
  applyTheme(theme);
  const toggleButton = renderLayout();
  syncToggleLabel(toggleButton, theme);

  toggleButton.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "light" ? "dark" : "light";
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
    syncToggleLabel(toggleButton, next);
  });
});
