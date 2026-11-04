import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { BrowserRouter, NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import {
  Activity, Ambulance, Bell, CalendarDays, ChevronRight, CircleUserRound, ClipboardList,
  Droplets, FileHeart, HeartPulse, Languages, LayoutDashboard, LogOut, Menu, MessageCircle,
  Package, Pill, QrCode, ShieldCheck, Sparkles, Stethoscope, TestTubeDiagonal,
  Users, Video, X, Check, Clock3, Search, ShoppingBag, Download, LockKeyhole, Settings,
  Phone, Heart, BrainCircuit, ArrowRight, Eye, EyeOff
} from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Brand from '../components/Brand';
import { Modal, PageHeader, Stat } from '../components/Shared';
import { isSupabaseConfigured, supabase } from '../services/supabase';

const navItems = [
  ['dashboard','Dashboard',LayoutDashboard], ['patient360','Patient 360°',CircleUserRound], ['appointments','Appointments',CalendarDays],
  ['consultations','Consultations',Video], ['journey','Health Journey',Activity], ['gaps','Care Gaps',ClipboardList],
  ['careplan','Care Plan',FileHeart], ['records','Medical Records',FileHeart], ['prescriptions','Prescriptions',Pill],
  ['pharmacy','Pharmacy',ShoppingBag], ['medicines','Medicine History',Package], ['blood','Blood Help',Droplets],
  ['organ','Organ Donation',HeartPulse], ['family','Family Health',Users], ['emergency','Emergency',Ambulance],
  ['ai','AI Health Summary',Sparkles], ['notifications','Notifications',Bell], ['privacy','Privacy Center',ShieldCheck], ['settings','Settings',Settings]
] as const;

const chartData = [{n:'Jan',v:3},{n:'Feb',v:5},{n:'Mar',v:4},{n:'Apr',v:7},{n:'May',v:6},{n:'Jun',v:8},{n:'Jul',v:9}];

function Landing() {
  const navigate = useNavigate();
  const features = [
    ['Patient 360°',CircleUserRound],['Care Journey',Activity],['Care Gap Tracking',ClipboardList],['Emergency Support',Ambulance],['Blood Help',Droplets],['Organ Donation Support',HeartPulse],['Teleconsultation',Video],['Pharmacy',ShoppingBag],['AI Health Summary',BrainCircuit],['Multilingual Access',Languages]
  ] as const;
  return <div className="landing">
    <nav className="public-nav" aria-label="Main navigation"><Brand/><div className="nav-links"><a href="#platform">Platform</a><a href="#roles">Roles</a><a href="#security">Security</a></div><div><button className="btn ghost" onClick={()=>navigate('/login')}>Log in</button><button className="btn primary" onClick={()=>navigate('/app/dashboard')}>View demo <ArrowRight size={17}/></button></div></nav>
    <main>
      <section className="hero-section">
        <div className="hero-copy"><div className="eyebrow"><span></span> Healthcare continuity, reimagined</div><h1>Every step of care,<br/><em>connected.</em></h1><p>CAREBRIDGE brings appointments, records, care plans, investigations and emergency support into one coordinated patient journey.</p><div className="hero-actions"><button className="btn primary large" onClick={()=>navigate('/login')}>Get started <ArrowRight size={18}/></button><button className="btn outline large" onClick={()=>navigate('/app/dashboard')}>Explore demo</button></div><div className="trust"><div className="avatars">RK</div><div><strong>Trusted care experience</strong><span>Built for patient-first continuity</span></div></div></div>
        <div className="hero-visual"><div className="visual-orbit"></div><div className="patient-card floating"><div className="patient-head"><div className="avatar">RK</div><div><b>Rahul Kumar</b><span>Patient overview</span></div><span className="status-dot"></span></div><div className="health-score"><div><span>Care health</span><strong>82</strong></div><div className="score-ring">82%</div></div><div className="mini-chart"><ResponsiveContainer width="100%" height={110}><AreaChart data={chartData}><defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#147dca" stopOpacity={.35}/><stop offset="95%" stopColor="#147dca" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="n" axisLine={false} tickLine={false}/><YAxis hide/><Tooltip/><Area type="monotone" dataKey="v" stroke="#147dca" strokeWidth={3} fill="url(#cg)"/></AreaChart></ResponsiveContainer></div></div><div className="floating-chip doctor"><Stethoscope/><span><b>Care team</b><small>Dr. Arjun Reddy</small></span></div><div className="floating-chip emergency"><Ambulance/><span><b>Emergency ready</b><small>QR accessible</small></span></div></div>
      </section>
      <section className="feature-strip" id="platform"><div className="section-heading"><div><span className="kicker">ONE CONNECTED PLATFORM</span><h2>Everything your care journey needs</h2></div><p>One coordinated view for patients, families and care teams.</p></div><div className="feature-grid">{features.map(([name,Icon])=><div className="feature-card" key={name}><div className="feature-icon"><Icon/></div><h3>{name}</h3><ChevronRight/></div>)}</div></section>
      <section className="role-preview" id="roles">
        <div className="section-heading">
          <div><span className="kicker">CARE FOR EVERY ROLE</span><h2>One platform, connected care teams</h2></div>
          <p>Purpose-built views bring patients, clinicians and operations together.</p>
        </div>
        <div className="role-preview-grid">
          <article><CircleUserRound/><h3>Patients & families</h3><p>Follow appointments, records and care plans in one place.</p></article>
          <article><Stethoscope/><h3>Care teams</h3><p>Coordinate consultations, follow-ups and patient workflows.</p></article>
          <article><LayoutDashboard/><h3>Operations</h3><p>Review platform activity and care coordination status.</p></article>
        </div>
      </section>
      <section className="security-callout" id="security">
        <ShieldCheck />
        <div><span className="kicker">SECURE ACCESS</span><h2>Authentication stays with Supabase</h2><p>When configured, sign-in and password resets use the existing Supabase Auth connection. The current domain screens remain demonstrations until connected to live application data.</p></div>
      </section>
      <section className="differentiator"><div><BrainCircuit size={34}/><span>CAREBRIDGE advantage</span></div><p>CAREBRIDGE differentiates itself by combining healthcare continuity, care-gap tracking, emergency access, Patient 360° analytics, donor coordination, teleconsultation, pharmacy support, accessibility and AI-assisted record summarization into a single patient-centric workflow.</p></section>
    </main>
  </div>
}

function Login() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');

    try {
      if (!isSupabaseConfigured || !supabase) {
        navigate('/app/dashboard');
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
        return;
      }

      navigate('/app/dashboard');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to sign in right now.');
    } finally {
      setBusy(false);
    }
  }

  async function resetPassword() {
    setMessage('');
    if (!email.trim()) {
      setMessage('Enter your email address to request a password reset.');
      return;
    }
    if (!isSupabaseConfigured || !supabase) {
      setMessage('Password reset requires a Supabase connection.');
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      setMessage(error ? error.message : 'Password reset email sent.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to request a password reset.');
    }
  }

  return <div className="login-page">
    <div className="login-art">
      <Brand light />
      <div className="login-quote">
        <span>Patient-first care</span>
        <h2>Connected at every step.</h2>
        <p>Securely manage your complete healthcare journey in one place.</p>
      </div>
      <div className="art-pattern"></div>
    </div>
    <div className="login-form-wrap">
      <button className="back-link" type="button" onClick={() => navigate('/')}>← Back to home</button>
      <div className="login-box">
        <Brand />
        <h1>Welcome back</h1>
        <p>Sign in to continue to your care dashboard.</p>
        <form onSubmit={submit}>
          <label>Email address
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required={isSupabaseConfigured}
            />
          </label>
          <label>Password
            <div className="password-wrap">
              <input
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required={isSupabaseConfigured}
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
            <label className="check"><input type="checkbox" defaultChecked /> Remember me</label>
            <button type="button" className="link-button" onClick={resetPassword}>Forgot password?</button>
          </div>
          {message && <div className="auth-message" role="alert">{message}</div>}
          <button className="btn primary full" type="submit" disabled={busy}>
            {busy ? 'Signing in...' : 'Sign in securely'} <ArrowRight size={18} />
          </button>
        </form>
        <div className="demo-note">
          <ShieldCheck />
          {isSupabaseConfigured ? 'Secure Supabase authentication' : 'Demo mode — configure Supabase to enable real accounts'}
        </div>
        <div className="role-pills">
          <button type="button" onClick={() => navigate('/app/dashboard')}>Patient</button>
          <button type="button" onClick={() => navigate('/doctor/dashboard')}>Doctor</button>
          <button type="button" onClick={() => navigate('/admin/dashboard')}>Admin</button>
        </div>
      </div>
    </div>
  </div>;
}

