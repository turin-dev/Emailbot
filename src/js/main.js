document.addEventListener("DOMContentLoaded", () => {
  const header = `
    <header>
      <h1><a href="/">E-mail</a></h1>
      <nav>
        <a href="/">홈</a> |
        <a href="/privacy.html">개인정보처리방침</a> |
        <a href="/terms.html">서비스 약관</a>
      </nav>
    </header>
  `;
  const footer = `
    <footer>
      <p>ⓒ 2025 E-mail. 모두의 메일을 지키는 요정 💌</p>
    </footer>
  `;
  document.body.insertAdjacentHTML("afterbegin", header);
  document.body.insertAdjacentHTML("beforeend", footer);
});
