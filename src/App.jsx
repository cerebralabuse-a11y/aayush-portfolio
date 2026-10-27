import { useEffect, useRef, useState } from 'react';
import feather from 'feather-icons';
import { palettes, accents, indiaTime, indiaDate } from './site-settings.js';
import { backend } from './backend.js';

function Icon({ name, size = 20 }) {
  return <span className="icon" aria-hidden="true" dangerouslySetInnerHTML={{ __html: feather.icons[name].toSvg({ width: size, height: size, 'stroke-width': 1.7 }) }} />;
}

const email = 'aayushsonias2005@gmail.com';
const projectDetails = {
  apex: {
    title: 'APEX GP', status: 'In development',
    image: '/assets/apex-gp-race.png',
    imageWidth: 899, imageHeight: 524,
    alt: 'APEX GP gameplay capture showing an open-wheel car on the Jewel of Navi Mumbai circuit, with a lakeside setting, lap display, speedometer, and circuit minimap.',
    caption: 'Gameplay screenshot · WIP',
    preview: '/assets/apex-gp-overview.png',
    previewLabel: 'View circuit map',
    intro: 'Recreating a Navi Mumbai street circuit in the browser.',
    summary: 'A work-in-progress 3D racer recreating a Palm Beach Road circuit and parts of Navi Mumbai.',
    paragraphs: [
      'APEX GP is a browser-based open-wheel racing game set around Palm Beach Road and Jewel Lake in Navi Mumbai. I’m continuing to develop its circuit, driving experience, and city scenery.',
      'The hand-traced 14-corner route and stylized landmarks are built as drivable Three.js geometry, with waterfront roads, parks, palms, and a surrounding cityscape.',
      'The current implementation includes AI opponents, lap timing and checkpoints, Grand Prix, Time Trial and Free Drive modes, multiple cameras, and an interactive 3D circuit atlas. The city and circuit are artistic approximations that are still being refined.',
    ],
    tags: ['Three.js', 'JavaScript', '3D game'],
  },
  aqhigh: {
    title: 'AQHigh', status: 'Personal project',
    repository: 'https://github.com/cerebralabuse-a11y/AQHigh',
    preview: '/assets/aqhigh-supplied-ui.png',
    image: '/assets/aqhigh-supplied-ui.jpg',
    imageWidth: 720, imageHeight: 1600,
    alt: 'Supplied AQHigh mobile screen with location search, air-quality readings, a cigarette-equivalent comparison, trends, and a Share Update button.',
    caption: 'Supplied app screen',
    intro: 'Making local air quality easier to understand.',
    summary: 'Local air-quality readings, an estimated cigarette-equivalent comparison, and shareable stat cards.',
    paragraphs: [
      'AQHigh combines air-quality APIs and interpolation to estimate local conditions and make pollution data more approachable.',
      'It presents an approximate cigarette-equivalent comparison for pollution awareness, alongside location search and air-quality trends. Shareable stat cards let users turn their readings into a visual update.',
      'Built with React and TypeScript, using Vite, Tailwind CSS, and shadcn/ui.',
    ],
    tags: ['React', 'TypeScript', 'APIs'],
  },
  hni: {
    title: 'HNI Wallet Tracker', status: 'Personal project',
    image: '/assets/hni-wallet-tracker-illustration.jpg',
    alt: 'Illustration of a crypto wallet watchlist connected to holdings, transaction activity, and buy or sell notifications.',
    caption: 'Illustrated project overview',
    intro: 'Following crypto wallet activity, with a focus on Solana.',
    summary: 'Track Solana-focused wallet watchlists, explore holdings and transactions, and receive buy/sell alerts.',
    paragraphs: [
      'A crypto wallet tracker focused mainly on Solana. It brings curated wallet lists and custom watchlists into one place for following on-chain activity.',
      'Users can explore a tracked wallet’s current holdings and transaction history, with notifications when it buys or sells. The project helps users follow the activity of wallets they choose to watch.',
    ],
    tags: ['Solana', 'Wallet tracking', 'Notifications'],
  },
  agentpay: {
    title: 'Agentic Pay', status: 'Devnet prototype',
    repository: 'https://github.com/cerebralabuse-a11y/agenticpay',
    preview: '/assets/agentic-pay-owner-console.png',
    previewLabel: 'View owner console',
    intro: 'Owner-controlled spending for compatible AI agents.',
    summary: 'An MCP-enabled Solana prototype with owner-issued agent grants, spending limits, and payment receipts.',
    paragraphs: [
      'Agentic Pay lets compatible AI agents purchase approved digital services through MCP, within owner-issued spending budgets.',
      'The owner console creates and revokes agent grants, sets limits, and displays receipts. A local ledger reserves budgets and helps prevent duplicate purchases after retries.',
      'Built with Node.js, SQLite, MCP, and Solana tooling. The current project is a local/devnet prototype, shown here using the supplied owner-console screenshot.',
    ],
    tags: ['Node.js', 'Solana', 'MCP'],
  },
  neural: {
    title: 'Neural Networks From Scratch', status: 'Learning exercise',
    intro: 'Exploring the logic behind the predictions.',
    paragraphs: [
      'A learning exercise involving feedforward neural-network logic in Python and NumPy, alongside study of deep-learning fundamentals.',
      'My focus is understanding the basic building blocks through study and experimentation. This work is presented as a learning exercise, with no production deployment or benchmark claims.',
    ],
    tags: ['Python', 'NumPy', 'Deep learning'],
  },
};