function Dashboard(){const navigate=useNavigate(); const [modal,setModal]=useState(false); return <><PageHeader title="Good morning, Rahul 👋" subtitle="Here is your care overview for today."/><div className="upcoming-banner"><div className="banner-icon"><Video/></div><div><span>UPCOMING APPOINTMENT</span><h3>Dr. Arjun Reddy</h3><p>Today at 4:30 PM · Video consultation</p></div><button className="btn white" onClick={()=>navigate('/app/consultations')}>Join consultation</button></div><div className="stats-grid"><Stat label="Active care plans" value="2" icon={ClipboardList}/><Stat label="Pending actions" value="3" icon={Clock3} color="orange"/><Stat label="Current medicines" value="4" icon={Pill} color="purple"/><Stat label="Next follow-up" value="3 days" icon={CalendarDays} color="green"/></div><div className="section-title"><h2>Quick actions</h2></div><div className="quick-grid"><button onClick={()=>navigate('/app/appointments')}><CalendarDays/><span>Book appointment</span></button><button onClick={()=>navigate('/app/consultations')}><Stethoscope/><span>Consult doctor</span></button><button onClick={()=>navigate('/app/pharmacy')}><ShoppingBag/><span>Order medicine</span></button><button className="danger" onClick={()=>navigate('/app/emergency')}><Ambulance/><span>Emergency</span></button><button onClick={()=>navigate('/app/blood')}><Droplets/><span>Blood help</span></button><button onClick={()=>navigate('/app/records')}><FileHeart/><span>View records</span></button></div><div className="dashboard-grid"><div className="panel"><div className="panel-head"><h2>Care health</h2><span className="positive">+8% this month</span></div><ResponsiveContainer width="100%" height={220}><AreaChart data={chartData}><defs><linearGradient id="health" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1677d2" stopOpacity={.28}/><stop offset="95%" stopColor="#1677d2" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="n" axisLine={false} tickLine={false}/><YAxis hide/><Tooltip/><Area type="monotone" dataKey="v" stroke="#1677d2" strokeWidth={3} fill="url(#health)"/></AreaChart></ResponsiveContainer></div><div className="panel"><div className="panel-head"><h2>Today's care plan</h2><button className="text-button">View all</button></div><div className="task done"><Check/><div><b>Morning medication</b><span>Completed at 8:15 AM</span></div></div><div className="task"><Clock3/><div><b>Blood pressure check</b><span>Due by 12:00 PM</span></div></div><div className="task" onClick={()=>setModal(true)}><Activity/><div><b>Complete symptom check-in</b><span>Tap to update</span></div></div></div></div>{modal&&<Modal title="Care check-in" onClose={()=>setModal(false)}><p>How are you feeling today?</p><div className="mood-row">{['Better','Same','Worse'].map(x=><button key={x}>{x}</button>)}</div><button className="btn primary full" onClick={()=>setModal(false)}>Save check-in</button></Modal>}</>}

function GenericPage({kind}:{kind:string}){
  const [modal,setModal]=useState<string|null>(null);
  const [medicineSearch,setMedicineSearch]=useState('');
  const titles:Record<string,[string,string]>={patient360:['Patient 360°','A complete overview of your health information.'],appointments:['Appointments','Schedule and manage your consultations.'],consultations:['Consultations','Connect with your care team online.'],journey:['Health Journey','Follow your care from appointment to recovery.'],gaps:['Care Gaps','Workflow items that need your attention.'],careplan:['Care Plan','Your active goals and treatment tasks.'],records:['Medical Records','Review your consultations and health documents.'],prescriptions:['Prescriptions','Your active and previous prescriptions.'],pharmacy:['CareBridge Pharmacy','Search medicines and manage your orders.'],medicines:['Medicine History','Track current and past medications.'],blood:['Blood Help','Request blood and coordinate donor support.'],organ:['Organ Donation Support','Learn about registration and coordination.'],family:['Family Health','Manage shared care for your family.'],emergency:['Emergency Support','Fast access for critical situations.'],ai:['AI Health Summary','A plain-language view of your available records.'],notifications:['Notifications','Updates about your care journey.'],privacy:['Privacy & Access','Control who can view your health information.'],settings:['Settings','Manage your profile and preferences.']};
  const [title,subtitle]=titles[kind]||['Dashboard',''];
  if(kind==='patient360') return <><PageHeader title={title} subtitle={subtitle}/><div className="patient-profile"><div className="avatar large">RK</div><div><h2>Rahul Kumar</h2><p>28 years · B+ blood group</p><span>Primary doctor: Dr. Arjun Reddy</span></div><div className="profile-score"><b>82</b><span>Care health score</span></div></div><div className="record-grid">{[['Consultations','12'],['Hospital visits','3'],['Prescriptions','8'],['Lab reports','15'],['Follow-ups','6'],['Medicines','4']].map(x=><div className="record-card" key={x[0]}><FileHeart/><span>{x[0]}</span><strong>{x[1]}</strong></div>)}</div><div className="panel"><div className="panel-head"><h2>Health trend</h2><span className="positive">Improving</span></div><ResponsiveContainer width="100%" height={220}><AreaChart data={chartData}><XAxis dataKey="n"/><YAxis/><Tooltip/><Area dataKey="v" stroke="#1677d2" fill="#dceefe"/></AreaChart></ResponsiveContainer></div></>;
  if(kind==='appointments') return <><PageHeader title={title} subtitle={subtitle} action="Book appointment"/><div className="appointment-list">{[['Today, 4:30 PM','Dr. Arjun Reddy','Video consultation','Confirmed'],['4 Nov, 10:00 AM','Dr. Meera Shah','Diabetes follow-up','Confirmed'],['18 Nov, 2:30 PM','Dr. Nikhil Rao','Lab review','Pending']].map((x,i)=><div className="appointment-row" key={i}><div className="date-box"><CalendarDays/><b>{x[0]}</b></div><div className="doctor-avatar">DR</div><div><h3>{x[1]}</h3><p>{x[2]}</p></div><span className={`badge ${x[3]==='Confirmed'?'green':'orange'}`}>{x[3]}</span><button className="btn outline" onClick={()=>setModal('appointment')}>{i===0?'Join':'Details'}</button></div>)}</div>{modal&&<Modal title="Appointment details" onClose={()=>setModal(null)}><div className="detail-grid"><span>Doctor</span><b>Dr. Arjun Reddy</b><span>Time</span><b>Today, 4:30 PM</b><span>Type</span><b>Video consultation</b></div><button className="btn primary full" onClick={()=>setModal(null)}>Done</button></Modal>}</>;
  if(kind==='consultations') return <><PageHeader title={title} subtitle={subtitle}/><div className="consult-grid">{[['Video consultation',Video,'blue'],['Audio consultation',Phone,'green'],['Secure chat',MessageCircle,'purple']].map(([n,Icon,c]:any)=><button className="consult-card" onClick={()=>setModal(String(n))} key={n}><div className={`feature-icon ${c}`}><Icon/></div><h2>{n}</h2><p>Start a private care session with your team.</p><span>Start now <ArrowRight/></span></button>)}</div><div className="panel"><h2>Recent consultations</h2><div className="table"><div><b>Doctor</b><b>Date</b><b>Summary</b><b>Status</b></div><div><span>Dr. Arjun Reddy</span><span>12 Sep 2026</span><span>Follow-up review</span><span className="badge green">Completed</span></div></div></div>{modal&&<Modal title={String(modal)} onClose={()=>setModal(null)}><div className="consult-ready"><Video/><h2>Demo consultation room</h2><p>Connecting to Dr. Arjun Reddy...</p></div><button className="btn primary full" onClick={()=>setModal(null)}>Enter demo room</button></Modal>}</>;
  if(kind==='journey') {const events=['Appointment','Consultation','Prescription','Investigation','Result','Follow-up','Outcome']; return <><PageHeader title={title} subtitle={subtitle}/><div className="journey"><div className="journey-line"></div>{events.map((e,i)=><button key={e} onClick={()=>setModal(e)} className={i===3?'active':''}><div>{i===0?<CalendarDays/>:i===2?<Pill/>:i===3?<TestTubeDiagonal/>:i===6?<Heart/>:<Check/>}</div><span>{e}</span><small>{i===3?'Pending':'Completed'}</small></button>)}</div>{modal&&<Modal title={modal||''} onClose={()=>setModal(null)}><div className="detail-grid"><span>Event</span><b>{modal}</b><span>Date</span><b>15 Oct 2026</b><span>Status</span><b>{modal==='Investigation'?'Pending':'Completed'}</b></div>{modal==='Investigation'&&<p>Blood test result expected within 24 hours.</p>}<button className="btn primary full" onClick={()=>setModal(null)}>View details</button></Modal>}</>}
  if(kind==='gaps') return <><PageHeader title={title} subtitle={subtitle}/><div className="gap-columns">{[['Pending',['Blood test result pending.']],['Due soon',['Follow-up due in 3 days.']],['Overdue',['Care-plan action overdue.']],['Completed',['Previous follow-up completed.']]].map(([s,x]:any)=><div className="gap-column" key={s}><div className={`gap-title ${String(s).toLowerCase().replace(' ','-')}`}><h2>{s}</h2><span>{x.length}</span></div><div className="gap-card"><span>{String(s)==='Completed'?'Recorded':'Action needed'}</span><h3>{x[0]}</h3><button>{s==='Completed'?'View':'Resolve'}</button></div></div>)}</div><div className="notice"><ShieldCheck/><p><b>Workflow detection only.</b> Care Gaps identifies pending healthcare actions and does not diagnose diseases.</p></div></>;
  if(kind==='blood') return <><PageHeader title={title} subtitle={subtitle} action="Request blood"/><div className="blood-banner"><Droplets/><div><h2>Every drop can create hope.</h2><p>Submit a request and CAREBRIDGE helps coordinate compatible donors.</p></div></div><div className="workflow"><h2>Recent request · CB-BLD-4028</h2>{['Blood request submitted','Donor matching in progress','Donor contacted','Ready for coordination'].map((x,i)=><div key={x} className={i===3?'':'done'}><span>{i+1}</span><b>{x}</b><small>{i<2?'Completed':'Active'}</small></div>)}</div><div className="panel"><h2>Nearby compatible donors</h2>{['Ananya S.','Vikram M.','Neha P.'].map((n,i)=><div className="donor-row" key={n}><div className="avatar">{n[0]}</div><div><b>{n}</b><span>B+ · {i+2} km away</span></div><button className="btn outline" onClick={()=>setModal('Contact request sent')}>Contact</button></div>)}</div>{modal&&<Modal title={modal} onClose={()=>setModal(null)}><p>Your request is ready to be shared through the demo coordination workflow.</p><button className="btn primary full" onClick={()=>setModal(null)}>Continue</button></Modal>}</>;
  if(kind==='organ') return <><PageHeader title={title} subtitle={subtitle}/><div className="organ-hero"><HeartPulse/><div><h2>Give hope through informed choice</h2><p>CAREBRIDGE provides educational coordination support for organ donation conversations.</p></div></div><div className="organ-grid"><div className="panel"><h2>Donation registry status</h2><div className="empty-state"><Heart/><h3>Not enrolled</h3><p>Create an expression of interest for authorized counselling.</p><button className="btn primary" onClick={()=>setModal('Interest recorded')}>Express interest</button></div></div><div className="panel"><h2>Awareness resources</h2>{['Eligibility & counselling','Organ registration process','Family decision guide'].map(x=><div className="resource" key={x}>{x}<ChevronRight/></div>)}</div></div><div className="notice"><ShieldCheck/><p>CAREBRIDGE is a coordination and information prototype. It does not independently determine medical eligibility, organ allocation or transplantation decisions.</p></div>{modal&&<Modal title={modal} onClose={()=>setModal(null)}><p>Your expression of interest has been recorded in this demo. An authorized coordinator can explain next steps.</p><button className="btn primary full" onClick={()=>setModal(null)}>Done</button></Modal>}</>;
  if(kind==='pharmacy'||kind==='medicines'||kind==='prescriptions'||kind==='records'){
    const medicines:[string,string,string,string][]=[['Paracetamol 650mg','Paracetamol','₹32','For fever relief'],['Vitamin D3','Health supplements','₹289','30 capsules'],['Cetirizine 10mg','Anti-allergy','₹48','10 tablets'],['ORS Sachets','Electrolytes','₹18','Pack of 4']];
    const filteredMedicines=medicines.filter((medicine)=>medicine.join(' ').toLowerCase().includes(medicineSearch.trim().toLowerCase()));
    return <><PageHeader title={title} subtitle={subtitle} action={kind==='pharmacy'?undefined:'Download report'}/>{kind==='pharmacy'&&<form className="search-box" role="search" onSubmit={(event)=>{event.preventDefault();setMedicineSearch(medicineSearch.trim())}}><Search/><input aria-label="Search medicines" placeholder="Search medicines, brands or health categories" value={medicineSearch} onChange={(event)=>setMedicineSearch(event.target.value)}/><button type="submit">Search</button></form>}{filteredMedicines.length?<div className="medicine-grid">{filteredMedicines.map((m)=><div className="medicine-card" key={m[0]}><div className="medicine-art"><Pill/></div><span>{m[1]}</span><h3>{m[0]}</h3><p>{m[3]}</p><div><strong>{m[2]}</strong>{kind==='pharmacy'&&<button className="btn outline" onClick={()=>setModal('Added to cart')}>Add</button>}</div></div>)}</div>:<div className="search-empty-state">No medicines match “{medicineSearch}”. Try a different name or category.</div>}{modal&&<Modal title="Added to cart" onClose={()=>setModal(null)}><p>Your medicine has been added. Continue to checkout to review delivery details.</p><button className="btn primary full" onClick={()=>setModal(null)}>View cart</button></Modal>}</>;
  }
  if(kind==='emergency') return <><PageHeader title={title} subtitle={subtitle}/><div className="emergency-banner"><Ambulance/><div><h2>Emergency assistance</h2><p>If a person is in immediate danger, contact your local emergency service now.</p></div><button className="btn white" onClick={()=>window.open('tel:112')}>Call 112</button></div><div className="emergency-grid"><div className="panel"><div className="panel-head"><h2>Emergency profile</h2><button className="text-button">Edit</button></div><div className="detail-grid"><span>Blood group</span><b>B+</b><span>Emergency contact</span><b>Anita Kumar · 98765 43210</b><span>Primary doctor</span><b>Dr. Arjun Reddy</b><span>Known allergies</span><b>None recorded</b></div></div><div className="qr-card"><div className="qr"><QrCode/><div className="qr-lines"></div></div><h2>CARE ID QR</h2><p>CB-P-2026-0824</p><button className="btn outline"><Download/> Download QR</button></div></div></>;
  if(kind==='ai') return <><PageHeader title={title} subtitle={subtitle}/><div className="ai-layout"><div className="panel ai-summary"><div className="ai-head"><Sparkles/><div><h2>Health summary</h2><span>Generated from available demo records</span></div></div><h3>Current care picture</h3><p>Rahul has a follow-up scheduled with Dr. Arjun Reddy and one blood test result awaiting review. His active care plan includes medication adherence and routine monitoring.</p><h3>Items to remember</h3><ul><li>Complete the pending blood test review.</li><li>Continue scheduled medication as prescribed.</li><li>Attend the upcoming video follow-up.</li></ul><div className="notice"><ShieldCheck/><p>This is an informational prototype summary, not a diagnosis or medical recommendation.</p></div></div><div className="panel"><h2>Data used</h2>{['Recent prescriptions','Lab reports','Care plan','Consultations'].map(x=><div className="data-source"><FileHeart/><span>{x}</span><Check/></div>)}</div></div></>;
  if(kind==='privacy') return <><PageHeader title={title} subtitle={subtitle}/><div className="privacy-grid"><div className="panel"><h2>Record sharing</h2>{['Dr. Arjun Reddy','Anita Kumar · Family','Apollo Diagnostics'].map((x,i)=><div className="access-row" key={x}><div className="avatar">{x[0]}</div><div><b>{x}</b><span>{i===0?'Full care team access':'Limited access'}</span></div><button className={`toggle ${i<2?'on':''}`}><span></span></button></div>)}</div><div className="panel"><h2>Recent access logs</h2>{[['Dr. Arjun Reddy','Today, 3:42 PM','Prescriptions'],['Apollo Diagnostics','Yesterday','Lab report']].map((x,i)=><div className="log-row" key={i}><LockKeyhole/><div><b>{x[0]}</b><span>{x[1]} · {x[2]}</span></div></div>)}</div></div></>;
  return <><PageHeader title={title} subtitle={subtitle}/><div className="panel"><h2>{title==='Notifications'?'Recent updates':'Profile settings'}</h2>{kind==='notifications'?['Your blood report is ready for review.','Care follow-up is due in 3 days.','Dr. Arjun Reddy has accepted your appointment.'].map((x,i)=><div className="notification" key={x}><Bell/><div><b>{x}</b><span>{i+1} hour ago</span></div></div>):<div className="settings-form"><label>Full name<input defaultValue="Rahul Kumar"/></label><label>Mobile<input defaultValue="98765 43210"/></label><label>Preferred language<select defaultValue="English"><option>English</option><option>हिन्दी</option><option>తెలుగు</option></select></label><button className="btn primary">Save changes</button></div>}</div></>;
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setAuthenticated(Boolean(session));
    });

    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) setAuthError(error.message);
        else setAuthenticated(Boolean(data.session));
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setAuthError(error instanceof Error ? error.message : 'Unable to verify your secure session.');
        setLoading(false);
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div className="auth-loading">Checking secure session...</div>;
  if (authError) return <div className="auth-loading" role="alert">Unable to verify your secure session: {authError}</div>;
  if (isSupabaseConfigured && !authenticated) return <Navigate to="/login" replace />;
  return children;
}

