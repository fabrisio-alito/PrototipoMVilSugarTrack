import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import Logo from './Logo';

type Screen =
  | 'welcome'
  | 'login'
  | 'signup'
  | 'body'
  | 'indicators'
  | 'goal'
  | 'quiz'
  | 'home'
  | 'register'
  | 'food-detail'
  | 'alert'
  | 'progress'
  | 'profile'
  | 'limit'
  | 'history'
  | 'premium';

type IconName =
  | 'home'
  | 'plus'
  | 'chart'
  | 'user'
  | 'search'
  | 'scan'
  | 'camera'
  | 'mail'
  | 'lock'
  | 'back'
  | 'check'
  | 'spark'
  | 'shield'
  | 'file'
  | 'history'
  | 'chevron'
  | 'eye'
  | 'eyeoff';

type Sex = 'mujer' | 'hombre';
type Family = 'si' | 'no' | 'nose';
type Activity = 'baja' | 'moderada' | 'alta';
type Goal = 'prevenir' | 'controlar' | 'reducir';
type Level = 'low' | 'ok' | 'warn' | 'high';
type Cat = { label: string; level: Level };

type Profile = {
  name: string;
  sex: Sex | '';
  age: string;
  weight: string;
  height: string;
  waist: string;
  family: Family | '';
  activity: Activity | '';
  goal: Goal;
};

const defaultProfile: Profile = {
  name: 'Mariana Torres',
  sex: '',
  age: '',
  weight: '',
  height: '',
  waist: '',
  family: '',
  activity: '',
  goal: 'prevenir',
};

const demoValues = {
  sex: 'mujer' as Sex,
  age: '32',
  weight: '64',
  height: '165',
  waist: '78',
  family: 'no' as Family,
  activity: 'moderada' as Activity,
};

const goalText: Record<Goal, string> = {
  prevenir: 'prevenir la diabetes',
  controlar: 'controlar mi consumo',
  reducir: 'reducir el azúcar',
};

const isComplete = (p: Profile) => !!(p.sex && p.age && p.weight && p.height && p.waist && p.family && p.activity);

const round1 = (n: number) => Math.round(n * 10) / 10;

function metrics(p: Profile) {
  const w = parseFloat(p.weight);
  const h = parseFloat(p.height);
  const wc = parseFloat(p.waist);
  const age = parseFloat(p.age);
  const male = p.sex === 'hombre';

  const bmi = round1(w / ((h / 100) * (h / 100)));
  const bmiCat: Cat =
    bmi < 18.5 ? { label: 'Bajo peso', level: 'low' }
    : bmi < 25 ? { label: 'Normal', level: 'ok' }
    : bmi < 30 ? { label: 'Sobrepeso', level: 'warn' }
    : { label: 'Obesidad', level: 'high' };

  const thr = male ? { t1: 94, t2: 102, min: 70, max: 130 } : { t1: 80, t2: 88, min: 60, max: 110 };
  const waistCat: Cat =
    wc < thr.t1 ? { label: 'Normal', level: 'ok' }
    : wc < thr.t2 ? { label: 'Aumentado', level: 'warn' }
    : { label: 'Alto', level: 'high' };

  const ratio = Math.round((wc / h) * 100) / 100;
  const ratioCat: Cat =
    ratio < 0.5 ? { label: 'Favorable', level: 'ok' }
    : ratio < 0.6 ? { label: 'Aumentado', level: 'warn' }
    : { label: 'Alto', level: 'high' };

  const bmr = 10 * w + 6.25 * h - 5 * age + (male ? 5 : -161);
  const factor = { baja: 1.2, moderada: 1.55, alta: 1.725 }[p.activity || 'moderada'];
  const kcal = Math.round(bmr * factor);

  const markers: string[] = [];
  if (bmi >= 25) markers.push('IMC de 25 o más');
  if (waistCat.level === 'high') markers.push('Cintura en riesgo alto');
  if (p.family === 'si') markers.push('Familiares con diabetes');
  const pct = markers.length === 0 ? 10 : markers.length === 1 ? 7.5 : 5;

  const rawLimit = (kcal * (pct / 100)) / 4;
  const limit = Math.min(70, Math.max(25, Math.round(rawLimit / 5) * 5));

  return { bmi, bmiCat, wc, male, thr, waistCat, ratio, ratioCat, kcal, markers, pct, rawLimit, limit };
}

type Group = 'Bebidas' | 'Desayuno' | 'Postres' | 'Snacks' | 'Platos';
type Food = { name: string; detail: string; sugar: number; emoji: string; tone: string; category: string; group: Group; fav?: boolean };
type Added = { id: number; name: string; emoji: string; sugar: number };

const foods: Food[] = [
  { name: 'Inca Kola', detail: '1 vaso · 250 ml', sugar: 27, emoji: '🥤', tone: '#FFF2D8', category: 'Bebida gaseosa', group: 'Bebidas', fav: true },
  { name: 'Chicha morada', detail: '1 vaso · 250 ml', sugar: 18, emoji: '🫗', tone: '#F0ECFF', category: 'Bebida tradicional', group: 'Bebidas', fav: true },
  { name: 'Jugo de naranja', detail: '1 vaso · 250 ml', sugar: 21, emoji: '🍊', tone: '#FFF2D8', category: 'Jugo de fruta', group: 'Bebidas' },
  { name: 'Café con leche', detail: '1 taza · 200 ml', sugar: 6, emoji: '☕', tone: '#F6EDE3', category: 'Bebida caliente', group: 'Bebidas' },
  { name: 'Té con azúcar', detail: '1 taza · 200 ml', sugar: 6, emoji: '🍵', tone: '#E8F6EE', category: 'Bebida caliente', group: 'Bebidas' },
  { name: 'Inca Kola sin azúcar', detail: '1 vaso · 250 ml', sugar: 0, emoji: '🥤', tone: '#E8F6EE', category: 'Bebida sin azúcar', group: 'Bebidas' },
  { name: 'Pan con mermelada', detail: '1 porción', sugar: 14, emoji: '🍞', tone: '#FFF0E9', category: 'Panadería', group: 'Desayuno', fav: true },
  { name: 'Yogur de fresa', detail: '1 envase · 120 g', sugar: 12, emoji: '🥛', tone: '#F3ECFF', category: 'Lácteo', group: 'Desayuno', fav: true },
  { name: 'Avena con azúcar', detail: '1 taza · 250 ml', sugar: 10, emoji: '🥣', tone: '#FFF0E9', category: 'Cereal caliente', group: 'Desayuno' },
  { name: 'Pan con palta', detail: '1 porción', sugar: 1, emoji: '🥑', tone: '#E8F6EE', category: 'Panadería', group: 'Desayuno' },
  { name: 'Helado', detail: '1 bola · 80 g', sugar: 11, emoji: '🍨', tone: '#FDE8EF', category: 'Postre frío', group: 'Postres' },
  { name: 'Torta', detail: '1 porción · 90 g', sugar: 11, emoji: '🍰', tone: '#FDE8EF', category: 'Postre', group: 'Postres' },
  { name: 'Arroz con leche', detail: '1 vaso · 150 g', sugar: 22, emoji: '🍮', tone: '#FFF2D8', category: 'Postre tradicional', group: 'Postres' },
  { name: 'Mazamorra morada', detail: '1 vaso · 200 g', sugar: 24, emoji: '🫐', tone: '#F0ECFF', category: 'Postre tradicional', group: 'Postres' },
  { name: 'Suspiro a la limeña', detail: '1 copa · 100 g', sugar: 30, emoji: '🍯', tone: '#FFF2D8', category: 'Postre tradicional', group: 'Postres' },
  { name: 'Barra de chocolate', detail: '1 barra · 30 g', sugar: 12, emoji: '🍫', tone: '#F6EDE3', category: 'Snack dulce', group: 'Snacks' },
  { name: 'Galletas rellenas', detail: '3 unidades · 36 g', sugar: 11, emoji: '🍪', tone: '#FFF0E9', category: 'Snack dulce', group: 'Snacks' },
  { name: 'Caramelos', detail: '4 unidades · 20 g', sugar: 14, emoji: '🍬', tone: '#FDE8EF', category: 'Golosina', group: 'Snacks' },
  { name: 'Ají de gallina', detail: '1 plato', sugar: 8, emoji: '🍲', tone: '#FFF2D8', category: 'Plato de fondo', group: 'Platos' },
  { name: 'Lomo saltado', detail: '1 plato', sugar: 3, emoji: '🥘', tone: '#FFF0E9', category: 'Plato de fondo', group: 'Platos' },
  { name: 'Ceviche', detail: '1 plato', sugar: 2, emoji: '🐟', tone: '#EAF2FF', category: 'Plato de fondo', group: 'Platos' },
  { name: 'Tallarines rojos', detail: '1 plato', sugar: 9, emoji: '🍝', tone: '#FFEDE6', category: 'Plato de fondo', group: 'Platos' },
  { name: 'Arroz con pollo', detail: '1 plato', sugar: 4, emoji: '🍛', tone: '#F0F7E3', category: 'Plato de fondo', group: 'Platos' },
  { name: 'Causa limeña', detail: '1 porción', sugar: 3, emoji: '🥔', tone: '#FFF6D6', category: 'Entrada', group: 'Platos' },
];

const BASE_TODAY = 38; // lo ya registrado hoy: café 6 + yogur 12 + ají 8 + chocolate 12
let uid = 0;
const nextId = () => ++uid;
const limitOf = (p: Profile) => metrics(isComplete(p) ? p : { ...p, ...demoValues }).limit;
const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const foodLevel = (sugar: number, limit: number): Level => (sugar >= limit * 0.4 ? 'high' : sugar >= limit * 0.2 ? 'warn' : 'ok');

const historyDays = [
  { day: 'Hoy', date: 'Martes 14 de mayo', total: 38, items: ['☕ Café con leche · 6 g', '🥛 Yogur de fresa · 12 g', '🍲 Ají de gallina · 8 g', '🍫 Barra de chocolate · 12 g'] },
  { day: 'Ayer', date: 'Lunes 13 de mayo', total: 34, items: ['☕ Café con leche · 6 g', '🍞 Pan con mermelada · 14 g', '🍲 Ají de gallina · 8 g', '🍵 Té con azúcar · 6 g'] },
  { day: 'Domingo', date: '12 de mayo', total: 52, items: ['🥤 Inca Kola · 27 g', '🍞 Pan con mermelada · 14 g', '🍨 Helado · 11 g'] },
  { day: 'Sábado', date: '11 de mayo', total: 41, items: ['🫗 Chicha morada · 18 g', '🥛 Yogur de fresa · 12 g', '🍰 Torta · 11 g'] },
];

const emailOk = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

function Icon({ name, size = 22, strokeWidth = 2 }: { name: IconName; size?: number; strokeWidth?: number }) {
  const paths: Record<IconName, ReactNode> = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    chart: <><path d="M4 19V9M10 19V5M16 19v-7M22 19H2" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M4 7.5l8 5.5 8-5.5" /></>,
    lock: <><rect x="5" y="11" width="14" height="9" rx="3" /><path d="M8 11V8a4 4 0 018 0v3" /></>,
    camera: <><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></>,
    scan: <><path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M7 12h10" /></>,
    back: <><path d="m15 18-6-6 6-6" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    spark: <><path d="m12 3 1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4L12 3Z" /><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" /></>,
    shield: <><path d="M12 3 5 6v5c0 4.6 2.8 8 7 10 4.2-2 7-5.4 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></>,
    file: <><path d="M7 3h7l4 4v14H7zM14 3v5h4M10 13h5M10 17h5" /></>,
    history: <><path d="M4 12a8 8 0 1 0 2-5.3L4 9" /><path d="M4 4v5h5M12 8v5l3 2" /></>,
    chevron: <><path d="m9 18 6-6-6-6" /></>,
    eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
    eyeoff: <><path d="M3 3l18 18" /><path d="M6.6 6.6A17 17 0 0 0 2 12s4 7 10 7a9.6 9.6 0 0 0 4.4-1.1M10.6 5.1A9.7 9.7 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3.2 3.9" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`logo ${compact ? 'logo--compact' : ''}`}>
      <Logo size={compact ? 44 : 56} />
      <div>
        <div className="logo-name">Sugar<span>Track</span></div>
        {!compact && <div className="logo-tagline">Tu dulce guía saludable</div>}
      </div>
    </div>
  );
}

function Button({ children, variant = 'primary', onClick, className = '' }: { children: ReactNode; variant?: 'primary' | 'secondary' | 'ghost'; onClick?: () => void; className?: string }) {
  return <button className={`button button--${variant} ${className}`} onClick={onClick}>{children}</button>;
}

function Card({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return <div className={`card ${onClick ? 'card--clickable' : ''} ${className}`} onClick={onClick}>{children}</div>;
}

function Header({ title, onBack, action }: { title: string; onBack?: () => void; action?: ReactNode }) {
  return (
    <header className="page-header">
      {onBack ? <button className="icon-button" onClick={onBack} aria-label="Volver"><Icon name="back" /></button> : <div className="header-spacer" />}
      <h1>{title}</h1>
      <div className="header-action">{action}</div>
    </header>
  );
}

function TextField({
  label, value, onChange, type = 'text', placeholder, error, hint, autoComplete, trailing, icon,
}: {
  icon?: IconName;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  autoComplete?: string;
  trailing?: ReactNode;
}) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      <div className={`field-input ${error ? 'has-error' : ''}`}>
        {icon && <span className="fi-ico"><Icon name={icon} size={19} /></span>}
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoComplete={autoComplete} />
        {trailing}
      </div>
      {error ? <p className="field-error">{error}</p> : hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  );
}

function PasswordToggle({ shown, toggle }: { shown: boolean; toggle: () => void }) {
  return (
    <button type="button" className="field-icon-btn" onClick={toggle} aria-label={shown ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
      <Icon name={shown ? 'eyeoff' : 'eye'} size={20} />
    </button>
  );
}

function NumberField({
  label, unit, value, onChange, placeholder, error,
}: {
  label: string;
  unit: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}) {
  return (
    <label>
      {label}
      <div className={`input-suffix ${error ? 'has-error' : ''}`}>
        <input value={value} onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ''))} inputMode="decimal" placeholder={placeholder} />
        <span>{unit}</span>
      </div>
      {error && <p className="field-error">{error}</p>}
    </label>
  );
}

function Segmented<T extends string>({
  options, value, onChange,
}: {
  options: { id: T; label: string }[];
  value: T | '';
  onChange: (value: T) => void;
}) {
  return (
    <div className="segmented">
      {options.map((o) => (
        <button type="button" key={o.id} className={value === o.id ? 'on' : ''} onClick={() => onChange(o.id)}>{o.label}</button>
      ))}
    </div>
  );
}

function RangeBar({ segments, pos }: { segments: { label: string; level: Level; size: number }[]; pos: number }) {
  const left = Math.min(98, Math.max(2, pos * 100));
  const sum = segments.reduce((a, s) => a + s.size, 0);
  const grow = (size: number) => `${(size / sum) * 100} 1 0%`;
  return (
    <div className="range">
      <div className="range-track">
        {segments.map((s) => <i key={s.label} className={`c-${s.level}`} style={{ flex: grow(s.size) }} />)}
      </div>
      <span className="range-marker" style={{ left: `${left}%` }} />
      <div className="range-labels">
        {segments.map((s) => <span key={s.label} style={{ flex: grow(s.size) }}>{s.label}</span>)}
      </div>
    </div>
  );
}

