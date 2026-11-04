(() => {
  if (window.location.protocol !== 'file:') return;

  const root = document.getElementById('root');
  if (!root) return;

  document.documentElement.classList.add('standalone-preview');
  let activeSection = 'home';
  let selectedMood = '';
  let messageTimer;

  const features = [
    ['Patient 360°', '◉'],
    ['Care Journey', '↗'],
    ['Care Gap Tracking', '▤'],
    ['Emergency Support', '✚'],
    ['Blood Help', '♥'],
    ['Organ Donation', '♡'],
    ['Teleconsultation', '▣'],
    ['Pharmacy', '▱'],
    ['AI Health Summary', '✳'],
    ['Multilingual Access', '文'],
  ];

  const navigation = [
    ['Dashboard', '▦'],
    ['Patient 360°', '◉'],
    ['Appointments', '▦'],
    ['Consultations', '▣'],
    ['Health Journey', '↗'],
    ['Care Gaps', '▤'],
    ['Care Plan', '▧'],
    ['Medical Records', '▧'],
    ['Prescriptions', '▱'],
    ['Pharmacy', '▱'],
    ['Medicine History', '▣'],
    ['Blood Help', '♥'],
    ['Organ Donation', '♡'],
    ['Family Health', '♧'],
    ['Emergency', '✚'],
    ['AI Health Summary', '✳'],
    ['Notifications', '♧'],
    ['Privacy Center', '◇'],
    ['Settings', '⚙'],
  ];

  function brand() {
    return `
      <a class="preview-brand" href="#home" data-action="home" aria-label="CAREBRIDGE home">
        <span class="preview-brand-mark" aria-hidden="true">♡</span>
        <span class="preview-brand-copy">
          <strong>CAREBRIDGE</strong>
          <small>Connected healthcare</small>
        </span>
      </a>`;
  }

  function renderLanding() {
    return `
      <div class="preview-shell">
        <nav class="preview-nav" aria-label="Main navigation">
          ${brand()}
          <div class="preview-nav-links">
            <a href="#platform">Platform</a>
            <a href="#roles">Care teams</a>
            <a href="#security">Security</a>
          </div>
          <div class="preview-nav-actions">
            <button class="preview-button preview-button-quiet" data-action="login">Log in</button>
            <button class="preview-button preview-button-primary" data-action="dashboard">View demo <span aria-hidden="true">→</span></button>
          </div>
        </nav>
        <main>
          <section class="preview-hero">
            <div class="preview-hero-copy">
              <div class="preview-eyebrow">Healthcare continuity, reimagined</div>
              <h1>Every step of care,<br><span>connected.</span></h1>
              <p>CAREBRIDGE brings appointments, records, care plans, investigations and emergency support into one coordinated patient journey.</p>
              <div class="preview-actions">
                <button class="preview-button preview-button-primary" data-action="login">Get started <span aria-hidden="true">→</span></button>
                <button class="preview-button preview-button-outline" data-action="dashboard">Explore demo</button>
              </div>
              <div class="preview-trust">
                <span class="preview-trust-avatar">RK</span>
                <span class="preview-trust-copy"><strong>Trusted care experience</strong><small>Built for patient-first continuity</small></span>
              </div>
            </div>
            <div class="preview-hero-visual" aria-label="Patient health overview preview">
              <div class="preview-orbit"></div>
              <article class="preview-patient-card">
                <div class="preview-patient-heading">
                  <span class="preview-avatar">RK</span>
                  <span class="preview-patient-name"><strong>Rahul Kumar</strong><small>Patient overview</small></span>
                  <span class="preview-online-dot" aria-label="Care overview ready"></span>
                </div>
                <div class="preview-health-score">
                  <div><span>Care health</span><strong>82</strong></div>
                  <span class="preview-score-ring">82%</span>
                </div>
                <svg class="preview-trend" viewBox="0 0 300 90" role="img" aria-label="Sample care trend increasing over time">
                  <path class="preview-trend-grid" d="M5 22H295M5 52H295M5 82H295"></path>
                  <path class="preview-trend-line" d="M8 70C40 58 45 38 80 50S119 66 148 39 189 54 220 34 258 39 292 15"></path>
                </svg>
              </article>
              <div class="preview-floating-chip preview-chip-doctor"><span aria-hidden="true">✚</span><span><strong>Care team</strong><small>Dr. Arjun Reddy</small></span></div>
              <div class="preview-floating-chip preview-chip-emergency"><span aria-hidden="true">✚</span><span><strong>Emergency ready</strong><small>QR accessible</small></span></div>
            </div>
          </section>
          <section class="preview-feature-section" id="platform">
            <div class="preview-section-heading">
              <div><span class="preview-kicker">One connected platform</span><h2>Everything your care journey needs</h2></div>
              <p>One coordinated view for patients, families and care teams.</p>
            </div>
            <div class="preview-feature-grid">
              ${features.map(([label, icon]) => `<article class="preview-feature-card"><span class="preview-feature-icon" aria-hidden="true">${icon}</span><h3>${label}</h3></article>`).join('')}
            </div>
          </section>
          <section class="preview-role-section" id="roles">
            <div class="preview-section-heading">
              <div><span class="preview-kicker">Care for every role</span><h2>One platform, connected care teams</h2></div>
              <p>Purpose-built views bring patients, clinicians and operations together.</p>
            </div>
            <div class="preview-role-grid">
              <article class="preview-role-card"><span class="preview-feature-icon" aria-hidden="true">◉</span><h3>Patients &amp; families</h3><p>Follow appointments, records and care plans in one place.</p></article>
              <article class="preview-role-card"><span class="preview-feature-icon" aria-hidden="true">✚</span><h3>Care teams</h3><p>Coordinate consultations, follow-ups and patient workflows.</p></article>
              <article class="preview-role-card"><span class="preview-feature-icon" aria-hidden="true">▦</span><h3>Operations</h3><p>Review platform activity and care coordination status.</p></article>
            </div>
          </section>
          <section class="preview-security" id="security">
            <span class="preview-security-icon" aria-hidden="true">◇</span>
            <div><span class="preview-kicker">Secure access</span><h2>Authentication stays with Supabase</h2><p>Real sign-in and password resets are available in the app when Supabase is configured. This file-open preview is read-only and uses demonstration content.</p></div>
          </section>
        </main>
        <footer class="preview-footer">CAREBRIDGE preview · Demonstration content only · Use the Vite app for authentication and live services</footer>
      </div>`;
  }

  function renderDashboard() {
    return `
      <div class="preview-dashboard">
        <button class="preview-menu-backdrop" type="button" aria-label="Close menu" data-action="menu"></button>
        <div class="preview-dashboard-layout">
          <aside class="preview-sidebar" aria-label="Patient navigation">
            ${brand()}
            <div class="preview-sidebar-label">PATIENT PORTAL · DEMO</div>
            <nav class="preview-sidebar-nav">
              ${navigation.map(([label, icon]) => `<button class="${label === activeSection ? 'is-active' : ''}" data-action="section" data-section="${label}" ${label === activeSection ? 'aria-current="page"' : ''}><span aria-hidden="true">${icon}</span>${label}</button>`).join('')}
            </nav>
            <div class="preview-sidebar-user">
              <span class="preview-avatar">RK</span>
              <span class="preview-sidebar-user-copy"><strong>Rahul Kumar</strong><small>Patient ID · 0824</small></span>
              <button type="button" aria-label="Return to landing page" data-action="home">↗</button>
            </div>
          </aside>
          <main class="preview-dashboard-main">
            <header class="preview-dashboard-header">
              <button class="preview-mobile-menu" type="button" aria-label="Open menu" data-action="menu">☰</button>
              <label class="preview-search"><span aria-hidden="true">⌕</span><input aria-label="Search navigation" placeholder="Search care sections"><kbd>Ctrl K</kbd></label>
              <div class="preview-header-user"><span>♧ &nbsp;3</span><span class="preview-avatar">RK</span></div>
            </header>
            <div class="preview-page-content">
              <h1 class="preview-page-heading">${activeSection === 'Dashboard' ? 'Good morning, Rahul 👋' : activeSection}</h1>
              <p class="preview-page-subtitle">${activeSection === 'Dashboard' ? 'Here is your care overview for today.' : `Explore your ${activeSection.toLowerCase()} overview.`}</p>
              <section class="preview-appointment" aria-label="Upcoming appointment">
                <span class="preview-appointment-icon" aria-hidden="true">▣</span>
                <span class="preview-appointment-copy"><small>UPCOMING APPOINTMENT</small><strong>Dr. Arjun Reddy</strong><span>Today at 4:30 PM · Video consultation</span></span>
                <button class="preview-button preview-button-white" data-action="consultation">Join consultation</button>
              </section>
              <section class="preview-stats" aria-label="Care summary">
                <article class="preview-stat"><span class="preview-stat-icon" aria-hidden="true">▤</span><span class="preview-stat-copy"><small>Active care plans</small><strong>2</strong></span></article>
                <article class="preview-stat"><span class="preview-stat-icon" aria-hidden="true">◷</span><span class="preview-stat-copy"><small>Pending actions</small><strong>3</strong></span></article>
                <article class="preview-stat"><span class="preview-stat-icon" aria-hidden="true">▱</span><span class="preview-stat-copy"><small>Current medicines</small><strong>4</strong></span></article>
                <article class="preview-stat"><span class="preview-stat-icon" aria-hidden="true">▦</span><span class="preview-stat-copy"><small>Next follow-up</small><strong>3 days</strong></span></article>
              </section>
              <h2 class="preview-dashboard-section-title">Quick actions</h2>
              <section class="preview-quick-actions" aria-label="Quick actions">
                <button data-action="section" data-section="Appointments"><span class="preview-quick-icon">▦</span>Book appointment</button>
                <button data-action="consultation"><span class="preview-quick-icon">✚</span>Consult doctor</button>
                <button data-action="section" data-section="Pharmacy"><span class="preview-quick-icon">▱</span>Order medicine</button>
                <button data-action="emergency"><span class="preview-quick-icon">✚</span>Emergency</button>
                <button data-action="section" data-section="Blood Help"><span class="preview-quick-icon">♥</span>Blood help</button>
                <button data-action="section" data-section="Medical Records"><span class="preview-quick-icon">▧</span>View records</button>
              </section>
              <section class="preview-dashboard-grid">
                <article class="preview-panel">
                  <div class="preview-panel-heading"><h2>Care health</h2><span class="preview-positive">+8% this month</span></div>
                  <svg class="preview-dashboard-chart" viewBox="0 0 600 190" preserveAspectRatio="none" role="img" aria-label="Sample care trend from January through July">
                    <defs><linearGradient id="preview-chart-gradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#1677d2" stop-opacity=".25"></stop><stop offset="100%" stop-color="#1677d2" stop-opacity="0"></stop></linearGradient></defs>
                    <path d="M10 150C55 130 70 115 120 135S190 145 235 95 310 120 360 105 430 75 480 65 550 50 590 28V180H10Z" fill="url(#preview-chart-gradient)"></path>
                    <path d="M10 150C55 130 70 115 120 135S190 145 235 95 310 120 360 105 430 75 480 65 550 50 590 28" class="preview-trend-line"></path>
                  </svg>
                  <div class="preview-panel-heading"><small>Jan &nbsp; Feb &nbsp; Mar &nbsp; Apr &nbsp; May &nbsp; Jun &nbsp; Jul</small></div>
                </article>
                <article class="preview-panel">
                  <div class="preview-panel-heading"><h2>Today's care plan</h2><button class="preview-button preview-button-quiet" data-action="section" data-section="Care Plan">View all</button></div>
                  <div class="preview-task"><span class="preview-task-icon">✓</span><span class="preview-task-copy"><strong>Morning medication</strong><small>Completed at 8:15 AM</small></span></div>
                  <div class="preview-task"><span class="preview-task-icon">◷</span><span class="preview-task-copy"><strong>Blood pressure check</strong><small>Due by 12:00 PM</small></span></div>
                  <button class="preview-task" data-action="check-in"><span class="preview-task-icon">↗</span><span class="preview-task-copy"><strong>Complete symptom check-in</strong><small>Tap to update</small></span></button>
                </article>
              </section>
              <p class="preview-demo-note">Demo preview only. This local file does not connect to Supabase or save health information. Use <strong>npm run dev</strong> from the project folder for secure authentication and the complete application.</p>
            </div>
          </main>
        </div>
      </div>`;
  }

  function showMessage(text) {
    document.querySelector('.preview-message')?.remove();
    const message = document.createElement('div');
    message.className = 'preview-message';
    message.setAttribute('role', 'status');
    message.textContent = text;
    document.body.append(message);
    clearTimeout(messageTimer);
    messageTimer = window.setTimeout(() => message.remove(), 4200);
  }

  function showCheckIn() {
    const backdrop = document.createElement('div');
    backdrop.className = 'preview-modal-backdrop';
    backdrop.innerHTML = `
      <section class="preview-modal" role="dialog" aria-modal="true" aria-labelledby="preview-modal-title">
        <h2 id="preview-modal-title">Care check-in</h2>
        <p>How are you feeling today? This local preview will not save health information.</p>
        <div class="preview-moods">
          ${['Better', 'Same', 'Worse'].map((mood) => `<button type="button" data-mood="${mood}">${mood}</button>`).join('')}
        </div>
        <div class="preview-modal-actions">
          <button class="preview-button preview-button-outline" data-action="close-modal">Cancel</button>
          <button class="preview-button preview-button-primary" data-action="save-checkin">Done</button>
        </div>
      </section>`;
    root.append(backdrop);
    backdrop.querySelector('[data-mood="Same"]')?.focus();
  }

  function render() {
    root.innerHTML = activeSection === 'home' ? renderLanding() : renderDashboard();
  }

  root.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('[data-action], [data-mood]') : null;
    if (!(target instanceof HTMLElement)) return;

    if (target.hasAttribute('data-mood')) {
      selectedMood = target.dataset.mood || '';
      root.querySelectorAll('[data-mood]').forEach((button) => {
        button.classList.toggle('is-selected', button === target);
      });
      return;
    }

    switch (target.dataset.action) {
      case 'home':
        activeSection = 'home';
        history.replaceState(null, '', '#home');
        render();
        window.scrollTo(0, 0);
        break;
      case 'dashboard':
        activeSection = 'Dashboard';
        history.replaceState(null, '', '#dashboard');
        render();
        window.scrollTo(0, 0);
        break;
      case 'section':
        activeSection = target.dataset.section || 'Dashboard';
        root.querySelector('.preview-dashboard')?.classList.remove('is-menu-open');
        render();
        break;
      case 'login':
        showMessage('Sign-in needs the running app. Start it with npm run dev to use Supabase securely.');
        break;
      case 'consultation':
        showMessage('Consultations are demonstration-only in this file-open preview.');
        break;
      case 'emergency':
        showMessage('If someone is in immediate danger, contact your local emergency service.');
        break;
      case 'menu':
        root.querySelector('.preview-dashboard')?.classList.toggle('is-menu-open');
        break;
      case 'check-in':
        showCheckIn();
        break;
      case 'close-modal':
        document.querySelector('.preview-modal-backdrop')?.remove();
        selectedMood = '';
        break;
      case 'save-checkin':
        document.querySelector('.preview-modal-backdrop')?.remove();
        showMessage(selectedMood ? `Thanks for checking in. You chose “${selectedMood}”. This was not saved.` : 'Choose how you are feeling to complete this demo check-in.');
        selectedMood = '';
        break;
      default:
        break;
    }
  });

  root.addEventListener('keydown', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)
      || !target.matches('.preview-search input')
      || event.key !== 'Enter') return;
    const query = target.value.trim().toLowerCase();
    if (!query) return;
    const match = navigation.find(([label]) => label.toLowerCase().includes(query));
    if (match) {
      activeSection = match[0];
      render();
      const newSearch = root.querySelector('.preview-search input');
      newSearch?.focus();
      if (newSearch instanceof HTMLInputElement) newSearch.value = target.value;
    } else showMessage('No matching care section found.');
  });

  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      root.querySelector('.preview-search input')?.focus();
    }
    if (event.key === 'Escape') {
      root.querySelector('.preview-dashboard')?.classList.remove('is-menu-open');
      document.querySelector('.preview-modal-backdrop')?.remove();
    }
  });

  window.addEventListener('hashchange', () => {
    activeSection = window.location.hash === '#dashboard' ? 'Dashboard' : 'home';
    render();
  });

  activeSection = window.location.hash === '#dashboard' ? 'Dashboard' : 'home';
  render();
})();
