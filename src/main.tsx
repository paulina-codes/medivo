import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  House, UserRound, Pill, HeartPulse, CalendarDays, FileText, Settings, BookHeart, Bell,
  ChevronRight, ChevronLeft, ChevronDown, Plus, Check, Trash2, Pencil, Search, Menu, X,
  ArrowRight, ArrowUpRight, ArrowDownRight, Eye, EyeOff, Globe, Download, LogOut, CircleHelp,
  type LucideIcon,
} from 'lucide-react';
import * as I from './illustrations';
import './style.css';

/* ================================================================
   Typen & Demo-Daten
   ================================================================ */

type Screen = 'welcome' | 'login' | 'mode' | 'app';
type Page = 'Dashboard' | 'Meine Daten' | 'Medikation' | 'Symptome' | 'Termine' | 'Vorlagen' | 'Berichte' | 'Einstellungen';
type Mode = 'Standard' | 'Kawaii' | 'Gamified' | 'Senioren' | 'ADHD' | 'Minimal' | 'Autismus';
type Symptom = { id: number; name: string; level: number; date: string };
type Med = { id: number; name: string; dose: string; time: string; done: boolean };
type ApptKind = 'medikament' | 'arzt' | 'therapie' | 'labor';
type Appointment = { id: number; title: string; date: string; time: string; kind: ApptKind; done?: boolean };
type Template = { name: string; details: string; ill: React.ReactNode };

const NAV: { name: Page; icon: LucideIcon }[] = [
  { name: 'Dashboard', icon: House },
  { name: 'Meine Daten', icon: UserRound },
  { name: 'Medikation', icon: Pill },
  { name: 'Symptome', icon: HeartPulse },
  { name: 'Termine', icon: CalendarDays },
  { name: 'Vorlagen', icon: BookHeart },
  { name: 'Berichte', icon: FileText },
  { name: 'Einstellungen', icon: Settings },
];

const MODES: { name: Mode; desc: string; tone: string; ill: (size: number) => React.ReactNode }[] = [
  { name: 'Standard', desc: 'Klar. Übersichtlich. Zeitlos.', tone: 'sage', ill: s => <I.Sprout size={s} /> },
  { name: 'Kawaii', desc: 'Freundlich. Niedlich. Motivierend.', tone: 'rose', ill: s => <I.CatHead size={s} /> },
  { name: 'Gamified', desc: 'Spielerisch. Belohnend. Motivierend.', tone: 'peach', ill: s => <I.Trophy size={s} /> },
  { name: 'Senioren', desc: 'Einfach. Groß. Klar.', tone: 'blush', ill: s => <I.Grandma size={s} /> },
  { name: 'ADHD', desc: 'Bunt. Dynamisch. Fokus & Motivation.', tone: 'sky', ill: s => <I.Bolt size={s} /> },
  { name: 'Minimal', desc: 'Reduziert. Ruhig. Konzentriert.', tone: 'stone', ill: s => <I.MoonIll size={s} /> },
  { name: 'Autismus', desc: 'Strukturiert. Vorhersehbar. Individuell.', tone: 'blue', ill: s => <I.Puzzle size={s} /> },
];

const TEMPLATES: Template[] = [
  { name: 'Diabetes Typ 1', details: 'Symptome · Medikation · Messwerte', ill: <I.Drop size={30} /> },
  { name: 'Fibromyalgie', details: 'Symptome · Schmerzverlauf · Schlaf', ill: <I.FlowerIll size={30} /> },
  { name: 'Multiple Sklerose', details: 'Symptome · Medikamentenplan · Aktivität', ill: <I.Butterfly size={30} /> },
  { name: 'Migräne', details: 'Schmerztagebuch · Trigger · Medikation', ill: <I.Brain size={30} /> },
  { name: 'Rheuma', details: 'Schmerzen · Gelenke · Medikation', ill: <I.Leaf size={30} /> },
  { name: 'Depression', details: 'Stimmung · Schlaf · Aktivität', ill: <I.Cloud size={30} /> },
];

const LANGUAGES = [
  { code: 'DE', name: 'Deutsch' }, { code: 'EN', name: 'English' }, { code: 'FR', name: 'Français' },
  { code: 'ES', name: 'Español' }, { code: 'PT', name: 'Português' }, { code: 'RU', name: 'Русский' }, { code: 'AR', name: 'العربية' },
];

const MOODS: { kind: I.FaceKind; label: string }[] = [
  { kind: 'great', label: 'Sehr gut' }, { kind: 'good', label: 'Gut' }, { kind: 'okay', label: 'Geht so' }, { kind: 'low', label: 'Nicht gut' },
];

/* ---------- Datumshilfen ---------- */
const pad = (n: number) => String(n).padStart(2, '0');
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const parse = (s: string) => new Date(`${s}T00:00:00`);
const TODAY = new Date();
const today = iso(TODAY);
const fmtLong = (s: string) => parse(s).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
const fmtShort = (s: string) => parse(s).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
const liters = (n: number) => n.toFixed(1).replace('.', ',');
const startOfWeek = (d: Date) => addDays(d, -((d.getDay() + 6) % 7));

/* ================================================================
   Kleine Bausteine (außerhalb von App definiert, damit Eingabefelder
   beim Tippen nicht den Fokus verlieren)
   ================================================================ */

function Logo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  return (
    <div className={`logo logo-${size}`}>
      <I.Sprout size={size === 'lg' ? 64 : 30} />
      <span>Medivo</span>
    </div>
  );
}

function Panel({ title, action, className = '', children }: { title?: string; action?: React.ReactNode; className?: string; children: React.ReactNode }) {
  return (
    <section className={`panel ${className}`}>
      {(title || action) && <div className="panel-head">{title && <h3>{title}</h3>}{action}</div>}
      {children}
    </section>
  );
}

function Tabs<T extends string>({ value, options, onChange }: { value: T; options: readonly T[]; onChange: (v: T) => void }) {
  return (
    <div className="tabs" role="tablist">
      {options.map(o => (
        <button key={o} role="tab" aria-selected={value === o} className={value === o ? 'active' : ''} onClick={() => onChange(o)}>{o}</button>
      ))}
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} className={`switch ${checked ? 'on' : ''}`} onClick={() => onChange(!checked)}>
      <span />
    </button>
  );
}

function CheckMark({ done }: { done: boolean }) {
  return <span className={`checkmark ${done ? 'done' : ''}`} aria-hidden="true">{done && <Check size={13} strokeWidth={3} />}</span>;
}