function BottomNav({ screen, setScreen }: { screen: Screen; setScreen: (s: Screen) => void }) {
  const items: { label: string; icon: IconName; target: Screen }[] = [
    { label: 'Inicio', icon: 'home', target: 'home' },
    { label: 'Registrar', icon: 'plus', target: 'register' },
    { label: 'Progreso', icon: 'chart', target: 'progress' },
    { label: 'Perfil', icon: 'user', target: 'profile' },
  ];
  return (
    <nav className="bottom-nav">
      {items.map((item) => {
        const active = screen === item.target || (item.target === 'register' && screen === 'food-detail');
        return (
          <button key={item.label} className={active ? 'active' : ''} onClick={() => setScreen(item.target)}>
            <span className="nav-icon"><Icon name={item.icon} size={21} /></span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function AuthHero({ onBack, step, title, sub, art, extra }: { onBack: () => void; step?: number; title: ReactNode; sub: string; art: string; extra?: ReactNode }) {
  return (
    <div className="ah">
      <i className="ah-glow g1" />
      <i className="ah-glow g2" />
      <div className="ah-bar">
        <button className="ah-back" onClick={onBack} aria-label="Volver"><Icon name="back" size={20} /></button>
        <div className="ah-brand">Sugar<span>Track</span></div>
      </div>
      {step ? (
        <div className="ah-steps" role="img" aria-label={`Paso ${step} de 4`}>
          {[1, 2, 3, 4].map((i) => <i key={i} className={i < step ? 'done' : i === step ? 'now' : ''} />)}
          <small>Paso {step} de 4</small>
        </div>
      ) : null}
      <h1>{title}</h1>
      <p>{sub}</p>
      {extra}
      <span className="ah-bub"><FoodArt name={art} emoji="🍬" size={46} still /></span>
    </div>
  );
}

type Mood = 'happy' | 'worry' | 'alert' | 'cheer';

function Dulci({ mood = 'happy', size = 90 }: { mood?: Mood; size?: number }) {
  const ink = '#14284B';
  return (
    <svg className={`dl dl-${mood}`} width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="Dulci, tu compañero de SugarTrack">
      <defs>
        <linearGradient id="dlg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#DCE6F6" />
        </linearGradient>
      </defs>
      <ellipse className="dl-shadow" cx="50" cy="92" rx="27" ry="4.5" fill="rgba(20,40,75,.2)" />
      <g className="dl-body">
        <g className="dl-spoon">
          <rect x="66" y="4" width="3.6" height="22" rx="1.8" transform="rotate(20 68 15)" fill="#F26A1B" />
          <ellipse cx="75" cy="8" rx="6.5" ry="4.2" transform="rotate(20 75 8)" fill="#FF8A3D" />
        </g>
        <rect x="14" y="20" width="72" height="68" rx="22" fill="url(#dlg)" stroke="#BFD0EA" strokeWidth="2.2" />
        <path d="M25 33 Q50 24 75 33" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" />
        <circle cx="26" cy="78" r="1.8" fill="#BFD0EA" />
        <circle cx="74" cy="80" r="1.4" fill="#BFD0EA" />
        <circle cx="70" cy="30" r="1.4" fill="#BFD0EA" />
        <circle className="dl-cheek" cx="28" cy="63" r="6" fill="#FFADBE" opacity=".6" />
        <circle className="dl-cheek" cx="72" cy="63" r="6" fill="#FFADBE" opacity=".6" />

        {mood === 'cheer' ? (
          <g fill="none" stroke={ink} strokeWidth="3.4" strokeLinecap="round">
            <path d="M32 54 Q38 45 44 54" />
            <path d="M56 54 Q62 45 68 54" />
          </g>
        ) : (
          <g className="dl-eyes">
            <ellipse cx="38" cy="53" rx="4.8" ry="5.8" fill={ink} />
            <ellipse cx="62" cy="53" rx="4.8" ry="5.8" fill={ink} />
            <circle cx="39.8" cy="50.6" r="1.7" fill="#fff" />
            <circle cx="63.8" cy="50.6" r="1.7" fill="#fff" />
          </g>
        )}

        {mood === 'worry' && (
          <g stroke={ink} strokeWidth="2.6" strokeLinecap="round" fill="none">
            <path d="M31 42 L44 45" />
            <path d="M69 42 L56 45" />
          </g>
        )}
        {mood === 'alert' && (
          <g stroke={ink} strokeWidth="2.6" strokeLinecap="round" fill="none">
            <path d="M31 45 L44 42" />
            <path d="M69 45 L56 42" />
          </g>
        )}

        {mood === 'happy' && <path d="M41 65 Q50 73 59 65" fill="none" stroke={ink} strokeWidth="3.2" strokeLinecap="round" />}
        {mood === 'cheer' && (
          <g>
            <path d="M40 62 Q50 80 60 62 Z" fill={ink} />
            <path d="M44 71 Q50 76 56 71 Q50 68 44 71 Z" fill="#FF7A8A" />
          </g>
        )}
        {mood === 'worry' && <path d="M43 69 Q50 65 57 69" fill="none" stroke={ink} strokeWidth="3.2" strokeLinecap="round" />}
        {mood === 'alert' && <path d="M42 71 Q50 61 58 71" fill="none" stroke={ink} strokeWidth="3.2" strokeLinecap="round" />}

        {mood === 'worry' && <path className="dl-drop" d="M80 40 Q84 47 80 50 Q76 47 80 40 Z" fill="#7CC4FF" />}
        {mood === 'cheer' && (
          <g className="dl-stars" fill="#FFC15E">
            <path d="M10 28 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z" />
            <path d="M88 52 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6 z" />
          </g>
        )}
      </g>
    </svg>
  );
}

type Habits = {
  diagnosis: string;
  sweets: string[];
  drinks: string;
  craving: string[];
  tried: string;
  pace: string;
};

const defaultHabits: Habits = { diagnosis: '', sweets: [], drinks: '', craving: [], tried: '', pace: '' };
const demoHabits: Habits = { diagnosis: 'no', sweets: ['bebidas', 'postres'], drinks: '2', craving: ['tarde'], tried: 'before', pace: 'medio' };

type QOption = { id: string; emoji: string; label: string; desc?: string };
type Question = { key: keyof Habits; multi: boolean; title: string; sub: string; options: QOption[]; note?: Record<string, string> };

const questions: Question[] = [
  {
    key: 'diagnosis',
    multi: false,
    title: '¿Te han diagnosticado diabetes o prediabetes?',
    sub: 'SugarTrack es una guía de prevención, no un tratamiento.',
    options: [
      { id: 'no', emoji: '🙂', label: 'No, ninguna' },
      { id: 'pre', emoji: '🩺', label: 'Prediabetes' },
      { id: 'dm', emoji: '🩸', label: 'Diabetes' },
      { id: 'skip', emoji: '🤐', label: 'Prefiero no decirlo' },
    ],
    note: {
      pre: 'Gracias por contarnos. Tu límite es una referencia general: sigue siempre las indicaciones de tu médico.',
      dm: 'Gracias por contarnos. Tu límite es una referencia general: sigue siempre las indicaciones de tu médico.',
    },
  },
  {
    key: 'sweets',
    multi: true,
    title: '¿Qué dulces consumes más?',
    sub: 'Elige todos los que quieras.',
    options: [
      { id: 'bebidas', emoji: '🥤', label: 'Gaseosas y bebidas azucaradas' },
      { id: 'jugos', emoji: '🧃', label: 'Jugos y néctares' },
      { id: 'postres', emoji: '🍰', label: 'Postres y tortas' },
      { id: 'chocolate', emoji: '🍫', label: 'Chocolates y golosinas' },
      { id: 'desayuno', emoji: '🍞', label: 'Pan con mermelada o cereales dulces' },
      { id: 'cafe', emoji: '☕', label: 'Café o té con azúcar' },
    ],
  },
  {
    key: 'drinks',
    multi: false,
    title: '¿Cuántas bebidas azucaradas tomas al día?',
    sub: 'Gaseosas, jugos envasados, chicha o café con azúcar.',
    options: [
      { id: '0', emoji: '💧', label: 'Ninguna' },
      { id: '1', emoji: '🥤', label: '1 al día' },
      { id: '2', emoji: '🥤', label: '2 al día' },
      { id: '3+', emoji: '🧋', label: '3 o más' },
    ],
  },
  {
    key: 'craving',
    multi: true,
    title: '¿Cuándo se te antoja más lo dulce?',
    sub: 'Así te avisamos en el momento justo.',
    options: [
      { id: 'manana', emoji: '🌅', label: 'Por la mañana' },
      { id: 'tarde', emoji: '☀️', label: 'Por la tarde' },
      { id: 'noche', emoji: '🌙', label: 'En la noche' },
      { id: 'animo', emoji: '😮‍💨', label: 'Cuando estoy estresado o decaído' },
    ],
  },
  {
    key: 'tried',
    multi: false,
    title: '¿Has intentado reducir el azúcar antes?',
    sub: 'No hay respuesta mala, solo punto de partida.',
    options: [
      { id: 'now', emoji: '💪', label: 'Sí, lo estoy haciendo ahora' },
      { id: 'before', emoji: '🔁', label: 'Lo intenté, pero no pude seguir' },
      { id: 'want', emoji: '🌱', label: 'No, pero quiero empezar' },
      { id: 'unsure', emoji: '🤔', label: 'No sé por dónde empezar' },
    ],
  },
  {
    key: 'pace',
    multi: false,
    title: '¿A qué ritmo quieres cambiar?',
    sub: 'Esto ajusta tu reto diario. No cambia tu límite.',
    options: [
      { id: 'suave', emoji: '🐢', label: 'Suave', desc: '1 opción sin azúcar al día' },
      { id: 'medio', emoji: '🚶', label: 'Constante', desc: '2 opciones sin azúcar al día' },
      { id: 'firme', emoji: '🚀', label: 'Firme', desc: '3 opciones sin azúcar al día' },
    ],
  },
];

const challengeGoal = (h: Habits) => (h.pace === 'suave' ? 1 : h.pace === 'firme' ? 3 : 2);

const focusOf = (h: Habits) => {
  if (h.sweets.includes('bebidas') || h.sweets.includes('jugos') || h.drinks === '2' || h.drinks === '3+') return 'Bebidas';
  if (h.sweets.includes('postres')) return 'Postres';
  if (h.sweets.includes('chocolate')) return 'Golosinas';
  if (h.sweets.includes('desayuno')) return 'Desayuno';
  if (h.sweets.includes('cafe')) return 'Café y té';
  return 'Hábitos generales';
};

const focusTip: Record<string, string> = {
  Bebidas: 'Cambia una bebida azucarada por agua o una versión sin azúcar.',
  Postres: 'Elige porciones pequeñas y deja el postre para después de comer.',
  Golosinas: 'Revisa la etiqueta: busca el octógono "Alto en azúcar".',
  Desayuno: 'Prueba el pan con palta en lugar de mermelada.',
  'Café y té': 'Baja media cucharadita cada semana, hasta endulzar menos.',
  'Hábitos generales': 'Registra todo lo que comes: lo que se ve, se puede cuidar.',
};

const remindOptions: { id: string; emoji: string; label: string }[] = [
  { id: 'manana', emoji: '🌅', label: 'Mañana · 8:00' },
  { id: 'tarde', emoji: '☀️', label: 'Tarde · 1:00 p. m.' },
  { id: 'noche', emoji: '🌙', label: 'Noche · 8:00 p. m.' },
  { id: 'no', emoji: '🔕', label: 'No, gracias' },
];

function Quiz({ initial, limit, back, done, cta = 'Ir a mi día' }: { initial: Habits; limit: number; back: () => void; done: (h: Habits) => void; cta?: string }) {
  const [step, setStep] = useState(0);
  const [h, setH] = useState<Habits>(initial);
  const [remind, setRemind] = useState('noche');
  const n = questions.length;
  const q = questions[step];
  const isPlan = step >= n;

  const value = q ? h[q.key] : '';
  const picked = Array.isArray(value) ? value : value ? [value] : [];
  const answered = picked.length > 0;

  const choose = (id: string) => {
    if (!q) return;
    if (q.multi) {
      const cur = h[q.key] as string[];
      setH({ ...h, [q.key]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] });
    } else {
      setH({ ...h, [q.key]: id });
    }
  };

  const goBack = () => (step === 0 ? back() : setStep(step - 1));
  const focus = focusOf(h);
  const goal = challengeGoal(h);
  const note = q?.note && !q.multi ? q.note[value as string] : undefined;

  return (
    <main className="screen qz">
      <div className="qz-top">
        <button className="qz-back" onClick={goBack} aria-label="Volver"><Icon name="back" size={22} /></button>
        <div className="qz-bar"><i style={{ width: `${((isPlan ? n : step + 1) / (n + 1)) * 100}%` }} /></div>
        <small>{isPlan ? 'Listo' : `${step + 1}/${n}`}</small>
      </div>

      {!isPlan ? (
        <div className="qz-body" key={step}>
          <div className="qz-pet"><Dulci mood={answered && q.key !== 'diagnosis' ? 'cheer' : 'happy'} size={92} /></div>
          <h1>{q.title}</h1>
          <p className="qz-sub">{q.sub}</p>
          <div className="qz-list">
            {q.options.map((o, i) => {
              const on = picked.includes(o.id);
              return (
                <button key={o.id} className={`qz-opt ${on ? 'on' : ''}`} style={{ animationDelay: `${i * 50}ms` }} onClick={() => choose(o.id)} aria-pressed={on}>
                  <span className="qz-emoji">{o.emoji}</span>
                  <span className="qz-txt"><strong>{o.label}</strong>{o.desc && <small>{o.desc}</small>}</span>
                  <span className="qz-check">{on ? '✓' : ''}</span>
                </button>
              );
            })}
          </div>
          {note && <p className="qz-note">{note}</p>}
        </div>
      ) : (
        <div className="qz-body plan" key="plan">
          <div className="qz-pet"><Dulci mood="cheer" size={104} /></div>
          <h1>¡Tu plan está listo!</h1>
          <p className="qz-sub">Lo armé con lo que me contaste.</p>
          <div className="pl-cards">
            <div className="pl-card"><span>🎯</span><div><small>Tu límite diario</small><strong>{limit} g de azúcar</strong></div></div>
            <div className="pl-card"><span>🔍</span><div><small>Tu enfoque</small><strong>{focus}</strong><em>{focusTip[focus]}</em></div></div>
            <div className="pl-card"><span>🏆</span><div><small>Tu reto diario</small><strong>{goal} {goal === 1 ? 'opción' : 'opciones'} sin azúcar al día</strong></div></div>
          </div>
          <div className="pl-remind">
            <small>¿Cuándo te recordamos registrar?</small>
            <div>
              {remindOptions.map((r) => (
                <button key={r.id} className={remind === r.id ? 'on' : ''} onClick={() => setRemind(r.id)}>{r.emoji} {r.label}</button>
              ))}
            </div>
          </div>
          <p className="qz-note">Usamos tus respuestas solo para personalizar tu guía. No son un diagnóstico.</p>
        </div>
      )}

      <div className="qz-foot">
        {!isPlan ? (
          <Button className={answered ? '' : 'is-off'} onClick={() => setStep(step + 1)}>Siguiente</Button>
        ) : (
          <Button onClick={() => done(h)}>{cta}</Button>
        )}
      </div>
    </main>
  );
}

const wlFoods = ['Yogur de fresa', 'Inca Kola', 'Helado', 'Pan con palta']
  .map((n) => foods.find((f) => f.name === n))
  .filter((f): f is Food => !!f);

const wlColor: Record<Level, string> = { ok: '#2FBF86', warn: '#F5A524', high: '#FF5A5F', low: '#5B8DEF' };
const wlLabel: Record<Level, string> = { ok: 'Bajo control', warn: 'Cuidado', high: 'Te pasaste', low: 'Bajo control' };

function Welcome({ goSignup, goLogin }: { goSignup: () => void; goLogin: () => void }) {
  const LIMIT = 50;
  const R = 68;
  const C = 2 * Math.PI * R;
  const [val, setVal] = useState(0);
  const [act, setAct] = useState(-1);
  const step = useRef(0);
  const shown = useSmooth(val);

  const bump = (i: number) => {
    const s = wlFoods[i].sugar;
    setAct(i);
    setVal((v) => (v + s > 62 ? s : v + s));
  };

  useEffect(() => {
    const first = setTimeout(() => {
      bump(step.current % wlFoods.length);
      step.current += 1;
    }, 800);
    const t = setInterval(() => {
      bump(step.current % wlFoods.length);
      step.current += 1;
    }, 2600);
    return () => {
      clearTimeout(first);
      clearInterval(t);
    };
  }, []);

  const level = levelOf(val, LIMIT);
  const pos = ['a', 'b', 'c', 'd'];

  return (
    <main className="screen welcome-screen wl">
      <i className="wl-glow g1" />
      <i className="wl-glow g2" />

      <div className="wl-top"><BrandLogo /></div>

      <div className="wl-hero">
        <div className="wl-stage">
          <i className="wl-orbit o1" />
          <i className="wl-orbit o2" />
          <span className="wl-spark s1">✦</span>
          <span className="wl-spark s2">✧</span>

          <div className="wl-core">
            <svg viewBox="0 0 170 170" aria-hidden="true">
              <circle cx="85" cy="85" r={R} className="wl-track" />
              <circle
                cx="85" cy="85" r={R}
                className="wl-arc"
                style={{ stroke: wlColor[level], strokeDasharray: C, strokeDashoffset: C * (1 - Math.min(1, val / LIMIT)) }}
              />
            </svg>
            <div className="wl-core-copy">
              <small>Azúcar de hoy</small>
              <strong>{shown}<span> g</span></strong>
              <em>de {LIMIT} g</em>
              <b className={`wl-state ${level}`}>{wlLabel[level]}</b>
            </div>
          </div>

          {wlFoods.map((f, i) => (
            <button
              key={f.name}
              className={`wl-food ${pos[i]} ${act === i ? 'on' : ''}`}
              onClick={() => bump(i)}
              aria-label={`Sumar ${f.name}`}
            >
              <span className="wl-bub"><FoodArt name={f.name} emoji={f.emoji} size={40} still /></span>
              <i key={act === i ? `p${val}` : 'x'}>+{f.sugar} g</i>
            </button>
          ))}
        </div>
        <p className="wl-hint">Toca un alimento y mira cómo cambia tu día</p>
      </div>

      <div className="wl-copy">
        <h1>Disfruta lo dulce,<br /><em>sin perder el equilibrio.</em></h1>
        <p>Conoce el azúcar que consumes cada día y toma mejores decisiones, paso a paso.</p>
        <div className="wl-pills">
          <span>🚦 Semáforo</span>
          <span>📊 Progreso</span>
          <span>🔔 Alertas</span>
        </div>
      </div>

      <div className="welcome-actions wl-actions">
        <Button className="wl-cta" onClick={goSignup}>Crear cuenta</Button>
        <Button variant="secondary" onClick={goLogin}>Iniciar sesión</Button>
        <small>Al continuar aceptas nuestros Términos y Política de privacidad</small>
      </div>
    </main>
  );
}

function Login({ back, goSignup, done }: { back: () => void; goSignup: () => void; done: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const submit = () => {
    const next: { email?: string; password?: string } = {};
    if (!email.trim()) next.email = 'Escribe tu correo.';
    else if (!emailOk(email)) next.email = 'Revisa el formato del correo.';
    if (!password) next.password = 'Escribe tu contraseña.';
    setErrors(next);
    if (Object.keys(next).length === 0) done();
  };

  return (
    <main className="screen ah-screen">
      <AuthHero onBack={back} title={<>Qué bueno<br /><em>verte de nuevo</em></>} sub="Ingresa para continuar con tu guía de azúcar." art="Inca Kola" />
      <div className="content auth-content ah-body">
        <TextField icon="mail" label="Correo electrónico" type="email" value={email} onChange={setEmail} placeholder="tucorreo@ejemplo.com" autoComplete="email" error={errors.email} />
        <TextField
          icon="lock"
          label="Contraseña"
          type={show ? 'text' : 'password'}
          value={password}
          onChange={setPassword}
          placeholder="Tu contraseña"
          autoComplete="current-password"
          error={errors.password}
          trailing={<PasswordToggle shown={show} toggle={() => setShow(!show)} />}
        />
        <div className="link-row"><span /><button className="link-button">¿Olvidaste tu contraseña?</button></div>
        <Button onClick={submit}>Iniciar sesión</Button>
        <div className="divider"><span>o</span></div>
        <Button variant="secondary" className="button--icon" onClick={done}><span className="google-mark">G</span> Continuar con Google</Button>
        <p className="auth-footer">¿No tienes cuenta? <button className="link-button" onClick={goSignup}>Crear cuenta</button></p>
      </div>
    </main>
  );
}

function Signup({ back, goLogin, done }: { back: () => void; goLogin: () => void; done: (name: string) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = () => {
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = 'Escribe tu nombre completo.';
    if (!email.trim()) next.email = 'Escribe tu correo.';
    else if (!emailOk(email)) next.email = 'Revisa el formato del correo.';
    if (password.length < 8) next.password = 'Usa al menos 8 caracteres.';
    else if (!/\d/.test(password)) next.password = 'Incluye al menos un número.';
    if (confirm !== password) next.confirm = 'Las contraseñas no coinciden.';
    if (!terms) next.terms = 'Debes aceptar los términos para continuar.';
    setErrors(next);
    if (Object.keys(next).length === 0) done(name.trim());
  };

  return (
    <main className="screen ah-screen">
      <AuthHero onBack={back} step={1} title={<>Empecemos<br /><em>con tu cuenta</em></>} sub="Con ella guardamos tu historial y tu progreso." art="Yogur de fresa" />
      <div className="content auth-content ah-body">
        <TextField icon="user" label="Nombre completo" value={name} onChange={setName} placeholder="Ej. Mariana Torres" autoComplete="name" error={errors.name} />
        <TextField icon="mail" label="Correo electrónico" type="email" value={email} onChange={setEmail} placeholder="tucorreo@ejemplo.com" autoComplete="email" error={errors.email} />
        <TextField
          icon="lock"
          label="Contraseña"
          type={show ? 'text' : 'password'}
          value={password}
          onChange={setPassword}
          placeholder="Mínimo 8 caracteres y un número"
          autoComplete="new-password"
          error={errors.password}
          trailing={<PasswordToggle shown={show} toggle={() => setShow(!show)} />}
        />
        <TextField
          icon="lock"
          label="Confirmar contraseña"
          type={show ? 'text' : 'password'}
          value={confirm}
          onChange={setConfirm}
          placeholder="Repite tu contraseña"
          autoComplete="new-password"
          error={errors.confirm}
        />
        <div>
          <label className="checkbox-row">
            <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
            <span>Acepto los <b>Términos</b> y la <b>Política de privacidad</b>.</span>
          </label>
          {errors.terms && <p className="field-error">{errors.terms}</p>}
        </div>
        <Button onClick={submit}>Crear cuenta</Button>
        <p className="auth-footer">¿Ya tienes cuenta? <button className="link-button" onClick={goLogin}>Iniciar sesión</button></p>
      </div>
    </main>
  );
}

function BodyData({
  profile, onboarding, back, next,
}: { profile: Profile; onboarding: boolean; back: () => void; next: (p: Profile) => void }) {
  const [data, setData] = useState<Profile>(profile);
  const [consent, setConsent] = useState(isComplete(profile));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof Profile>(key: K, value: Profile[K]) => setData((d) => ({ ...d, [key]: value }));

  const activityHint: Record<Activity, string> = {
    baja: 'Poco movimiento durante la semana.',
    moderada: 'Ejercicio de 30 minutos, 3 a 4 veces por semana.',
    alta: 'Ejercicio casi todos los días.',
  };

  const submit = () => {
    const e: Record<string, string> = {};
    const age = parseFloat(data.age);
    const weight = parseFloat(data.weight);
    const height = parseFloat(data.height);
    const waist = parseFloat(data.waist);
    if (!data.sex) e.sex = 'Elige una opción.';
    if (!age) e.age = 'Escribe tu edad.';
    else if (age < 18) e.age = 'La app es para mayores de 18 años.';
    else if (age > 100) e.age = 'Revisa tu edad.';
    if (!weight || weight < 30 || weight > 250) e.weight = 'Entre 30 y 250 kg.';
    if (!height || height < 120 || height > 230) e.height = 'Entre 120 y 230 cm.';
    if (!waist || waist < 40 || waist > 200) e.waist = 'Entre 40 y 200 cm.';
    if (!data.family) e.family = 'Elige una opción.';
    if (!data.activity) e.activity = 'Elige una opción.';
    if (!consent) e.consent = 'Necesitamos tu consentimiento para continuar.';
    setErrors(e);
    if (Object.keys(e).length === 0) next(data);
  };

  return (
    <main className="screen ah-screen">
      <AuthHero onBack={back} step={onboarding ? 2 : undefined} title={<>Para calcular<br /><em>tu límite seguro</em></>} sub="Usamos estos datos para personalizar tu límite diario de azúcar." art="Pan con palta" />
      <div className="content auth-content ah-body">

        <div>
          <label className="group-label">Sexo</label>
          <Segmented<Sex> options={[{ id: 'mujer', label: 'Mujer' }, { id: 'hombre', label: 'Hombre' }]} value={data.sex} onChange={(v) => set('sex', v)} />
          {errors.sex && <p className="field-error">{errors.sex}</p>}
        </div>

        <div className="field-grid">
          <NumberField label="Edad" unit="años" value={data.age} onChange={(v) => set('age', v)} placeholder="25" error={errors.age} />
          <NumberField label="Peso" unit="kg" value={data.weight} onChange={(v) => set('weight', v)} placeholder="68" error={errors.weight} />
          <NumberField label="Talla" unit="cm" value={data.height} onChange={(v) => set('height', v)} placeholder="165" error={errors.height} />
          <NumberField label="Cintura" unit="cm" value={data.waist} onChange={(v) => set('waist', v)} placeholder="82" error={errors.waist} />
        </div>
        <p className="field-hint">Mide tu cintura de pie, a la altura del ombligo y sin apretar la cinta.</p>

        <div>
          <label className="group-label">¿Tienes familiares con diabetes?</label>
          <Segmented<Family> options={[{ id: 'si', label: 'Sí' }, { id: 'no', label: 'No' }, { id: 'nose', label: 'No sé' }]} value={data.family} onChange={(v) => set('family', v)} />
          {errors.family && <p className="field-error">{errors.family}</p>}
        </div>

        <div>
          <label className="group-label">Actividad física</label>
          <Segmented<Activity> options={[{ id: 'baja', label: 'Baja' }, { id: 'moderada', label: 'Moderada' }, { id: 'alta', label: 'Alta' }]} value={data.activity} onChange={(v) => set('activity', v)} />
          {data.activity && <p className="field-hint">{activityHint[data.activity]}</p>}
          {errors.activity && <p className="field-error">{errors.activity}</p>}
        </div>

        <div>
          <label className="checkbox-row">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>Autorizo que SugarTrack use estos datos de salud para calcular mi límite diario. Puedo retirarlos cuando quiera.</span>
          </label>
          {errors.consent && <p className="field-error">{errors.consent}</p>}
        </div>

        <div className="disclaimer">
          <Icon name="shield" size={20} />
          <p><strong>Información referencial.</strong> SugarTrack no sustituye la consulta con un médico o nutricionista colegiado.</p>
        </div>

        <Button onClick={submit}>{onboarding ? 'Continuar' : 'Guardar cambios'}</Button>
      </div>
    </main>
  );
}

function Indicators({
  profile, onboarding, back, primary, seeLimit,
}: { profile: Profile; onboarding: boolean; back: () => void; primary: () => void; seeLimit: () => void }) {
  const demo = !isComplete(profile);
  const p: Profile = demo ? { ...profile, ...demoValues } : profile;
  const m = metrics(p);

  return (
    <main className="screen">
      <Header title="Tus indicadores" onBack={back} />
      <div className="content auth-content">
        {onboarding && <div className="step-label"><span>Paso 3 de 4</span><div><i style={{ width: '75%' }} /></div></div>}
        {demo && <div className="demo-note">Mostrando datos de ejemplo. Completa los tuyos para ver tus resultados.</div>}

        <div className="limit-hero">
          <span className="eb">Tu límite diario de azúcar</span>
          <div className="limit-big"><strong>{m.limit}</strong><span>g</span></div>
          <p>Unas {Math.round(m.limit / 4)} cucharaditas al día, el {m.pct}% de tu energía diaria.</p>
          <button className="limit-link" onClick={seeLimit}>Ver cómo se calcula <Icon name="chevron" size={16} /></button>
        </div>

        <Card className="ind-card">
          <div className="ind-head">
            <div>
              <span className="ind-label">Índice de masa corporal (IMC)</span>
              <div className="ind-value"><strong>{m.bmi.toFixed(1)}</strong><small>kg/m²</small></div>
            </div>
            <span className={`pill ${m.bmiCat.level}`}>{m.bmiCat.label}</span>
          </div>
          <RangeBar
            pos={(m.bmi - 15) / 25}
            segments={[
              { label: 'Bajo peso', level: 'low', size: 3.5 },
              { label: 'Normal', level: 'ok', size: 6.5 },
              { label: 'Sobrepeso', level: 'warn', size: 5 },
              { label: 'Obesidad', level: 'high', size: 10 },
            ]}
          />
          <p className="ind-note">Se calcula con tu peso y tu talla: peso ÷ talla².</p>
        </Card>

        <Card className="ind-card">
          <div className="ind-head">
            <div>
              <span className="ind-label">Perímetro de cintura</span>
              <div className="ind-value"><strong>{m.wc}</strong><small>cm</small></div>
            </div>
            <span className={`pill ${m.waistCat.level}`}>{m.waistCat.label}</span>
          </div>
          <RangeBar
            pos={(m.wc - m.thr.min) / (m.thr.max - m.thr.min)}
            segments={[
              { label: 'Normal', level: 'ok', size: m.thr.t1 - m.thr.min },
              { label: 'Aumentado', level: 'warn', size: m.thr.t2 - m.thr.t1 },
              { label: 'Alto', level: 'high', size: m.thr.max - m.thr.t2 },
            ]}
          />
          <p className="ind-note">Referencia para {m.male ? 'hombres' : 'mujeres'}: normal por debajo de {m.thr.t1} cm y riesgo alto desde {m.thr.t2} cm.</p>
        </Card>

        <Card className="ind-card">
          <div className="ind-head">
            <div>
              <span className="ind-label">Índice cintura-talla</span>
              <div className="ind-value"><strong>{m.ratio.toFixed(2)}</strong></div>
            </div>
            <span className={`pill ${m.ratioCat.level}`}>{m.ratioCat.label}</span>
          </div>
          <RangeBar
            pos={(m.ratio - 0.3) / 0.4}
            segments={[
              { label: 'Favorable', level: 'ok', size: 0.2 },
              { label: 'Aumentado', level: 'warn', size: 0.1 },
              { label: 'Alto', level: 'high', size: 0.1 },
            ]}
          />
          <p className="ind-note">Mantener tu cintura por debajo de la mitad de tu talla (menos de 0.50) se asocia a menor riesgo.</p>
        </Card>

        <div className="disclaimer">
          <Icon name="shield" size={20} />
          <p><strong>Información referencial.</strong> Estos indicadores no son un diagnóstico. Consulta a un médico o nutricionista colegiado.</p>
        </div>

        <Button onClick={primary}>{onboarding ? 'Continuar' : 'Editar mis datos'}</Button>
      </div>
    </main>
  );
}

function Limit({ profile, back }: { profile: Profile; back: () => void }) {
  const demo = !isComplete(profile);
  const p: Profile = demo ? { ...profile, ...demoValues } : profile;
  const m = metrics(p);
  const energyForSugar = Math.round((m.kcal * m.pct) / 100);

  return (
    <main className="screen ah-screen">
      <AuthHero
        onBack={back}
        title={<>Mi límite<br /><em>diario</em></>}
        sub={`Unas ${Math.round(m.limit / 4)} cucharaditas de azúcar al día.`}
        art="Inca Kola"
        extra={<div className="ah-big"><strong>{m.limit}</strong><span>g</span></div>}
      />
      <div className="content auth-content ah-body">
        {demo && <div className="demo-note">Mostrando datos de ejemplo. Completa los tuyos para ver tu cálculo.</div>}
        <div className="tip">
          <span>🥤</span>
          <p><strong>Para que lo imagines</strong> Una Inca Kola (27 g) usa el {Math.round((27 / m.limit) * 100)}% de tu límite diario.</p>
        </div>

        <div className="section-heading" style={{ margin: '4px 2px 0' }}><h2>Cómo lo calculamos</h2></div>
        <div className="calc-list">
          <Card className="calc-step">
            <span className="calc-num">1</span>
            <div><strong>Tu energía diaria</strong><small>Según edad, sexo, peso, talla y actividad física (fórmula de Mifflin-St Jeor).</small></div>
            <b>{m.kcal.toLocaleString('es-PE')} kcal</b>
          </Card>
          <Card className="calc-step">
            <span className="calc-num">2</span>
            <div><strong>Parte para azúcar libre</strong><small>La OMS recomienda menos del 10% de la energía diaria, e idealmente menos del 5%.</small></div>
            <b>{m.pct}%</b>
          </Card>
          <Card className="calc-step">
            <span className="calc-num">3</span>
            <div><strong>Tu límite</strong><small>{energyForSugar} kcal ÷ 4 kcal por gramo = {Math.round(m.rawLimit)} g. Lo redondeamos a múltiplos de 5.</small></div>
            <b>{m.limit} g</b>
          </Card>
        </div>

        <div className="tip">
          <span>🎯</span>
          <p>
            <strong>Por qué {m.pct}%</strong>{' '}
            {m.markers.length === 0
              ? 'No encontramos factores de riesgo en tus datos, así que usamos el 10%.'
              : `Bajamos el porcentaje por: ${m.markers.join(', ').toLowerCase()}.`}
          </p>
        </div>

        <div className="disclaimer">
          <Icon name="shield" size={20} />
          <p><strong>Información referencial.</strong> Es una guía general y no sustituye la consulta con un médico o nutricionista colegiado.</p>
        </div>
      </div>
    </main>
  );
}

function History({ profile, added, sample, back, premium }: { profile: Profile; added: Added[]; sample: boolean; back: () => void; premium: () => void }) {
  const demo = !isComplete(profile);
  const m = metrics(demo ? { ...profile, ...demoValues } : profile);
  const base = sample ? historyDays : [{ day: 'Hoy', date: 'Martes 14 de mayo', total: 0, items: [] as string[] }];
  const days = [
    {
      ...base[0],
      total: (sample ? BASE_TODAY : 0) + added.reduce((sum, a) => sum + a.sugar, 0),
      items: [...base[0].items, ...added.map((a) => `${a.emoji} ${a.name} · ${a.sugar} g`)],
    },
    ...base.slice(1),
  ];
  return (
    <main className="screen ah-screen">
      <AuthHero onBack={back} title={<>Historial<br /><em>de registros</em></>} sub="Tus últimos días, con el total de azúcar de cada uno." art="Torta" />
      <div className="content auth-content ah-body">
        {days.map((d) => {
          const lv = levelOf(d.total, m.limit);
          const pct = Math.min(100, Math.round((d.total / m.limit) * 100));
          return (
            <Card className={`hist-day hd-${lv}`} key={d.day}>
              <div className="hist-head">
                <div><strong>{d.day}</strong><small>{d.date}</small></div>
                <div className="hist-total">
                  <b>{d.total} g</b>
                  <span className={`pill ${lv === 'high' ? 'high' : lv === 'warn' ? 'warn' : 'ok'}`}>{lv === 'high' ? 'Excediste el límite' : lv === 'warn' ? 'Cerca del límite' : 'Dentro de tu límite'}</span>
                </div>
              </div>
              <div className="hist-meter"><i className={`lv-${lv}`} style={{ width: `${pct}%` }} /></div>
              {d.items.length > 0 ? (
                <div className="hist-items">{d.items.map((it) => <span key={it}>{it}</span>)}</div>
              ) : (
                <p className="hist-none">Aún no registras nada hoy.</p>
              )}
            </Card>
          );
        })}
        {!sample && (
          <div className="hist-empty">
            <Dulci mood="happy" size={64} />
            <p>Tus días anteriores aparecerán aquí cuando uses la app unos días.</p>
          </div>
        )}
        <div className="hist-lock">
          <span className="hist-lock-ico"><Icon name="history" size={22} /></span>
          <strong>Historial ilimitado con Premium</strong>
          <p>Mira tu evolución de meses y exporta reportes para tu nutricionista.</p>
          <Button onClick={premium}>Conocer Premium</Button>
        </div>
      </div>
    </main>
  );
}

function Goal({ initial, next, back }: { initial: Goal; next: (g: Goal) => void; back: () => void }) {
  const [goal, setGoal] = useState<Goal>(initial);
  const options: [Goal, string, string, IconName][] = [
    ['prevenir', 'Prevenir la diabetes', 'Cuidar hoy para sentirte bien mañana', 'shield'],
    ['controlar', 'Controlar mi consumo', 'Entender cuánto azúcar consumo', 'chart'],
    ['reducir', 'Reducir el azúcar', 'Crear hábitos más saludables', 'spark'],
  ];
  return (
    <main className="screen ah-screen">
      <AuthHero onBack={back} step={4} title={<>¿Cuál es<br /><em>tu objetivo?</em></>} sub="Así adaptamos tus consejos. Podrás cambiarlo luego." art="Chicha morada" />
      <div className="content profile-setup ah-body">
        <div className="goal-list">
          {options.map(([id, title, copy, icon]) => (
            <button key={id} className={`goal-card ${goal === id ? 'selected' : ''}`} onClick={() => setGoal(id)}>
              <span className="goal-icon"><Icon name={icon} /></span>
              <span><strong>{title}</strong><small>{copy}</small></span>
              <span className="radio">{goal === id && <i />}</span>
            </button>
          ))}
        </div>
        <Button onClick={() => next(goal)}>Comenzar</Button>
      </div>
    </main>
  );
}

type ArtKind = 'glass' | 'cup' | 'bread' | 'yogurt' | 'cone' | 'cake' | 'bowl' | 'bar' | 'cookie' | 'candy' | 'plate';
type Art = { kind: ArtKind; a: string; b: string };

const artOf: Record<string, Art> = {
  'Inca Kola': { kind: 'glass', a: '#F5D547', b: '#E0A800' },
  'Chicha morada': { kind: 'glass', a: '#8E3B9E', b: '#5A1F6E' },
  'Jugo de naranja': { kind: 'glass', a: '#FFB347', b: '#FF8A1F' },
  'Inca Kola sin azúcar': { kind: 'glass', a: '#F5D547', b: '#E0A800' },
  'Café con leche': { kind: 'cup', a: '#C69C6D', b: '#8B5E3C' },
  'Té con azúcar': { kind: 'cup', a: '#D98F2B', b: '#A8641A' },
  'Avena con azúcar': { kind: 'cup', a: '#EAD7B0', b: '#C9AE7A' },
  'Pan con mermelada': { kind: 'bread', a: '#C8372D', b: '#8E1F18' },
  'Pan con palta': { kind: 'bread', a: '#9BC25A', b: '#6E9A36' },
  'Yogur de fresa': { kind: 'yogurt', a: '#F48FB1', b: '#D81B60' },
  Helado: { kind: 'cone', a: '#F8BBD0', b: '#E91E63' },
  Torta: { kind: 'cake', a: '#7B4A2E', b: '#F7C6D3' },
  'Arroz con leche': { kind: 'bowl', a: '#FFF3D6', b: '#C98B4A' },
  'Mazamorra morada': { kind: 'bowl', a: '#7B2D8E', b: '#4A1560' },
  'Suspiro a la limeña': { kind: 'bowl', a: '#F3C77A', b: '#FFFFFF' },
  'Barra de chocolate': { kind: 'bar', a: '#6D4026', b: '#4A2A17' },
  'Galletas rellenas': { kind: 'cookie', a: '#3E2A22', b: '#F6EBD9' },
  Caramelos: { kind: 'candy', a: '#FF5C8A', b: '#FFC145' },
  'Ají de gallina': { kind: 'plate', a: '#F2B632', b: '#7CB342' },
  'Lomo saltado': { kind: 'plate', a: '#8B4A2B', b: '#F2C94C' },
  Ceviche: { kind: 'plate', a: '#F1E6CF', b: '#9C4DCC' },
  'Tallarines rojos': { kind: 'plate', a: '#D8452B', b: '#F2C94C' },
  'Arroz con pollo': { kind: 'plate', a: '#9BC25A', b: '#E8A33D' },
  'Causa limeña': { kind: 'plate', a: '#F6D04D', b: '#E5484D' },
};

function FoodArt({ name, emoji, size = 120, still = false }: { name: string; emoji: string; size?: number; still?: boolean }) {
  const art = artOf[name.replace(/ ×\d+$/, '')];
  if (!art) return <span style={{ fontSize: size * 0.62, lineHeight: 1 }}>{emoji}</span>;
  const { kind, a, b } = art;
  return (
    <svg className={`fa ${still ? 'still' : ''}`} width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
      <ellipse cx="60" cy="113" rx="34" ry="4" fill="#14284B" opacity=".1" />

      {kind === 'glass' && (
        <>
          <path d="M34 22H86L80 104Q79 108 75 108H45Q41 108 40 104Z" fill="#fff" fillOpacity=".7" stroke="#D5DCEA" strokeWidth="2" />
          <path className="fa-liquid" d="M35.3 40H84.7L80 104Q79 108 75 108H45Q41 108 40 104Z" fill={a} />
          <path className="fa-liquid" d="M37 68H83L80 104Q79 108 75 108H45Q41 108 40 104Z" fill={b} opacity=".35" />
          <path d="M35.3 40H84.7" stroke="#fff" strokeOpacity=".7" strokeWidth="2" />
          <circle className="fa-bub" cx="50" cy="92" r="2.5" fill="#fff" opacity=".8" />
          <circle className="fa-bub b2" cx="62" cy="98" r="2" fill="#fff" opacity=".8" />
          <circle className="fa-bub b3" cx="72" cy="90" r="3" fill="#fff" opacity=".8" />
          <path d="M42 30L46 98" stroke="#fff" strokeOpacity=".6" strokeWidth="3" strokeLinecap="round" />
          <path d="M72 8L65 64" stroke="#E5484D" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M72 8L65 64" stroke="#fff" strokeWidth="1.8" strokeDasharray="4 6" strokeLinecap="round" />
        </>
      )}

      {kind === 'cup' && (
        <>
          <ellipse cx="60" cy="104" rx="44" ry="7" fill="#E5E9F2" />
          <path d="M90 56Q110 54 106 72Q102 84 86 82" fill="none" stroke="#E0E6F1" strokeWidth="6" strokeLinecap="round" />
          <path d="M30 48H90Q90 94 60 94Q30 94 30 48Z" fill="#fff" stroke="#E0E6F1" strokeWidth="2" />
          <ellipse cx="60" cy="48" rx="30" ry="7" fill={a} />
          <ellipse cx="52" cy="47" rx="12" ry="2.5" fill="#fff" opacity=".3" />
          <path d="M36 64Q60 72 84 64" stroke={b} strokeOpacity=".3" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path className="fa-steam" d="M46 38Q40 28 46 20Q52 12 46 4" stroke="#B9C4DB" strokeWidth="3" strokeLinecap="round" />
          <path className="fa-steam s2" d="M60 38Q54 28 60 20Q66 12 60 4" stroke="#B9C4DB" strokeWidth="3" strokeLinecap="round" />
          <path className="fa-steam s3" d="M74 38Q68 28 74 20Q80 12 74 4" stroke="#B9C4DB" strokeWidth="3" strokeLinecap="round" />
        </>
      )}

      {kind === 'bread' && (
        <>
          <path d="M24 56Q16 30 44 28Q60 18 76 28Q104 30 96 56Q100 64 92 70V96Q92 104 84 104H36Q28 104 28 96V70Q20 64 24 56Z" fill="#E7B36A" stroke="#C98F45" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M33 56Q28 38 46 36Q60 28 74 36Q92 38 87 56Q90 62 84 66V94H36V66Q30 62 33 56Z" fill="#F8E0AE" />
          <path d="M38 56Q46 46 60 50Q76 44 82 58Q86 72 68 78Q50 86 40 74Q32 66 38 56Z" fill={a} />
          <path d="M44 57Q52 52 60 54" stroke="#fff" strokeOpacity=".5" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="52" cy="68" r="2.4" fill={b} opacity=".6" />
          <circle cx="68" cy="64" r="2.4" fill={b} opacity=".6" />
          <circle cx="60" cy="72" r="2" fill={b} opacity=".6" />
        </>
      )}

      {kind === 'yogurt' && (
        <>
          <path d="M32 44H88L82 104Q81.5 109 77 109H43Q38.5 109 38 104Z" fill="#fff" stroke="#E0E6F1" strokeWidth="2" />
          <path d="M34.6 62H85.4L83 92H37Z" fill={a} />
          <circle cx="60" cy="77" r="10" fill={b} />
          <path d="M55 68Q60 61 65 68Z" fill="#43A047" />
          <circle cx="56" cy="78" r="1.2" fill="#fff" />
          <circle cx="63" cy="75" r="1.2" fill="#fff" />
          <circle cx="60" cy="82" r="1.2" fill="#fff" />
          <rect x="29" y="34" width="62" height="12" rx="6" fill={b} />
          <rect x="29" y="34" width="62" height="5" rx="2.5" fill="#fff" opacity=".28" />
        </>
      )}

      {kind === 'cone' && (
        <>
          <path d="M38 62L60 114L82 62Z" fill="#E8B26A" stroke="#C98F45" strokeWidth="2" strokeLinejoin="round" />
          <path d="M46 72L62 104M74 72L58 104" stroke="#C98F45" strokeWidth="1.6" opacity=".7" />
          <circle cx="60" cy="50" r="24" fill={a} />
          <path d="M37 58Q36 72 45 67Q51 79 58 68Q65 79 71 67Q79 74 83 58Z" fill={a} />
          <circle cx="60" cy="30" r="15" fill="#FFF3E0" />
          <ellipse cx="50" cy="44" rx="7" ry="4" fill="#fff" opacity=".5" />
          <path d="M60 16Q58 10 64 6" stroke="#43A047" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <circle cx="60" cy="18" r="5.5" fill={b} />
        </>
      )}

      {kind === 'cake' && (
        <>
          <path d="M20 60H100V100Q100 106 94 106H26Q20 106 20 100Z" fill={a} />
          <rect x="20" y="78" width="80" height="8" fill={b} />
          <path d="M18 60Q18 44 38 44H82Q102 44 102 60Q96 70 90 60Q84 72 76 60Q68 72 60 60Q52 72 44 60Q36 70 30 60Q24 68 18 60Z" fill={b} />
          <path d="M30 52Q44 48 58 50" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".7" fill="none" />
          <path d="M60 36Q58 28 64 24" stroke="#43A047" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="60" cy="38" r="8" fill="#D32F2F" />
          <circle cx="57" cy="35" r="2" fill="#fff" opacity=".6" />
        </>
      )}

      {kind === 'bowl' && (
        <>
          <path d="M16 62Q16 108 60 108Q104 108 104 62Z" fill="#fff" stroke="#E0E6F1" strokeWidth="2" />
          <path d="M22 62Q28 40 60 40Q92 40 98 62Z" fill={a} />
          <path d="M32 56Q42 46 60 46" stroke="#fff" strokeOpacity=".45" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="46" cy="54" r="2" fill={b} />
          <circle cx="62" cy="50" r="2" fill={b} />
          <circle cx="76" cy="55" r="2" fill={b} />
          <circle cx="54" cy="58" r="1.6" fill={b} />
          <circle cx="70" cy="60" r="1.6" fill={b} />
          <rect x="14" y="58" width="92" height="8" rx="4" fill="#fff" stroke="#E0E6F1" strokeWidth="2" />
        </>
      )}

      {kind === 'bar' && (
        <g transform="rotate(-12 60 62)">
          <rect x="22" y="26" width="76" height="70" rx="9" fill={a} />
          <path d="M22 62H98V87Q98 96 89 96H31Q22 96 22 87Z" fill="#F26A1B" />
          <rect x="22" y="70" width="76" height="6" fill="#fff" opacity=".85" />
          <path d="M40 26V62M58 26V62M76 26V62M22 44H98" stroke={b} strokeWidth="2.5" />
          <path d="M28 33H50" stroke="#fff" opacity=".25" strokeWidth="4" strokeLinecap="round" />
        </g>
      )}

      {kind === 'cookie' && (
        <>
          <circle cx="74" cy="54" r="26" fill={a} />
          <circle cx="74" cy="54" r="17" fill="none" stroke={b} strokeWidth="2" strokeDasharray="2 4" strokeLinecap="round" />
          <circle cx="74" cy="54" r="7" fill={b} />
          <circle cx="46" cy="72" r="28" fill={a} stroke="#fff" strokeOpacity=".15" />
          <circle cx="46" cy="72" r="19" fill="none" stroke={b} strokeWidth="2" strokeDasharray="2 4" strokeLinecap="round" />
          <circle cx="46" cy="72" r="8" fill={b} />
          <path d="M28 58Q36 48 50 48" stroke="#fff" strokeOpacity=".25" strokeWidth="3" strokeLinecap="round" fill="none" />
        </>
      )}

      {kind === 'candy' && (
        <g className="fa-wiggle">
          <path d="M42 60L14 44V76Z" fill={b} />
          <path d="M78 60L106 44V76Z" fill={b} />
          <circle cx="60" cy="60" r="24" fill={a} />
          <path d="M46 44Q62 60 46 76" stroke="#fff" strokeWidth="5" strokeOpacity=".7" fill="none" strokeLinecap="round" />
          <path d="M66 38Q82 60 66 82" stroke="#fff" strokeWidth="4" strokeOpacity=".4" fill="none" strokeLinecap="round" />
          <circle cx="52" cy="50" r="4" fill="#fff" opacity=".5" />
        </g>
      )}

      {kind === 'plate' && (
        <>
          <ellipse cx="60" cy="66" rx="50" ry="36" fill="#fff" stroke="#E0E6F1" strokeWidth="2.5" />
          <ellipse cx="60" cy="66" rx="38" ry="26" fill="#F4F6FA" />
          <circle cx="48" cy="62" r="13" fill={a} stroke="#14284B" strokeOpacity=".08" />
          <circle cx="68" cy="58" r="11" fill={a} stroke="#14284B" strokeOpacity=".08" />
          <circle cx="62" cy="74" r="12" fill={a} stroke="#14284B" strokeOpacity=".08" />
          <circle cx="44" cy="76" r="5" fill={b} />
          <circle cx="80" cy="72" r="5" fill={b} />
          <circle cx="58" cy="50" r="4" fill={b} />
          <circle cx="52" cy="58" r="3" fill="#fff" opacity=".35" />
        </>
      )}
    </svg>
  );
}

const PALETTE = ['#FF8A3D', '#FFC15E', '#5BB8FF', '#9B8CFF', '#4CC68C', '#FF6B8B', '#7AD7F0', '#F4A261'];

const todayBase = [
  { name: 'Café con leche', time: 'Desayuno · 8:15 a. m.', sugar: 6, emoji: '☕' },
  { name: 'Yogur de fresa', time: 'Media mañana · 11:20 a. m.', sugar: 12, emoji: '🥛' },
  { name: 'Ají de gallina', time: 'Almuerzo · 1:40 p. m.', sugar: 8, emoji: '🍲' },
  { name: 'Barra de chocolate', time: 'Merienda · 4:30 p. m.', sugar: 12, emoji: '🍫' },
];

type DayItem = { key: string; name: string; time: string; sugar: number; emoji: string; addedId?: number };

function useSmooth(target: number) {
  const [v, setV] = useState(0);
  const cur = useRef(0);
  useEffect(() => {
    const from = cur.current;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / 700);
      const val = from + (target - from) * (1 - Math.pow(1 - k, 3));
      cur.current = val;
      setV(val);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return Math.round(v);
}

function Arc({ len, start, color, dim, selected, index, onClick }: { len: number; start: number; color: string; dim: boolean; selected: boolean; index: number; onClick: () => void }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), 60 + index * 90);
    return () => clearTimeout(t);
  }, [index]);
  const d = Math.max(0, len - 0.9);
  return (
    <circle
      cx="110"
      cy="110"
      r="86"
      fill="none"
      stroke={color}
      pathLength={100}
      className="hv-arc"
      style={{ strokeDasharray: on ? `${d} 100` : '0 100', strokeDashoffset: -start, strokeWidth: selected ? 24 : 18, opacity: dim ? 0.4 : 1 }}
      onClick={onClick}
    />
  );
}

function DynamicRing({ items, total, limit, sel, setSel, bump }: {
  items: DayItem[];
  total: number;
  limit: number;
  sel: number | null;
  setSel: (i: number | null) => void;
  bump: { k: number; g: number } | null;
}) {
  const scale = Math.max(total, limit);
  const shown = useSmooth(total);
  const pct = Math.round((total / limit) * 100);
  let acc = 0;
  const arcs = items.map((it, i) => {
    const len = (it.sugar / scale) * 100;
    const start = acc;
    acc += len;
    return { it, i, len, start };
  });
  const cur = sel !== null && items[sel] ? items[sel] : null;
  return (
    <div className="hv-ring">
      <svg viewBox="0 0 220 220" role="img" aria-label={`${total} gramos de ${limit} gramos diarios`}>
        <circle className="hv-orbit" cx="110" cy="110" r="106" fill="none" />
        <circle className="hv-track" cx="110" cy="110" r="86" fill="none" />
        <g transform="rotate(-90 110 110)">
          {arcs.filter((a) => a.len > 0).map((a) => (
            <Arc
              key={a.it.key}
              index={a.i}
              len={a.len}
              start={a.start}
              color={PALETTE[a.i % PALETTE.length]}
              dim={sel !== null && sel !== a.i}
              selected={sel === a.i}
              onClick={() => setSel(sel === a.i ? null : a.i)}
            />
          ))}
        </g>
        {total > limit && (
          <g transform={`rotate(${(limit / scale) * 360} 110 110)`}>
            <rect x="108" y="4" width="4" height="30" rx="2" fill="#fff" />
          </g>
        )}
      </svg>
      <div className={`hv-center ${cur ? 'sel' : ''}`} key={cur ? cur.key : 'total'} onClick={() => cur && setSel(null)}>
        {cur ? (
          <>
            <FoodArt name={cur.name} emoji={cur.emoji} size={66} still />
            <strong className="hv-c-name">{cur.name}</strong>
            <span className="hv-c-sub">+{cur.sugar} g · {Math.round((cur.sugar / limit) * 100)}% del día</span>
          </>
        ) : (
          <>
            <span className="hv-c-eb">Consumiste hoy</span>
            <strong className="hv-c-num">{shown}<small>g</small></strong>
            <span className="hv-c-sub">de {limit} g · {pct}%</span>
          </>
        )}
      </div>
      {bump && <span className="hv-bump" key={bump.k}>+{bump.g} g</span>}
    </div>
  );
}

function Home({ name, habits, sample, loadSample, total, limit, added, goRegister, goProgress, goProfile, quickAdd, undo }: {
  name: string;
  habits: Habits;
  sample: boolean;
  loadSample: () => void;
  total: number;
  limit: number;
  added: Added[];
  goRegister: () => void;
  goProgress: () => void;
  goProfile: () => void;
  quickAdd: (item: Added) => void;
  undo: (id: number) => void;
}) {
  const first = name.split(' ')[0] || 'Mariana';
  const [sel, setSel] = useState<number | null>(null);
  const [bump, setBump] = useState<{ k: number; g: number } | null>(null);

  const level = levelOf(total, limit);
  const diff = limit - total;
  const statusText = level === 'ok' ? 'Vas bien' : level === 'warn' ? 'Cerca del límite' : 'Superaste tu límite';

  const items: DayItem[] = [
    ...(sample ? todayBase : []).map((b, i) => ({ key: `b${i}`, ...b })),
    ...added.map((a) => ({ key: `a${a.id}`, name: a.name, time: 'Ahora · agregado', sugar: a.sugar, emoji: a.emoji, addedId: a.id })),
  ];

  const quickNames = ['Inca Kola sin azúcar', 'Chicha morada', 'Yogur de fresa', 'Pan con palta', 'Café con leche'];
  const quick = quickNames.map((n) => foods.find((f) => f.name === n)).filter((f): f is Food => !!f);
  const addQuick = (f: Food) => {
    quickAdd({ id: nextId(), name: f.name, emoji: f.emoji, sugar: f.sugar });
    setBump({ k: Date.now(), g: f.sugar });
    setSel(null);
  };

  const week = progressWeeks[0].days.map((d, i) => ({ label: d.label, value: i === 6 ? total : sample ? d.value : 0 }));
  const wmax = Math.max(limit * 1.2, ...week.map((w) => w.value));
  let streak = 0;
  for (let k = 6; k >= 0; k--) {
    if (k === 6 && week[k].value === 0) continue;
    if (week[k].value > 0 && week[k].value <= limit) streak++;
    else break;
  }

  const zero = added.filter((a) => a.sugar === 0).length;
  const goal = challengeGoal(habits);
  const answered = habits.pace !== '';
  const mood: Mood = level === 'high' ? 'alert' : level === 'warn' ? 'worry' : zero >= goal ? 'cheer' : 'happy';
  const pct = Math.round((total / limit) * 100);
  const empty = items.length === 0;
  const say =
    empty ? `¡Hola, ${first}! Registra tu primer alimento y empieza tu racha.`
    : level === 'high' ? `Hoy nos pasamos, ${first}. Mañana empezamos de nuevo.`
    : level === 'warn' ? `Ojo, ya llevas el ${pct}% de tu límite. Elige algo sin azúcar.`
    : streak >= 3 ? `¡${streak} días seguidos, ${first}! Sigue así.`
    : `Vas bien, ${first}. Te quedan ${diff} g hoy.`;
  const doneChallenge = zero >= goal;

  return (
    <main className="screen with-nav">
      <div className="content hv">
        <div className="hv-head">
          <div>
            <span className="hv-eb">Martes, 14 de mayo</span>
            <h1>Hola, {first} <span className="hv-wave">👋</span></h1>
          </div>
          <div className="hv-head-r">
            <button className="hv-avatar" onClick={goProfile} aria-label="Ir a mi perfil">{first.charAt(0).toUpperCase()}</button>
          </div>
        </div>

        <div className={`mc ${level}`}>
          <div className="mc-top">
            <div className="mc-pet"><Dulci mood={mood} size={92} /></div>
            <div className="mc-main">
              <button className="mc-streak" onClick={goProgress} aria-label={`Racha de ${streak} días`}>
                <span className="mc-flame">🔥</span><strong>{streak}</strong><small>{streak === 1 ? 'día de racha' : 'días de racha'}</small>
              </button>
              <p className="mc-say" key={say}>{say}</p>
              {answered && <span className="mc-tag">Tu enfoque: {focusOf(habits)}</span>}
            </div>
          </div>
          <div className="mc-days">
            {week.map((w, i) => {
              const st = i === 6 ? 'today' : w.value === 0 ? 'none' : w.value <= limit ? 'ok' : 'over';
              return (
                <div key={i} className={`mc-d ${st}`}>
                  <i className={i === 6 ? `lv-${level}` : ''}>{i === 6 ? '' : w.value === 0 ? '–' : w.value <= limit ? '✓' : '✕'}</i>
                  <small>{i === 6 ? 'Hoy' : w.label}</small>
                </div>
              );
            })}
          </div>
        </div>

        <div className="hv-hero" data-level={level}>
          <i className="hv-blob b1" />
          <i className="hv-blob b2" />
          <div className="hv-top">
            <div className="hv-top-l"><strong>Tu azúcar de hoy</strong><b className={`rg-pill ${level}`}>{statusText}</b></div>
            <button className="hv-link" onClick={goProgress}>Ver semana</button>
          </div>
          <DynamicRing items={items} total={total} limit={limit} sel={sel} setSel={setSel} bump={bump} />
          <div className="hv-chips">
            <div className="hv-chip"><strong>{Math.abs(diff)} g</strong><small>{diff >= 0 ? 'Te quedan' : 'Te pasaste'}</small></div>
            <div className="hv-chip"><strong>{limit} g</strong><small>Tu límite</small></div>
            <div className="hv-chip"><strong>{items.length}</strong><small>Alimentos</small></div>
          </div>
          <p className="hv-hint">{sel === null ? 'Toca un color del círculo para ver qué aportó' : 'Toca el centro para volver al total'}</p>
        </div>

        <div className="hv-sec"><h2>Agrega rápido</h2><span>Toca para sumar</span></div>
        <HScroll className="hv-quick">
          {quick.map((f, i) => (
            <button key={f.name} className="hv-q" style={{ animationDelay: `${i * 70}ms` }} onClick={() => addQuick(f)} aria-label={`Agregar ${f.name}`}>
              <FoodArt name={f.name} emoji={f.emoji} size={54} still />
              <strong>{f.name}</strong>
              <span className={f.sugar === 0 ? 'z' : ''}>{f.sugar === 0 ? '0 g' : `+${f.sugar} g`}</span>
            </button>
          ))}
        </HScroll>

        <button className="hv-week" onClick={goProgress}>
          <div className="hv-week-top"><strong>Tu semana</strong><span>Ver detalle ›</span></div>
          <div className="hv-bars">
            <i className="hv-lim" style={{ bottom: `${18 + (limit / wmax) * 62}px` }} />
            {week.map((w, i) => (
              <div key={i} className={i === 6 ? 'today' : ''}>
                <span className="hv-bar-area"><i className={`lv-${levelOf(w.value, limit)}`} style={{ height: `${(w.value / wmax) * 100}%`, animationDelay: `${i * 70}ms` }} /></span>
                <small>{i === 6 ? 'Hoy' : w.label}</small>
              </div>
            ))}
          </div>
        </button>

        <div className={`hv-chal ${doneChallenge ? 'done' : ''}`}>
          <span className="hv-chal-ico">{doneChallenge ? '🏆' : '💧'}</span>
          <div>
            <strong>{doneChallenge ? '¡Reto cumplido!' : 'Reto del día'}</strong>
            <small>{doneChallenge ? `Elegiste ${goal} ${goal === 1 ? 'opción' : 'opciones'} sin azúcar. ¡Sigue así!` : `Elige ${goal} ${goal === 1 ? 'opción' : 'opciones'} sin azúcar hoy`}</small>
          </div>
          <div className="hv-chal-dots">{Array.from({ length: goal }, (_, i) => <i key={i} className={i < zero ? 'on' : ''}>{i < zero ? '✓' : ''}</i>)}</div>
          {doneChallenge && <div className="hv-conf" aria-hidden="true"><span>🎉</span><span>✨</span><span>🎊</span><span>✨</span><span>🎉</span></div>}
        </div>

        <div className="hv-sec"><h2>Registrado hoy</h2><span>{items.length} alimentos</span></div>
        {empty && (
          <div className="hv-empty">
            <Dulci mood="happy" size={74} />
            <div>
              <strong>Aún no registras nada hoy</strong>
              <p>Toca un alimento de "Agrega rápido" o registra el primero.</p>
              <div className="hv-empty-actions">
                <button className="hv-empty-main" onClick={goRegister}>Registrar</button>
                {!sample && <button className="hv-empty-alt" onClick={loadSample}>Cargar datos de ejemplo</button>}
              </div>
            </div>
          </div>
        )}
        <div className="hv-list">
          {items.map((it, i) => ({ it, i })).reverse().map(({ it, i }, n) => (
            <div key={it.key} className={`hv-row ${sel === i ? 'on' : ''} ${it.addedId !== undefined ? 'new' : ''}`} style={{ animationDelay: `${Math.min(n, 8) * 50}ms` }} onClick={() => setSel(sel === i ? null : i)}>
              <span className="hv-dot" style={{ background: PALETTE[i % PALETTE.length] }} />
              <span className="hv-art"><FoodArt name={it.name} emoji={it.emoji} size={40} still /></span>
              <div><strong>{it.name}</strong><small>{it.time}</small></div>
              <b>{it.sugar} g</b>
              {it.addedId !== undefined ? (
                <button className="hv-x" aria-label={`Quitar ${it.name}`} onClick={(e) => { e.stopPropagation(); undo(it.addedId as number); setSel(null); }}>✕</button>
              ) : <span />}
            </div>
          ))}
        </div>
      </div>
      <button className="fab" onClick={goRegister}><Icon name="plus" size={20} strokeWidth={2.5} /> Registrar</button>
    </main>
  );
}

const scanProducts = [
  { name: 'Gaseosa amarilla 500 ml', emoji: '🥤', code: '7750182001234', unit: 'ml', portion: 500, per100: 10.8 },
  { name: 'Yogur sabor fresa', emoji: '🥛', code: '7751271004521', unit: 'g', portion: 120, per100: 10 },
  { name: 'Galletas rellenas de vainilla', emoji: '🍪', code: '7750243012345', unit: 'g', portion: 36, per100: 30 },
  { name: 'Néctar de durazno', emoji: '🧃', code: '7751493008876', unit: 'ml', portion: 300, per100: 10.5 },
  { name: 'Pan de molde integral', emoji: '🍞', code: '7750885003312', unit: 'g', portion: 50, per100: 4 },
];

const chips: { id: 'Frecuentes' | Group; emoji: string }[] = [
  { id: 'Frecuentes', emoji: '⭐' },
  { id: 'Bebidas', emoji: '🥤' },
  { id: 'Desayuno', emoji: '🥣' },
  { id: 'Postres', emoji: '🍰' },
  { id: 'Snacks', emoji: '🍫' },
  { id: 'Platos', emoji: '🍲' },
];

const tips = [
  ['Una cucharadita equivale a 4 gramos de azúcar.', 'Dato útil'],
  ['Las bebidas son la mayor fuente de azúcar en tu semana: elige agua o versiones sin azúcar.', 'Tu semana'],
  ['Busca el octógono "Alto en azúcar" en la etiqueta: te avisa antes de que lo compres.', 'Etiquetas'],
];

function HScroll({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ l: false, r: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setEdge({ l: el.scrollLeft > 4, r: el.scrollLeft < el.scrollWidth - el.clientWidth - 4 });
    let down = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 5) {
        moved = true;
        el.classList.add('dragging');
      }
      if (moved) el.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      down = false;
      el.classList.remove('dragging');
    };
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    update();
    const t1 = setTimeout(update, 150);
    const t2 = setTimeout(update, 700);
    el.addEventListener('scroll', update, { passive: true });
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('click', onClick, true);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('resize', update);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      el.removeEventListener('scroll', update);
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('click', onClick, true);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('resize', update);
    };
  }, []);

  const go = (dir: number) => ref.current?.scrollBy({ left: dir * 190, behavior: 'smooth' });

  return (
    <div className="hs">
      {edge.l && <button type="button" className="hs-btn l" aria-label="Ver anteriores" onClick={() => go(-1)}>‹</button>}
      <div ref={ref} className={className}>{children}</div>
      {edge.r && <button type="button" className="hs-btn r" aria-label="Ver más" onClick={() => go(1)}>›</button>}
    </div>
  );
}

