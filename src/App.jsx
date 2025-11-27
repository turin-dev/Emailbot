import React from "react";

const features = [
  {
    icon: "📨",
    title: "실시간 이메일 알림",
    text: "새로운 메일이 도착하면 몇 초 안에 디스코드에서 바로 알림을 받아요.",
  },
  {
    icon: "🔒",
    title: "안전한 토큰 저장",
    text: "OAuth 토큰은 암호화되어 보관되며 언제든지 손쉽게 해제할 수 있어요.",
  },
  {
    icon: "📩",
    title: "DM·비공개 채널 전송",
    text: "개인 DM 또는 지정한 비공개 채널로만 알림을 보내 안전하게 확인합니다.",
  },
  {
    icon: "⚡",
    title: "간단한 설정",
    text: "봇 초대 후 몇 번의 클릭으로 이메일 계정을 연동할 수 있어요.",
  },
];

const steps = [
  {
    title: "디스코드에서 봇 초대",
    description: "봇 초대 링크로 서버에 추가하거나 DM으로 초대해 주세요.",
  },
  {
    title: "이메일 계정 OAuth로 연동",
    description: "안내에 따라 로그인하고 필요한 권한만 선택해 승인합니다.",
  },
  {
    title: "토큰 암호화 후 안전하게 보관",
    description: "수집된 토큰은 강력한 암호화로 저장되어 외부에 노출되지 않습니다.",
  },
  {
    title: "새 메일이 오면 디스코드로 즉시 알림",
    description: "실시간 감지 후 제목, 보낸 사람, 요약을 깔끔한 카드로 보내드려요.",
  },
];

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="logo">E-mail</div>
        <nav className="nav">
          <a href="#intro">소개</a>
          <a href="#features">기능</a>
          <a href="#how">어떻게 동작하나요</a>
          <a href="#terms">이용약관</a>
          <a href="#privacy">개인정보처리방침</a>
          <a className="small-btn ghost" href="https://discord.gg/support" target="_blank" rel="noreferrer">
            지원 서버
          </a>
          <a
            className="small-btn"
            href="https://discord.com/oauth2/authorize?client_id=YOUR_BOT_ID&scope=bot"
            target="_blank"
            rel="noreferrer"
          >
            봇 초대
          </a>
        </nav>
      </header>

      <main>
        <section id="intro" className="hero">
          <div className="hero-inner">
            <p className="pill">디스코드 이메일 알림 봇</p>
            <h1>이메일을 디스코드에서 바로 확인하세요</h1>
            <p className="subtitle">
              E-mail은 새 메일을 놓치지 않도록 디스코드에서 실시간으로 알려주는 깔끔한 알림 봇입니다.
            </p>
            <div className="cta-group">
              <a className="btn primary" href="https://discord.gg/support" target="_blank" rel="noreferrer">
                지원 서버 입장하기
              </a>
              <a
                className="btn secondary"
                href="https://discord.com/oauth2/authorize?client_id=YOUR_BOT_ID&scope=bot"
                target="_blank"
                rel="noreferrer"
              >
                봇 초대하기
              </a>
            </div>
            <ul className="hero-bullets">
              <li>• 실시간 알림</li>
              <li>• 디스코드 DM/비공개 채널 알림</li>
              <li>• 간단한 OAuth 연동</li>
            </ul>
          </div>
        </section>

        <section id="features" className="section">
          <div className="section-header">
            <h2>기능</h2>
            <p>메일 확인부터 알림 전달까지, 필요한 모든 것을 간단히 제공해요.</p>
          </div>
          <div className="grid">
            {features.map((item) => (
              <div className="card" key={item.title}>
                <div className="icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how" className="section">
          <div className="section-header">
            <h2>어떻게 동작하나요?</h2>
            <p>4단계로 끝나는 간단한 연동 과정을 안내합니다.</p>
          </div>
          <div className="steps">
            {steps.map((step, index) => (
              <div className="step" key={step.title}>
                <div className="step-number">{index + 1}</div>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="terms" className="section legal">
          <div className="section-header">
            <h2>이용약관</h2>
            <p>E-mail 서비스 이용에 앞서 아래 약관을 확인해 주세요.</p>
          </div>
          <div className="legal-block">
            <h3>서비스 소개</h3>
            <p>
              E-mail은 사용자가 연동한 이메일 계정의 신규 메일 정보를 디스코드 봇을 통해 전달하는 알림 서비스입니다.
              사용자는 봇 초대와 계정 연동을 통해 디스코드 내에서 편리하게 알림을 받을 수 있습니다.
            </p>
          </div>
          <div className="legal-block">
            <h3>서비스 제공 범위 및 보증 부인</h3>
            <p>
              본 서비스는 알림 전달을 위해 합리적인 노력을 기울이지만, 모든 메일에 대한 즉시 알림을 보증하지 않습니다.
              네트워크 환경, 이메일 제공사의 정책, 디스코드의 상태 등에 따라 전달이 지연되거나 누락될 수 있습니다.
            </p>
          </div>
          <div className="legal-block">
            <h3>이용자의 책임</h3>
            <p>
              이용자는 자신의 디스코드 계정 및 이메일 계정 보안을 유지해야 하며, 타인의 권리를 침해하는 방식으로 서비스를
              이용해서는 안 됩니다. 또한 계정 연동 및 알림 수신 설정을 주기적으로 확인하는 책임이 있습니다.
            </p>
          </div>
          <div className="legal-block">
            <h3>운영자의 책임 제한</h3>
            <p>
              운영자는 서비스 이용 중 발생한 데이터 손실, 알림 지연, 계정 도용 등으로 인한 직접·간접적 손해에 대해 법령이
              허용하는 한도 내에서 책임을 지지 않습니다.
            </p>
          </div>
          <div className="legal-block">
            <h3>서비스 변경 및 중단</h3>
            <p>
              운영자는 필요 시 사전 고지 후 서비스의 일부 또는 전부를 변경·중단할 수 있습니다. 긴급한 보안 또는 시스템
              장애 발생 시 사전 고지 없이도 제한할 수 있습니다.
            </p>
          </div>
          <div className="legal-block">
            <h3>준거법 및 관할법원 (대한민국)</h3>
            <p>
              본 약관은 대한민국 법령을 준거로 하며, 서비스와 관련하여 분쟁이 발생할 경우 서울중앙지방법원을 제1심 전속적
              관할 법원으로 합니다.
            </p>
          </div>
        </section>

        <section id="privacy" className="section legal">
          <div className="section-header">
            <h2>개인정보처리방침</h2>
            <p>개인정보를 어떻게 수집하고 보호하는지 투명하게 안내합니다.</p>
          </div>
          <div className="legal-block">
            <h3>1. 수집하는 개인정보 항목</h3>
            <p>디스코드 사용자 ID, 이메일 계정 식별자, OAuth 토큰, 알림 설정 값, 서버 ID 등이 수집될 수 있습니다.</p>
          </div>
          <div className="legal-block">
            <h3>2. 개인정보 수집 및 이용 목적</h3>
            <p>메일 알림 제공, 계정 연동 상태 유지, 알림 내역 기록, 고객 지원 응대에 활용됩니다.</p>
          </div>
          <div className="legal-block">
            <h3>3. 보관 기간 및 암호화</h3>
            <p>서비스 이용 기간 동안만 보관하며, AES 등 강력한 암호화로 저장합니다. 이용 해지 시 지체 없이 파기합니다.</p>
          </div>
          <div className="legal-block">
            <h3>4. 제3자 제공 여부</h3>
            <p>법령상 요구되는 경우를 제외하고 제3자에게 정보를 제공하지 않습니다.</p>
          </div>
          <div className="legal-block">
            <h3>5. 이용자의 권리</h3>
            <p>언제든지 연동 해제, 데이터 삭제, 문의 요청을 할 수 있으며, support@example.com 으로 연락 가능합니다.</p>
          </div>
          <div className="legal-block">
            <h3>6. 로그 및 분석 도구에 대한 안내</h3>
            <p>서비스 안정성 확보를 위해 최소한의 시스템 로그를 저장하며, 광고 목적의 추적 도구는 사용하지 않습니다.</p>
          </div>
          <div className="legal-block">
            <h3>7. 개인정보처리방침 변경</h3>
            <p>방침이 변경될 경우 디스코드 공지 또는 알림을 통해 사전에 안내합니다.</p>
          </div>
          <div className="legal-block">
            <h3>8. 이 문서는 법률 자문이 아닙니다</h3>
            <p>이 문서는 참고용으로 제공되며, 법적 자문이 필요할 경우 전문 변호사와 상담하시기 바랍니다.</p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© 2025 E-mail. All rights reserved.</p>
        <a href="#intro" className="back-to-top">
          맨 위로
        </a>
      </footer>
    </div>
  );
}