function AppShell({role='patient'}:{role?:'patient'|'doctor'|'admin'}){
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [accountMessage, setAccountMessage] = useState('');
  const searchInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const searchResults = navItems.filter(([, label]) =>
    label.toLowerCase().includes(search.trim().toLowerCase()),
  );

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInput.current?.focus();
      }
      if (event.key === 'Escape') {
        setSearch('');
        searchInput.current?.blur();
      }
    }

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  async function signOut() {
    setAccountMessage('');
    try {
      if (supabase) {
        const { error } = await supabase.auth.signOut();
        if (error) {
          setAccountMessage(error.message);
          return;
        }
      }
      navigate('/login');
    } catch (error) {
      setAccountMessage(error instanceof Error ? error.message : 'Unable to sign out right now.');
    }
  }

  function navigateToSearchResult(path: string) {
    navigate(`/app/${path}`);
    setSearch('');
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const firstResult = searchResults[0];
    if (firstResult) navigateToSearchResult(firstResult[0]);
  }

  return <div className="app-shell">
    <aside className={open ? 'open' : ''} aria-label="Patient navigation">
      <div className="sidebar-brand">
        <Brand />
        <button type="button" aria-label="Close navigation" onClick={() => setOpen(false)}><X /></button>
      </div>
      <div className="role-chip">PATIENT PORTAL</div>
      <nav>
        {role === 'patient' && navItems.map(([path, label, Icon]) =>
          <NavLink key={path} to={`/app/${path}`} onClick={() => setOpen(false)}>
            <Icon /><span>{label}</span>
          </NavLink>,
        )}
      </nav>
      <div className="sidebar-user">
        <div className="avatar">RK</div>
        <div><b>Rahul Kumar</b><span>Patient ID · 0824</span></div>
        <button type="button" aria-label="Sign out" onClick={signOut}><LogOut /></button>
      </div>
      {accountMessage && <div className="sidebar-error" role="alert">{accountMessage}</div>}
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
            aria-label="Search application sections"
            autoComplete="off"
            placeholder="Search records, doctors or services"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <kbd>Ctrl K</kbd>
          {search.trim() && <div className="global-search-results" aria-label="Search results">
            {searchResults.length ? searchResults.map(([path, label, Icon]) =>
              <button
                type="button"
                key={path}
                onClick={() => navigateToSearchResult(path)}
              >
                <Icon size={17} />{label}
              </button>,
            ) : <span className="global-search-empty" role="status">No matching sections found.</span>}
          </div>}
        </form>
        <div className="header-actions">
          <button type="button" className="language" aria-label="Current language: English"><Languages /> EN</button>
          <button type="button" aria-label="Notifications" onClick={() => navigate('/app/notifications')}><Bell /><i>3</i></button>
          <div className="avatar">RK</div>
        </div>
      </header>
      <div className="page-content">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          {navItems.filter((item) => item[0] !== 'dashboard').map(([path]) =>
            <Route key={path} path={path} element={<GenericPage kind={path} />} />,
          )}
        </Routes>
      </div>
    </main>
  </div>;
}