type CaptureMode = 'barcode' | 'photo';

const dishNames = ['Ají de gallina', 'Lomo saltado', 'Ceviche', 'Tallarines rojos', 'Arroz con pollo', 'Causa limeña'];
const portionSizes = [
  { label: 'Pequeña', mult: 0.7 },
  { label: 'Normal', mult: 1 },
  { label: 'Grande', mult: 1.3 },
];

function PhotoResult({ n, limit, onAdd, onAgain }: {
  n: number;
  limit: number;
  onAdd: (item: { name: string; emoji: string; sugar: number }) => void;
  onAgain: () => void;
}) {
  const options = [0, 1, 2]
    .map((k) => foods.find((f) => f.name === dishNames[(n + k) % dishNames.length]))
    .filter((f): f is Food => !!f);
  const [pick, setPick] = useState(0);
  const [size, setSize] = useState(1);
  const dish = options[pick];
  const est = Math.round(dish.sugar * portionSizes[size].mult);
  const lo = Math.max(0, Math.round(est * 0.75));
  const hi = Math.round(est * 1.25);
  const pct = Math.round((est / limit) * 100);
  const lv = foodLevel(est, limit);
  return (
    <div className="sc-sheet">
      <div className="sc-grab" />
      <div className="sc-prod">
        <span className="rg-emoji" style={{ background: dish.tone }}><FoodArt name={dish.name} emoji={dish.emoji} size={44} still /></span>
        <div><strong>{dish.name}</strong><small>Plato reconocido · demo simulado</small></div>
      </div>
      <div className="ph-block">
        <small>¿Es otro plato?</small>
        <div className="ph-opts">
          {options.map((o, i) => (
            <button key={o.name} className={pick === i ? 'on' : ''} onClick={() => setPick(i)}>{o.name}</button>
          ))}
        </div>
      </div>
      <div className="ph-block">
        <small>Tamaño de la porción</small>
        <div className="ph-size">
          {portionSizes.map((p, i) => (
            <button key={p.label} className={size === i ? 'on' : ''} onClick={() => setSize(i)}>{p.label}</button>
          ))}
        </div>
      </div>
      <div className="sc-main">
        <div>
          <span>Azúcar estimada</span>
          <div className="sc-big" key={est}>≈ {est} <small>g</small></div>
          <div className="sc-spoons"><em>Entre {lo} y {hi} g</em></div>
        </div>
        <span className={`fd-pct ${lv}`}>{est === 0 ? 'Sin azúcar' : `${pct}% de tu límite`}</span>
      </div>
      <p className="sc-note">Con una foto se reconoce el plato, pero el azúcar siempre es una estimación. Elige el tamaño y corrígela si sabes mejor.</p>
      <div className="sc-actions">
        <Button onClick={() => onAdd({ name: dish.name, emoji: dish.emoji, sugar: est })}>Agregar a mi día · +{est} g</Button>
        <Button variant="secondary" onClick={onAgain}>Tomar otra foto</Button>
      </div>
    </div>
  );
}