function Tags({ items }) {
  return <div className="tags">{items.map(item => <span key={item}>{item}</span>)}</div>;
}

function ProjectImage({ src, alt, caption, width = 1200, height = 675 }) {
  return <figure className="project-image"><img src={backend.image(src)} onError={event => { if (event.currentTarget.getAttribute('src') !== src) event.currentTarget.src = src; }} alt={alt} width={width} height={height} loading="lazy" decoding="async" /><figcaption>{caption}</figcaption></figure>;
}

function ProjectPreview({ project }) {
  const [href, setHref] = useState(project.preview);
  useEffect(() => {
    let mounted = true;
    const remote = backend.image(project.preview);
    if (remote !== project.preview) {
      fetch(remote, { method: 'HEAD', signal: AbortSignal.timeout(8000) })
        .then(response => { if (mounted && response.ok) setHref(remote); })
        .catch(() => { /* Keep the bundled full-resolution preview available. */ });
    }
    return () => { mounted = false; };
  }, [project.preview]);
  return <a className="text-link" href={href}>{project.previewLabel || 'View app screen'}<Icon name="image" size={16} /></a>;
}

function readPreference(key, fallback, choices) {
  try {
    const value = localStorage.getItem(key);
    return Object.hasOwn(choices, value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function LocalClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return <section className="widget location-widget" aria-labelledby="location-widget-title">
    <h2 id="location-widget-title"><Icon name="map-pin" size={17} />Currently based in</h2>
    <p className="city-name">Navi Mumbai<span>India</span></p>
    <div className="local-time"><Icon name="clock" size={18} /><time dateTime={now.toISOString()}>{indiaTime.format(now)}</time><span>IST</span></div>
    <p className="widget-note">{indiaDate.format(now)} · UTC +05:30</p>
  </section>;
}

function ClickCounter() {
  const [clicks, setClicks] = useState(() => {
    if (backend.configured) return null;
    try {
      const saved = Number(sessionStorage.getItem('aayush-clicks'));
      return Number.isSafeInteger(saved) && saved >= 0 ? saved : 0;
    } catch {
      return 0;
    }
  });
  const [busy, setBusy] = useState(backend.configured);
  const [status, setStatus] = useState(backend.configured ? 'Loading shared count…' : 'Your clicks this session.');

  useEffect(() => {
    if (!backend.configured) return;
    let mounted = true;
    backend.getClicks().then(total => {
      if (mounted) { setClicks(total); setStatus('Clicks from everyone.'); }
    }).catch(() => { if (mounted) setStatus('Shared count unavailable. Try again.'); })
      .finally(() => { if (mounted) setBusy(false); });
    return () => { mounted = false; };
  }, []);

  async function increment() {
    if (backend.configured) {
      setBusy(true);
      try { setClicks(await backend.incrementClicks()); setStatus('Clicks from everyone.'); }
      catch { setStatus('Click wasn’t saved. Please try again.'); }
      finally { setBusy(false); }
      return;
    }
    const next = clicks + 1;
    setClicks(next);
    try { sessionStorage.setItem('aayush-clicks', String(next)); } catch { /* The counter still works without storage. */ }
  }

  return <section className="widget click-widget" aria-labelledby="click-widget-title">
    <h2 id="click-widget-title"><Icon name="mouse-pointer" size={17} />Just for fun</h2>
    <output className="click-count" aria-live="polite" aria-label={clicks === null ? 'Shared click count unavailable' : `${clicks} ${clicks === 1 ? 'click' : 'clicks'}`}>{clicks === null ? '—' : clicks.toLocaleString('en-IN')}</output>
    <button className="accent-button" onClick={increment} disabled={busy}>{busy ? (clicks === null ? 'Loading…' : 'Saving…') : 'Click me'}<Icon name="plus" size={16} /></button>
    <p className="widget-note" role="status">{status}</p>
  </section>;
}

function ContactForm() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const submissionId = useRef(crypto.randomUUID());

  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    setBusy(true);
    setStatus('');
    try {
      await backend.sendMessage({ submission_id: submissionId.current,
        sender_name: fields.get('name'), sender_email: fields.get('email'),
        message_body: fields.get('message'), website: fields.get('website') });
      form.reset();
      submissionId.current = crypto.randomUUID();
      setStatus('Message received. Thanks for reaching out!');
    } catch (error) { setStatus(error.message); }
    finally { setBusy(false); }
  }

  if (!backend.configured) return null;
  return <form className="contact-form" onSubmit={submit} aria-label="Send Aayush a message">
    <div className="contact-fields">
      <label>Your name<input name="name" autoComplete="name" required minLength={2} maxLength={80} /></label>
      <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
    </div>
    <label>Message<textarea name="message" required minLength={10} maxLength={3000} rows={4} placeholder="Tell me about your opportunity or idea…" /></label>
    <div className="contact-honeypot" aria-hidden="true"><label>Leave this blank<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <div className="contact-submit"><button className="accent-button" disabled={busy}>{busy ? 'Sending…' : 'Send message'}<Icon name="arrow-up-right" size={16} /></button><span role="status">{status}</span></div>
    <p className="contact-note">Your name, email and message are stored privately so I can respond.</p>
  </form>;
}