function RoleDashboard({role}:{role:'doctor'|'admin'}){const navigate=useNavigate(); const doctor=role==='doctor'; return <div className="role-page"><div className="role-nav"><Brand/><button className="btn outline" onClick={()=>navigate('/login')}>Back to login</button></div><div className="role-dashboard"><PageHeader title={doctor?'Good morning, Dr. Arjun':'CAREBRIDGE Operations'} subtitle={doctor?'Your care schedule and patient queue today.':'Platform overview and system activity.'}/><div className="stats-grid"><Stat label={doctor?'Today’s patients':'Active patients'} value={doctor?'12':'2,840'} icon={Users}/><Stat label={doctor?'Pending reviews':'Care gaps tracked'} value={doctor?'5':'326'} icon={ClipboardList} color="orange"/><Stat label={doctor?'Appointments':'Connected providers'} value={doctor?'8':'148'} icon={CalendarDays} color="green"/><Stat label={doctor?'Avg. wait time':'System health'} value={doctor?'14 min':'99.9%'} icon={Activity} color="purple"/></div><div className="panel"><div className="panel-head"><h2>{doctor?'Patient queue':'Platform activity'}</h2><span className="positive">Live</span></div><div className="table"><div><b>{doctor?'Patient':'Area'}</b><b>Time</b><b>Type</b><b>Status</b></div>{(doctor?[['Rahul Kumar','4:30 PM','Video','Waiting'],['Meera Shah','5:00 PM','Follow-up','Scheduled']]:[['Appointments','Today','Patient service','Healthy'],['Lab coordination','Today','Provider network','Healthy']]).map((r,i)=><div key={i}><span>{r[0]}</span><span>{r[1]}</span><span>{r[2]}</span><span className="badge green">{r[3]}</span></div>)}</div></div></div></div>}

export default function App(){return <BrowserRouter><Routes><Route path="/" element={<Landing/>}/><Route path="/login" element={<Login/>}/><Route path="/app/*" element={<ProtectedRoute><AppShell/></ProtectedRoute>}/><Route path="/doctor/dashboard" element={<ProtectedRoute><RoleDashboard role="doctor"/></ProtectedRoute>}/><Route path="/admin/dashboard" element={<ProtectedRoute><RoleDashboard role="admin"/></ProtectedRoute>}/><Route path="*" element={<Navigate to="/"/>}/></Routes></BrowserRouter>}