function Scanner({ limit, initial, onClose, onAdd }: {
  limit: number;
  initial: CaptureMode;
  onClose: () => void;
  onAdd: (item: { name: string; emoji: string; sugar: number }) => void;
}) {
  const [mode, setMode] = useState<CaptureMode>(initial);
  const [n, setN] = useState(0);
  const [found, setFound] = useState(false);

  useEffect(() => {
    if (found) return;
    const t = setTimeout(() => setFound(true), 2200);
    return () => clearTimeout(t);
  }, [found, n, mode]);

  const switchMode = (m: CaptureMode) => {
    setMode(m);
    setFound(false);
    setN(0);
  };

  const p = scanProducts[n % scanProducts.length];
  const sugar = Math.round((p.per100 * p.portion) / 100);
  const warn = p.per100 >= (p.unit === 'ml' ? 5 : 10);
  const spoons = Math.max(1, Math.round(sugar / 4));
  const pct = Math.round((sugar / limit) * 100);
  const lv = foodLevel(sugar, limit);

  return (
    <div className="sc" role="dialog" aria-label="Registrar con la cámara">
      <div className="sc-cam">
        <div className="sc-top">
          <button className="sc-x" onClick={onClose} aria-label="Cerrar">✕</button>
          <span className="sc-chip">Demo · reconocimiento simulado</span>
        </div>
        <div className="sc-tabs" role="tablist">
          <button className={mode === 'barcode' ? 'on' : ''} onClick={() => switchMode('barcode')}>Código de barras</button>
          <button className={mode === 'photo' ? 'on' : ''} onClick={() => switchMode('photo')}>Foto del plato</button>
        </div>
        <div className={`sc-frame ${mode === 'photo' ? 'photo' : ''} ${found ? 'ok' : ''}`}>
          <i /><i /><i /><i />
          {mode === 'barcode' ? <span className="sc-code" /> : <span className="sc-plate" />}
          {!found && <span className="sc-line" />}
        </div>
        <p className="sc-hint">
          {found
            ? mode === 'barcode' ? '¡Producto reconocido!' : '¡Plato reconocido!'
            : mode === 'barcode' ? 'Centra el código de barras en el recuadro' : 'Encuadra tu plato desde arriba'}
        </p>
      </div>

      {found && mode === 'barcode' && (
        <div className="sc-sheet" key={`b${n}`}>
          <div className="sc-grab" />
          <div className="sc-prod">
            <span className="rg-emoji" style={{ background: '#FFF2D8' }}>{p.emoji}</span>
            <div><strong>{p.name}</strong><small>Código {p.code} · simulado</small></div>
          </div>
          <div className="sc-main">
            <div>
              <span>Azúcar por porción ({p.portion} {p.unit})</span>
              <div className="sc-big">{sugar} <small>g</small></div>
              <div className="sc-spoons">{Array.from({ length: Math.min(spoons, 8) }, () => '🥄').join('')}{spoons > 8 ? ` +${spoons - 8}` : ''} <em>≈ {spoons} cucharaditas</em></div>
            </div>
            {warn ? <div className="octo">ALTO EN<br />AZÚCAR</div> : <div className="octo-ok">✓<br />Sin<br />advertencia</div>}
          </div>
          <div>
            <div className="rg-tag" style={{ marginBottom: 6 }}><i className={`lv-${lv}`} /> {pct}% de tu límite diario de {limit} g · {p.per100} g por 100 {p.unit}</div>
            <div className="sc-bar"><i className={`lv-${lv}`} style={{ width: `${Math.min(100, pct)}%` }} /></div>
          </div>
          <p className="sc-note">Advertencia según umbral referencial de rotulado: ≥ 10 g por 100 g (sólidos) o ≥ 5 g por 100 ml (líquidos). Valores de ejemplo para el prototipo.</p>
          <div className="sc-actions">
            <Button onClick={() => { onAdd({ name: p.name, emoji: p.emoji, sugar }); onClose(); }}>Agregar a mi día · +{sugar} g</Button>
            <Button variant="secondary" onClick={() => { setFound(false); setN(n + 1); }}>Escanear otro producto</Button>
          </div>
        </div>
      )}

      {found && mode === 'photo' && (
        <PhotoResult
          key={`p${n}`}
          n={n}
          limit={limit}
          onAdd={(item) => { onAdd(item); onClose(); }}
          onAgain={() => { setFound(false); setN(n + 1); }}
        />
      )}
    </div>
  );
}