function Widgets({ theme, accent, setTheme, setAccent }) {
  const mode = theme === 'latte' ? 'light' : 'dark';
  return <section className="widgets" aria-label="Make yourself at home">
    <section className="widget theme-widget" aria-labelledby="theme-widget-title">
      <h2 id="theme-widget-title"><Icon name="sliders" size={17} />Make it yours</h2>
      <div className="theme-options" role="group" aria-label="Color theme">{Object.entries(palettes).map(([key, palette]) => <button key={key} aria-pressed={theme === key} onClick={() => setTheme(key)}>{palette.label}</button>)}</div>
      <div className="accent-options" role="group" aria-label="Accent color">{Object.entries(accents).map(([key, color]) => <button key={key} className="color-swatch" style={{ '--swatch': color[mode] }} aria-label={`${color.label} accent`} title={color.label} aria-pressed={accent === key} onClick={() => setAccent(key)}>{accent === key && <Icon name="check" size={14} />}</button>)}</div>
      <p className="widget-note">{palettes[theme].label} / {accents[accent].label}</p>
    </section>
    <section className="widget connect-widget" aria-labelledby="connect-widget-title">
      <h2 id="connect-widget-title"><Icon name="message-circle" size={17} />Let’s talk</h2>
      <p>Have an opportunity or an idea? I’d love to hear it.</p>
      <a className="accent-button" href={`mailto:${email}`}>Say hello<Icon name="arrow-up-right" size={16} /></a>
    </section>
    <LocalClock />
    <ClickCounter />
  </section>;
}

