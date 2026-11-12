import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { BrowserRouter, NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import {
  Activity, Ambulance, ArrowRight, Bell, BrainCircuit, CalendarDays, Check, CheckCircle2,
  ChevronRight, CircleUserRound, ClipboardList, Clock3, Download, Droplets, Eye, EyeOff,
  FileHeart, Heart, HeartPulse, Languages, LayoutDashboard, LockKeyhole, LogOut,
  Menu, MessageCircle, Package, Phone, Pill, QrCode, Search, Settings,
  ShieldCheck, ShoppingBag, Sparkles, Stethoscope, TestTubeDiagonal, Users, Video, X
} from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Brand from '../components/Brand';
import { Modal, PageHeader, Stat } from '../components/Shared';
import { isSupabaseConfigured, supabase } from '../services/supabase';

export type UserRole = 'patient' | 'doctor';

export function getActiveRole(): UserRole {
  const saved = localStorage.getItem('carebridge_role');
  return saved === 'doctor' ? 'doctor' : 'patient';
}

export function setActiveRole(role: UserRole) {
  localStorage.setItem('carebridge_role', role);
}

export function clearActiveRole() {
  localStorage.removeItem('carebridge_role');
}

const patientNavItems = [
  ['dashboard', 'Dashboard', LayoutDashboard],
  ['patient360', 'Patient 360°', CircleUserRound],
  ['appointments', 'Appointments', CalendarDays],
  ['consultations', 'Consultations', Video],
  ['journey', 'Health Journey', Activity],
  ['gaps', 'Care Gaps', ClipboardList],
  ['careplan', 'Care Plan', FileHeart],
  ['records', 'Medical Records', FileHeart],
  ['prescriptions', 'Prescriptions', Pill],
  ['pharmacy', 'Pharmacy', ShoppingBag],
  ['medicines', 'Medicine History', Package],
  ['blood', 'Blood Help', Droplets],
  ['organ', 'Organ Donation', HeartPulse],
  ['family', 'Family Health', Users],
  ['emergency', 'Emergency', Ambulance],
  ['ai', 'AI Health Summary', Sparkles],
  ['notifications', 'Notifications', Bell],
  ['privacy', 'Privacy Center', ShieldCheck],
  ['settings', 'Settings', Settings],
] as const;

const doctorNavItems = [
  ['dashboard', 'Doctor Dashboard', LayoutDashboard],
  ['queue', 'OPD Patient Queue', Users],
  ['consultations', 'Telehealth & Consults', Video],
  ['prescriptions', 'Write Prescriptions', Pill],
  ['records', 'Diagnostic & Lab Reviews', FileHeart],
  ['caregaps', 'Chronic Care Tracking', ClipboardList],
  ['emergency', 'Emergency Triage', Ambulance],
  ['schedule', 'Clinical Schedule', CalendarDays],
  ['settings', 'Clinical Settings', Settings],
] as const;

const chartData = [
  { n: 'Mon', v: 4 },
  { n: 'Tue', v: 6 },
  { n: 'Wed', v: 5 },
  { n: 'Thu', v: 8 },
  { n: 'Fri', v: 7 },
  { n: 'Sat', v: 9 },
  { n: 'Sun', v: 6 },
];

function Landing() {
  const navigate = useNavigate();
  const features = [
    ['Patient 360°', CircleUserRound],
    ['Care Journey', Activity],
    ['Care Gap Tracking', ClipboardList],
    ['Emergency Support', Ambulance],
    ['Blood Help', Droplets],
    ['Organ Donation Support', HeartPulse],
    ['Teleconsultation', Video],
    ['Pharmacy', ShoppingBag],
    ['AI Health Summary', BrainCircuit],
    ['Multilingual Access', Languages],
  ] as const;

  return (
    <div className="landing">
      <nav className="public-nav" aria-label="Main navigation">
        <Brand />
        <div className="nav-links">
          <a href="#platform">Platform</a>
          <a href="#roles">Clinical Portals</a>
          <a href="#security">Security & Compliance</a>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button className="btn ghost" onClick={() => navigate('/login')}>
            Sign in
          </button>
          <button
            className="btn outline"
            onClick={() => {
              setActiveRole('doctor');
              navigate('/doctor/dashboard');
            }}
          >
            <Stethoscope size={16} /> Doctor Portal
          </button>
          <button
            className="btn primary"
            onClick={() => {
              setActiveRole('patient');
              navigate('/app/dashboard');
            }}
          >
            Patient Portal <ArrowRight size={17} />
          </button>
        </div>
      </nav>
      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow">
              <span></span> Healthcare continuity, reimagined
            </div>
            <h1>
              Every step of care,
              <br />
              <em>connected.</em>
            </h1>
            <p>
              CAREBRIDGE coordinates patient appointments, clinical consultations, active care plans,
              diagnostic lab investigations, and emergency triage into one unified healthcare platform.
            </p>
            <div className="hero-actions">
              <button
                className="btn primary large"
                onClick={() => {
                  setActiveRole('patient');
                  navigate('/app/dashboard');
                }}
              >
                <CircleUserRound size={18} /> Access Patient Portal
              </button>
              <button
                className="btn outline large"
                onClick={() => {
                  setActiveRole('doctor');
                  navigate('/doctor/dashboard');
                }}
              >
                <Stethoscope size={18} /> Doctor & Clinician Login
              </button>
            </div>
            <div className="trust">
              <div className="avatars">CB</div>
              <div>
                <strong>Accredited Healthcare Network</strong>
                <span>HIPAA & Digital Health Standards Compliant</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-orbit"></div>
            <div
              className="patient-card floating"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setActiveRole('patient');
                navigate('/app/patient360');
              }}
              title="Click to view Patient 360°"
            >
              <div className="patient-head">
                <div className="avatar">RK</div>
                <div>
                  <b>Rahul Kumar</b>
                  <span>Patient ID · CB-P-0824</span>
                </div>
                <span className="status-dot"></span>
              </div>
              <div className="health-score">
                <div>
                  <span>Care health score</span>
                  <strong>82</strong>
                </div>
                <div className="score-ring">82%</div>
              </div>
              <div className="mini-chart">
                <ResponsiveContainer width="100%" height={110}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#147dca" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#147dca" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="n" axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip />
                    <Area type="monotone" dataKey="v" stroke="#147dca" strokeWidth={3} fill="url(#cg)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div
              className="floating-chip doctor"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setActiveRole('doctor');
                navigate('/doctor/dashboard');
              }}
              title="Click to open Doctor Portal"
            >
              <Stethoscope />
              <span>
                <b>Primary Care Team</b>
                <small>Dr. Arjun Reddy, MD</small>
              </span>
            </div>
            <div
              className="floating-chip emergency"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setActiveRole('patient');
                navigate('/app/emergency');
              }}
            >
              <Ambulance />
              <span>
                <b>Emergency Response</b>
                <small>QR Medical ID Ready</small>
              </span>
            </div>
          </div>
        </section>

        <section className="feature-strip" id="platform">
          <div className="section-heading">
            <div>
              <span className="kicker">ONE CONNECTED PLATFORM</span>
              <h2>Comprehensive clinical ecosystem</h2>
            </div>
            <p>Dedicated tools designed exclusively for patients and healthcare professionals.</p>
          </div>
          <div className="feature-grid">
            {features.map(([name, Icon]) => (
              <div className="feature-card" key={name}>
                <div className="feature-icon">
                  <Icon />
                </div>
                <h3>{name}</h3>
                <ChevronRight />
              </div>
            ))}
          </div>
        </section>

        <section className="role-preview" id="roles">
          <div className="section-heading">
            <div>
              <span className="kicker">ROLE-EXCLUSIVE WORKFLOWS</span>
              <h2>Built for every member of the care cycle</h2>
            </div>
            <p>Separated portals ensure patients and doctors access strictly what they need.</p>
          </div>
          <div className="role-preview-grid">
            <article
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setActiveRole('patient');
                navigate('/app/dashboard');
              }}
            >
              <CircleUserRound />
              <h3>Patient Portal</h3>
              <p>Appointments, digital records, prescription delivery, emergency QR, and family health management.</p>
              <span style={{ color: '#0878c9', fontWeight: 700, fontSize: '13px', marginTop: '10px', display: 'inline-block' }}>
                Open Patient Portal →
              </span>
            </article>
            <article
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setActiveRole('doctor');
                navigate('/doctor/dashboard');
              }}
            >
              <Stethoscope />
              <h3>Doctor & Clinician Portal</h3>
              <p>OPD waiting queue, teleconsultation room, SOAP clinical notes, e-prescriptions, and lab reviews.</p>
              <span style={{ color: '#0878c9', fontWeight: 700, fontSize: '13px', marginTop: '10px', display: 'inline-block' }}>
                Open Doctor Portal →
              </span>
            </article>
            <article
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setActiveRole('doctor');
                navigate('/doctor/emergency');
              }}
            >
              <Ambulance />
              <h3>Emergency & Triage</h3>
              <p>Instant UHID medical lookups, critical blood unit coordination, and rapid-response care.</p>
              <span style={{ color: '#0878c9', fontWeight: 700, fontSize: '13px', marginTop: '10px', display: 'inline-block' }}>
                Access Emergency Desk →
              </span>
            </article>
          </div>
        </section>

        <section className="security-callout" id="security">
          <ShieldCheck />
          <div>
            <span className="kicker">ENTERPRISE SECURITY & PRIVACY</span>
            <h2>Encrypted Health Records & Controlled Access</h2>
            <p>
              Patient health records and doctor clinical notes are strictly protected with Row-Level Security,
              end-to-end encryption, and role-based access control.
            </p>
          </div>
        </section>

        <section className="differentiator">
          <div>
            <BrainCircuit size={34} />
            <span>CAREBRIDGE Clinical Standard</span>
          </div>
          <p>
            CAREBRIDGE combines longitudinal patient tracking, OPD queue intelligence, rapid emergency QR access,
            digital pharmacy fulfillment, and AI-assisted clinical summaries into a single seamless health experience.
          </p>
        </section>
      </main>
    </div>
  );
}