function ManualAdd({ initialName, limit, onClose, onAdd }: {
  initialName: string;
  limit: number;
  onClose: () => void;
  onAdd: (item: { name: string; emoji: string; sugar: number }) => void;
}) {
  const [name, setName] = useState(initialName);
  const [sugar, setSugar] = useState('');
  const g = Number(sugar);
  const valid = name.trim().length > 1 && sugar !== '' && g >= 0 && g <= 200;
  const lv = foodLevel(g || 0, limit);
  const presets: [string, number][] = [['Poco', 5], ['Medio', 12], ['Mucho', 25]];
  const submit = () => {
    if (!valid) return;
    onAdd({ name: name.trim(), emoji: '🍽️', sugar: g });
    onClose();
  };
  return (
    <div className="mn" role="dialog" aria-label="Agregar manualmente" onClick={onClose}>
      <div className="mn-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sc-grab" />
        <h2>Agregar manualmente</h2>
        <p>Para comida casera o sin etiqueta. Si no sabes cuánta azúcar tiene, elige una estimación.</p>
        <label className="mn-field">
          <span>¿Qué comiste o bebiste?</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Mazamorra de mi abuela" />
        </label>
        <div className="mn-field">
          <span>Azúcar aproximada</span>
          <div className="mn-presets">
            {presets.map(([label, v]) => (
              <button key={label} className={sugar !== '' && g === v ? 'on' : ''} onClick={() => setSugar(String(v))}>{label}<small>≈ {v} g</small></button>
            ))}
          </div>
          <div className="mn-input">
            <input inputMode="numeric" value={sugar} onChange={(e) => setSugar(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))} placeholder="o escribe los gramos" />
            <b>g</b>
          </div>
        </div>
        {valid && <div className="rg-tag"><i className={`lv-${lv}`} /> {Math.round((g / limit) * 100)}% de tu límite diario</div>}
        <Button className={valid ? '' : 'is-off'} onClick={submit}>Agregar a mi día</Button>
        <button className="pm-close" onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}