function Projects({ detailed, onSelect }) {
  const agent = projectDetails.agentpay;
  return <div className={`project-grid all-projects${detailed ? '' : ' featured-projects'}`} id="project-list">
    <article className="project-card agentpay-card">
      <ProjectImage src="/assets/agentic-pay-owner-console.jpg" alt="Agentic Pay owner console showing Solana devnet spending allowances, agent grants, and wallet controls." caption="App screenshot · Devnet" width={1600} height={689} />
      <div className="project-content">
        <div className="card-heading"><h3><button className="project-title" onClick={() => onSelect('agentpay')} aria-label="Read about Agentic Pay">{agent.title}</button></h3><span className="badge">{agent.status}</span></div>
        <p>{agent.summary}</p><Tags items={agent.tags} />
        <a className="text-link repository-link" href={agent.repository} aria-label="View Agentic Pay source on GitHub"><Icon name="github" size={16} />View source<Icon name="arrow-up-right" size={15} /></a>
        {detailed && <div className="expanded-copy"><p>Owner-issued grants, budget reservations, approved services, and recoverable payment receipts.</p><button className="text-link" onClick={() => onSelect('agentpay')}>Project details<Icon name="arrow-right" size={16} /></button></div>}
      </div>
    </article>
    {(detailed ? ['aqhigh', 'apex', 'hni'] : ['aqhigh', 'apex']).map(id => {
      const project = projectDetails[id];
      return <article key={id} className={`project-card ${id}-card`}>
        <ProjectImage src={project.image} alt={project.alt} caption={project.caption} width={project.imageWidth} height={project.imageHeight} />
        <div className="project-content">
          <div className="card-heading"><h3><button className="project-title" onClick={() => onSelect(id)} aria-label={`Read about ${project.title}`}>{project.title}</button></h3><span className="badge">{project.status}</span></div>
          <p>{project.summary}</p>
          <Tags items={project.tags} />
          <div className="project-actions"><button className="text-link" onClick={() => onSelect(id)}>Project details<Icon name="arrow-right" size={16} /></button>{project.repository && <a className="text-link" href={project.repository} aria-label={`View ${project.title} source on GitHub`}><Icon name="github" size={16} />View source</a>}</div>
          {detailed && <div className="expanded-copy"><p>{project.paragraphs[0]}</p></div>}
        </div>
      </article>;
    })}
    {detailed && <article className="project-card research-card"><ProjectImage src="/assets/virtual-pet-research.jpg" alt="Illustrated cover for Virtual Pet by Aayush Soni, IJARSCT Volume 5, Issue 8, March 2025." caption="Illustrated publication cover" /><div className="project-content"><div className="card-heading"><h3>Virtual Pet</h3><span className="badge publication">Published research</span></div><p>A research paper published in IJARSCT, Volume 5, Issue 8, in March 2025.</p><a className="text-link paper-link" href="https://doi.org/10.48175/IJARSCT-24551">Read paper<Icon name="arrow-right" size={16} /></a><div className="expanded-copy"><p>Published as Aayush Soni, Bharati Vidyapeeth Institute of Technology, Navi Mumbai.</p><p className="doi">DOI: 10.48175/IJARSCT-24551</p></div></div></article>}
    {detailed && <article className="project-card learning-card"><ProjectImage src="/assets/neural-networks-learning.jpg" alt="Illustrative feedforward neural network with three input nodes, four hidden nodes, and two output nodes." caption="Learning illustration" /><div className="project-content learning-main"><div className="card-heading"><h3><button className="project-title" onClick={() => onSelect('neural')} aria-label="Read about Neural Networks From Scratch">Neural Networks From Scratch</button></h3><span className="badge">Learning exercise</span></div><p>Exploring feedforward neural-network logic to strengthen the fundamentals.</p><Tags items={['Python', 'NumPy']} /><div className="expanded-copy"><p>Studying the building blocks of neural networks through Python and NumPy experimentation.</p><button className="text-link" onClick={() => onSelect('neural')}>What I’m learning<Icon name="arrow-right" size={16} /></button></div></div></article>}
  </div>;
}