function Sparkline({ values, good = 'up' }: { values: number[]; good?: 'up' | 'down' }) {
  const max = Math.max(...values), min = Math.min(...values);
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 60},${18 - ((v - min) / (max - min || 1)) * 14}`).join(' ');
  const rising = values[values.length - 1] >= values[0];
  const positive = good === 'up' ? rising : !rising;
  return (
    <svg className={`spark ${positive ? 'pos' : 'neg'}`} viewBox="-2 0 64 22" width="64" height="22" aria-hidden="true">
      <polyline points={pts} fill="none" />
    </svg>
  );
}

function Trend({ dir, good }: { dir: 'up' | 'down' | 'flat'; good: boolean }) {
  const cls = dir === 'flat' ? 'trend-flat' : good ? 'trend-good' : 'trend-bad';
  return (
    <span className={`trend-icon ${cls}`} aria-label={dir === 'up' ? 'steigend' : dir === 'down' ? 'fallend' : 'gleichbleibend'}>
      {dir === 'up' ? <ArrowUpRight size={17} /> : dir === 'down' ? <ArrowDownRight size={17} /> : <ArrowRight size={17} />}
    </span>
  );
}

function ModeGrid({ mode, onSelect, extra }: { mode: Mode; onSelect: (m: Mode) => void; extra?: React.ReactNode }) {
  return (
    <div className="mode-grid">
      {MODES.map(m => (
        <button key={m.name} className={`mode-tile tone-${m.tone} ${mode === m.name ? 'selected' : ''}`} aria-pressed={mode === m.name} onClick={() => onSelect(m.name)}>
          {mode === m.name && <span className="mode-check"><Check size={14} strokeWidth={3} /></span>}
          {m.ill(54)}
          <strong>{m.name}</strong>
          <small>{m.desc}</small>
        </button>
      ))}
      {extra}
    </div>
  );
}

function Companion({ mood, text }: { mood: I.CatMood; text: string }) {
  return (
    <div className="companion">
      <I.Cat mood={mood} size={128} className="companion-cat" />
      <div className="bubble">{text}</div>
      <I.Leaf size={70} className="companion-leaf" />
    </div>
  );
}

/* ================================================================
   App
   ================================================================ */

function App() {
  /* Navigation & Darstellung */
  const [screen, setScreen] = useState<Screen>('welcome');
  const [page, setPage] = useState<Page>('Dashboard');
  const [mode, setMode] = useState<Mode>('Standard');
  const [dark, setDark] = useState(false);
  const [menu, setMenu] = useState(false);
  const [companion, setCompanion] = useState(true);
  const [language, setLanguage] = useState('DE');
  const [toast, setToast] = useState('');

  /* Profil */
  const [name, setName] = useState('Paulina');
  const [age, setAge] = useState('29');
  const [goals, setGoals] = useState<string[]>(['Meine Symptome besser verstehen']);
  const [comm, setComm] = useState({ erinnern: true, unterstuetzen: true, motivieren: true, informieren: false });
  const [conditions, setConditions] = useState<string[]>(['Migräne']);

  /* Gesundheitsdaten (Demo) */
  const [symptoms, setSymptoms] = useState<Symptom[]>([
    { id: 1, name: 'Schmerzen', level: 4, date: iso(addDays(TODAY, -1)) },
    { id: 2, name: 'Müdigkeit', level: 6, date: iso(addDays(TODAY, -1)) },
    { id: 3, name: 'Übelkeit', level: 2, date: iso(addDays(TODAY, -2)) },
    { id: 4, name: 'Angst', level: 3, date: iso(addDays(TODAY, -3)) },
    { id: 5, name: 'Schlafstörungen', level: 5, date: iso(addDays(TODAY, -2)) },
    { id: 6, name: 'Verdauung', level: 2, date: iso(addDays(TODAY, -4)) },
  ]);
  const [meds, setMeds] = useState<Med[]>([
    { id: 1, name: 'Medikament A', dose: '1 Tablette', time: '09:00', done: true },
    { id: 2, name: 'Medikament B', dose: '1 Tablette', time: '19:00', done: false },
  ]);
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, title: 'Arzttermin (Neurologe)', date: today, time: '11:30', kind: 'arzt' },
    { id: 2, title: 'Physiotherapie', date: today, time: '15:00', kind: 'therapie' },
    { id: 3, title: 'Blutabnahme', date: iso(addDays(TODAY, 6)), time: '10:00', kind: 'labor' },
    { id: 4, title: 'Kontrolltermin', date: iso(addDays(TODAY, 9)), time: '14:00', kind: 'arzt' },
  ]);
  const [moodToday, setMoodToday] = useState<I.FaceKind | null>(null);
  const [water, setWater] = useState(1.2);
  const [digestion, setDigestion] = useState(false);
  const [myTemplates, setMyTemplates] = useState<string[]>(['Migräne']);

  /* Formular-Zustände */
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [symTab, setSymTab] = useState<'Symptome' | 'Medikation'>('Symptome');
  const [showSymForm, setShowSymForm] = useState(false);
  const [symName, setSymName] = useState('');
  const [symLevel, setSymLevel] = useState(5);
  const [editId, setEditId] = useState<number | null>(null);
  const [medName, setMedName] = useState('');
  const [medDose, setMedDose] = useState('1 Tablette');
  const [medTime, setMedTime] = useState('08:00');
  const [dataTab, setDataTab] = useState<'Profil' | 'Erkrankungen'>('Profil');
  const [tplTab, setTplTab] = useState<'Vorlagen' | 'Meine Vorlagen'>('Vorlagen');
  const [tplQuery, setTplQuery] = useState('');
  const [weekOffset, setWeekOffset] = useState(0);
  const [selDay, setSelDay] = useState(today);
  const [showApptForm, setShowApptForm] = useState(false);
  const [apTitle, setApTitle] = useState('');
  const [apDate, setApDate] = useState(today);
  const [apTime, setApTime] = useState('10:00');
  const [apKind, setApKind] = useState<ApptKind>('arzt');
  const [reportTab, setReportTab] = useState<'Arztzusammenfassung' | 'Verläufe'>('Arztzusammenfassung');
  const [period, setPeriod] = useState(30);
  const [reportParts, setReportParts] = useState<string[]>(['Schlaf', 'Medikamenteneinnahme', 'Symptome']);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  /* Abgeleitete Werte */
  const medsDone = meds.filter(m => m.done).length;
  const symptomsToday = symptoms.filter(s => s.date === today).length;
  const tasks = [
    { key: 'mood', done: moodToday !== null },
    { key: 'meds', done: meds.length > 0 && medsDone === meds.length },
    { key: 'sym', done: symptomsToday > 0 },
    { key: 'water', done: water >= 2 },
    { key: 'digestion', done: digestion },
  ];
  const tasksDone = tasks.filter(t => t.done).length;
  const xp = Math.min(200, 120 + tasksDone * 16);
  const showGame = ['Standard', 'Gamified', 'Kawaii', 'ADHD'].includes(mode);
  const showCompanion = companion && !['Minimal', 'Autismus'].includes(mode);
  const catMood: I.CatMood = tasksDone >= 4 ? 'cheer' : 'happy';
  const companionText =
    tasksDone >= 5 ? 'Alles geschafft – richtig stark!' :
    tasksDone >= 3 ? 'Du bist auf einem guten Weg.' :
    'Noch ein kleiner Schritt für heute.';
  const avgPain = useMemo(() => {
    const p = symptoms.filter(s => /schmerz|kopf|migr/i.test(s.name));
    return p.length ? (p.reduce((a, s) => a + s.level, 0) / p.length) : 0;
  }, [symptoms]);

  function navigate(p: Page) {
    setPage(p);
    setMenu(false);
    if (p === 'Symptome') setSymTab('Symptome');
    if (p === 'Medikation') setSymTab('Medikation');
    window.scrollTo({ top: 0 });
  }

  /* Aktionen */
  function addSymptom() {
    if (!symName.trim()) return;
    setSymptoms(s => [{ id: Date.now(), name: symName.trim(), level: symLevel, date: today }, ...s]);
    setSymName(''); setSymLevel(5); setShowSymForm(false);
    setToast('Symptom eingetragen');
  }
  function addMed() {
    if (!medName.trim()) return;
    setMeds(s => [...s, { id: Date.now(), name: medName.trim(), dose: medDose, time: medTime, done: false }].sort((a, b) => a.time.localeCompare(b.time)));
    setMedName('');
    setToast('Medikament hinzugefügt');
  }
  function addAppointment() {
    if (!apTitle.trim()) return;
    setAppointments(a => [...a, { id: Date.now(), title: apTitle.trim(), date: apDate, time: apTime, kind: apKind }]);
    setApTitle(''); setShowApptForm(false); setSelDay(apDate);
    setToast('Termin hinzugefügt');
  }
  function toggleMed(id: number) { setMeds(v => v.map(m => m.id === id ? { ...m, done: !m.done } : m)); }
  function adoptTemplate(t: string) {
    if (!myTemplates.includes(t)) setMyTemplates(v => [...v, t]);
    if (!conditions.includes(t)) setConditions(v => [...v, t]);
    setToast(`Vorlage „${t}" übernommen`);
  }

  /* ---------------- Onboarding ---------------- */

  if (screen !== 'app') {
    return (
      <div className={`onboarding mode-${mode.toLowerCase()} ${dark ? 'dark' : ''}`}>
        <I.IllDefs />
        <svg className="waves" viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 210 C240 150 420 270 720 220 C1000 175 1180 250 1440 200 V320 H0 Z" className="w1" />
          <path d="M0 260 C300 220 520 300 820 262 C1080 230 1250 290 1440 258 V320 H0 Z" className="w2" />
        </svg>

        {screen === 'welcome' && (
          <main className="onb-card welcome-card">
            <Logo size="lg" />
            <p className="tagline">Adaptive Health Management<br />for Everyday Life</p>
            <p className="onb-sub">Gesundheit, die sich deinem Alltag anpasst.</p>
            <I.Cat size={190} className="welcome-cat" />
            <button className="primary big" onClick={() => setScreen('login')}>Los geht's <ArrowRight size={18} /></button>
            <button className="link-button" onClick={() => setScreen('app')}>Direkt zur Demo</button>
          </main>
        )}

        {screen === 'login' && (
          <main className="onb-card login-card">
            <Logo />
            <h1>Willkommen zurück!</h1>
            <p className="onb-sub">Schön, dass du wieder da bist.</p>
            <form onSubmit={e => { e.preventDefault(); setScreen('mode'); }}>
              <label className="field">E-Mail oder Benutzername<input type="text" placeholder="name@example.com" autoComplete="off" /></label>
              <label className="field">Passwort
                <span className="input-icon">
                  <input type={showPw ? 'text' : 'password'} placeholder="••••••••" autoComplete="off" />
                  <button type="button" className="icon-btn" aria-label={showPw ? 'Passwort verbergen' : 'Passwort anzeigen'} onClick={() => setShowPw(!showPw)}>{showPw ? <EyeOff size={17} /> : <Eye size={17} />}</button>
                </span>
              </label>
              <button type="button" className="link-button left">Passwort vergessen?</button>
              <button className="primary big full" type="submit">Anmelden</button>
            </form>
            <p className="muted small center">Noch kein Konto? <button className="link-button inline" onClick={() => setScreen('mode')}>Jetzt registrieren</button></p>
            <p className="demo-hint">Demo: Beliebige Eingaben genügen – es wird nichts gespeichert.</p>
            <label className="lang-select"><Globe size={16} />
              <select aria-label="Sprache" value={language} onChange={e => setLanguage(e.target.value)}>
                {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
              </select>
            </label>
            <I.Leaf size={60} className="login-leaf" />
          </main>
        )}

        {screen === 'mode' && (
          <main className="onb-card mode-card">
            <h1 className="left">Modus auswählen</h1>
            <p className="onb-sub left">Wähle den Stil, der am besten zu dir passt. Du kannst den Modus jederzeit in den Einstellungen ändern.</p>
            <ModeGrid mode={mode} onSelect={setMode} extra={
              <button className="mode-tile later" onClick={() => { setMode('Standard'); setScreen('app'); }}>Später entscheiden</button>
            } />
            <button className="primary big full" onClick={() => setScreen('app')}>Weiter <ArrowRight size={18} /></button>
          </main>
        )}
      </div>
    );
  }

  /* ---------------- App ---------------- */

  const weekStart = addDays(startOfWeek(TODAY), weekOffset * 7);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const dayItems = [
    ...(selDay === today ? meds.map(m => ({ id: `m${m.id}`, time: m.time, title: 'Medikamenteneinnahme', sub: `${m.name} · ${m.dose}`, kind: 'medikament' as ApptKind, done: m.done, onToggle: () => toggleMed(m.id) })) : []),
    ...appointments.filter(a => a.date === selDay).map(a => ({ id: `a${a.id}`, time: a.time, title: a.title, sub: '', kind: a.kind, done: !!a.done, onToggle: undefined as undefined | (() => void) })),
  ].sort((a, b) => a.time.localeCompare(b.time));
  const upcoming = appointments.filter(a => a.date > selDay).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).slice(0, 3);
  const nextAppt = appointments.filter(a => a.date > today || (a.date === today)).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0];
  const filteredTemplates = TEMPLATES.filter(t => (t.name + t.details).toLowerCase().includes(tplQuery.toLowerCase()));
  const periodSymptoms = symptoms.filter(s => (TODAY.getTime() - parse(s.date).getTime()) / 86400000 <= period);

  return (
    <div className={`app mode-${mode.toLowerCase()} ${dark ? 'dark' : ''}`}>
      <I.IllDefs />

      {/* Seitenleiste */}
      <aside className={`sidebar ${menu ? 'show' : ''}`} aria-label="Hauptnavigation">
        <div className="sidebar-top">
          <Logo />
          <button className="icon-btn close-menu" aria-label="Menü schließen" onClick={() => setMenu(false)}><X size={20} /></button>
        </div>
        <nav>
          {NAV.map(item => (
            <button key={item.name} className={`nav-item ${page === item.name ? 'active' : ''}`} aria-current={page === item.name ? 'page' : undefined} onClick={() => navigate(item.name)}>
              <item.icon size={18} strokeWidth={1.8} />{item.name}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          {showCompanion && <I.Cat mood="sleepy" size={86} className="sidebar-cat" />}
          <p className="privacy-mini">UI-Prototyp v0.2 · nur Demo-Daten</p>
          <button className="nav-item subtle" onClick={() => { setScreen('welcome'); setMenu(false); }}><LogOut size={17} strokeWidth={1.8} />Abmelden</button>
        </div>
      </aside>
      {menu && <button className="overlay" aria-label="Menü schließen" onClick={() => setMenu(false)} />}

      <main className="main">
        <header className="topbar">
          <button className="icon-btn mobile-menu" aria-label="Menü öffnen" onClick={() => setMenu(true)}><Menu size={22} /></button>
          {page === 'Dashboard' ? (
            <div className="greeting">
              <h1>Hallo {name}</h1>
              <p>Schön, dass du da bist!</p>
            </div>
          ) : (
            <div className="breadcrumb">Medivo <ChevronRight size={14} /> <strong>{page}</strong></div>
          )}
          <div className="top-actions">
            <button className="icon-btn" aria-label="Benachrichtigungen (Demo)" onClick={() => setToast('Benachrichtigungen folgen in einer späteren Version')}><Bell size={19} strokeWidth={1.8} /></button>
            <label className="lang-chip">
              <select aria-label="Sprache" value={language} onChange={e => setLanguage(e.target.value)}>
                {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.code}</option>)}
              </select>
              <ChevronDown size={14} />
            </label>
            <button className="avatar" aria-label="Meine Daten öffnen" onClick={() => navigate('Meine Daten')}><I.CatHead size={30} /></button>
          </div>
        </header>

        <div className="content">

          {/* ============ DASHBOARD ============ */}
          {page === 'Dashboard' && (
            <div className="dash-grid">
              <div className="dash-main">
                {showCompanion ? (
                  <Companion mood={catMood} text={companionText} />
                ) : (
                  <div className="calm-hello"><h2>Dein Tag im Überblick</h2><p>{tasksDone} von {tasks.length} Punkten erledigt.</p></div>
                )}

                <Panel title="Deine Aufgaben" action={<span className="pill">Heute</span>}>
                  <ul className="task-list">
                    <li>
                      <CheckMark done={moodToday !== null} />
                      <span className="grow">Wie fühlst du dich heute?</span>
                      {moodToday ? (
                        <button className="status-link" onClick={() => setShowMoodPicker(v => !v)}><I.Face kind={moodToday} size={24} /> {MOODS.find(m => m.kind === moodToday)?.label}</button>
                      ) : (
                        <button className="primary small" onClick={() => setShowMoodPicker(v => !v)}>Jetzt eintragen</button>
                      )}
                    </li>
                    {showMoodPicker && (
                      <li className="mood-picker" aria-label="Stimmung auswählen">
                        {MOODS.map(m => (
                          <button key={m.kind} className={moodToday === m.kind ? 'selected' : ''} onClick={() => { setMoodToday(m.kind); setShowMoodPicker(false); }}>
                            <I.Face kind={m.kind} size={40} /><span>{m.label}</span>
                          </button>
                        ))}
                      </li>
                    )}
                    <li>
                      <CheckMark done={tasks[1].done} />
                      <span className="grow">Medikamente einnehmen</span>
                      <button className="status-link" onClick={() => navigate('Medikation')}>{medsDone} von {meds.length} erledigt</button>
                    </li>
                    <li>
                      <CheckMark done={symptomsToday > 0} />
                      <span className="grow">Symptome eintragen</span>
                      <button className="status-link" onClick={() => { navigate('Symptome'); setShowSymForm(true); }}>{symptomsToday ? `${symptomsToday} eingetragen` : 'noch nicht eingetragen'}</button>
                    </li>
                    <li>
                      <CheckMark done={water >= 2} />
                      <span className="grow">Trinken</span>
                      <span className="status">{liters(water)} / 2,0 L</span>
                      <button className="mini-btn" aria-label="Ein Glas (0,25 L) hinzufügen" onClick={() => setWater(w => Math.min(3, Math.round((w + 0.25) * 100) / 100))}><Plus size={14} /></button>
                    </li>
                    <li>
                      <button className="check-button" aria-pressed={digestion} onClick={() => setDigestion(v => !v)}><CheckMark done={digestion} /></button>
                      <span className="grow">Stuhlgang</span>
                      <span className="status">{digestion ? 'eingetragen' : 'noch nicht eingetragen'}</span>
                    </li>
                  </ul>
                </Panel>

                {showGame && (
                  <section className="quest">
                    <I.Gamepad size={50} />
                    <div className="grow">
                      <strong>Deine Tagesquest</strong>
                      <p>{tasksDone >= tasks.length ? 'Quest geschafft – Truhe geöffnet!' : `Noch ${tasks.length - tasksDone} Aufgabe${tasks.length - tasksDone === 1 ? '' : 'n'} bis zum nächsten Level!`}</p>
                      <div className="progress"><div style={{ width: `${(tasksDone / tasks.length) * 100}%` }} /></div>
                    </div>
                    <I.Chest size={64} />
                  </section>
                )}
              </div>

              <div className="dash-side">
                {showGame && (
                  <Panel title="Dein Fortschritt" className="progress-card">
                    <div className="level-row">
                      <I.Star size={52} />
                      <div className="grow">
                        <span className="muted small">Level 3 · {xp} / 200 XP</span>
                        <div className="progress"><div style={{ width: `${(xp / 200) * 100}%` }} /></div>
                      </div>
                    </div>
                  </Panel>
                )}

                <Panel title="Diese Woche">
                  <ul className="week-list">
                    <li><I.Face kind="good" size={26} /><span className="grow">Stimmung</span><Trend dir="up" good /></li>
                    <li><I.MoonIll size={26} /><span className="grow">Schlaf</span><Trend dir="flat" good /></li>
                    <li><I.Bolt size={26} color={I.illColors.rose} /><span className="grow">Schmerzen</span><Trend dir="down" good /></li>
                    <li><I.PillIll size={26} /><span className="grow">Medikamente</span><span className="status">{medsDone} von {meds.length} erledigt</span></li>
                    <li><I.HeartIll size={26} /><span className="grow">Symptome</span><span className="status">{symptomsToday ? `${symptomsToday} heute` : 'noch nicht eingetragen'}</span></li>
                    <li><I.Glass size={26} /><span className="grow">Trinken</span><span className="status">{liters(water)} / 2,0 L</span></li>
                    <li><I.Belly size={26} /><span className="grow">Stuhlgang</span><span className="status">{digestion ? 'eingetragen' : '–'}</span></li>
                  </ul>
                  <button className="text-button" onClick={() => navigate('Berichte')}>Entwicklung ansehen <ArrowRight size={15} /></button>
                </Panel>

                <Panel title="Nächster Termin">
                  {nextAppt ? (
                    <button className="next-appt" onClick={() => navigate('Termine')}>
                      <I.CalendarIll size={40} />
                      <span><strong>{nextAppt.title}</strong><small>{nextAppt.date === today ? 'Heute' : fmtShort(nextAppt.date)} · {nextAppt.time}</small></span>
                      <ChevronRight size={18} />
                    </button>
                  ) : <p className="muted">Keine Termine geplant.</p>}
                </Panel>
              </div>
            </div>
          )}

          {/* ============ MEINE DATEN ============ */}
          {page === 'Meine Daten' && (
            <>
              <div className="page-heading"><div><h1>Meine Daten</h1><p>So passt sich Medivo an dich an.</p></div><I.Clipboard size={64} /></div>
              <Tabs value={dataTab} options={['Profil', 'Erkrankungen'] as const} onChange={setDataTab} />
              {dataTab === 'Profil' ? (
                <div className="two-col align-start">
                  <Panel title="Persönliche Daten">
                    <label className="field">Anzeigename<input value={name} onChange={e => setName(e.target.value)} /></label>
                    <label className="field">Wie alt bist du?
                      <select value={age} onChange={e => setAge(e.target.value)}>
                        {Array.from({ length: 85 }, (_, i) => String(i + 14)).map(a => <option key={a}>{a}</option>)}
                      </select>
                    </label>
                    <label className="field">Sprache
                      <select value={language} onChange={e => setLanguage(e.target.value)}>
                        {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                      </select>
                    </label>
                    <div className="field">Wie möchtest du Medivo nutzen?
                      {goals.map((g, i) => (
                        <select key={i} value={g} aria-label={`Ziel ${i + 1}`} onChange={e => setGoals(v => v.map((x, j) => j === i ? e.target.value : x))}>
                          {['Meine Symptome besser verstehen', 'Medikamente im Blick behalten', 'Arztgespräche vorbereiten', 'Termine organisieren', 'Gewohnheiten aufbauen'].map(o => <option key={o}>{o}</option>)}
                        </select>
                      ))}
                      {goals.length < 3 && <button className="link-button left" onClick={() => setGoals(v => [...v, 'Medikamente im Blick behalten'])}><Plus size={15} /> Option hinzufügen</button>}
                    </div>
                  </Panel>
                  <Panel title="Wie soll Medivo mit dir kommunizieren?">
                    <ul className="comm-list">
                      {([
                        ['erinnern', 'Erinnern', 'Zeit für deine Medikamente.', <I.Sprout size={34} />],
                        ['unterstuetzen', 'Unterstützen', 'Du hast heute schon einiges geschafft.', <I.FlowerIll size={34} />],
                        ['motivieren', 'Motivieren', 'Nur noch eine Aufgabe bis zum Tagesziel!', <I.HeartIll size={34} />],
                        ['informieren', 'Informieren', 'Hier ist deine Entwicklung der letzten Woche.', <I.Sparkle size={34} color={I.illColors.lav} />],
                      ] as const).map(([key, title, example, ill]) => (
                        <li key={key}>
                          <span className="comm-ill">{ill}</span>
                          <span className="grow"><strong>{title}</strong><small>„{example}"</small></span>
                          <Toggle label={title} checked={comm[key]} onChange={v => setComm(c => ({ ...c, [key]: v }))} />
                        </li>
                      ))}
                    </ul>
                    <button className="primary full" onClick={() => setToast('Gespeichert – in dieser Demo nur bis zum Neuladen')}>Speichern</button>
                  </Panel>
                </div>
              ) : (
                <Panel title="Deine Erkrankungen">
                  <p className="muted">Diese Angaben personalisieren Vorlagen und Auswertungen. Sie dienen nur der Demo.</p>
                  <div className="chip-row">
                    {conditions.map(c => (
                      <span className="chip" key={c}>{c}<button aria-label={`${c} entfernen`} onClick={() => setConditions(v => v.filter(x => x !== c))}><X size={13} /></button></span>
                    ))}
                    {!conditions.length && <span className="muted">Noch keine Erkrankung hinterlegt.</span>}
                  </div>
                  <h4 className="sub-head">Hinzufügen</h4>
                  <div className="chip-row">
                    {TEMPLATES.filter(t => !conditions.includes(t.name)).map(t => (
                      <button className="chip add" key={t.name} onClick={() => setConditions(v => [...v, t.name])}><Plus size={13} />{t.name}</button>
                    ))}
                  </div>
                </Panel>
              )}
            </>
          )}

          {/* ============ SYMPTOME & MEDIKATION ============ */}
          {(page === 'Symptome' || page === 'Medikation') && (
            <>
              <div className="page-heading"><div><h1>Symptome &amp; Medikation</h1><p>Beobachte dein Wohlbefinden in deinem eigenen Tempo.</p></div>{symTab === 'Symptome' ? <I.HeartIll size={60} /> : <I.PillIll size={60} />}</div>
              <Tabs value={symTab} options={['Symptome', 'Medikation'] as const} onChange={v => { setSymTab(v); setPage(v); }} />

              {symTab === 'Symptome' ? (
                <div className="two-col align-start wide-left">
                  <Panel title="Symptome verwalten" action={<button className="primary small" onClick={() => setShowSymForm(v => !v)}><Plus size={15} /> Neues Symptom</button>}>
                    <p className="muted small top-gap">Passe deine Symptome an oder füge neue hinzu.</p>
                    {showSymForm && (
                      <div className="inline-form">
                        <label className="field">Symptom oder Beschwerde<input autoFocus value={symName} onChange={e => setSymName(e.target.value)} placeholder="z. B. Kopfschmerzen" onKeyDown={e => e.key === 'Enter' && addSymptom()} /></label>
                        <label className="field">Intensität: <b>{symLevel} / 10</b><input type="range" min={0} max={10} value={symLevel} onChange={e => setSymLevel(+e.target.value)} /></label>
                        <div className="form-actions"><button className="secondary" onClick={() => setShowSymForm(false)}>Abbrechen</button><button className="primary" onClick={addSymptom}>Eintragen</button></div>
                      </div>
                    )}
                    <ul className="record-list">
                      {symptoms.map(s => (
                        <li key={s.id}>
                          <span className="record-ill"><I.SymptomIll name={s.name} size={30} /></span>
                          <span className="grow">
                            <strong>{s.name}</strong>
                            {editId === s.id ? (
                              <label className="edit-range">
                                <input type="range" min={0} max={10} value={s.level} aria-label={`Intensität ${s.name}`} onChange={e => setSymptoms(v => v.map(x => x.id === s.id ? { ...x, level: +e.target.value } : x))} />
                                <b>{s.level}/10</b>
                              </label>
                            ) : (
                              <small>Skala 0–10 · zuletzt {s.level}/10 · {s.date === today ? 'heute' : fmtShort(s.date)}</small>
                            )}
                          </span>
                          <button className="icon-btn" aria-label={editId === s.id ? 'Fertig' : `${s.name} bearbeiten`} onClick={() => setEditId(editId === s.id ? null : s.id)}>{editId === s.id ? <Check size={17} /> : <Pencil size={16} />}</button>
                          <button className="icon-btn danger" aria-label={`${s.name} löschen`} onClick={() => setSymptoms(v => v.filter(x => x.id !== s.id))}><Trash2 size={16} /></button>
                        </li>
                      ))}
                      {!symptoms.length && <li className="muted empty">Noch keine Symptome dokumentiert.</li>}
                    </ul>
                  </Panel>
                  <Panel title="Häufige Medikamente">
                    <p className="muted small">Verwalte deine Medikamente und Dosierungen.</p>
                    <ul className="record-list compact">
                      {meds.map(m => <li key={m.id}><span className="record-ill"><I.PillIll size={26} /></span><span className="grow"><strong>{m.name}</strong><small>{m.dose} · {m.time} Uhr</small></span></li>)}
                    </ul>
                    <button className="primary full" onClick={() => { setSymTab('Medikation'); setPage('Medikation'); }}><Plus size={15} /> Medikament hinzufügen</button>
                  </Panel>
                </div>
              ) : (
                <div className="two-col align-start wide-left">
                  <Panel title="Dein Einnahmeplan" action={<span className="pill">{medsDone} von {meds.length} heute</span>}>
                    <ul className="record-list">
                      {meds.map(m => (
                        <li key={m.id}>
                          <button className="check-button" aria-pressed={m.done} aria-label={`${m.name} als eingenommen markieren`} onClick={() => toggleMed(m.id)}><CheckMark done={m.done} /></button>
                          <span className="record-ill"><I.PillIll size={30} /></span>
                          <span className="grow"><strong>{m.name}</strong><small>{m.dose} · {m.time} Uhr · {m.done ? 'eingenommen' : 'noch offen'}</small></span>
                          <button className="icon-btn danger" aria-label={`${m.name} löschen`} onClick={() => setMeds(v => v.filter(x => x.id !== m.id))}><Trash2 size={16} /></button>
                        </li>
                      ))}
                      {!meds.length && <li className="muted empty">Noch keine Medikamente hinterlegt.</li>}
                    </ul>
                    <p className="muted small">Diese Demo versendet keine Einnahmeerinnerungen.</p>
                  </Panel>
                  <Panel title="Medikament hinzufügen">
                    <label className="field">Bezeichnung<input value={medName} onChange={e => setMedName(e.target.value)} placeholder="Name des Medikaments" onKeyDown={e => e.key === 'Enter' && addMed()} /></label>
                    <label className="field">Dosierung<input value={medDose} onChange={e => setMedDose(e.target.value)} /></label>
                    <label className="field">Uhrzeit<input type="time" value={medTime} onChange={e => setMedTime(e.target.value)} /></label>
                    <button className="primary full" onClick={addMed}><Plus size={15} /> Hinzufügen</button>
                  </Panel>
                </div>
              )}
            </>
          )}

          {/* ============ TERMINE ============ */}
          {page === 'Termine' && (
            <>
              <div className="page-heading"><div><h1>Tagesansicht</h1><p>Behalte Termine und Einnahmen im Blick.</p></div><I.CalendarIll size={60} /></div>
              <div className="two-col align-start wide-left">
                <Panel>
                  <div className="day-head">
                    <button className="icon-btn" aria-label="Vorherige Woche" onClick={() => setWeekOffset(w => w - 1)}><ChevronLeft size={18} /></button>
                    <strong>{selDay === today ? 'Heute, ' : ''}{fmtLong(selDay)}</strong>
                    <button className="icon-btn" aria-label="Nächste Woche" onClick={() => setWeekOffset(w => w + 1)}><ChevronRight size={18} /></button>
                  </div>
                  <div className="week-strip">
                    {weekDays.map(d => {
                      const id = iso(d);
                      const has = appointments.some(a => a.date === id) || id === today;
                      return (
                        <button key={id} className={`${id === selDay ? 'selected' : ''} ${id === today ? 'is-today' : ''}`} onClick={() => setSelDay(id)} aria-pressed={id === selDay}>
                          <small>{d.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', '')}</small>
                          <strong>{d.getDate()}</strong>
                          {has && <i className="dot" />}
                        </button>
                      );
                    })}
                  </div>
                  <h4 className="sub-head">Meine Termine</h4>
                  <ul className="timeline">
                    {dayItems.map(it => (
                      <li key={it.id} className={it.done ? 'done' : ''}>
                        <time>{it.time}</time>
                        <span className="grow"><strong>{it.title}</strong>{it.sub && <small>{it.sub}</small>}</span>
                        {it.onToggle ? (
                          <button className="check-button" aria-pressed={it.done} aria-label="Einnahme abhaken" onClick={it.onToggle}><CheckMark done={it.done} /></button>
                        ) : (
                          <span className="kind-ill">{it.kind === 'therapie' ? <I.HeartIll size={26} color={I.illColors.sageL} /> : it.kind === 'labor' ? <I.Drop size={26} /> : <I.CalendarIll size={26} />}</span>
                        )}
                      </li>
                    ))}
                    {!dayItems.length && <li className="muted empty">Für diesen Tag ist nichts geplant.</li>}
                  </ul>
                  {showApptForm ? (
                    <div className="inline-form">
                      <label className="field">Bezeichnung<input autoFocus value={apTitle} onChange={e => setApTitle(e.target.value)} placeholder="z. B. Hausarzt" /></label>
                      <div className="field-row">
                        <label className="field">Datum<input type="date" value={apDate} onChange={e => setApDate(e.target.value)} /></label>
                        <label className="field">Uhrzeit<input type="time" value={apTime} onChange={e => setApTime(e.target.value)} /></label>
                      </div>
                      <label className="field">Art
                        <select value={apKind} onChange={e => setApKind(e.target.value as ApptKind)}>
                          <option value="arzt">Arzttermin</option><option value="therapie">Therapie</option><option value="labor">Labor / Blutabnahme</option>
                        </select>
                      </label>
                      <div className="form-actions"><button className="secondary" onClick={() => setShowApptForm(false)}>Abbrechen</button><button className="primary" onClick={addAppointment}>Speichern</button></div>
                    </div>
                  ) : (
                    <button className="primary center-btn" onClick={() => { setApDate(selDay); setShowApptForm(true); }}><Plus size={15} /> Termin hinzufügen</button>
                  )}
                </Panel>
                <Panel title="Nächste Termine">
                  <ul className="upcoming">
                    {upcoming.map(a => (
                      <li key={a.id}>
                        <span className="grow"><small>{fmtShort(a.date)}</small><strong>{a.time} · {a.title}</strong></span>
                        <button className="icon-btn danger" aria-label={`${a.title} löschen`} onClick={() => setAppointments(v => v.filter(x => x.id !== a.id))}><Trash2 size={16} /></button>
                      </li>
                    ))}
                    {!upcoming.length && <li className="muted empty">Keine weiteren Termine.</li>}
                  </ul>
                </Panel>
              </div>
            </>
          )}

          {/* ============ VORLAGEN ============ */}
          {page === 'Vorlagen' && (
            <>
              <div className="page-heading"><div><h1>Vorlagen &amp; Erkrankungen</h1><p>Starte mit einer passenden Struktur für deine Dokumentation.</p></div><I.FlowerIll size={60} /></div>
              <Tabs value={tplTab} options={['Vorlagen', 'Meine Vorlagen'] as const} onChange={setTplTab} />
              <Panel>
                {tplTab === 'Vorlagen' ? (
                  <>
                    <label className="search"><Search size={17} /><input value={tplQuery} onChange={e => setTplQuery(e.target.value)} placeholder="Suche nach Erkrankung …" aria-label="Vorlagen durchsuchen" /></label>
                    <h4 className="sub-head">Beliebte Vorlagen</h4>
                    <ul className="record-list">
                      {filteredTemplates.map(t => (
                        <li key={t.name}>
                          <span className="record-ill">{t.ill}</span>
                          <span className="grow"><strong>{t.name}</strong><small>{t.details}</small></span>
                          {myTemplates.includes(t.name)
                            ? <span className="pill"><Check size={13} /> übernommen</span>
                            : <button className="secondary small" onClick={() => adoptTemplate(t.name)}>Übernehmen</button>}
                        </li>
                      ))}
                      {!filteredTemplates.length && <li className="muted empty">Keine Vorlage gefunden.</li>}
                    </ul>
                  </>
                ) : (
                  <ul className="record-list">
                    {myTemplates.map(n => {
                      const t = TEMPLATES.find(x => x.name === n);
                      return (
                        <li key={n}>
                          <span className="record-ill">{t ? t.ill : <I.Sparkle size={30} />}</span>
                          <span className="grow"><strong>{n}</strong><small>{t ? t.details : 'Eigene Vorlage'}</small></span>
                          <button className="icon-btn danger" aria-label={`${n} entfernen`} onClick={() => setMyTemplates(v => v.filter(x => x !== n))}><Trash2 size={16} /></button>
                        </li>
                      );
                    })}
                    {!myTemplates.length && <li className="muted empty">Noch keine Vorlage übernommen.</li>}
                  </ul>
                )}
                <button className="primary full top-gap" onClick={() => {
                  const n = window.prompt('Name der eigenen Vorlage');
                  if (n && n.trim()) { setMyTemplates(v => [...v, n.trim()]); setTplTab('Meine Vorlagen'); }
                }}><Plus size={15} /> Eigene Vorlage erstellen</button>
              </Panel>
              <div className="notice"><I.Shield size={30} /> Die Vorlagen sind Strukturvorschläge und ersetzen keine ärztliche Empfehlung.</div>
            </>
          )}

          {/* ============ BERICHTE ============ */}
          {page === 'Berichte' && (
            <>
              <div className="page-heading"><div><h1>Berichte &amp; Arztzusammenfassung</h1><p>Stelle zusammen, was du in dein nächstes Arztgespräch mitnehmen möchtest.</p></div><I.Clipboard size={60} /></div>
              <Tabs value={reportTab} options={['Arztzusammenfassung', 'Verläufe'] as const} onChange={setReportTab} />
              {reportTab === 'Arztzusammenfassung' ? (
                <div className="two-col align-start">
                  <Panel title="Welche Daten sollen aufgenommen werden?">
                    <ul className="check-list">
                      {['Schmerzintensität', 'Schlaf', 'Medikamenteneinnahme', 'Symptome', 'Termine', 'Sonstige Notizen'].map(p => (
                        <li key={p}>
                          <label><input type="checkbox" checked={reportParts.includes(p)} onChange={() => setReportParts(v => v.includes(p) ? v.filter(x => x !== p) : [...v, p])} /> {p}</label>
                        </li>
                      ))}
                    </ul>
                    <div className="period">
                      <button className="icon-btn" aria-label="Kürzerer Zeitraum" onClick={() => setPeriod(p => p === 90 ? 30 : 7)}><ChevronLeft size={18} /></button>
                      <strong>Letzte {period} Tage</strong>
                      <button className="icon-btn" aria-label="Längerer Zeitraum" onClick={() => setPeriod(p => p === 7 ? 30 : 90)}><ChevronRight size={18} /></button>
                    </div>
                    <h4 className="sub-head">Deine wichtigsten Werte</h4>
                    <ul className="values">
                      <li><I.Bolt size={28} color={I.illColors.rose} /><span className="grow"><small>Schmerzintensität</small><strong>{avgPain ? avgPain.toFixed(1).replace('.', ',') : '–'} / 10</strong></span><Sparkline values={[6, 5, 6, 4, 5, 4, 4]} good="down" /></li>
                      <li><I.MoonIll size={28} /><span className="grow"><small>Schlaf</small><strong>Ø 6:48 h</strong></span><Sparkline values={[6.1, 6.5, 6.2, 6.9, 6.7, 7.0, 6.8]} /></li>
                      <li><I.PillIll size={28} /><span className="grow"><small>Medikamenteneinnahme</small><strong>91 %</strong></span><Sparkline values={[80, 85, 88, 86, 90, 92, 91]} /></li>
                      <li><I.HeartIll size={28} /><span className="grow"><small>Symptom-Einträge</small><strong>{periodSymptoms.length}</strong></span><Sparkline values={[2, 3, 2, 4, 3, 3, Math.max(1, periodSymptoms.length)]} good="down" /></li>
                    </ul>
                    <button className="primary full" onClick={() => window.print()}><Download size={16} /> Drucken / als PDF speichern</button>
                  </Panel>
                  <Panel title="Berichtsvorschau" className="report-preview">
                    <div className="report-head"><Logo /><span className="muted small">erstellt am {fmtLong(today)}</span></div>
                    <p className="muted small">Persönliche Übersicht · Zeitraum: letzte {period} Tage</p>
                    {reportParts.includes('Schmerzintensität') && <><h4>Schmerzintensität</h4><p>Ø {avgPain ? avgPain.toFixed(1).replace('.', ',') : '–'} / 10</p></>}
                    {reportParts.includes('Schlaf') && <><h4>Schlaf</h4><p>Ø 6:48 h pro Nacht (Demo-Wert)</p></>}
                    {reportParts.includes('Medikamenteneinnahme') && <><h4>Medikamente</h4>{meds.map(m => <p key={m.id}>• {m.name} – {m.dose}, {m.time} Uhr</p>)}</>}
                    {reportParts.includes('Symptome') && <><h4>Symptome</h4>{periodSymptoms.map(s => <p key={s.id}>• {s.name}: {s.level}/10 ({fmtShort(s.date)})</p>)}{!periodSymptoms.length && <p className="muted">Keine Einträge im Zeitraum.</p>}</>}
                    {reportParts.includes('Termine') && <><h4>Termine</h4>{appointments.map(a => <p key={a.id}>• {a.title}, {fmtShort(a.date)}, {a.time}</p>)}</>}
                    {reportParts.includes('Sonstige Notizen') && <><h4>Notizen</h4><p className="muted">Noch keine Notizen erfasst.</p></>}
                    <p className="muted small disclaimer">Demo-Zusammenfassung. Fehlende Einträge bedeuten nicht, dass keine Beschwerden vorlagen. Kein medizinischer Befund.</p>
                  </Panel>
                </div>
              ) : (
                <>
                  <Panel title="Symptomintensität">
                    <p className="muted">Die Balken zeigen die aktuellen Beispiel-Einträge – keine medizinische Analyse.</p>
                    <div className="bar-chart">
                      {symptoms.map(s => (
                        <div className="bar-row" key={s.id}>
                          <span className="bar-label"><I.SymptomIll name={s.name} size={22} />{s.name}</span>
                          <div className="bar-track"><div style={{ width: `${s.level * 10}%` }} /></div>
                          <strong>{s.level}/10</strong>
                        </div>
                      ))}
                    </div>
                  </Panel>
                  <div className="notice"><CircleHelp size={20} /> Zusammenhänge zwischen Schlaf, Symptomen und Medikamenten werden erst mit einer geeigneten Datenbasis und Auswertungslogik ergänzt.</div>
                </>
              )}
            </>
          )}

          {/* ============ EINSTELLUNGEN ============ */}
          {page === 'Einstellungen' && (
            <>
              <div className="page-heading"><div><h1>Dein Medivo</h1><p>Gestalte die App so, wie sie am besten zu dir passt.</p></div><I.Sparkle size={56} /></div>
              <Panel title="Modus auswählen">
                <p className="muted">Jeder Modus verändert Farben, Lesbarkeit und Informationsdichte.</p>
                <ModeGrid mode={mode} onSelect={setMode} />
              </Panel>
              <div className="settings-grid">
                <Panel title="Mehrsprachigkeit" className="setting-card">
                  <I.GlobeIll size={50} />
                  <p className="muted small">Wähle deine bevorzugte Sprache.</p>
                  <div className="lang-grid">
                    {LANGUAGES.map(l => (
                      <button key={l.code} className={language === l.code ? 'selected' : ''} aria-pressed={language === l.code} onClick={() => setLanguage(l.code)}><b>{l.code}</b>{l.name}</button>
                    ))}
                  </div>
                  <p className="muted small">Die Demo-Texte sind derzeit Deutsch.</p>
                </Panel>
                <Panel title="Companion" className="setting-card">
                  <I.Cat size={96} mood={companion ? 'happy' : 'sleepy'} />
                  <p className="muted small">Möchtest du einen persönlichen Begleiter, der dich motiviert und unterstützt?</p>
                  <div className="seg">
                    <button className={companion ? 'selected' : ''} onClick={() => setCompanion(true)}>Ja, gerne</button>
                    <button className={!companion ? 'selected' : ''} onClick={() => setCompanion(false)}>Später</button>
                  </div>
                </Panel>
                <Panel title="Dark Mode" className="setting-card">
                  <I.MoonIll size={50} />
                  <p className="muted small">Für eine angenehme Darstellung zu jeder Tageszeit.</p>
                  <Toggle label="Dunkles Design" checked={dark} onChange={setDark} />
                </Panel>
                <Panel title="Datenschutz & Sicherheit" className="setting-card">
                  <I.Shield size={50} />
                  <p className="muted small"><strong>Diese Demo speichert keine Daten.</strong> Für eine echte Version sind geplant:</p>
                  <ul className="plan-list">
                    <li>Verschlüsselte Datenübertragung</li>
                    <li>DSGVO-konformes Einwilligungs- und Löschkonzept</li>
                    <li>Sichere Authentifizierung</li>
                  </ul>
                </Panel>
              </div>
            </>
          )}
        </div>
      </main>

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