function Login() {
  const navigate = useNavigate();
  const [activeRole, setActiveRoleState] = useState<UserRole>(getActiveRole());
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState(
    activeRole === 'doctor' ? 'dr.arjun@carebridge.health' : 'rahul.kumar@carebridge.health'
  );
  const [password, setPassword] = useState('password123');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  function handleRoleChange(newRole: UserRole) {
    setActiveRoleState(newRole);
    setActiveRole(newRole);
    setEmail(newRole === 'doctor' ? 'dr.arjun@carebridge.health' : 'rahul.kumar@carebridge.health');
    setPassword('password123');
    setMessage('');
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setMessage(error.message);
          setBusy(false);
          return;
        }
      }

      setActiveRole(activeRole);
      if (activeRole === 'doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/app/dashboard');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to sign in right now.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-art">
        <Brand light />
        <div className="login-quote">
          <span>{activeRole === 'doctor' ? 'Clinical Workspace' : 'Patient-first care'}</span>
          <h2>{activeRole === 'doctor' ? 'Connected Clinical Intelligence.' : 'Connected at every step.'}</h2>
          <p>
            {activeRole === 'doctor'
              ? 'Access your OPD patient queue, teleconsultation suite, e-prescriptions, and lab signoffs.'
              : 'Securely manage your personal appointments, prescriptions, health records, and emergency profile.'}
          </p>
        </div>
        <div className="art-pattern"></div>
      </div>
      <div className="login-form-wrap">
        <button className="back-link" type="button" onClick={() => navigate('/')}>
          ← Back to home
        </button>
        <div className="login-box">
          <Brand />
          <h1>{activeRole === 'doctor' ? 'Doctor Portal Login' : 'Patient Portal Login'}</h1>
          <p>Select your role below and sign in to access your exclusive workspace.</p>

          <div className="login-role-selector" role="tablist" aria-label="Select Login Portal">
            <button
              type="button"
              role="tab"
              aria-selected={activeRole === 'patient'}
              className={`role-tab ${activeRole === 'patient' ? 'active' : ''}`}
              onClick={() => handleRoleChange('patient')}
            >
              <CircleUserRound size={17} />
              <span>Patient</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeRole === 'doctor'}
              className={`role-tab ${activeRole === 'doctor' ? 'active' : ''}`}
              onClick={() => handleRoleChange('doctor')}
            >
              <Stethoscope size={17} />
              <span>Doctor / Clinician</span>
            </button>
          </div>

          <div className={`role-badge-pill ${activeRole === 'doctor' ? 'doctor' : ''}`}>
            {activeRole === 'doctor' ? 'Clinical Staff Authorization' : 'Patient Account Access'}
          </div>

          <form onSubmit={submit}>
            <label>
              Email address
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <label>
              Password
              <div className="password-wrap">
                <input
                  type={show ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button
                  type="button"
                  aria-label={show ? 'Hide password' : 'Show password'}
                  onClick={() => setShow(!show)}
                >
                  {show ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </label>
            <div className="form-row">
              <label className="check">
                <input type="checkbox" defaultChecked /> Remember me
              </label>
              <span style={{ fontSize: '12px', color: '#688297' }}>
                Account: <b>{activeRole === 'doctor' ? 'Dr. Arjun Reddy' : 'Rahul Kumar'}</b>
              </span>
            </div>
            {message && <div className="auth-message" role="alert">{message}</div>}
            <button className="btn primary full" type="submit" disabled={busy}>
              {busy ? 'Verifying credentials...' : `Sign in as ${activeRole === 'doctor' ? 'Doctor' : 'Patient'}`} <ArrowRight size={18} />
            </button>
          </form>

          <div className="security-note" style={{ color: '#2c5270', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginTop: '16px', justifyContent: 'center' }}>
            <ShieldCheck size={18} style={{ color: '#0878c9' }} />
            <span>Secure Enterprise Authentication • 256-Bit SSL Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------- DOCTOR PORTAL PAGES ----------------- //

function DoctorPages({ kind }: { kind: string }) {
  const navigate = useNavigate();
  const [modal, setModal] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState('Rahul Kumar');
  const [queueStatus, setQueueStatus] = useState<Record<number, string>>({
    1: 'Completed',
    2: 'Completed',
    3: 'In Consultation',
    4: 'Waiting',
    5: 'Waiting',
    6: 'Waiting',
  });
  const [labApprovals, setLabApprovals] = useState<Record<number, boolean>>({});

  // Doctor Dashboard
  if (kind === 'dashboard') {
    return (
      <>
        <PageHeader
          title="Good morning, Dr. Arjun Reddy 👋"
          subtitle="Cardiology OPD • Room 302 • Clinical Session Active"
        />

        <div className="doctor-hero-banner">
          <div className="doctor-hero-content">
            <Video />
            <div>
              <span>NEXT PATIENT IN QUEUE</span>
              <h3>Rahul Kumar · Token #04</h3>
              <p>Scheduled Video Consultation · Routine Cardiology Follow-up & BP Review</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn white"
              onClick={() => navigate('/doctor/consultations')}
            >
              <Video size={16} /> Start Consultation
            </button>
            <button
              className="btn outline"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'transparent' }}
              onClick={() => navigate('/doctor/queue')}
            >
              View Full Queue
            </button>
          </div>
        </div>

        <div className="stats-grid">
          <Stat label="Today's Appointments" value="12" icon={CalendarDays} color="blue" />
          <Stat label="Waiting in OPD" value="3" icon={Users} color="orange" />
          <Stat label="Pending Lab Reviews" value="5" icon={TestTubeDiagonal} color="purple" />
          <Stat label="Avg Consultation Time" value="14 mins" icon={Clock3} color="green" />
        </div>

        <div className="section-title">
          <h2>Clinical Quick Actions</h2>
        </div>
        <div className="quick-grid">
          <button onClick={() => navigate('/doctor/queue')}>
            <Users />
            <span>Call Next Patient</span>
          </button>
          <button onClick={() => navigate('/doctor/prescriptions')}>
            <Pill />
            <span>Write E-Prescription</span>
          </button>
          <button onClick={() => navigate('/doctor/records')}>
            <FileHeart />
            <span>Review Lab Reports</span>
          </button>
          <button className="danger" onClick={() => navigate('/doctor/emergency')}>
            <Ambulance />
            <span>Emergency Triage</span>
          </button>
          <button onClick={() => navigate('/doctor/caregaps')}>
            <ClipboardList />
            <span>Chronic Care Gaps</span>
          </button>
          <button onClick={() => navigate('/doctor/schedule')}>
            <CalendarDays />
            <span>OPD Timings & Slots</span>
          </button>
        </div>

        <div className="dashboard-grid">
          <div className="panel">
            <div className="panel-head">
              <h2>Weekly Patient Volume</h2>
              <span className="positive">Healthy Flow</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="docVol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1f9463" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#1f9463" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="n" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="v" stroke="#1f9463" strokeWidth={3} fill="url(#docVol)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h2>OPD Live Queue Summary</h2>
              <button className="text-button" onClick={() => navigate('/doctor/queue')}>
                Manage All
              </button>
            </div>
            <div className="doctor-table-wrap">
              <table className="clinical-table">
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Patient</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="token-badge">03</span></td>
                    <td><b>Meera Shah</b><br /><small>Palpitations · In Room</small></td>
                    <td><span className="clinical-badge blue">Attending</span></td>
                    <td><button className="btn outline" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => navigate('/doctor/consultations')}>Resume</button></td>
                  </tr>
                  <tr>
                    <td><span className="token-badge">04</span></td>
                    <td><b>Rahul Kumar</b><br /><small>BP Check · Scheduled 4:30 PM</small></td>
                    <td><span className="clinical-badge orange">Waiting</span></td>
                    <td><button className="btn primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => navigate('/doctor/consultations')}>Call In</button></td>
                  </tr>
                  <tr>
                    <td><span className="token-badge">05</span></td>
                    <td><b>Anita Kumar</b><br /><small>Lab Review</small></td>
                    <td><span className="clinical-badge orange">Waiting</span></td>
                    <td><button className="btn outline" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => navigate('/doctor/queue')}>Prepare</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    );
  }

  // OPD Patient Queue
  if (kind === 'queue') {
    const queueList = [
      { id: 1, token: '01', name: 'Ramesh Patel', age: '54M', complaint: 'Chest discomfort, post-angioplasty', time: '03:30 PM', vitals: 'BP 138/88 · Pulse 74' },
      { id: 2, token: '02', name: 'Sunita Devi', age: '48F', complaint: 'Hypertension follow-up', time: '04:00 PM', vitals: 'BP 124/82 · Pulse 68' },
      { id: 3, token: '03', name: 'Meera Shah', age: '36F', complaint: 'Palpitations & fatigue', time: '04:15 PM', vitals: 'BP 118/76 · Pulse 82' },
      { id: 4, token: '04', name: 'Rahul Kumar', age: '28M', complaint: 'Cardiology follow-up & BP review', time: '04:30 PM', vitals: 'BP 120/80 · Pulse 72' },
      { id: 5, token: '05', name: 'Anita Kumar', age: '31F', complaint: 'Lipid profile review', time: '04:45 PM', vitals: 'BP 116/74 · Pulse 70' },
      { id: 6, token: '06', name: 'Vikram Malhotra', age: '62M', complaint: 'Breathlessness on exertion', time: '05:00 PM', vitals: 'BP 142/92 · Pulse 78' },
    ];

    return (
      <>
        <PageHeader
          title="OPD Patient Queue"
          subtitle="Manage incoming patient tokens, waiting room arrivals, and consultation transitions."
        />

        <div className="panel">
          <div className="panel-head">
            <h2>Today's Patient Schedule ({queueList.length} Total)</h2>
            <span className="positive">Live Doctor OPD</span>
          </div>

          <div className="doctor-table-wrap">
            <table className="clinical-table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Patient Details</th>
                  <th>Time</th>
                  <th>Vitals (Recorded by Nurse)</th>
                  <th>Reason for Consultation</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {queueList.map((p) => {
                  const status = queueStatus[p.id] || 'Waiting';
                  return (
                    <tr key={p.id}>
                      <td><span className="token-badge">{p.token}</span></td>
                      <td>
                        <strong>{p.name}</strong> ({p.age})
                      </td>
                      <td>{p.time}</td>
                      <td><code>{p.vitals}</code></td>
                      <td>{p.complaint}</td>
                      <td>
                        <span
                          className={`clinical-badge ${
                            status === 'Completed'
                              ? 'green'
                              : status === 'In Consultation'
                              ? 'blue'
                              : 'orange'
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {status === 'Waiting' && (
                            <button
                              className="btn primary"
                              style={{ padding: '6px 12px', fontSize: '12px' }}
                              onClick={() => {
                                setQueueStatus((prev) => ({ ...prev, [p.id]: 'In Consultation' }));
                                navigate('/doctor/consultations');
                              }}
                            >
                              Call In
                            </button>
                          )}
                          {status === 'In Consultation' && (
                            <button
                              className="btn outline"
                              style={{ padding: '6px 12px', fontSize: '12px' }}
                              onClick={() => navigate('/doctor/consultations')}
                            >
                              Open Room
                            </button>
                          )}
                          {status === 'Completed' && (
                            <button
                              className="btn outline"
                              style={{ padding: '6px 12px', fontSize: '12px' }}
                              onClick={() => setModal(`Viewing completed summary for ${p.name}`)}
                            >
                              Summary
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {modal && (
          <Modal title="Patient Clinical Record" onClose={() => setModal(null)}>
            <p>{modal}</p>
            <button className="btn primary full" onClick={() => setModal(null)}>Close</button>
          </Modal>
        )}
      </>
    );
  }

  // Telehealth & Consultations
  if (kind === 'consultations') {
    return (
      <>
        <PageHeader
          title="Clinical Consultations & Telehealth"
          subtitle="HD video room with integrated clinical SOAP notes and real-time medical chart access."
        />

        <div className="panel" style={{ marginBottom: '20px' }}>
          <div className="panel-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="token-badge">04</span>
              <div>
                <h2 style={{ margin: 0 }}>Active Consultation: Rahul Kumar</h2>
                <small style={{ color: '#688297' }}>28 Yrs · Male · UHID: CB-P-2026-0824 · Primary Care Patient</small>
              </div>
            </div>
            <span className="clinical-badge green">Call Connected (04:12)</span>
          </div>

          <div
            style={{
              height: '240px',
              background: '#0d2338',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              position: 'relative',
              margin: '16px 0',
            }}
          >
            <div className="avatar large" style={{ background: '#1c3e5d', color: '#7bc3f5', marginBottom: '10px' }}>
              RK
            </div>
            <p style={{ margin: 0, fontWeight: 700 }}>Rahul Kumar (Video Call Active)</p>
            <small style={{ color: '#8ebbdc' }}>Microphone and HD camera connected</small>

            <div style={{ position: 'absolute', bottom: '16px', display: 'flex', gap: '12px' }}>
              <button className="btn white" style={{ padding: '8px 14px', fontSize: '13px' }}>
                <Phone size={15} /> Mute
              </button>
              <button className="btn white" style={{ padding: '8px 14px', fontSize: '13px' }}>
                <Video size={15} /> Video
              </button>
              <button
                className="btn"
                style={{ background: '#d32f2f', color: 'white', padding: '8px 14px', fontSize: '13px' }}
                onClick={() => setModal('Consultation ended and archived to patient file.')}
              >
                End Call
              </button>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h2>SOAP Clinical Documentation</h2>
            <span style={{ fontSize: '12px', color: '#688297' }}>Auto-synced with Patient 360°</span>
          </div>

          <div className="soap-grid">
            <div className="soap-field">
              <label>S — Subjective (Symptoms & History)</label>
              <textarea defaultValue="Patient reports mild lightheadedness after heavy cardio running. Denies chest pressure, shortness of breath, or palpitations." />
            </div>
            <div className="soap-field">
              <label>O — Objective (Vitals & Physical Exam)</label>
              <textarea defaultValue="BP: 120/80 mmHg | Pulse: 72 bpm regular | SpO2: 99% on room air | S1 S2 heard, no murmurs | Chest clear bilaterally." />
            </div>
            <div className="soap-field">
              <label>A — Assessment (Clinical Diagnosis)</label>
              <textarea defaultValue="Essential hypertension under optimal pharmacological control. Mild post-exercise dehydration." />
            </div>
            <div className="soap-field">
              <label>P — Plan (Treatment & Follow-up)</label>
              <textarea defaultValue="Continue Telmisartan 40mg daily after breakfast. Ensure adequate electrolyte rehydration post-exercise. Routine review in 4 weeks." />
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button className="btn outline" onClick={() => navigate('/doctor/prescriptions')}>
              <Pill size={16} /> Open Prescription Desk
            </button>
            <button className="btn primary" onClick={() => setModal('Clinical notes saved and transmitted to patient medical records.')}>
              <CheckCircle2 size={16} /> Save Notes & Sign Off
            </button>
          </div>
        </div>

        {modal && (
          <Modal title="Clinical Record Updated" onClose={() => setModal(null)}>
            <p>{modal}</p>
            <button className="btn primary full" onClick={() => setModal(null)}>Done</button>
          </Modal>
        )}
      </>
    );
  }

  // Write Prescriptions
  if (kind === 'prescriptions') {
    return (
      <>
        <PageHeader
          title="Digital E-Prescriptions Desk"
          subtitle="Generate authenticated prescriptions and transmit instantly to the hospital pharmacy & patient app."
        />

        <div className="panel">
          <div className="panel-head">
            <h2>Issue New Prescription</h2>
            <span className="positive">Authenticated Provider</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '16px 0' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '13px', marginBottom: '6px' }}>Select Patient</label>
              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d4e0eb' }}
              >
                <option>Rahul Kumar (UHID: CB-P-2026-0824)</option>
                <option>Meera Shah (UHID: CB-P-2026-0312)</option>
                <option>Vikram Malhotra (UHID: CB-P-2026-0955)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '13px', marginBottom: '6px' }}>Provisional Diagnosis</label>
              <input
                defaultValue="Stage-1 Essential Hypertension / Controlled"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d4e0eb' }}
              />
            </div>
          </div>

          <table className="rx-table">
            <thead>
              <tr>
                <th>Medicine / Formulation</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Duration</th>
                <th>Food Instructions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>Telmisartan</b> 40mg Tab</td>
                <td>1 Tablet</td>
                <td>1 - 0 - 0</td>
                <td>30 Days</td>
                <td>After Breakfast</td>
              </tr>
              <tr>
                <td><b>Atorvastatin</b> 10mg Tab</td>
                <td>1 Tablet</td>
                <td>0 - 0 - 1</td>
                <td>30 Days</td>
                <td>Bedtime</td>
              </tr>
              <tr>
                <td><b>Electral Oral Rehydration</b></td>
                <td>1 Sachet</td>
                <td>As needed</td>
                <td>7 Days</td>
                <td>After Workouts</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: '16px' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '13px', marginBottom: '6px' }}>Doctor's Clinical Advice</label>
            <textarea
              defaultValue="Low sodium diet (< 2g/day), aerobic exercise 30 mins 4x/week, monitor home BP twice weekly."
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d4e0eb', minHeight: '60px' }}
            />
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#688297' }}>
              Digitally signed by: <b>Dr. Arjun Reddy (Reg #MCI-2018-9482)</b>
            </span>
            <button
              className="btn primary"
              onClick={() => setModal(`Prescription successfully generated for ${selectedPatient} and dispatched to CAREBRIDGE Pharmacy & Patient Portal.`)}
            >
              <CheckCircle2 size={16} /> Sign & Dispatch to Pharmacy
            </button>
          </div>
        </div>

        {modal && (
          <Modal title="Prescription Dispatched" onClose={() => setModal(null)}>
            <p>{modal}</p>
            <button className="btn primary full" onClick={() => setModal(null)}>Done</button>
          </Modal>
        )}
      </>
    );
  }

  // Diagnostic & Lab Reviews
  if (kind === 'records') {
    const reports = [
      { id: 1, patient: 'Rahul Kumar', test: 'Complete Blood Count (CBC) with Platelets', date: 'Today, 11:30 AM', status: 'Pending Review', finding: 'Hb: 14.8 g/dL, WBC: 6,800/mcL, Platelets: 2.4 Lakhs (Normal)' },
      { id: 2, patient: 'Meera Shah', test: '12-Lead Electrocardiogram (ECG)', date: 'Today, 09:15 AM', status: 'Requires Attention', finding: 'Sinus Tachycardia (Heart Rate 104 bpm), no ST elevation' },
      { id: 3, patient: 'Vikram Malhotra', test: '2D Echocardiogram with Doppler', date: 'Yesterday', status: 'Pending Review', finding: 'Mild concentric LV hypertrophy, Ejection Fraction 58%' },
      { id: 4, patient: 'Sunita Devi', test: 'Lipid Profile Panel', date: 'Yesterday', status: 'Approved', finding: 'Total Cholesterol: 182 mg/dL, LDL: 104 mg/dL, HDL: 46 mg/dL' },
    ];

    return (
      <>
        <PageHeader
          title="Diagnostic & Lab Investigations Desk"
          subtitle="Review laboratory reports, ECGs, and imaging results awaiting clinical sign-off."
        />

        <div className="panel">
          <div className="panel-head">
            <h2>Investigation Queue</h2>
            <span className="positive">{reports.length} Reports</span>
          </div>

          <div className="doctor-table-wrap">
            <table className="clinical-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Investigation</th>
                  <th>Report Date</th>
                  <th>Key Finding</th>
                  <th>Review Status</th>
                  <th>Clinical Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => {
                  const isApproved = labApprovals[r.id] || r.status === 'Approved';
                  return (
                    <tr key={r.id}>
                      <td><b>{r.patient}</b></td>
                      <td>{r.test}</td>
                      <td>{r.date}</td>
                      <td><small>{r.finding}</small></td>
                      <td>
                        <span className={`clinical-badge ${isApproved ? 'green' : r.status === 'Requires Attention' ? 'orange' : 'blue'}`}>
                          {isApproved ? 'Approved & Notified' : r.status}
                        </span>
                      </td>
                      <td>
                        {isApproved ? (
                          <span style={{ color: '#1f9463', fontSize: '12px', fontWeight: 700 }}>✓ Signed Off</span>
                        ) : (
                          <button
                            className="btn primary"
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                            onClick={() => {
                              setLabApprovals((prev) => ({ ...prev, [r.id]: true }));
                              setModal(`Report for ${r.patient} approved and patient notified via app.`);
                            }}
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {modal && (
          <Modal title="Lab Report Signed Off" onClose={() => setModal(null)}>
            <p>{modal}</p>
            <button className="btn primary full" onClick={() => setModal(null)}>Done</button>
          </Modal>
        )}
      </>
    );
  }

  // Care Gaps & Chronic Care Tracker
  if (kind === 'caregaps') {
    return (
      <>
        <PageHeader
          title="Care Gaps & Chronic Disease Tracking"
          subtitle="Proactive clinical monitoring for diabetic, cardiac, and hypertensive cohorts."
        />

        <div className="gap-columns">
          <div className="gap-column">
            <div className="gap-title" style={{ background: '#fff2e2', color: '#c97716' }}>
              <h2>Follow-up Overdue</h2>
              <span>2</span>
            </div>
            <div className="gap-card">
              <span>Cardiology Cohort</span>
              <h3>Rahul Kumar — 3-Month BP follow-up due in 3 days.</h3>
              <button onClick={() => setModal('Recall SMS and priority slot invitation sent to Rahul Kumar.')}>
                Trigger Recall SMS
              </button>
            </div>
          </div>

          <div className="gap-column">
            <div className="gap-title" style={{ background: '#feebee', color: '#d32f2f' }}>
              <h2>Lab Investigation Missing</h2>
              <span>1</span>
            </div>
            <div className="gap-card">
              <span>Endocrine Cohort</span>
              <h3>Ramesh Patel — HbA1c diabetic monitoring overdue by 14 days.</h3>
              <button onClick={() => setModal('Laboratory order for HbA1c generated and patient notified.')}>
                Order Lab Test
              </button>
            </div>
          </div>

          <div className="gap-column">
            <div className="gap-title" style={{ background: '#e8f8f0', color: '#1f9463' }}>
              <h2>Interventions Completed</h2>
              <span>4</span>
            </div>
            <div className="gap-card">
              <span>Routine Screening</span>
              <h3>Sunita Devi — Annual lipid profile completed and reviewed.</h3>
              <button onClick={() => setModal('Care gap marked closed in patient health record.')}>
                View Clinical Note
              </button>
            </div>
          </div>
        </div>

        {modal && (
          <Modal title="Care Intervention Triggered" onClose={() => setModal(null)}>
            <p>{modal}</p>
            <button className="btn primary full" onClick={() => setModal(null)}>Done</button>
          </Modal>
        )}
      </>
    );
  }

  // Emergency Triage
  if (kind === 'emergency') {
    const [searchId, setSearchId] = useState('CB-P-2026-0824');
    const [searched, setSearched] = useState(true);

    return (
      <>
        <PageHeader
          title="Emergency Clinical Triage"
          subtitle="Rapid UHID / QR access for acute emergency admissions and trauma coordination."
        />

        <div className="emergency-banner">
          <Ambulance />
          <div>
            <h2>Hospital Emergency Coordination Network</h2>
            <p>Direct line to Hospital Trauma Center, Blood Bank, and Intensive Care Unit.</p>
          </div>
          <button className="btn white" onClick={() => window.open('tel:112')}>
            Dial Trauma Center (112)
          </button>
        </div>

        <div className="panel" style={{ marginBottom: '20px' }}>
          <h2>Emergency Medical ID Instant Lookup</h2>
          <p style={{ color: '#688297', fontSize: '13px' }}>Scan patient QR card or input UHID to pull emergency profile immediately:</p>

          <form
            className="triage-search"
            onSubmit={(e) => {
              e.preventDefault();
              setSearched(true);
            }}
          >
            <input
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Patient UHID (e.g. CB-P-2026-0824)"
            />
            <button type="submit" className="btn primary">
              <Search size={16} /> Lookup Profile
            </button>
          </form>

          {searched && (
            <div className="emergency-grid">
              <div className="panel" style={{ border: '1px solid #e2edf7' }}>
                <div className="panel-head">
                  <h2>Patient Emergency Card</h2>
                  <span className="clinical-badge green">Verified UHID</span>
                </div>
                <div className="detail-grid">
                  <span>Full Name</span><b>Rahul Kumar (28 Yrs · Male)</b>
                  <span>Blood Group</span><b style={{ color: '#d32f2f', fontSize: '16px' }}>B+ Positive</b>
                  <span>Emergency Contact</span><b>Anita Kumar (Mother) · 98765 43210</b>
                  <span>Primary Physician</span><b>Dr. Arjun Reddy, MD</b>
                  <span>Known Drug Allergies</span><b>None Recorded</b>
                  <span>Chronic Conditions</span><b>Controlled Hypertension</b>
                </div>
              </div>

              <div className="qr-card">
                <div className="qr">
                  <QrCode />
                </div>
                <h2>UHID QR Code</h2>
                <p>CB-P-2026-0824</p>
                <button className="btn outline" onClick={() => setModal('UHID record synced with Emergency Department registry.')}>
                  <Check size={16} /> Sync with Trauma Registry
                </button>
              </div>
            </div>
          )}
        </div>

        {modal && (
          <Modal title="Emergency Registry" onClose={() => setModal(null)}>
            <p>{modal}</p>
            <button className="btn primary full" onClick={() => setModal(null)}>Done</button>
          </Modal>
        )}
      </>
    );
  }

  // Clinical Schedule
  if (kind === 'schedule') {
    return (
      <>
        <PageHeader
          title="Clinical Schedule & OPD Slot Allocation"
          subtitle="Manage OPD hours, in-person consultation slots, and video appointments."
        />

        <div className="panel">
          <h2>Active OPD Sessions</h2>
          <div className="appointment-list">
            <div className="appointment-row">
              <div className="date-box"><CalendarDays /><b>Mon - Fri</b></div>
              <div>
                <h3>Morning In-Person Cardiology OPD</h3>
                <p>09:00 AM — 01:00 PM · Central Block Room 302 · Max 20 Patients</p>
              </div>
              <span className="badge green">Active</span>
              <button className="btn outline" onClick={() => setModal('Morning OPD session slots configured.')}>Slots</button>
            </div>

            <div className="appointment-row">
              <div className="date-box"><Video /><b>Mon - Fri</b></div>
              <div>
                <h3>Afternoon Video Telehealth Consultations</h3>
                <p>02:30 PM — 05:00 PM · Digital Telehealth Suite · Max 10 Consults</p>
              </div>
              <span className="badge green">Active</span>
              <button className="btn outline" onClick={() => setModal('Video consultation slots configured.')}>Slots</button>
            </div>

            <div className="appointment-row">
              <div className="date-box"><Activity /><b>Daily</b></div>
              <div>
                <h3>Inpatient & CCU Ward Rounds</h3>
                <p>05:30 PM — 07:00 PM · Cardiac Care Unit</p>
              </div>
              <span className="badge blue">Scheduled</span>
              <button className="btn outline" onClick={() => setModal('Ward round roster updated.')}>Roster</button>
            </div>
          </div>
        </div>

        {modal && (
          <Modal title="Schedule Updated" onClose={() => setModal(null)}>
            <p>{modal}</p>
            <button className="btn primary full" onClick={() => setModal(null)}>Done</button>
          </Modal>
        )}
      </>
    );
  }

  // Clinical Settings
  return (
    <>
      <PageHeader
        title="Clinical Profile & Credentials"
        subtitle="Manage your medical registration, hospital affiliation, and clinical preferences."
      />
      <div className="panel">
        <h2>Physician Profile</h2>
        <div className="settings-form">
          <label>
            Full Name & Qualifications
            <input defaultValue="Dr. Arjun Reddy, MD, DM (Cardiology)" />
          </label>
          <label>
            Medical Council Registration No.
            <input defaultValue="MCI-2018-9482 (Verified)" />
          </label>
          <label>
            Specialization & Department
            <input defaultValue="Cardiology & Cardiovascular Sciences" />
          </label>
          <label>
            Hospital & Room Allocation
            <input defaultValue="CAREBRIDGE Medical Center • Room 302" />
          </label>
          <button className="btn primary" onClick={() => setModal('Clinical credentials and profile updated.')}>
            Save Changes
          </button>
        </div>
      </div>

      {modal && (
        <Modal title="Settings Saved" onClose={() => setModal(null)}>
          <p>{modal}</p>
          <button className="btn primary full" onClick={() => setModal(null)}>Done</button>
        </Modal>
      )}
    </>
  );
}

// ----------------- PATIENT PORTAL PAGES ----------------- //

function Dashboard() {
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);

  return (
    <>
      <PageHeader title="Good morning, Rahul 👋" subtitle="Here is your personal care overview for today." />

      <div className="upcoming-banner">
        <div className="banner-icon">
          <Video />
        </div>
        <div>
          <span>UPCOMING APPOINTMENT</span>
          <h3>Dr. Arjun Reddy</h3>
          <p>Today at 4:30 PM · Video consultation</p>
        </div>
        <button className="btn white" onClick={() => navigate('/app/consultations')}>
          Join consultation
        </button>
      </div>

      <div className="stats-grid">
        <Stat label="Active care plans" value="2" icon={ClipboardList} />
        <Stat label="Pending actions" value="3" icon={Clock3} color="orange" />
        <Stat label="Current medicines" value="4" icon={Pill} color="purple" />
        <Stat label="Next follow-up" value="3 days" icon={CalendarDays} color="green" />
      </div>

      <div className="section-title">
        <h2>Quick actions</h2>
      </div>
      <div className="quick-grid">
        <button onClick={() => navigate('/app/appointments')}>
          <CalendarDays />
          <span>Book appointment</span>
        </button>
        <button onClick={() => navigate('/app/consultations')}>
          <Stethoscope />
          <span>Consult doctor</span>
        </button>
        <button onClick={() => navigate('/app/pharmacy')}>
          <ShoppingBag />
          <span>Order medicine</span>
        </button>
        <button className="danger" onClick={() => navigate('/app/emergency')}>
          <Ambulance />
          <span>Emergency</span>
        </button>
        <button onClick={() => navigate('/app/blood')}>
          <Droplets />
          <span>Blood help</span>
        </button>
        <button onClick={() => navigate('/app/records')}>
          <FileHeart />
          <span>View records</span>
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-head">
            <h2>Care health</h2>
            <span className="positive">+8% this month</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="health" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1677d2" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#1677d2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="n" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip />
              <Area type="monotone" dataKey="v" stroke="#1677d2" strokeWidth={3} fill="url(#health)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h2>Today's care plan</h2>
            <button className="text-button" onClick={() => navigate('/app/careplan')}>
              View all
            </button>
          </div>
          <div className="task done">
            <Check />
            <div>
              <b>Morning medication</b>
              <span>Completed at 8:15 AM</span>
            </div>
          </div>
          <div className="task">
            <Clock3 />
            <div>
              <b>Blood pressure check</b>
              <span>Due by 12:00 PM</span>
            </div>
          </div>
          <div className="task" onClick={() => setModal(true)}>
            <Activity />
            <div>
              <b>Complete symptom check-in</b>
              <span>Tap to update</span>
            </div>
          </div>
        </div>
      </div>

      {modal && (
        <Modal title="Care check-in" onClose={() => setModal(false)}>
          <p>How are you feeling today?</p>
          <div className="mood-row">
            {['Better', 'Same', 'Worse'].map((x) => (
              <button key={x}>{x}</button>
            ))}
          </div>
          <button className="btn primary full" onClick={() => setModal(false)}>
            Save check-in
          </button>
        </Modal>
      )}
    </>
  );
}

function GenericPage({ kind }: { kind: string }) {
  const [modal, setModal] = useState<string | null>(null);
  const [medicineSearch, setMedicineSearch] = useState('');

  const titles: Record<string, [string, string]> = {
    patient360: ['Patient 360°', 'A complete longitudinal overview of your personal health history.'],
    appointments: ['Appointments', 'Schedule and manage consultations with your hospital care team.'],
    consultations: ['Consultations', 'Connect with your doctor via encrypted video and audio sessions.'],
    journey: ['Health Journey', 'Follow your healthcare progression from consultation to recovery.'],
    gaps: ['Care Gaps', 'Clinical workflow items and preventive screenings requiring your attention.'],
    careplan: ['Care Plan', 'Your personalized daily goals and treatment adherence schedule.'],
    records: ['Medical Records', 'Review your official consultations, laboratory reports, and clinical documents.'],
    prescriptions: ['Prescriptions', 'Your active and past medications authorized by Dr. Arjun Reddy.'],
    pharmacy: ['CareBridge Pharmacy', 'Search genuine medicines with doorstep delivery and order tracking.'],
    medicines: ['Medicine History', 'Comprehensive log of all current and historical pharmaceutical treatments.'],
    blood: ['Blood Help', 'Request compatible blood units and coordinate verified donor support.'],
    organ: ['Organ Donation Registry', 'Review registration status, counselling resources, and pledge support.'],
    family: ['Family Health', 'Manage linked health records and appointments for your dependents.'],
    emergency: ['Emergency Support', 'Fast access to your Medical ID QR and critical emergency contacts.'],
    ai: ['AI Health Summary', 'Clinical AI summary synthesized from your verified medical reports.'],
    notifications: ['Notifications', 'Clinical updates and appointment reminders for your care journey.'],
    privacy: ['Privacy & Access Control', 'Manage patient consent and control which care providers can view your file.'],
    settings: ['Settings', 'Manage your personal profile, preferred language, and notification channels.'],
  };

  const [title, subtitle] = titles[kind] || ['Dashboard', ''];

  if (kind === 'patient360') {
    return (
      <>
        <PageHeader title={title} subtitle={subtitle} />
        <div className="patient-profile">
          <div className="avatar large">RK</div>
          <div>
            <h2>Rahul Kumar</h2>
            <p>28 years · B+ blood group · UHID: CB-P-2026-0824</p>
            <span>Primary Doctor: Dr. Arjun Reddy, MD</span>
          </div>
          <div className="profile-score">
            <b>82</b>
            <span>Care health score</span>
          </div>
        </div>
        <div className="record-grid">
          {[
            ['Consultations', '12'],
            ['Hospital visits', '3'],
            ['Prescriptions', '8'],
            ['Lab reports', '15'],
            ['Follow-ups', '6'],
            ['Medicines', '4'],
          ].map((x) => (
            <div className="record-card" key={x[0]}>
              <FileHeart />
              <span>{x[0]}</span>
              <strong>{x[1]}</strong>
            </div>
          ))}
        </div>
        <div className="panel">
          <div className="panel-head">
            <h2>Health trend</h2>
            <span className="positive">Improving</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <XAxis dataKey="n" />
              <YAxis />
              <Tooltip />
              <Area dataKey="v" stroke="#1677d2" fill="#dceefe" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </>
    );
  }

  if (kind === 'appointments') {
    return (
      <>
        <PageHeader title={title} subtitle={subtitle} action="Book appointment" />
        <div className="appointment-list">
          {[
            ['Today, 4:30 PM', 'Dr. Arjun Reddy', 'Video consultation', 'Confirmed'],
            ['4 Nov, 10:00 AM', 'Dr. Meera Shah', 'Cardiology follow-up', 'Confirmed'],
            ['18 Nov, 2:30 PM', 'Dr. Nikhil Rao', 'Lab review', 'Pending'],
          ].map((x, i) => (
            <div className="appointment-row" key={i}>
              <div className="date-box">
                <CalendarDays />
                <b>{x[0]}</b>
              </div>
              <div className="doctor-avatar">DR</div>
              <div>
                <h3>{x[1]}</h3>
                <p>{x[2]}</p>
              </div>
              <span className={`badge ${x[3] === 'Confirmed' ? 'green' : 'orange'}`}>{x[3]}</span>
              <button className="btn outline" onClick={() => setModal('appointment')}>
                {i === 0 ? 'Join Call' : 'Details'}
              </button>
            </div>
          ))}
        </div>
        {modal && (
          <Modal title="Appointment details" onClose={() => setModal(null)}>
            <div className="detail-grid">
              <span>Doctor</span><b>Dr. Arjun Reddy</b>
              <span>Time</span><b>Today, 4:30 PM</b>
              <span>Type</span><b>Encrypted Video Consultation</b>
            </div>
            <button className="btn primary full" onClick={() => setModal(null)}>Done</button>
          </Modal>
        )}
      </>
    );
  }

  if (kind === 'consultations') {
    return (
      <>
        <PageHeader title={title} subtitle={subtitle} />
        <div className="consult-grid">
          {[
            ['Video consultation', Video, 'blue'],
            ['Audio consultation', Phone, 'green'],
            ['Secure messaging', MessageCircle, 'purple'],
          ].map(([n, Icon, c]: any) => (
            <button className="consult-card" onClick={() => setModal(String(n))} key={n}>
              <div className={`feature-icon ${c}`}>
                <Icon />
              </div>
              <h2>{n}</h2>
              <p>Start an encrypted session with Dr. Arjun Reddy.</p>
              <span>Connect now <ArrowRight /></span>
            </button>
          ))}
        </div>
        <div className="panel">
          <h2>Recent consultations</h2>
          <div className="table">
            <div>
              <b>Doctor</b>
              <b>Date</b>
              <b>Summary</b>
              <b>Status</b>
            </div>
            <div>
              <span>Dr. Arjun Reddy</span>
              <span>12 Sep 2026</span>
              <span>Cardiology follow-up</span>
              <span className="badge green">Completed</span>
            </div>
          </div>
        </div>
        {modal && (
          <Modal title={String(modal)} onClose={() => setModal(null)}>
            <div className="consult-ready">
              <Video />
              <h2>Encrypted Teleconsultation Room</h2>
              <p>Connecting to Dr. Arjun Reddy, MD...</p>
            </div>
            <button className="btn primary full" onClick={() => setModal(null)}>
              Enter Consultation Room
            </button>
          </Modal>
        )}
      </>
    );
  }

  if (kind === 'journey') {
    const events = ['Appointment', 'Consultation', 'Prescription', 'Investigation', 'Result', 'Follow-up', 'Outcome'];
    return (
      <>
        <PageHeader title={title} subtitle={subtitle} />
        <div className="journey">
          <div className="journey-line"></div>
          {events.map((e, i) => (
            <button key={e} onClick={() => setModal(e)} className={i === 3 ? 'active' : ''}>
              <div>
                {i === 0 ? <CalendarDays /> : i === 2 ? <Pill /> : i === 3 ? <TestTubeDiagonal /> : i === 6 ? <Heart /> : <Check />}
              </div>
              <span>{e}</span>
              <small>{i === 3 ? 'In Progress' : 'Completed'}</small>
            </button>
          ))}
        </div>
        {modal && (
          <Modal title={modal || ''} onClose={() => setModal(null)}>
            <div className="detail-grid">
              <span>Event</span><b>{modal}</b>
              <span>Date</span><b>15 Oct 2026</b>
              <span>Status</span><b>{modal === 'Investigation' ? 'In Progress' : 'Completed'}</b>
            </div>
            {modal === 'Investigation' && <p>Blood test result verified and uploaded by central pathology lab.</p>}
            <button className="btn primary full" onClick={() => setModal(null)}>View details</button>
          </Modal>
        )}
      </>
    );
  }

  if (kind === 'gaps') {
    return (
      <>
        <PageHeader title={title} subtitle={subtitle} />
        <div className="gap-columns">
          {[
            ['Pending', ['Blood test investigation awaiting pathology review.']],
            ['Due soon', ['Cardiology follow-up due in 3 days.']],
            ['Action required', ['Morning medication adherence check.']],
            ['Completed', ['Previous consultation notes recorded.']],
          ].map(([s, x]: any) => (
            <div className="gap-column" key={s}>
              <div className={`gap-title ${String(s).toLowerCase().replace(' ', '-')}`}>
                <h2>{s}</h2>
                <span>{x.length}</span>
              </div>
              <div className="gap-card">
                <span>{String(s) === 'Completed' ? 'Recorded' : 'Action needed'}</span>
                <h3>{x[0]}</h3>
                <button>{s === 'Completed' ? 'View Record' : 'Resolve'}</button>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (kind === 'blood') {
    return (
      <>
        <PageHeader title={title} subtitle={subtitle} action="Request blood" />
        <div className="blood-banner">
          <Droplets />
          <div>
            <h2>Every drop can save a life.</h2>
            <p>Submit a request and CAREBRIDGE coordinates with verified regional blood banks.</p>
          </div>
        </div>
        <div className="workflow">
          <h2>Active Request · CB-BLD-4028</h2>
          {['Blood request registered', 'Donor cross-match initiated', 'Donors contacted', 'Ready for hospital delivery'].map((x, i) => (
            <div key={x} className={i === 3 ? '' : 'done'}>
              <span>{i + 1}</span>
              <b>{x}</b>
              <small>{i < 2 ? 'Completed' : 'Active'}</small>
            </div>
          ))}
        </div>
        <div className="panel">
          <h2>Nearby Compatible Donors (B+ Group)</h2>
          {['Ananya S.', 'Vikram M.', 'Neha P.'].map((n, i) => (
            <div className="donor-row" key={n}>
              <div className="avatar">{n[0]}</div>
              <div>
                <b>{n}</b>
                <span>B+ · {i + 2} km away · Verified donor</span>
              </div>
              <button className="btn outline" onClick={() => setModal('Donor contact request initiated')}>
                Contact Donor
              </button>
            </div>
          ))}
        </div>
        {modal && (
          <Modal title={modal} onClose={() => setModal(null)}>
            <p>Your request has been routed to the hospital coordination network.</p>
            <button className="btn primary full" onClick={() => setModal(null)}>Continue</button>
          </Modal>
        )}
      </>
    );
  }

  if (kind === 'organ') {
    return (
      <>
        <PageHeader title={title} subtitle={subtitle} />
        <div className="organ-hero">
          <HeartPulse />
          <div>
            <h2>National Organ Donation Registry</h2>
            <p>CAREBRIDGE provides authorized counselling and secure donor registration coordination.</p>
          </div>
        </div>
        <div className="organ-grid">
          <div className="panel">
            <h2>Registry Status</h2>
            <div className="empty-state">
              <Heart />
              <h3>Pledge Recorded</h3>
              <p>Your pledge is registered under national digital health ID CB-P-0824.</p>
              <button className="btn primary" onClick={() => setModal('Pledge Certificate Downloaded')}>
                Download Donor Card
              </button>
            </div>
          </div>
          <div className="panel">
            <h2>Awareness & Guidelines</h2>
            {['Donor eligibility criteria', 'Legal & family consent process', 'Authorized counselling contacts'].map((x) => (
              <div className="resource" key={x}>
                {x}
                <ChevronRight />
              </div>
            ))}
          </div>
        </div>
        {modal && (
          <Modal title={modal} onClose={() => setModal(null)}>
            <p>Your donor pledge certificate is verified and accessible under your medical records.</p>
            <button className="btn primary full" onClick={() => setModal(null)}>Done</button>
          </Modal>
        )}
      </>
    );
  }

  if (kind === 'pharmacy' || kind === 'medicines' || kind === 'prescriptions' || kind === 'records') {
    const medicines: [string, string, string, string][] = [
      ['Telmisartan 40mg', 'Blood Pressure', '₹92', '30 tablets · 1 daily'],
      ['Atorvastatin 10mg', 'Lipid Control', '₹135', '30 tablets · 1 daily'],
      ['Paracetamol 650mg', 'Pain & Fever', '₹32', '15 tablets · As needed'],
      ['Vitamin D3 60K', 'Supplements', '₹289', '4 capsules · 1 weekly'],
    ];
    const filteredMedicines = medicines.filter((m) =>
      m.join(' ').toLowerCase().includes(medicineSearch.trim().toLowerCase())
    );

    return (
      <>
        <PageHeader
          title={title}
          subtitle={subtitle}
          action={kind === 'pharmacy' ? undefined : 'Download Clinical PDF'}
        />
        {kind === 'pharmacy' && (
          <form
            className="search-box"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              setMedicineSearch(medicineSearch.trim());
            }}
          >
            <Search />
            <input
              aria-label="Search medicines"
              placeholder="Search genuine medicines, brands, or health categories"
              value={medicineSearch}
              onChange={(e) => setMedicineSearch(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        )}
        {filteredMedicines.length ? (
          <div className="medicine-grid">
            {filteredMedicines.map((m) => (
              <div className="medicine-card" key={m[0]}>
                <div className="medicine-art">
                  <Pill />
                </div>
                <span>{m[1]}</span>
                <h3>{m[0]}</h3>
                <p>{m[3]}</p>
                <div>
                  <strong>{m[2]}</strong>
                  {kind === 'pharmacy' && (
                    <button className="btn outline" onClick={() => setModal('Added to cart')}>
                      Add to cart
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="search-empty-state">No medicines match “{medicineSearch}”. Try another query.</div>
        )}
        {modal && (
          <Modal title="Cart Updated" onClose={() => setModal(null)}>
            <p>Item added to your order. Proceed to checkout to review doorstep delivery details.</p>
            <button className="btn primary full" onClick={() => setModal(null)}>View Cart & Checkout</button>
          </Modal>
        )}
      </>
    );
  }

  if (kind === 'emergency') {
    return (
      <>
        <PageHeader title={title} subtitle={subtitle} />
        <div className="emergency-banner">
          <Ambulance />
          <div>
            <h2>Immediate Emergency Assistance</h2>
            <p>If you or someone nearby is experiencing acute symptoms, contact emergency services immediately.</p>
          </div>
          <button className="btn white" onClick={() => window.open('tel:112')}>
            Call 112
          </button>
        </div>
        <div className="emergency-grid">
          <div className="panel">
            <div className="panel-head">
              <h2>Emergency Medical Profile</h2>
              <button className="text-button" onClick={() => setModal('Profile edit mode enabled')}>
                Edit
              </button>
            </div>
            <div className="detail-grid">
              <span>Blood Group</span><b>B+ Positive</b>
              <span>Emergency Contact</span><b>Anita Kumar · 98765 43210</b>
              <span>Primary Care Doctor</span><b>Dr. Arjun Reddy, MD</b>
              <span>Known Drug Allergies</span><b>None recorded</b>
              <span>Chronic Conditions</span><b>Hypertension (Stage 1)</b>
            </div>
          </div>
          <div className="qr-card">
            <div className="qr">
              <QrCode />
            </div>
            <h2>CARE MEDICAL QR ID</h2>
            <p>CB-P-2026-0824</p>
            <button className="btn outline" onClick={() => setModal('Medical ID QR saved to your device.')}>
              <Download /> Download QR Card
            </button>
          </div>
        </div>
        {modal && (
          <Modal title="Emergency Profile" onClose={() => setModal(null)}>
            <p>{modal}</p>
            <button className="btn primary full" onClick={() => setModal(null)}>Done</button>
          </Modal>
        )}
      </>
    );
  }

  if (kind === 'ai') {
    return (
      <>
        <PageHeader title={title} subtitle={subtitle} />
        <div className="ai-layout">
          <div className="panel ai-summary">
            <div className="ai-head">
              <Sparkles />
              <div>
                <h2>Clinical Health Summary</h2>
                <span>Synthesized from verified patient medical history</span>
              </div>
            </div>
            <h3>Current Care Picture</h3>
            <p>
              Rahul has a scheduled cardiology video follow-up with Dr. Arjun Reddy today. His blood pressure
              remains well managed under current pharmacotherapy (Telmisartan 40mg), and routine CBC lab results
              have been reviewed and signed off as within normal parameters.
            </p>
            <h3>Action Items</h3>
            <ul>
              <li>Attend today's 4:30 PM video appointment with Dr. Arjun Reddy.</li>
              <li>Maintain regular hydration following morning cardio exercises.</li>
              <li>Continue morning medication as scheduled.</li>
            </ul>
            <div className="notice">
              <ShieldCheck />
              <p>Generated by CAREBRIDGE Clinical AI. All recommendations verified with clinical care team protocols.</p>
            </div>
          </div>
          <div className="panel">
            <h2>Data Sources Consulted</h2>
            {['Cardiology Consultations', 'Recent CBC Lab Reports', 'Active Care Plan', 'Prescription History'].map((x) => (
              <div className="data-source" key={x}>
                <FileHeart />
                <span>{x}</span>
                <Check />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  if (kind === 'privacy') {
    return (
      <>
        <PageHeader title={title} subtitle={subtitle} />
        <div className="privacy-grid">
          <div className="panel">
            <h2>Provider Access Permissions</h2>
            {['Dr. Arjun Reddy (Cardiology)', 'Anita Kumar (Family Access)', 'Central Pathology Lab'].map((x, i) => (
              <div className="access-row" key={x}>
                <div className="avatar">{x[0]}</div>
                <div>
                  <b>{x}</b>
                  <span>{i === 0 ? 'Full Care Team Access' : 'Read-Only Medical Records'}</span>
                </div>
                <button className={`toggle ${i < 2 ? 'on' : ''}`}>
                  <span></span>
                </button>
              </div>
            ))}
          </div>
          <div className="panel">
            <h2>Access Audit Logs</h2>
            {[
              ['Dr. Arjun Reddy', 'Today, 3:42 PM', 'Prescriptions & Notes'],
              ['Central Pathology Lab', 'Yesterday', 'Lab Report Signoff'],
            ].map((x, i) => (
              <div className="log-row" key={i}>
                <LockKeyhole />
                <div>
                  <b>{x[0]}</b>
                  <span>{x[1]} · {x[2]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  // Notifications or Settings
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="panel">
        <h2>{title === 'Notifications' ? 'Recent Health Alerts' : 'Profile & App Settings'}</h2>
        {kind === 'notifications' ? (
          [
            'Your routine CBC blood report has been approved by Dr. Arjun Reddy.',
            'Upcoming video consultation with Dr. Arjun Reddy in 1 hour.',
            'Morning medication adherence recorded successfully.',
          ].map((x, i) => (
            <div className="notification" key={x}>
              <Bell />
              <div>
                <b>{x}</b>
                <span>{i + 1} hour ago</span>
              </div>
            </div>
          ))
        ) : (
          <div className="settings-form">
            <label>
              Full name
              <input defaultValue="Rahul Kumar" />
            </label>
            <label>
              Mobile number
              <input defaultValue="+91 98765 43210" />
            </label>
            <label>
              Preferred language
              <select defaultValue="English">
                <option>English</option>
                <option>हिन्दी</option>
                <option>తెలుగు</option>
              </select>
            </label>
            <button className="btn primary" onClick={() => setModal('Profile settings updated successfully.')}>
              Save changes
            </button>
          </div>
        )}
      </div>

      {modal && (
        <Modal title="Preferences Updated" onClose={() => setModal(null)}>
          <p>{modal}</p>
          <button className="btn primary full" onClick={() => setModal(null)}>Done</button>
        </Modal>
      )}
    </>
  );
}

// ----------------- SHELL & LAYOUT COMPONENT ----------------- //

function AppShell({ role }: { role: UserRole }) {
  const isDoctor = role === 'doctor';
  const navItems = isDoctor ? doctorNavItems : patientNavItems;

  const user = isDoctor
    ? {
        initials: 'AR',
        name: 'Dr. Arjun Reddy, MD',
        shortName: 'Dr. Arjun Reddy',
        sub: 'Cardiologist · Reg #9482',
        roleLabel: 'DOCTOR PORTAL',
        badge: 'Doctor',
        id: 'Reg: MCI-2018-9482',
        meta: 'Cardiology OPD · Room 302',
        profilePath: '/doctor/settings',
      }
    : {
        initials: 'RK',
        name: 'Rahul Kumar',
        shortName: 'Rahul Kumar',
        sub: 'Patient ID · CB-P-0824',
        roleLabel: 'PATIENT PORTAL',
        badge: 'Patient',
        id: 'UHID: CB-P-2026-0824',
        meta: 'Blood Group: B+',
        profilePath: '/app/patient360',
      };

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [lang, setLang] = useState<'EN' | 'HI' | 'TE'>('EN');
  const searchInput = useRef<HTMLInputElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const searchResults = navItems.filter(([, label]) =>
    label.toLowerCase().includes(search.trim().toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [profileOpen]);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInput.current?.focus();
      }
      if (event.key === 'Escape') {
        setSearch('');
        setProfileOpen(false);
        searchInput.current?.blur();
      }
    }
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  function signOut() {
    clearActiveRole();
    if (supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    navigate('/login');
  }

  function cycleLanguage() {
    setLang((prev) => (prev === 'EN' ? 'HI' : prev === 'HI' ? 'TE' : 'EN'));
  }

  const basePath = isDoctor ? '/doctor' : '/app';

  function navigateToSearchResult(path: string) {
    navigate(`${basePath}/${path}`);
    setSearch('');
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const firstResult = searchResults[0];
    if (firstResult) navigateToSearchResult(firstResult[0]);
  }

  return (
    <div className="app-shell">
      <aside className={open ? 'open' : ''} aria-label={`${user.roleLabel} Navigation`}>
        <div className="sidebar-brand">
          <Brand />
          <button type="button" aria-label="Close navigation" onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        <div className={`role-chip ${isDoctor ? 'doctor' : ''}`} style={isDoctor ? { background: '#e6f7ef', color: '#1f9463' } : {}}>
          {user.roleLabel}
        </div>

        <nav>
          {navItems.map(([path, label, Icon]) => (
            <NavLink key={path} to={`${basePath}/${path}`} onClick={() => setOpen(false)}>
              <Icon />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div
          className="sidebar-user"
          onClick={() => navigate(user.profilePath)}
          title={`View ${user.shortName}'s profile`}
        >
          <div className="avatar" style={isDoctor ? { background: '#e8f8f0', color: '#1f9463' } : {}}>
            {user.initials}
          </div>
          <div>
            <b>{user.shortName}</b>
            <span>{user.sub}</span>
          </div>
          <button
            type="button"
            aria-label="Sign out"
            onClick={(event) => {
              event.stopPropagation();
              signOut();
            }}
          >
            <LogOut />
          </button>
        </div>
      </aside>

      {open && <button type="button" className="sidebar-overlay" aria-label="Close navigation" onClick={() => setOpen(false)} />}

      <main className="app-main">
        <header className="app-header">
          <button
            type="button"
            className="menu-button"
            aria-label="Open navigation"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>

          <form className="global-search" role="search" onSubmit={submitSearch}>
            <Search />
            <input
              ref={searchInput}
              aria-label="Search sections"
              autoComplete="off"
              placeholder={isDoctor ? 'Search patient queue, UHID, or clinical sections' : 'Search records, doctors, or health services'}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <kbd>Ctrl K</kbd>
            {search.trim() && (
              <div className="global-search-results" aria-label="Search results">
                {searchResults.length ? (
                  searchResults.map(([path, label, Icon]) => (
                    <button type="button" key={path} onClick={() => navigateToSearchResult(path)}>
                      <Icon size={17} />
                      {label}
                    </button>
                  ))
                ) : (
                  <span className="global-search-empty" role="status">No matching sections found.</span>
                )}
              </div>
            )}
          </form>

          <div className="header-actions">
            <button
              type="button"
              className="language"
              aria-label={`Current language: ${lang}. Click to switch.`}
              title="Switch Language (EN / हिन्दी / తెలుగు)"
              onClick={cycleLanguage}
            >
              <Languages size={16} /> {lang}
            </button>

            <button
              type="button"
              aria-label="Notifications"
              onClick={() => navigate(isDoctor ? '/doctor/dashboard' : '/app/notifications')}
            >
              <Bell />
              <i>{isDoctor ? '5' : '3'}</i>
            </button>

            <div className="header-avatar-wrap" ref={profileMenuRef}>
              <button
                type="button"
                className="avatar header-avatar-btn"
                aria-label="User profile and account menu"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((prev) => !prev)}
                style={isDoctor ? { background: '#e8f8f0', color: '#1f9463' } : {}}
              >
                <span>{user.initials}</span>
                <span className="avatar-status-dot" aria-hidden="true"></span>
              </button>

              {profileOpen && (
                <div className="profile-dropdown" role="menu">
                  <div className="profile-dropdown-header">
                    <div
                      className="avatar large-sm"
                      style={isDoctor ? { background: '#e8f8f0', color: '#1f9463' } : {}}
                    >
                      {user.initials}
                    </div>
                    <div className="profile-dropdown-user">
                      <strong>{user.name}</strong>
                      <span className={`profile-badge ${isDoctor ? 'doctor' : ''}`} style={isDoctor ? { background: '#e8f8f0', color: '#1f9463' } : {}}>
                        {user.badge}
                      </span>
                      <span className="profile-id">{user.id}</span>
                      <span className="profile-blood">{user.meta}</span>
                    </div>
                  </div>

                  <div className="profile-dropdown-divider"></div>

                  <div className="profile-dropdown-section">
                    <span className="profile-section-title">
                      {isDoctor ? 'Doctor Workspace' : 'Patient Services'}
                    </span>
                    {isDoctor ? (
                      <>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            navigate('/doctor/queue');
                            setProfileOpen(false);
                          }}
                        >
                          <Users size={16} /> OPD Patient Queue
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            navigate('/doctor/prescriptions');
                            setProfileOpen(false);
                          }}
                        >
                          <Pill size={16} /> E-Prescriptions Desk
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            navigate('/doctor/records');
                            setProfileOpen(false);
                          }}
                        >
                          <FileHeart size={16} /> Lab & Diagnostic Reviews
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            navigate('/doctor/settings');
                            setProfileOpen(false);
                          }}
                        >
                          <Settings size={16} /> Clinical Settings
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            navigate('/app/patient360');
                            setProfileOpen(false);
                          }}
                        >
                          <CircleUserRound size={16} /> Patient 360° Profile
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            navigate('/app/careplan');
                            setProfileOpen(false);
                          }}
                        >
                          <FileHeart size={16} /> Active Care Plan
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            navigate('/app/emergency');
                            setProfileOpen(false);
                          }}
                        >
                          <Ambulance size={16} /> Emergency ID & QR
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            navigate('/app/privacy');
                            setProfileOpen(false);
                          }}
                        >
                          <ShieldCheck size={16} /> Privacy & Sharing
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            navigate('/app/settings');
                            setProfileOpen(false);
                          }}
                        >
                          <Settings size={16} /> Profile & Settings
                        </button>
                      </>
                    )}
                  </div>

                  <div className="profile-dropdown-divider"></div>

                  <div className="profile-dropdown-section">
                    <span className="profile-section-title">Switch Portal</span>
                    {isDoctor ? (
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setActiveRole('patient');
                          setProfileOpen(false);
                          navigate('/app/dashboard');
                        }}
                      >
                        <CircleUserRound size={16} /> Switch to Patient Portal
                      </button>
                    ) : (
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setActiveRole('doctor');
                          setProfileOpen(false);
                          navigate('/doctor/dashboard');
                        }}
                      >
                        <Stethoscope size={16} /> Switch to Doctor Portal
                      </button>
                    )}
                  </div>

                  <div className="profile-dropdown-divider"></div>

                  <button
                    type="button"
                    className="profile-logout-btn"
                    role="menuitem"
                    onClick={() => {
                      setProfileOpen(false);
                      signOut();
                    }}
                  >
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="page-content">
          <Routes>
            {isDoctor ? (
              <>
                <Route path="dashboard" element={<DoctorPages kind="dashboard" />} />
                {doctorNavItems
                  .filter((item) => item[0] !== 'dashboard')
                  .map(([path]) => (
                    <Route key={path} path={path} element={<DoctorPages kind={path} />} />
                  ))}
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </>
            ) : (
              <>
                <Route path="dashboard" element={<Dashboard />} />
                {patientNavItems
                  .filter((item) => item[0] !== 'dashboard')
                  .map(([path]) => (
                    <Route key={path} path={path} element={<GenericPage kind={path} />} />
                  ))}
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </>
            )}
          </Routes>
        </div>
      </main>
    </div>
  );
}

function ProtectedRoute({ children, allowedRole }: { children: ReactNode; allowedRole?: UserRole }) {
  const currentRole = getActiveRole();
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    let active = true;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setAuthenticated(Boolean(session));
    });

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) setAuthError(error.message);
        else setAuthenticated(Boolean(data.session));
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setAuthError(error instanceof Error ? error.message : 'Unable to verify session.');
        setLoading(false);
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div className="auth-loading">Checking secure session...</div>;
  if (authError) return <div className="auth-loading" role="alert">Authentication Error: {authError}</div>;
  if (isSupabaseConfigured && !authenticated) return <Navigate to="/login" replace />;

  if (allowedRole && currentRole !== allowedRole) {
    return <Navigate to={currentRole === 'doctor' ? '/doctor/dashboard' : '/app/dashboard'} replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/app/*"
          element={
            <ProtectedRoute allowedRole="patient">
              <AppShell role="patient" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/*"
          element={
            <ProtectedRoute allowedRole="doctor">
              <AppShell role="doctor" />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