function Background() {
  return (
    <section className="background" id="background" aria-label="Education, experience, and skills">
      <div className="background-grid">
        <section className="background-card education-card" id="education" aria-labelledby="education-title">
          <h2 id="education-title"><Icon name="book-open" size={23} />Education</h2>
          <article className="background-entry">
            <div className="entry-meta"><span>2025 — PRESENT</span><span className="small-status">Currently studying</span></div>
            <h3>B.Tech, Computer Science & Engineering</h3>
            <p>Ratan Tata Maharashtra State Skills University</p>
            <div className="entry-foot"><span>Kharghar, Navi Mumbai</span></div>
          </article>
          <article className="background-entry">
            <div className="entry-meta"><span>2022 — 2025</span></div>
            <h3>Diploma, Computer Technology</h3>
            <p>Bharati Vidyapeeth College of Engineering</p>
            <div className="entry-foot"><span>Kharghar, Navi Mumbai</span></div>
          </article>
          <details className="school-details"><summary>Earlier education<Icon name="chevron-down" size={16} /></summary><div className="school-content"><strong>SSC · St. Augustines High School, Nerul</strong><p>2012–2022</p></div></details>
        </section>
        <section className="background-card experience-card" id="experience" aria-labelledby="experience-title">
          <h2 id="experience-title"><Icon name="briefcase" size={23} />Work experience</h2>
          <article className="background-entry">
            <div className="entry-meta"><span>JUNE — JULY 2024</span><span className="small-status">Internship</span></div>
            <h3>Web Development Intern</h3>
            <p className="employer">Lotus Educare Academy</p>
            <p className="experience-summary">Completed a six-week summer internship focused on web development, as part of the MSBTE I-Scheme curriculum.</p>
            <div className="entry-foot"><span>Navi Mumbai, India</span><span>6 weeks</span></div>
          </article>
          <div className="experience-note"><Icon name="code" size={20} /><p>Building on this experience through AI concepts, published research, and learning projects.</p></div>
        </section>
        <section className="background-card skills-card" aria-labelledby="skills-title">
          <h2 id="skills-title"><Icon name="terminal" size={23} />Tools & foundations</h2>
          <div className="skill-group"><h3>AI & data</h3><p>Python · NumPy · Jupyter Notebook<br />Machine learning · NLP · OCR</p></div>
          <div className="skill-group"><h3>Web & software</h3><p>JavaScript · TypeScript · React.js · Node.js<br />HTML · CSS · REST APIs · Supabase · Firebase · MongoDB</p></div>
          <div className="skill-group"><h3>Build & collaborate</h3><p>Git · GitHub · Figma · VS Code</p></div>
        </section>
        <section className="background-card certifications-card" aria-labelledby="certifications-title">
          <h2 id="certifications-title"><Icon name="award" size={23} />Certifications</h2>
          <article className="certificate"><span>2025</span><div><h3>Generative AI Mastery</h3><p>Revolutionizing Game Development</p><small>AI & Generative AI via HP (edX) · November</small></div></article>
          <article className="certificate"><span>2024</span><div><h3>Linux Fundamentals</h3><p>IIT Bombay Spoken Tutorial · September</p></div></article>
          <article className="certificate"><span>2024</span><div><h3>Java Programming</h3><p>IIT Bombay Spoken Tutorial · February</p></div></article>
        </section>
      </div>
    </section>
  );
}