function Register({ limit, total, chooseFood, quickAdd, undo }: {
  limit: number;
  total: number;
  chooseFood: (food: Food) => void;
  quickAdd: (item: Added) => void;
  undo: (id: number) => void;
}) {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<'Frecuentes' | Group>('Frecuentes');
  const [sortLow, setSortLow] = useState(false);
  const [capture, setCapture] = useState<CaptureMode | null>(null);
  const [manual, setManual] = useState<string | null>(null);
  const [tip, setTip] = useState(0);
  const [done, setDone] = useState<string | null>(null);
  const [toast, setToast] = useState<{ id: number; emoji: string; name: string; sugar: number; left: number } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(null), 900);
    return () => clearTimeout(t);
  }, [done]);

  const q = norm(query.trim());
  let list = foods.filter((f) =>
    q ? norm(f.name).includes(q) || norm(f.category).includes(q) : group === 'Frecuentes' ? !!f.fav : f.group === group,
  );
  if (sortLow) list = [...list].sort((a, b) => a.sugar - b.sugar);

  const level = levelOf(total, limit);
  const diff = limit - total;

  const add = (item: { name: string; emoji: string; sugar: number }) => {
    const id = nextId();
    quickAdd({ id, name: item.name, emoji: item.emoji, sugar: item.sugar });
    setToast({ id, name: item.name, emoji: item.emoji, sugar: item.sugar, left: limit - (total + item.sugar) });
  };

  return (
    <main className="screen with-nav">
      <div className="content rg">
        <div className="rg-head">
          <div><span className="rg-eb">Agrega a tu día</span><h1>¿Qué consumiste?</h1></div>
          <span className="rg-date">Mar 14 may</span>
        </div>

        <div className="rg-day">
          <div className="rg-day-top"><span>Tu día</span><b className={`rg-pill ${level}`}>{levelLabel[level]}</b></div>
          <div className="rg-day-num"><strong key={total}>{total}</strong><small>g de {limit} g</small></div>
          <div className="rg-meter"><i className={`lv-${level}`} style={{ width: `${Math.min(100, (total / limit) * 100)}%` }} /></div>
          <p className="rg-day-note">{diff >= 0 ? <>Te quedan <b>{diff} g</b> para hoy</> : <>Te pasaste por <b>{-diff} g</b> hoy</>}</p>
        </div>

        <label className="rg-search">
          <Icon name="search" size={20} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Busca un alimento o bebida" />
          {query && <button type="button" className="rg-clear" onClick={() => setQuery('')} aria-label="Borrar búsqueda">✕</button>}
        </label>

        <div className="rg-tools">
          <button className="rg-tool a" onClick={() => setCapture('barcode')}>
            <span className="rg-scan-ico"><Icon name="scan" size={24} /></span>
            <div><strong>Código de barras</strong><small>Para productos con etiqueta</small></div>
          </button>
          <button className="rg-tool b" onClick={() => setCapture('photo')}>
            <span className="rg-scan-ico"><Icon name="camera" size={24} /></span>
            <div><strong>Foto del plato</strong><small>Para comida preparada · demo</small></div>
          </button>
        </div>

        {!q && (
          <HScroll className="rg-chips">
            {chips.map((c) => (
              <button key={c.id} role="tab" className={`rg-chip ${group === c.id ? 'on' : ''}`} onClick={() => setGroup(c.id)}>
                <span>{c.emoji}</span>{c.id}
              </button>
            ))}
          </HScroll>
        )}

        <div className="rg-listhead">
          <h2>{q ? 'Resultados' : group}<small>{list.length} {list.length === 1 ? 'opción' : 'opciones'}</small></h2>
          <button className={`rg-sort ${sortLow ? 'on' : ''}`} onClick={() => setSortLow(!sortLow)}>{sortLow ? '✓ Menos azúcar' : 'Menos azúcar'}</button>
        </div>

        {list.length === 0 ? (
          <div className="rg-empty">
            <span>🔍</span>
            No encontramos “{query}”. Agrégalo tú mismo o usa la cámara.
            <div><button onClick={() => setManual(query.trim())}>Agregar manualmente</button><button onClick={() => setCapture('photo')}>Foto del plato</button></div>
          </div>
        ) : (
          <div className="rg-list" key={`${group}-${q}-${sortLow}`}>
            {list.map((f, i) => {
              const lv = foodLevel(f.sugar, limit);
              const pct = Math.round((f.sugar / limit) * 100);
              return (
                <div key={f.name} className="card card--clickable rg-row" style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }} onClick={() => chooseFood(f)}>
                  <span className="rg-emoji" style={{ background: f.tone }}><FoodArt name={f.name} emoji={f.emoji} size={40} still /></span>
                  <div className="rg-info">
                    <strong>{f.name}</strong>
                    <small>{f.detail}</small>
                    <span className="rg-tag"><i className={`lv-${lv}`} />{f.sugar === 0 ? 'Sin azúcar' : `${pct}% de tu límite`}</span>
                  </div>
                  <div className="rg-sugar"><b>{f.sugar} g</b><small>azúcar</small></div>
                  <button
                    className={`rg-add ${done === f.name ? 'done' : ''}`}
                    aria-label={`Agregar ${f.name}`}
                    onClick={(e) => { e.stopPropagation(); add(f); setDone(f.name); }}
                  >
                    <Icon name={done === f.name ? 'check' : 'plus'} size={17} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <button className="rg-manual" onClick={() => setManual('')}>✏️ ¿No está en la lista? Agregar manualmente</button>

        <button className="rg-tip" onClick={() => setTip((tip + 1) % tips.length)}>
          <span>💡</span>
          <p><strong>{tips[tip][1]}</strong> {tips[tip][0]}<em>Toca para ver otro dato</em></p>
        </button>
      </div>

      {toast && (
        <div className="rg-toast" key={toast.id} role="status">
          <strong>{toast.emoji} {toast.name} · +{toast.sugar} g</strong>
          <span className={toast.left < 0 ? 'over' : ''}>{toast.left >= 0 ? `Te quedan ${toast.left} g hoy` : `Superaste tu límite por ${-toast.left} g`}</span>
          <button onClick={() => { undo(toast.id); setToast(null); }}>Deshacer</button>
        </div>
      )}

      {capture && <Scanner limit={limit} initial={capture} onClose={() => setCapture(null)} onAdd={add} />}
      {manual !== null && <ManualAdd initialName={manual} limit={limit} onClose={() => setManual(null)} onAdd={add} />}
    </main>
  );
}

function FoodDetail({ food, limit, total, back, add, swap }: {
  food: Food;
  limit: number;
  total: number;
  back: () => void;
  add: (qty: number) => void;
  swap: (f: Food) => void;
}) {
  const [qty, setQty] = useState(1);
  const [sent, setSent] = useState(false);
  const sugar = food.sugar * qty;
  const spoons = sugar === 0 ? 0 : Math.max(1, Math.round(sugar / 4));
  const cubes = Math.min(spoons, 20);
  const after = total + sugar;
  const afterLevel = levelOf(after, limit);
  const portionLevel = foodLevel(sugar, limit);
  const over = after - limit;
  const pct = Math.round((sugar / limit) * 100);
  const scale = Math.max(after, limit);
  const shown = useCountUp(sugar);
  const art = artOf[food.name];
  const pieces = Math.min(qty, 3);
  const alt = foods
    .filter((f) => f.group === food.group && f.name !== food.name && f.sugar <= food.sugar * 0.5)
    .sort((x, y) => x.sugar - y.sugar)[0];

  const send = () => {
    if (sent) return;
    setSent(true);
    setTimeout(() => add(qty), 700);
  };

  return (
    <main className="screen food-detail-screen">
      <Header title="Detalle del alimento" onBack={back} />
      <div className="content detail-content fd">
        <div className="fd-hero" style={{ ['--c1' as string]: art ? art.a : '#FFB37F', ['--tone' as string]: food.tone } as CSSProperties}>
          <i className="fd-halo" />
          <i className="fd-halo h2" />
          {['✦', '✦', '✧', '✦', '✧'].map((s, i) => <span key={i} className={`fd-spark sp${i}`}>{s}</span>)}
          <div className="fd-pieces" key={qty}>
            {Array.from({ length: pieces }, (_, i) => (
              <span key={i} style={{ marginLeft: i === 0 ? 0 : -46, transform: `rotate(${(i - (pieces - 1) / 2) * 10}deg)`, zIndex: i }}>
                <FoodArt name={food.name} emoji={food.emoji} size={pieces === 1 ? 150 : pieces === 2 ? 128 : 112} />
              </span>
            ))}
          </div>
          {qty > 1 && <span className="fd-qty">×{qty}</span>}
          <span className="fd-flag">Perú</span>
        </div>

        <div className="fd-title">
          <span className="category">{food.category}</span>
          <h1>{food.name}</h1>
          <p>{food.detail}</p>
        </div>

        <div className="fd-sugar">
          <div className="fd-jar">
            <svg viewBox="0 0 140 150" width="124" height="132" aria-label={`${spoons} terrones de azúcar`}>
              <rect x="30" y="4" width="80" height="14" rx="5" fill="#F26A1B" />
              <rect x="30" y="4" width="80" height="5" rx="2.5" fill="#fff" opacity=".3" />
              <rect x="38" y="18" width="64" height="8" rx="3" fill="#E9EEF7" />
              <path d="M26 30Q26 24 32 24H108Q114 24 114 30V132Q114 144 102 144H38Q26 144 26 132Z" fill="#EAF0F9" stroke="#CBD5E6" strokeWidth="2" />
              {Array.from({ length: cubes }, (_, i) => (
                <g key={`${sugar}-${i}`} className="fd-cube" style={{ animationDelay: `${i * 70}ms` }}>
                  <rect x={31 + (i % 4) * 20} y={120 - Math.floor(i / 4) * 20} width="18" height="18" rx="3.5" fill="#FFFFFF" stroke="#D5C8AE" strokeWidth="1.2" />
                  <path d={`M${34 + (i % 4) * 20} ${124 - Math.floor(i / 4) * 20}h7`} stroke="#E3D8C2" strokeWidth="2" strokeLinecap="round" />
                </g>
              ))}
              <path d="M34 36V122" stroke="#fff" strokeOpacity=".8" strokeWidth="3" strokeLinecap="round" />
            </svg>
            {spoons > 20 && <b>+{spoons - 20}</b>}
          </div>
          <div className="fd-sugar-copy">
            <span>Azúcar de tu porción</span>
            <div className="fd-num"><strong>{shown}</strong><small>g</small></div>
            <p>
              {spoons === 0 ? <>¡Jarra vacía! <b>0 terrones</b></> : <>≈ <b>{spoons}</b> {spoons === 1 ? 'terrón' : 'terrones'} de azúcar</>}
              <em>1 terrón = 1 cucharadita = 4 g</em>
            </p>
            <span className={`fd-pct ${portionLevel}`}>{sugar === 0 ? 'Sin azúcar' : `${pct}% de tu límite`}</span>
          </div>
        </div>

        <div className="portion-row">
          <div><span>Porción</span><strong>{qty === 1 ? food.detail : `${qty} × ${food.detail}`}</strong></div>
          <div className="stepper">
            <button disabled={qty === 1} onClick={() => setQty(qty - 1)} aria-label="Menos">−</button>
            <b key={qty} className="pop">{qty}</b>
            <button disabled={qty === 5} onClick={() => setQty(qty + 1)} aria-label="Más">+</button>
          </div>
        </div>

        <div className="fd-after">
          <div className="fd-after-top"><span>Tu día después de agregarlo</span><b className={`t-${afterLevel}`}>{after} g de {limit} g</b></div>
          <div className="fd-bar">
            <i className="fd-bar-base" style={{ width: `${(total / scale) * 100}%` }} />
            <i className={`fd-bar-add lv-${afterLevel}`} style={{ left: `${(total / scale) * 100}%`, width: `${(sugar / scale) * 100}%` }} />
            <span className="fd-bar-limit" style={{ left: `${(limit / scale) * 100}%` }} />
          </div>
          <div className="fd-bar-legend">
            <span><i /> Ya registrado · {total} g</span>
            <span><i className={`lv-${afterLevel}`} /> Esta porción · +{sugar} g</span>
          </div>
        </div>

        {sugar === 0 ? (
          <div className="fd-good"><span>🌿</span><p>¡Excelente elección! Esto no suma azúcar a tu día.</p></div>
        ) : over > 0 ? (
          <div className="notice amber"><span>!</span><p>Con esto superarías tu límite por <strong>{over} g</strong>. Puedes elegir una porción menor o una alternativa.</p></div>
        ) : pct >= 40 ? (
          <div className="notice amber"><span>!</span><p>Este alimento usa el <strong>{pct}%</strong> de tu límite diario.</p></div>
        ) : null}

        {alt && food.sugar >= limit * 0.2 && (
          <button className="fd-alt" onClick={() => swap(alt)}>
            <span className="fd-alt-art"><FoodArt name={alt.name} emoji={alt.emoji} size={46} still /></span>
            <div><small>Alternativa más ligera</small><strong>{alt.name}</strong><em>{alt.sugar} g · ahorras {food.sugar - alt.sugar} g por porción</em></div>
            <Icon name="chevron" size={18} />
          </button>
        )}

        <div className="detail-action">
          <div><span>Azúcar a agregar</span><strong>{sugar} g</strong></div>
          <Button className={`fd-cta ${sent ? 'sent' : ''}`} onClick={send}>
            {sent ? <><Icon name="check" size={18} strokeWidth={3} /> ¡Agregado!</> : 'Agregar a mi día'}
          </Button>
        </div>
      </div>
    </main>
  );
}

function ExcessAlert({ total, limit, last, home, alternative, undoLast }: {
  total: number;
  limit: number;
  last?: Added;
  home: () => void;
  alternative: () => void;
  undoLast: () => void;
}) {
  const over = total - limit;
  const shown = useCountUp(total);
  const scale = Math.max(total, limit);
  const baseFood = last ? foods.find((f) => f.name === last.name.replace(/ ×\d+$/, '')) : undefined;
  const alt =
    (baseFood
      ? foods.filter((f) => f.group === baseFood.group && f.name !== baseFood.name && f.sugar <= baseFood.sugar * 0.5).sort((a, b) => a.sugar - b.sugar)[0]
      : undefined) || foods.find((f) => f.name === 'Inca Kola sin azúcar');
  return (
    <main className="screen alert-screen al">
      <div className="al-hero">
        <i className="al-pulse" />
        <i className="al-pulse p2" />
        <div className="al-badge">!</div>
        <span className="al-dot d1" />
        <span className="al-dot d2" />
        <span className="al-dot d3" />
      </div>

      <div className="al-copy">
        <span className="eyebrow">Límite diario</span>
        <h1>Hoy te pasaste<br />un poquito</h1>
        <p>No pasa nada: cada elección es una oportunidad para cuidarte.</p>
      </div>

      <div className="al-meter">
        <div className="al-meter-top">
          <div className="al-num"><strong>{shown}</strong><small>g de {limit} g</small></div>
          <span className="al-over">+{over} g sobre tu límite</span>
        </div>
        <div className="al-bar">
          <i className="al-bar-base" style={{ width: `${(limit / scale) * 100}%` }} />
          <i className="al-bar-over" style={{ left: `${(limit / scale) * 100}%`, width: `${(over / scale) * 100}%` }} />
          <span className="al-bar-limit" style={{ left: `${(limit / scale) * 100}%` }} />
        </div>
        <div className="al-bar-legend"><span>Tu límite · {limit} g</span><span>Hoy · {total} g</span></div>
      </div>

      {last && (
        <div className="al-last">
          <span className="al-art"><FoodArt name={last.name} emoji={last.emoji} size={44} still /></span>
          <div><small>Lo último que agregaste</small><strong>{last.name}</strong></div>
          <b>+{last.sugar} g</b>
        </div>
      )}

      {alt && (
        <button className="al-alt" onClick={alternative}>
          <span className="al-art"><FoodArt name={alt.name} emoji={alt.emoji} size={46} still /></span>
          <div>
            <small>Prueba esta alternativa</small>
            <strong>{alt.name}</strong>
            <em>{alt.sugar} g de azúcar{last ? ` · ahorras ${Math.max(0, last.sugar - alt.sugar)} g` : ''}</em>
          </div>
          <Icon name="chevron" size={18} />
        </button>
      )}

      <div className="simple-tip"><Icon name="spark" size={20} /><p><strong>Consejo simple</strong><br />Toma un vaso de agua y elige algo sin azúcar en tu próxima comida.</p></div>

      <div className="alert-actions">
        <Button onClick={home}>Entendido, ir a Inicio</Button>
        {last && <Button variant="secondary" onClick={undoLast}>Deshacer lo último</Button>}
      </div>
    </main>
  );
}

type DayPoint = { label: string; date: string; value: number; top: string };

const DAY_LABELS = ['Mié', 'Jue', 'Vie', 'Sáb', 'Dom', 'Lun', 'Mar'];

function makeWeek(range: string, dates: string[], values: number[], tops: string[]) {
  const days: DayPoint[] = values.map((v, i) => ({ label: DAY_LABELS[i], date: dates[i], value: v, top: tops[i] }));
  return { range, days };
}

const progressWeeks = [
  makeWeek(
    '8 – 14 mayo',
    ['8 mayo', '9 mayo', '10 mayo', '11 mayo', '12 mayo', '13 mayo', '14 mayo'],
    [29, 44, 47, 41, 52, 34, 38],
    ['Yogur de fresa · 12 g', 'Chicha morada · 18 g', 'Inca Kola · 27 g', 'Chicha morada · 18 g', 'Inca Kola · 27 g', 'Pan con mermelada · 14 g', 'Yogur de fresa · 12 g'],
  ),
  makeWeek(
    '1 – 7 mayo',
    ['1 mayo', '2 mayo', '3 mayo', '4 mayo', '5 mayo', '6 mayo', '7 mayo'],
    [48, 35, 52, 40, 31, 45, 39],
    ['Inca Kola · 27 g', 'Pan con mermelada · 14 g', 'Helado · 20 g', 'Chicha morada · 18 g', 'Yogur de fresa · 12 g', 'Inca Kola · 27 g', 'Torta · 15 g'],
  ),
  makeWeek(
    '24 – 30 abr',
    ['24 abr', '25 abr', '26 abr', '27 abr', '28 abr', '29 abr', '30 abr'],
    [55, 50, 46, 58, 42, 37, 49],
    ['Inca Kola · 27 g', 'Helado · 20 g', 'Chicha morada · 18 g', 'Inca Kola · 27 g', 'Torta · 15 g', 'Pan con mermelada · 14 g', 'Chicha morada · 18 g'],
  ),
  makeWeek(
    '17 – 23 abr',
    ['17 abr', '18 abr', '19 abr', '20 abr', '21 abr', '22 abr', '23 abr'],
    [44, 39, 51, 47, 36, 41, 43],
    ['Chicha morada · 18 g', 'Yogur de fresa · 12 g', 'Inca Kola · 27 g', 'Torta · 15 g', 'Pan con mermelada · 14 g', 'Chicha morada · 18 g', 'Helado · 20 g'],
  ),
];

const levelLabel: Record<Level, string> = {
  low: 'Bajo',
  ok: 'Bajo control',
  warn: 'Cerca del límite',
  high: 'Excediste',
};

const levelOf = (value: number, limit: number): Level => (value > limit ? 'high' : value >= limit * 0.8 ? 'warn' : 'ok');

const sourcesByView = {
  week: [
    { label: 'Bebidas', pct: 46, color: '#14284B' },
    { label: 'Postres', pct: 28, color: '#F26A1B' },
    { label: 'Panes y dulces', pct: 16, color: '#FFB347' },
    { label: 'Otros', pct: 10, color: '#9CABC1' },
  ],
  month: [
    { label: 'Bebidas', pct: 42, color: '#14284B' },
    { label: 'Postres', pct: 30, color: '#F26A1B' },
    { label: 'Panes y dulces', pct: 18, color: '#FFB347' },
    { label: 'Otros', pct: 10, color: '#9CABC1' },
  ],
};

function useCountUp(target: number) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / 900);
      setValue(target * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return Math.round(value);
}

function ProgressEmpty({ total, count, goRegister, loadSample }: { total: number; count: number; goRegister: () => void; loadSample: () => void }) {
  return (
    <main className="screen with-nav">
      <div className="content pg">
        <div className="progress-head"><span>Tu camino saludable</span><h1>Progreso</h1></div>
        <div className="pg-empty">
          <Dulci mood="happy" size={104} />
          <h2>Tu progreso aparecerá aquí</h2>
          <p>Registra tus alimentos unos días y verás tus gráficas, tu racha y tus patrones de consumo.</p>
          {count > 0 && <span className="pg-empty-chip">Hoy llevas {total} g registrados</span>}
          <button className="pg-empty-main" onClick={goRegister}>Registrar un alimento</button>
          <button className="pg-empty-alt" onClick={loadSample}>Cargar datos de ejemplo</button>
        </div>
      </div>
    </main>
  );
}

function WeeklyProgress({ profile, total, added, sample, loadSample, goRegister, goPremium }: {
  profile: Profile; total: number; added: Added[]; sample: boolean; loadSample: () => void; goRegister: () => void; goPremium: () => void;
}) {
  if (!sample) return <ProgressEmpty total={total} count={added.length} goRegister={goRegister} loadSample={loadSample} />;
  return <ProgressFull profile={profile} total={total} added={added} goPremium={goPremium} />;
}

function ProgressFull({ profile, total, added, goPremium }: { profile: Profile; total: number; added: Added[]; goPremium: () => void }) {
  const demo = !isComplete(profile);
  const limit = metrics(demo ? { ...profile, ...demoValues } : profile).limit;

  const todayTop = [...todayBase.map((b) => ({ name: b.name, sugar: b.sugar })), ...added.map((x) => ({ name: x.name, sugar: x.sugar }))].reduce((m, x) => (x.sugar > m.sugar ? x : m));
  const weeks = progressWeeks.map((wk, k) =>
    k === 0 ? { ...wk, days: wk.days.map((d, i) => (i === 6 ? { ...d, value: total, top: `${todayTop.name} · ${todayTop.sugar} g` } : d)) } : wk,
  );

  const [tab, setTab] = useState<'week' | 'month'>('week');
  const [w, setW] = useState(0);
  const [sel, setSel] = useState({ w: 0, i: 6 });

  const monthDays = [3, 2, 1, 0].flatMap((k) => weeks[k].days.map((d, i) => ({ ...d, w: k, i })));
  const weekDays = weeks[w].days.map((d, i) => ({ ...d, w, i }));
  const viewDays = tab === 'week' ? weekDays : monthDays;
  const n = viewDays.length;

  const avg = viewDays.reduce((s, d) => s + d.value, 0) / n;
  const daysIn = viewDays.filter((d) => d.value <= limit).length;
  const prevAvg = tab === 'week' && w < weeks.length - 1 ? weeks[w + 1].days.reduce((s, d) => s + d.value, 0) / 7 : null;
  const delta = prevAvg ? ((avg - prevAvg) / prevAvg) * 100 : null;
  const deltaRounded = delta === null ? 0 : Math.round(delta);

  const deltaText =
    delta === null
      ? tab === 'week' ? 'Primera semana registrada' : 'Últimos 28 días'
      : deltaRounded === 0 ? '→ Igual que la semana anterior'
      : `${delta < 0 ? '↓' : '↑'} ${Math.abs(deltaRounded)}% vs semana anterior`;
  const deltaClass = delta === null || deltaRounded === 0 ? 'neutral' : delta < 0 ? 'good' : 'bad';

  const avgShown = useCountUp(avg);
  const daysShown = useCountUp(daysIn);
  const ringPct = Math.round((daysIn / n) * 100);

  let streak = 0;
  for (let k = n - 1; k >= 0; k--) {
    if (viewDays[k].value <= limit) streak++;
    else break;
  }
  const best = viewDays.reduce((a, b) => (b.value < a.value ? b : a));
  const sweet = viewDays.reduce((a, b) => (b.value > a.value ? b : a));

  const message =
    daysIn === n ? '¡Perfecto! Todos los días dentro de tu límite.'
    : daysIn / n >= 0.7 ? `¡Muy buen trabajo! ${daysIn} de ${n} días dentro de tu límite.`
    : 'Vamos paso a paso: elige una bebida sin azúcar hoy.';

  const cur = weeks[sel.w].days[sel.i];
  const curLevel = levelOf(cur.value, limit);
  const curPct = Math.round((cur.value / limit) * 100);
  const diff = cur.value - limit;
  const isToday = sel.w === 0 && sel.i === 6;

  const scaleMax = Math.ceil(Math.max(limit * 1.3, ...weekDays.map((d) => d.value * 1.1)) / 10) * 10;
  const sources = sourcesByView[tab];

  const wkAvg = [3, 2, 1, 0].map((k) => ({ label: weeks[k].range.replace(' – ', '–').replace('mayo', 'may'), v: weeks[k].days.reduce((a, d) => a + d.value, 0) / 7 }));
  const tMax = Math.ceil(Math.max(limit * 1.15, ...wkAvg.map((a) => a.v * 1.1)) / 5) * 5;
  const tPts = wkAvg.map((a, i) => ({ ...a, x: 34 + i * 84, y: 14 + (1 - a.v / tMax) * 96 }));
  const tLine = tPts.map((p) => `${p.x},${p.y}`).join(' ');
  const tLimY = 14 + (1 - limit / tMax) * 96;
  const tDelta = Math.round(wkAvg[3].v - wkAvg[0].v);
  const wdName: Record<string, string> = { Mié: 'miércoles', Jue: 'jueves', Vie: 'viernes', Sáb: 'sábados', Dom: 'domingos', Lun: 'lunes', Mar: 'martes' };
  const wdAvg = DAY_LABELS.map((l, i) => ({ l, v: Math.round([0, 1, 2, 3].reduce((a, k) => a + weeks[k].days[i].value, 0) / 4) }));
  const wdMax = Math.max(limit * 1.15, ...wdAvg.map((a) => a.v));
  const wdTop = wdAvg.reduce((a, b) => (b.v > a.v ? b : a));

  const goWeek = (next: number) => {
    setW(next);
    setSel({ w: next, i: 6 });
  };

  return (
    <main className="screen with-nav">
      <div className="content pg">
        <div className="progress-head"><span>Tu camino saludable</span><h1>Progreso</h1></div>

        <div className="pg-tabs" role="tablist">
          <span className="pg-thumb" style={{ transform: `translateX(${tab === 'week' ? 0 : 100}%)` }} />
          <button className={tab === 'week' ? 'on' : ''} onClick={() => { setTab('week'); setSel({ w, i: 6 }); }}>Semana</button>
          <button className={tab === 'month' ? 'on' : ''} onClick={() => { setTab('month'); setSel({ w: 0, i: 6 }); }}>Mes</button>
          <button onClick={goPremium}>Año 🔒</button>
        </div>

        <div className="pg-hero" key={`hero-${tab}-${w}`}>
          <div className="pg-hero-left">
            <span className="pg-eb">Promedio diario</span>
            <div className="pg-avg"><strong>{avgShown}</strong><small>g</small></div>
            <span className={`pg-delta ${deltaClass}`}>{deltaText}</span>
            <p>{message}</p>
          </div>
          <div className="pg-ring">
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <circle cx="60" cy="60" r="50" className="pg-ring-track" />
              <circle
                cx="60" cy="60" r="50"
                className="pg-ring-value"
                pathLength={100}
                strokeDasharray={`${ringPct} 100`}
                style={{ ['--p' as string]: ringPct } as CSSProperties}
              />
            </svg>
            <div className="pg-ring-copy"><strong>{daysShown}<small>/{n}</small></strong><span>días en meta</span></div>
          </div>
        </div>

        {tab === 'week' ? (
          <div className="week-switch">
            <button disabled={w === weeks.length - 1} onClick={() => goWeek(w + 1)} aria-label="Semana anterior"><Icon name="back" size={18} /></button>
            <strong key={w} className="pg-range">{weeks[w].range}{w === 0 ? ' · Esta semana' : ''}</strong>
            <button disabled={w === 0} onClick={() => goWeek(w - 1)} aria-label="Semana siguiente"><Icon name="chevron" size={18} /></button>
          </div>
        ) : (
          <p className="pg-sub">Últimos 28 días · 17 abr – 14 mayo</p>
        )}

        <Card className="pg-chart-card">
          <div className="pg-chart-head">
            <strong>{tab === 'week' ? 'Azúcar por día' : 'Mapa de tus 28 días'}</strong>
            <span>Toca un día para ver el detalle</span>
          </div>

          {tab === 'week' ? (
            <div className="pg-chart" key={`chart-${w}`}>
              <div className="pg-cols">
                {weekDays.map((d) => {
                  const lvl = levelOf(d.value, limit);
                  const selected = sel.w === d.w && sel.i === d.i;
                  return (
                    <button key={d.i} className={`pg-col ${selected ? 'sel' : ''}`} onClick={() => setSel({ w: d.w, i: d.i })} aria-label={`${d.label} ${d.date}: ${d.value} gramos, ${levelLabel[lvl]}`}>
                      <span className="pg-plot">
                        <span className={`pg-bar c-${lvl}`} style={{ height: `${(d.value / scaleMax) * 100}%`, animationDelay: `${d.i * 70}ms` }}>
                          <b>{d.value}</b>
                        </span>
                      </span>
                      <span className="pg-day">{d.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="pg-limit">
                <i style={{ bottom: `${(limit / scaleMax) * 100}%` }} />
                <span style={{ bottom: `calc(${(limit / scaleMax) * 100}% + 4px)` }}>Tu límite · {limit} g</span>
              </div>
            </div>
          ) : (
            <div className="hm" key="heat">
              <div className="hm-head"><span />{DAY_LABELS.map((l) => <span key={l}>{l}</span>)}</div>
              {[3, 2, 1, 0].map((k, row) => (
                <div className="hm-row" key={k}>
                  <span className="hm-lab">{weeks[k].days[0].date}</span>
                  {weeks[k].days.map((d, i) => {
                    const lvl = levelOf(d.value, limit);
                    const selected = sel.w === k && sel.i === i;
                    return (
                      <button
                        key={i}
                        className={`hm-cell c-${lvl} ${selected ? 'sel' : ''}`}
                        style={{ animationDelay: `${(row * 7 + i) * 18}ms` }}
                        onClick={() => setSel({ w: k, i })}
                        aria-label={`${d.label} ${d.date}: ${d.value} gramos, ${levelLabel[lvl]}`}
                      >
                        {d.value}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          <div className="pg-legend">
            <span><i className="c-ok" /> Bajo control</span>
            <span><i className="c-warn" /> Cerca del límite</span>
            <span><i className="c-high" /> Excediste</span>
          </div>
        </Card>

        <div className="pg-detail" key={`detail-${sel.w}-${sel.i}`}>
          <div className="pg-detail-head">
            <div>
              <span className="pg-detail-day">{cur.label} {cur.date}{isToday ? ' · Hoy' : ''}</span>
              <strong>{cur.value} g <small>de azúcar</small></strong>
            </div>
            <span className={`pill ${curLevel}`}>{levelLabel[curLevel]}</span>
          </div>
          <div className="pg-meter"><i className={`c-${curLevel}`} style={{ width: `${Math.min(100, curPct)}%` }} /></div>
          <p className="pg-detail-note">
            <b>{curPct}% de tu límite de {limit} g.</b>{' '}
            {diff <= 0 ? `Te faltaron ${-diff} g para llegar al límite.` : `Te pasaste por ${diff} g.`}
          </p>
          <p className="pg-detail-note">Mayor aporte: <b>{cur.top}</b></p>
        </div>

        <div className="pg-ins-grid">
          <div className="pg-ins" style={{ animationDelay: '0ms' }}>
            <span className="pg-flame">🔥</span><strong>{streak}</strong><small>{streak === 1 ? 'día seguido' : 'días seguidos'} en tu límite</small>
          </div>
          <div className="pg-ins" style={{ animationDelay: '90ms' }}>
            <span>🌿</span><strong>{best.value} g</strong><small>Mejor día · {best.label} {best.date}</small>
          </div>
          <div className="pg-ins" style={{ animationDelay: '180ms' }}>
            <span>🍫</span><strong>{sweet.value} g</strong><small>Más dulce · {sweet.label} {sweet.date}</small>
          </div>
        </div>

        <Card className="pg-trend">
          <div className="pg-chart-head"><strong>Tendencia de 4 semanas</strong><span>┄ Tu límite: {limit} g</span></div>
          <svg viewBox="0 0 320 150" role="img" aria-label="Promedio diario de azúcar en las últimas 4 semanas">
            <defs>
              <linearGradient id="trg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#F26A1B" stopOpacity=".3" />
                <stop offset="1" stopColor="#F26A1B" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="14" x2="306" y1={tLimY} y2={tLimY} className="tr-lim" />
            <polygon points={`${tPts[0].x},110 ${tLine} ${tPts[3].x},110`} fill="url(#trg)" className="tr-area" />
            <polyline points={tLine} className="tr-line" pathLength={1} />
            {tPts.map((p, i) => (
              <g key={p.label} className="tr-pt" style={{ animationDelay: `${.5 + i * .15}s` }}>
                <circle cx={p.x} cy={p.y} r="5" />
                <text x={p.x} y={p.y - 11} textAnchor="middle" className="tr-val">{Math.round(p.v)}</text>
                <text x={p.x} y="134" textAnchor="middle" className="tr-x">{p.label}</text>
              </g>
            ))}
          </svg>
          <p className="pg-note">
            {tDelta < 0 ? `Tu promedio bajó ${-tDelta} g al día en 4 semanas. ¡Sigue así!` : tDelta > 0 ? `Tu promedio subió ${tDelta} g al día en 4 semanas. Elige una bebida sin azúcar hoy.` : 'Tu promedio se mantiene estable en 4 semanas.'}
          </p>
        </Card>

        <Card className="pg-wd">
          <div className="pg-chart-head"><strong>Tu día más dulce</strong><span>Promedio 4 semanas</span></div>
          <div className="wd-cols">
            {wdAvg.map((d, i) => (
              <div key={d.l} className={d.l === wdTop.l ? 'top' : ''}>
                <b>{d.v}</b>
                <span className="wd-plot"><s className="wd-l" style={{ bottom: `${(limit / wdMax) * 100}%` }} /><i className={`c-${levelOf(d.v, limit)}`} style={{ height: `${(d.v / wdMax) * 100}%`, animationDelay: `${i * 60}ms` }} /></span>
                <small>{d.l}</small>
              </div>
            ))}
          </div>
          <p className="pg-note">Los <b>{wdName[wdTop.l]}</b> es cuando más azúcar consumes ({wdTop.v} g en promedio). Planea una opción sin azúcar ese día.</p>
        </Card>

        <Card className="pg-src" >
          <div className="pg-chart-head"><strong>¿De dónde viene tu azúcar?</strong></div>
          <div className="pg-stack" key={`stack-${tab}`}>
            {sources.map((s, i) => <i key={s.label} style={{ flex: s.pct, background: s.color, animationDelay: `${i * 120}ms` }} />)}
          </div>
          <div className="pg-src-list">
            {sources.map((s) => (
              <div key={s.label}><span><i style={{ background: s.color }} />{s.label}</span><b>{s.pct}%</b></div>
            ))}
          </div>
        </Card>

        <button className="pg-teaser" onClick={goPremium}>
          <span className="pg-teaser-ico"><Icon name="chart" size={22} /></span>
          <div>
            <strong>Descubre tus patrones del año</strong>
            <small>Con Premium: historial ilimitado, tendencias y reportes para tu nutricionista.</small>
          </div>
          <Icon name="chevron" size={18} />
        </button>
      </div>
    </main>
  );
}
    

function ProfileScreen({
  profile, habits, sample, loadSample, openHabits, premium, openData, openLimit, openHistory, logout,
}: {
  profile: Profile;
  habits: Habits;
  sample: boolean;
  loadSample: () => void;
  openHabits: () => void;
  premium: () => void;
  openData: () => void;
  openLimit: () => void;
  openHistory: () => void;
  logout: () => void;
}) {
  const demo = !isComplete(profile);
  const m = metrics(demo ? { ...profile, ...demoValues } : profile);
  const first = profile.name.split(' ')[0] || 'Mariana';

  const rows: { icon: IconName; tone: string; title: string; sub: string; action: () => void }[] = [
    { icon: 'user', tone: 'orange', title: 'Mis datos y objetivo', sub: `IMC ${m.bmi.toFixed(1)} · Cintura ${m.wc} cm`, action: openData },
    { icon: 'shield', tone: 'green', title: 'Mi límite diario', sub: `${m.limit} g de azúcar al día`, action: openLimit },
    { icon: 'history', tone: 'blue', title: 'Historial de registros', sub: 'Tus últimos días', action: openHistory },
  ];

  return (
    <main className="screen with-nav">
      <div className="content pf">
        <div className="pf-hero">
          <div className="pf-top">
            <div className="pf-avatar">{first.charAt(0).toUpperCase()}</div>
            <div>
              <h1 className="pf-name">{profile.name}</h1>
              <span className="pf-chip">🎯 Meta: {goalText[profile.goal]}</span>
            </div>
          </div>
          <div className="pf-stats">
            <div className="pf-stat"><span>Límite diario</span><strong>{m.limit}<small>g</small></strong></div>
            <div className="pf-stat"><span>Tu IMC</span><strong>{m.bmi.toFixed(1)}</strong></div>
            <div className="pf-stat"><span>Días en meta</span><strong>{sample ? <>5<small>/7</small></> : '–'}</strong></div>
          </div>
          {demo && <p className="pf-demo">Cifras de ejemplo. Completa tus datos en "Mis datos y objetivo".</p>}
        </div>

        <button className="pf-premium" onClick={premium}>
          <span><Icon name="spark" /></span>
          <div><small>SUGARTRACK PREMIUM</small><strong>Conoce más sobre tus hábitos</strong></div>
          <Icon name="chevron" />
        </button>

        <h2 className="pf-section">Tus hábitos</h2>
        {habits.pace === '' ? (
          <div className="pf-habits empty">
            <Dulci mood="happy" size={64} />
            <div>
              <strong>Cuéntanos tus hábitos</strong>
              <p>6 preguntas rápidas para personalizar tu guía y tu reto diario.</p>
              <button className="pf-h-edit" onClick={openHabits}>Responder ahora</button>
            </div>
          </div>
        ) : (
          <div className="pf-habits">
            <div className="pf-h-top">
              <Dulci mood="happy" size={64} />
              <div>
                <small>ENFOQUE</small>
                <strong>{focusOf(habits)}</strong>
                <p>{focusTip[focusOf(habits)]}</p>
              </div>
            </div>
            <div className="pf-h-chips">
              <span>🏆 {challengeGoal(habits)} {challengeGoal(habits) === 1 ? 'opción' : 'opciones'} sin azúcar al día</span>
              <span>{habits.pace === 'suave' ? '🐢 Ritmo suave' : habits.pace === 'firme' ? '🚀 Ritmo firme' : '🚶 Ritmo constante'}</span>
              {habits.drinks !== '' && <span>🥤 {habits.drinks === '0' ? 'Sin bebidas azucaradas' : `${habits.drinks} bebida${habits.drinks === '1' ? '' : 's'} al día`}</span>}
            </div>
            <button className="pf-h-edit" onClick={openHabits}>Cambiar mis respuestas</button>
          </div>
        )}

        <h2 className="pf-section">Tu cuenta</h2>
        <div className="pf-list">
          {rows.map((r) => (
            <button key={r.title} className="pf-row" onClick={r.action}>
              <span className={`pf-ico ${r.tone}`}><Icon name={r.icon} /></span>
              <div><strong>{r.title}</strong><small>{r.sub}</small></div>
              <span className="chev"><Icon name="chevron" size={18} /></span>
            </button>
          ))}
        </div>

        {!sample && (
          <button className="pf-sample" onClick={loadSample}>✨ Cargar datos de ejemplo para la demo</button>
        )}
        <button className="pf-logout" onClick={logout}>Cerrar sesión</button>
      </div>
    </main>
  );
}

const premiumBenefits = [
  { id: 'alerts', icon: '🔔', title: 'Alertas tempranas', copy: 'Te avisamos antes de pasarte, no después.' },
  { id: 'charts', icon: '📈', title: 'Gráficos de todo el año', copy: 'Descubre tus patrones mes a mes.' },
  { id: 'plan', icon: '🎯', title: 'Plan personalizado', copy: 'Metas y alternativas según tus hábitos.' },
];

const premiumRows = [
  ['Registro de alimentos', '✓', '✓'],
  ['Semáforo y límite diario', '✓', '✓'],
  ['Historial', '7 días', 'Ilimitado'],
  ['Gráficos del año', '—', '✓'],
  ['Alertas tempranas', '—', '✓'],
  ['Planes personalizados', '—', '✓'],
  ['Reporte para tu médico', '—', 'Pronto'],
];

function PreviewAlerts() {
  return (
    <div className="pm-prev">
      <div className="pm-notif">
        <span className="pm-bell">🔔</span>
        <div>
          <small>SugarTrack · ahora</small>
          <strong>Ya usaste el 80% de tu límite</strong>
          <p>Una chicha morada más y te pasarías. ¿Probamos agua o una versión sin azúcar?</p>
        </div>
      </div>
      <em className="pm-ex">Vista de ejemplo</em>
    </div>
  );
}

function PreviewCharts() {
  const months = [34, 41, 38, 45, 36, 40, 33, 37, 31, 35, 30, 28];
  const letters = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  return (
    <div className="pm-prev">
      <div className="pm-mini">
        {months.map((v, i) => (
          <div key={i}>
            <i style={{ height: `${(v / 48) * 100}%`, animationDelay: `${i * 50}ms` }} />
            <small>{letters[i]}</small>
          </div>
        ))}
      </div>
      <p className="pm-trend">Promedio diario por mes: <b>baja de 34 g a 28 g</b></p>
      <em className="pm-ex">Vista de ejemplo</em>
    </div>
  );
}

function PreviewPlan() {
  const tasks = ['Cambia 1 gaseosa por agua al día', 'Pan sin mermelada en el desayuno', 'Revisa la etiqueta de 2 productos'];
  const [done, setDone] = useState<number[]>([0]);
  const toggle = (i: number) => setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]));
  return (
    <div className="pm-prev">
      <ul className="pm-plan">
        {tasks.map((t, i) => (
          <li key={t}>
            <button className={done.includes(i) ? 'on' : ''} onClick={() => toggle(i)} aria-pressed={done.includes(i)}>
              <i>{done.includes(i) ? '✓' : ''}</i>{t}
            </button>
          </li>
        ))}
      </ul>
      <div className="pm-plan-bar"><i style={{ width: `${(done.length / tasks.length) * 100}%` }} /></div>
      <p className="pm-trend">{done.length} de {tasks.length} · Meta de la semana: <b>bajar 5 g por día</b></p>
      <em className="pm-ex">Vista de ejemplo</em>
    </div>
  );
}

function Premium({ back }: { back: () => void }) {
  const [open, setOpen] = useState('alerts');
  const [done, setDone] = useState(false);
  return (
    <main className="screen premium-screen pm">
      <Header title="Premium" onBack={back} />
      <div className="content pm-content">
        <div className="pm-hero">
          <i className="pm-orb o1" />
          <i className="pm-orb o2" />
          <span className="pm-spark s1">✦</span>
          <span className="pm-spark s2">✧</span>
          <span className="pm-spark s3">✦</span>
          <div className="pm-gem"><Icon name="spark" size={34} /></div>
          <span className="pm-label">SUGARTRACK PREMIUM</span>
          <h1>Más claridad para <em>cuidarte mejor</em></h1>
          <p>Descubre tus patrones y recibe una guía hecha a tu medida.</p>
          <div className="pm-chips"><span>7 días gratis</span><span>Cancela cuando quieras</span></div>
        </div>

        <h2 className="pm-sec">Lo que desbloqueas</h2>
        <div className="pm-bens">
          {premiumBenefits.map((b, i) => (
            <div key={b.id} className={`pm-ben ${open === b.id ? 'open' : ''}`} style={{ animationDelay: `${i * 80}ms` }}>
              <button className="pm-ben-head" onClick={() => setOpen(open === b.id ? '' : b.id)} aria-expanded={open === b.id}>
                <span className="pm-ben-ico">{b.icon}</span>
                <div><strong>{b.title}</strong><small>{b.copy}</small></div>
                <span className="pm-chev"><Icon name="chevron" size={18} /></span>
              </button>
              <div className="pm-ben-body">
                <div>
                  {open === b.id && (b.id === 'alerts' ? <PreviewAlerts /> : b.id === 'charts' ? <PreviewCharts /> : <PreviewPlan />)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="pm-sec">Gratis vs Premium</h2>
        <div className="pm-table">
          <div className="pm-th"><span /><b>Gratis</b><b className="pro">Premium</b></div>
          {premiumRows.map(([f, a, p], i) => (
            <div className="pm-tr" key={f} style={{ animationDelay: `${i * 60}ms` }}>
              <span>{f}</span>
              <em className={a === '✓' ? 'yes' : a === '—' ? 'no' : ''}>{a}</em>
              <em className={`pro ${p === 'Pronto' ? 'soon' : ''}`}>{p}</em>
            </div>
          ))}
        </div>

        <div className="pm-price">
          <div>
            <small>Plan mensual</small>
            <strong>S/ 12.90<span> /mes</span></strong>
            <em>≈ S/ 0.43 al día</em>
          </div>
          <span className="pm-trial">7 días gratis</span>
        </div>
        <Button className="pm-cta" onClick={() => setDone(true)}>Probar Premium gratis</Button>
        <p className="pm-note">Precio y funciones ilustrativos para el prototipo. SugarTrack no reemplaza la consulta con un profesional de la salud.</p>
      </div>

      {done && (
        <div className="pm-modal" role="dialog" aria-label="Premium activado">
          <div className="pm-modal-card">
            <div className="pm-conf" aria-hidden="true"><span>🎉</span><span>✨</span><span>🎊</span><span>✨</span><span>🎉</span></div>
            <div className="pm-ok">✓</div>
            <h2>¡Premium activado!</h2>
            <p>Esto es una demostración del prototipo. En la versión real, el pago se confirma en Google Play o App Store.</p>
            <Button onClick={back}>Volver al perfil</Button>
            <button className="pm-close" onClick={() => setDone(false)}>Seguir viendo</button>
          </div>
        </div>
      )}
    </main>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [selected, setSelected] = useState<Food>(foods[0]);
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [onboarding, setOnboarding] = useState(true);
  const [added, setAdded] = useState<Added[]>([]);
  const [habits, setHabits] = useState<Habits>(defaultHabits);
  const [sample, setSample] = useState(false);
  const [quizFrom, setQuizFrom] = useState<'onboarding' | 'profile'>('onboarding');
  const loadSample = () => { setSample(true); setHabits((h) => (h.pace ? h : demoHabits)); };
  const limit = limitOf(profile);
  const total = (sample ? BASE_TODAY : 0) + added.reduce((s, a) => s + a.sugar, 0);
  const addFood = (item: Added) => setAdded((a) => [...a, item]);
  const undoFood = (id: number) => setAdded((a) => a.filter((x) => x.id !== id));
  const withNav = ['home', 'register', 'progress', 'profile'].includes(screen);

  const renderScreen = () => {
    switch (screen) {
      case 'welcome':
        return <Welcome goSignup={() => setScreen('signup')} goLogin={() => setScreen('login')} />;
      case 'login':
        return <Login back={() => setScreen('welcome')} goSignup={() => setScreen('signup')} done={() => { setSample(true); setHabits(demoHabits); setOnboarding(false); setScreen('home'); }} />;
      case 'signup':
        return <Signup back={() => setScreen('welcome')} goLogin={() => setScreen('login')} done={(name) => { setProfile((p) => ({ ...p, name })); setOnboarding(true); setScreen('body'); }} />;
      case 'body':
        return <BodyData profile={profile} onboarding={onboarding} back={() => setScreen(onboarding ? 'signup' : 'indicators')} next={(p) => { setProfile(p); setScreen('indicators'); }} />;
      case 'indicators':
        return (
          <Indicators
            profile={profile}
            onboarding={onboarding}
            back={() => setScreen(onboarding ? 'body' : 'profile')}
            primary={() => setScreen(onboarding ? 'goal' : 'body')}
            seeLimit={() => setScreen('limit')}
          />
        );
      case 'goal':
        return <Goal initial={profile.goal} back={() => setScreen('indicators')} next={(g) => { setProfile((p) => ({ ...p, goal: g })); setQuizFrom('onboarding'); setScreen('quiz'); }} />;
      case 'quiz':
        return <Quiz initial={habits} limit={limit} cta={quizFrom === 'profile' ? 'Guardar y volver' : 'Ir a mi día'} back={() => setScreen(quizFrom === 'profile' ? 'profile' : 'goal')} done={(h) => { setHabits(h); if (quizFrom === 'profile') setScreen('profile'); else { setOnboarding(false); setScreen('home'); } }} />;
      case 'home':
        return <Home name={profile.name} habits={habits} sample={sample} loadSample={loadSample} total={total} limit={limit} added={added} goRegister={() => setScreen('register')} goProgress={() => setScreen('progress')} goProfile={() => setScreen('profile')} quickAdd={addFood} undo={undoFood} />;
      case 'register':
        return <Register limit={limit} total={total} chooseFood={(f) => { setSelected(f); setScreen('food-detail'); }} quickAdd={addFood} undo={undoFood} />;
      case 'food-detail':
        return (
          <FoodDetail
            key={selected.name}
            food={selected}
            swap={(f) => setSelected(f)}
            limit={limit}
            total={total}
            back={() => setScreen('register')}
            add={(qty) => {
              const sugar = selected.sugar * qty;
              addFood({ id: nextId(), name: qty > 1 ? `${selected.name} ×${qty}` : selected.name, emoji: selected.emoji, sugar });
              setScreen(total + sugar > limit ? 'alert' : 'home');
            }}
          />
        );
      case 'alert':
        return <ExcessAlert total={total} limit={limit} last={added[added.length - 1]} home={() => setScreen('home')} alternative={() => setScreen('register')} undoLast={() => { const l = added[added.length - 1]; if (l) undoFood(l.id); setScreen('home'); }} />;
      case 'progress':
        return <WeeklyProgress profile={profile} total={total} added={added} sample={sample} loadSample={loadSample} goRegister={() => setScreen('register')} goPremium={() => setScreen('premium')} />;
      case 'profile':
        return (
          <ProfileScreen
            profile={profile}
            habits={habits}
            sample={sample}
            loadSample={loadSample}
            openHabits={() => { setQuizFrom('profile'); setScreen('quiz'); }}
            premium={() => setScreen('premium')}
            openData={() => { setOnboarding(false); setScreen('indicators'); }}
            openLimit={() => setScreen('limit')}
            openHistory={() => setScreen('history')}
            logout={() => { setAdded([]); setSample(false); setHabits(defaultHabits); setProfile(defaultProfile); setOnboarding(true); setScreen('welcome'); }}
          />
        );
      case 'limit':
        return <Limit profile={profile} back={() => setScreen(onboarding ? 'indicators' : 'profile')} />;
      case 'history':
        return <History profile={profile} added={added} sample={sample} back={() => setScreen('profile')} premium={() => setScreen('premium')} />;
      case 'premium':
        return <Premium back={() => setScreen('profile')} />;
    }
  };

  return (
    <div className="app-shell">
      <div className="phone" key={screen}>
        <div className="status-bar"><span>9:41</span><div><i className="signal" /><i className="wifi" /><i className="battery" /></div></div>
        <div className="screen-transition">{renderScreen()}</div>
        {withNav && <BottomNav screen={screen} setScreen={setScreen} />}
      </div>
    </div>
  );
}