export function App() {
  const page = window.location.pathname.replace(/\/+$/, '') || '/';
  const isHome = page === '/';
  const isProjects = page === '/projects';
  const isAbout = page === '/about';
  const [theme, setTheme] = useState(() => readPreference('aayush-theme', 'mocha', palettes));
  const [accent, setAccent] = useState(() => readPreference('aayush-accent', 'peach', accents));
  const [activeDialog, setActiveDialog] = useState(null);
  const [copyStatus, setCopyStatus] = useState('');
  const dialog = useRef(null);
  const statusTimer = useRef();

  useEffect(() => {
    if (activeDialog && !dialog.current.open) dialog.current.showModal();
  }, [activeDialog]);
  useEffect(() => () => clearTimeout(statusTimer.current), []);
  useEffect(() => {
    try {
      localStorage.setItem('aayush-theme', theme);
      localStorage.setItem('aayush-accent', accent);
    } catch { /* Appearance controls remain usable when storage is unavailable. */ }
    document.documentElement.style.colorScheme = theme === 'latte' ? 'light' : 'dark';
    document.body.style.backgroundColor = palettes[theme].bg;
  }, [theme, accent]);
  useEffect(() => {
    document.title = `${isProjects ? 'Projects' : isAbout ? 'About' : isHome ? 'AI & full-stack developer' : 'Page not found'} · Aayush Soni`;
  }, [page]);

  async function copyEmail() {
    clearTimeout(statusTimer.current);
    try {
      await navigator.clipboard.writeText(email);
      setCopyStatus('Email copied');
    } catch {
      setCopyStatus('Select the email address to copy it.');
    }
    statusTimer.current = setTimeout(() => setCopyStatus(''), 5000);
  }

  const selectedProject = projectDetails[activeDialog];
  const appearance = Object.fromEntries(Object.entries(palettes[theme]).filter(([key]) => key !== 'label').map(([key, value]) => [`--${key}`, value]));
  appearance['--accent'] = accents[accent][theme === 'latte' ? 'light' : 'dark'];

  return (
    <div className="portfolio" data-theme={theme === 'latte' ? 'light' : 'dark'} data-palette={theme} style={appearance}>
      <a className="skip" href="#main">Skip to content</a>
      <header className="header container" id="top">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><a className="brand" href="/" aria-label="Aayush Soni, home">~</a><span aria-hidden="true">/</span>{!isHome && <><span className="current-path" aria-current="page">{isProjects ? 'projects' : isAbout ? 'about' : '404'}</span><span aria-hidden="true">/</span></>}</nav>
        <nav aria-label="Main navigation">
          <a href="/projects/" aria-current={isProjects ? 'page' : undefined}>Work</a>
          <a href="/about/" aria-current={isAbout ? 'page' : undefined}>About</a>
          <a href={isHome ? '#contact' : '/#contact'}>Contact</a>
          <button className="theme-toggle" onClick={() => setTheme(theme === 'latte' ? 'mocha' : 'latte')} aria-label={`Switch to ${theme === 'latte' ? 'dark' : 'light'} theme`} aria-pressed={theme === 'latte'}><Icon name={theme === 'latte' ? 'moon' : 'sun'} size={25} /></button>
        </nav>
      </header>
      <main className="container" id="main">
        {isHome ? <><section className="intro" aria-labelledby="intro-title">
          <h1 id="intro-title">Hey! I’m <span>Aayush Soni</span></h1>
          <div className="intro-copy"><p>Computer Science student exploring practical AI and full-stack software.</p><p>Learning by building concepts, studying the fundamentals, and connecting research with code.</p></div>
          <div className="social-links"><a href="https://github.com/cerebralabuse-a11y"><Icon name="github" />GitHub</a><a href="https://www.linkedin.com/in/aayush-soni-248282399/"><Icon name="linkedin" />LinkedIn</a><a href={`mailto:${email}`}><Icon name="mail" size={23} />Email</a></div>
          <p className="location"><Icon name="map-pin" />B.Tech CSE · Navi Mumbai, India</p>
          <div className="profile-highlights"><a href="#education"><Icon name="book-open" size={18} /><span>Ratan Tata MSSU<small>Education</small></span></a><a href="#experience"><Icon name="briefcase" size={18} /><span>Lotus Educare Academy<small>Past internship</small></span></a></div>
        </section>
        <section className="work" id="work" aria-labelledby="work-title">
          <div className="section-heading"><h2 id="work-title"><Icon name="star" size={30} />Selected work</h2><a className="text-link view-work" href="/projects/">View all work<Icon name="arrow-right" size={16} /></a></div>
          <Projects onSelect={setActiveDialog} />
        </section>
        <Background />
        <Widgets theme={theme} accent={accent} setTheme={setTheme} setAccent={setAccent} />
        </> : isProjects ? <section className="page-section" aria-labelledby="projects-title"><div className="page-heading"><p className="page-eyebrow">CONCEPTS / RESEARCH / LEARNING</p><h1 id="projects-title">Projects<span>.</span></h1><p>A closer look at what I’m designing, publishing, and learning along the way.</p></div><Projects detailed onSelect={setActiveDialog} /><a className="text-link page-return" href="/"><Icon name="arrow-left" size={16} />Back home</a></section>
        : isAbout ? <><section className="page-section about-intro" aria-labelledby="about-title"><p className="page-eyebrow">A LITTLE CONTEXT</p><h1 id="about-title">About me<span>.</span></h1><div className="about-copy"><p>I’m Aayush M. Soni, a Computer Science & Engineering student based in Navi Mumbai. I’m interested in practical AI, full-stack web development, and understanding how software works beneath the surface.</p><p>My projects include Agentic Pay, AQHigh for air-quality awareness, a Solana-focused HNI Wallet Tracker, and a published Virtual Pet paper. I’m also developing APEX GP, a Navi Mumbai racing game, and learning neural networks from scratch with Python and NumPy.</p><a className="text-link" href="/projects/">Explore my work<Icon name="arrow-right" size={16} /></a></div></section><Background /><section className="personal-note" aria-labelledby="personal-title"><h2 id="personal-title"><Icon name="coffee" size={23} />Away from code</h2><p>I play chess: runner-up at a zonal-level tournament and 20th place at a state-level online tournament.</p></section></>
        : <section className="page-section not-found"><p className="page-eyebrow">404 / WRONG TURN</p><h1>Nothing here yet<span>.</span></h1><p>Let’s get you back to the portfolio.</p><a className="text-link" href="/">Back home<Icon name="arrow-right" size={16} /></a></section>}
        <section className="contact" id="contact" aria-labelledby="contact-title"><h2 id="contact-title"><Icon name="mail" size={30} />Let’s connect</h2><div className="contact-body"><p>I’m open to internship opportunities, collaborations, or interesting ideas.</p><div className="email-row"><a href={`mailto:${email}`}>{email}</a><button className="copy-email" aria-label="Copy email address" onClick={copyEmail}><Icon name={copyStatus === 'Email copied' ? 'check' : 'copy'} size={17} /></button><span className="copy-status" role="status">{copyStatus}</span></div><ContactForm /></div></section>
      </main>
      <footer className="container"><span>© 2026 Aayush M. Soni</span><a href="#top">Back to top<Icon name="arrow-up" size={14} /></a></footer>
      <dialog ref={dialog} className="detail-dialog" aria-labelledby="dialog-title" onClose={() => setActiveDialog(null)} onClick={event => { if (event.target === event.currentTarget) dialog.current.close(); }}>
        <div className="dialog-surface"><form method="dialog"><button className="dialog-close" aria-label="Close details"><Icon name="x" size={22} /></button></form>
          {selectedProject ? <><p className="dialog-eyebrow">{selectedProject.status}</p><h2 id="dialog-title">{selectedProject.title}</h2><p className="dialog-intro">{selectedProject.intro}</p>{selectedProject.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<Tags items={selectedProject.tags} /><div className="project-actions">{selectedProject.repository && <a className="text-link" href={selectedProject.repository} aria-label={`View ${selectedProject.title} source on GitHub`}><Icon name="github" size={16} />View source<Icon name="arrow-up-right" size={15} /></a>}{selectedProject.preview && <ProjectPreview key={selectedProject.preview} project={selectedProject} />}</div></> : null}
        </div>
      </dialog>
    </div>
  );
}
