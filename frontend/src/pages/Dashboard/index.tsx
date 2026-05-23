import { useState, useEffect, useRef } from 'react';
import {
  IconClipboardCheck,
  IconChartLine,
  IconFlame,
  IconRobot,
  IconTrendingUp,
  IconAlarm,
  IconPlayerPlay,
  IconMathFunction,
  IconAtom,
  IconLanguage,
  IconFlask,
  IconArrowRight,
  IconBrain,
  IconSparkles,
  IconSend,
  IconBell,
  IconCalendarEvent,
} from '@tabler/icons-react';

// ── TYPES ──
interface StatCard {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  iconColor: string;
  iconBg: string;
  iconBorder: string;
  trend: string;
  trendColor: string;
  value: string;
  label: string;
}

interface Subject {
  name: string;
  variant: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  pct: number;
  meta: string;
  color: string;
  dimBg: string;
  borderHover: string;
}

interface Topic {
  name: string;
  status: 'done' | 'prog' | 'new';
  score: string;
  dotColor: string;
}

interface TestItem {
  name: string;
  meta: string;
  score: string;
  pct: string;
  level: 'high' | 'mid' | 'low';
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  iconColor: string;
  iconBg: string;
  iconBorder: string;
}

interface ProgressItem {
  name: string;
  pct: number;
  color: string;
}

// ── DATA ──
const stats: StatCard[] = [
  { icon: IconClipboardCheck, iconColor: 'var(--teal)', iconBg: 'var(--teal-dim)', iconBorder: 'var(--teal-border)', trend: '+3 bugun', trendColor: 'var(--green)', value: '48', label: 'Bajarilgan testlar' },
  { icon: IconChartLine, iconColor: 'var(--purple)', iconBg: 'var(--purple-dim)', iconBorder: 'rgba(129,140,248,0.3)', trend: '+5%', trendColor: 'var(--green)', value: '73%', label: "O'rtacha ball" },
  { icon: IconFlame, iconColor: 'var(--amber)', iconBg: 'var(--amber-dim)', iconBorder: 'rgba(251,191,36,0.3)', trend: 'Rekord!', trendColor: 'var(--green)', value: '12', label: 'Kunlik streak' },
  { icon: IconRobot, iconColor: 'var(--green)', iconBg: 'var(--green-dim)', iconBorder: 'rgba(52,211,153,0.3)', trend: 'Bugun: 24', trendColor: 'var(--green)', value: '124', label: 'AI savollari' },
];

const subjects: Subject[] = [
  { name: 'Matematika', variant: 'math', icon: IconMathFunction, pct: 68, meta: '12 mavzu · 8 bajarildi', color: 'var(--teal)', dimBg: 'rgba(0,196,154,.08)', borderHover: 'var(--teal-border)' },
  { name: 'Fizika', variant: 'phys', icon: IconAtom, pct: 45, meta: '9 mavzu · 4 bajarildi', color: 'var(--purple)', dimBg: 'rgba(129,140,248,.08)', borderHover: 'rgba(129,140,248,.3)' },
  { name: 'Ingliz tili', variant: 'eng', icon: IconLanguage, pct: 82, meta: '15 mavzu · 12 bajarildi', color: 'var(--amber)', dimBg: 'rgba(251,191,36,.08)', borderHover: 'rgba(251,191,36,.3)' },
  { name: 'Kimyo', variant: 'chem', icon: IconFlask, pct: 31, meta: '11 mavzu · 3 bajarildi', color: 'var(--red)', dimBg: 'rgba(248,113,113,.08)', borderHover: 'rgba(248,113,113,.3)' },
];

const topics: Topic[] = [
  { name: 'Algebra — Tenglamalar', status: 'done', score: '90%', dotColor: 'var(--green)' },
  { name: 'Geometriya — Uchburchaklar', status: 'prog', score: '65%', dotColor: 'var(--amber)' },
  { name: 'Logarifm va daraja', status: 'new', score: '—', dotColor: 'var(--text3)' },
  { name: 'Trigonometriya', status: 'new', score: '—', dotColor: 'var(--text3)' },
];

const recentTests: TestItem[] = [
  { name: 'Matematika — Algebra', meta: 'Bugun · 12:34 · 13:47 daqiqa', score: '9/10', pct: '90%', level: 'high', icon: IconMathFunction, iconColor: 'var(--teal)', iconBg: 'var(--teal-dim)', iconBorder: 'var(--teal-border)' },
  { name: 'Ingliz tili — Grammar', meta: 'Kecha · 19:12 · 11:20 daqiqa', score: '7/10', pct: '70%', level: 'mid', icon: IconLanguage, iconColor: 'var(--amber)', iconBg: 'var(--amber-dim)', iconBorder: 'rgba(251,191,36,.3)' },
  { name: 'Fizika — Mexanika', meta: '22-may · 15:45 · 14:55 daqiqa', score: '6/10', pct: '60%', level: 'mid', icon: IconAtom, iconColor: 'var(--purple)', iconBg: 'var(--purple-dim)', iconBorder: 'rgba(129,140,248,.3)' },
  { name: 'Kimyo — Kimyoviy reaksiyalar', meta: '21-may · 10:20 · 10:05 daqiqa', score: '4/10', pct: '40%', level: 'low', icon: IconFlask, iconColor: 'var(--red)', iconBg: 'var(--red-dim)', iconBorder: 'rgba(248,113,113,.3)' },
];

const progressItems: ProgressItem[] = [
  { name: 'Ingliz tili', pct: 82, color: 'var(--amber)' },
  { name: 'Matematika', pct: 68, color: 'var(--teal)' },
  { name: 'Fizika', pct: 45, color: 'var(--purple)' },
  { name: 'Kimyo', pct: 31, color: 'var(--red)' },
];

const aiReplies = [
  "Algebrada eng muhim mavzu — diskriminant. D = b²−4ac formulasini yaxshi biling!",
  "DTM da trigonometriya savollaridan 3-4 ta keladi. sin²x + cos²x = 1 ni unutmang.",
  "Kimyo bo'yicha molyar massa = atom massalari yig'indisi. Masalan, H₂O = 2+16 = 18 g/mol.",
  "Fizikada Nyuton 2-qonuni: F = ma. Kuch, massa va tezlanish o'rtasidagi bog'liqlik.",
  "Bu mavzuni tushunish uchun avval asosiy formulalarni yod oling, keyin misollar ishlang!",
];

const statusStyles: Record<string, { bg: string; color: string; label: string }> = {
  done: { bg: 'var(--green-dim)', color: 'var(--green)', label: 'Bajarildi' },
  prog: { bg: 'var(--amber-dim)', color: 'var(--amber)', label: 'Jarayonda' },
  new: { bg: 'rgba(255,255,255,.05)', color: 'var(--text3)', label: 'Boshlanmagan' },
};

const scoreColorMap: Record<string, string> = {
  high: 'var(--green)',
  mid: 'var(--amber)',
  low: 'var(--red)',
};

// ── COUNTDOWN HOOK ──
function useCountdown(targetDate: Date) {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0 });

  useEffect(() => {
    const update = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return;
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
      });
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, [targetDate]);

  return time;
}

// ── STREAK CALENDAR ──
function StreakCalendar() {
  const today = 23;
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const labels = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];

  const getDayClass = (d: number) => {
    if (d === today) return 'today';
    if (d >= 12 && d < today) return 'done';
    if (d === 9 || d === 10) return 'missed';
    if (d < 12) return 'done';
    return '';
  };

  const dayStyles: Record<string, React.CSSProperties> = {
    today: { background: 'var(--teal)', color: '#07090F', fontWeight: 700 },
    done: { background: 'var(--teal-dim)', color: 'var(--teal)', fontWeight: 500 },
    missed: { background: 'var(--red-dim)', color: 'var(--text3)' },
    '': { background: 'rgba(255,255,255,.04)', color: 'var(--text3)' },
  };

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5, marginBottom: 6 }}>
        {labels.map((l) => (
          <div key={l} style={{ fontSize: 9, color: 'var(--text3)', textAlign: 'center', fontWeight: 500 }}>{l}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5 }}>
        {days.map((d) => {
          const cls = getDayClass(d);
          return (
            <div
              key={d}
              style={{
                height: 28,
                borderRadius: 5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 9,
                ...dayStyles[cls],
              }}
            >
              {d}
            </div>
          );
        })}
      </div>
    </>
  );
}

// ── MAIN DASHBOARD ──
const Dashboard = () => {
  const dtmDate = new Date('2026-07-09T09:00:00');
  const { days, hours, mins } = useCountdown(dtmDate);

  // Chat state
  const [messages, setMessages] = useState([
    { role: 'ai' as const, text: 'Salom Kumush! Bugun qaysi mavzuda yordam kerak? 📚' },
    { role: 'user' as const, text: 'Kvadrat tenglama formulasini tushuntir' },
    { role: 'ai' as const, text: 'Kvadrat tenglama: **ax² + bx + c = 0**\n\nx = (−b ± √(b²−4ac)) / 2a\n\nDiskriminant D = b²−4ac. D>0 bo\'lsa 2 ta yechim bor. DTM da bu turdagi savollar ko\'p!' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const replyIdx = useRef(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', text: chatInput.trim() }]);
    setChatInput('');
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'ai', text: aiReplies[replyIdx.current % aiReplies.length] }]);
      replyIdx.current++;
    }, 600);
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ minWidth: 0 }}>
      {/* TOPBAR */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: '18px 28px',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(7,9,15,0.8)',
          backdropFilter: 'blur(8px)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div className="flex flex-col gap-0.5">
          <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)' }}>
            Assalomu alaykum, <span style={{ color: 'var(--teal)' }}>Kumush</span> 👋
          </div>
          <div className="flex items-center gap-1.5" style={{ fontSize: 12, color: 'var(--text3)' }}>
            <span>Juma, 23-may 2026</span>
            <span>·</span>
            <div
              className="flex items-center gap-1.5 font-medium"
              style={{
                background: 'var(--red-dim)',
                border: '1px solid rgba(248,113,113,0.2)',
                borderRadius: 20,
                padding: '3px 10px',
                fontSize: 11,
                color: 'var(--red)',
              }}
            >
              <IconCalendarEvent size={12} /> DTM — {days} kun qoldi
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center gap-1.5 font-medium cursor-pointer"
            style={{
              background: 'var(--amber-dim)',
              border: '1px solid rgba(251,191,36,0.2)',
              borderRadius: 20,
              padding: '6px 14px',
              fontSize: 12,
              color: 'var(--amber)',
            }}
          >
            <IconFlame size={14} /> 12 kunlik streak!
          </div>
          <div
            className="flex items-center justify-center cursor-pointer relative"
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--r-sm)',
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
            }}
          >
            <IconBell size={17} style={{ color: 'var(--text2)' }} />
            <div
              style={{
                position: 'absolute',
                top: 7,
                right: 7,
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--red)',
                border: '1.5px solid var(--bg2)',
              }}
            />
          </div>
          <div
            className="flex items-center justify-center text-white font-semibold cursor-pointer"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--teal), var(--purple))',
              fontSize: 14,
            }}
          >
            K
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: '24px 28px' }}>
        {/* DTM COUNTDOWN */}
        <div
          className="flex items-center gap-6"
          style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r)',
            padding: 20,
            marginBottom: 24,
          }}
        >
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--r)',
              background: 'var(--red-dim)',
              border: '1px solid rgba(248,113,113,.3)',
            }}
          >
            <IconAlarm size={22} style={{ color: 'var(--red)' }} />
          </div>
          <div className="flex-1">
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>
              DTM imtihoni yaqinlashmoqda
            </div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>
              Har kuni o'qish natijalarga bevosita ta'sir qiladi
            </div>
          </div>
          <div className="flex gap-4">
            {[
              { val: days, label: 'KUN' },
              { val: String(hours).padStart(2, '0'), label: 'SOAT' },
              { val: String(mins).padStart(2, '0'), label: 'DAQIQA' },
            ].map((c) => (
              <div key={c.label} className="text-center">
                <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--red)', fontFamily: "'DM Serif Display', serif", lineHeight: 1 }}>
                  {c.val}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>{c.label}</div>
              </div>
            ))}
          </div>
          <button
            className="flex items-center gap-1 font-semibold cursor-pointer whitespace-nowrap"
            style={{
              background: 'var(--red-dim)',
              border: '1px solid rgba(248,113,113,.3)',
              borderRadius: 'var(--r-sm)',
              padding: '8px 18px',
              fontSize: 12,
              color: 'var(--red)',
              transition: 'all 0.2s',
            }}
          >
            <IconPlayerPlay size={13} /> Test boshlash
          </button>
        </div>

        {/* STATS ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="cursor-pointer"
                style={{
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r)',
                  padding: '18px 20px',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 'var(--r-sm)',
                      background: s.iconBg,
                      border: `1px solid ${s.iconBorder}`,
                    }}
                  >
                    <Icon size={17} style={{ color: s.iconColor }} />
                  </div>
                  <div className="flex items-center gap-1 font-medium" style={{ fontSize: 11, color: s.trendColor }}>
                    <IconTrendingUp size={12} /> {s.trend}
                  </div>
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.5px', marginBottom: 3, fontFamily: "'DM Serif Display', serif" }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text3)' }}>{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* FANLAR + AI TUTOR */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 24 }}>
          {/* LEFT: FANLAR */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
            {/* Header */}
            <div className="flex items-center justify-between" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Fanlar va progress</div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>Davom ettirish uchun bosing</div>
              </div>
              <div className="flex items-center gap-1 cursor-pointer" style={{ fontSize: 12, color: 'var(--teal)' }}>
                Barchasi <IconArrowRight size={14} />
              </div>
            </div>

            {/* Subjects Grid */}
            <div style={{ padding: '16px 20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {subjects.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div
                      key={s.variant}
                      className="cursor-pointer"
                      style={{
                        borderRadius: 'var(--r-sm)',
                        padding: 14,
                        background: `linear-gradient(135deg, ${s.dimBg}, ${s.dimBg.replace('0.08', '0.03')})`,
                        border: '1px solid transparent',
                        transition: 'all 0.2s',
                        overflow: 'hidden',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = s.borderHover;
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                        <div
                          className="flex items-center justify-center"
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 'var(--r-sm)',
                            background: s.color.replace(')', ',0.12)').replace('var(', 'var('),
                          }}
                        >
                          <Icon size={16} style={{ color: s.color }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: s.color }}>{s.pct}%</span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 10 }}>{s.meta}</div>
                      <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${s.pct}%`, background: s.color, borderRadius: 2, transition: 'width 0.6s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Topic List */}
            <div className="flex items-center justify-between" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Matematika — Mavzular</div>
              <div className="flex items-center gap-1 cursor-pointer" style={{ fontSize: 12, color: 'var(--teal)' }}>
                Barchasi <IconArrowRight size={14} />
              </div>
            </div>
            <div className="flex flex-col">
              {topics.map((t, i) => {
                const st = statusStyles[t.status];
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 cursor-pointer"
                    style={{
                      padding: '11px 20px',
                      borderBottom: i < topics.length - 1 ? '1px solid var(--border)' : 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg3)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.dotColor, flexShrink: 0 }} />
                    <div style={{ fontSize: 13, color: 'var(--text)', flex: 1 }}>{t.name}</div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 20,
                        background: st.bg,
                        color: st.color,
                      }}
                    >
                      {st.label}
                    </span>
                    <div style={{ fontSize: 12, fontWeight: 600, color: t.status === 'new' ? 'var(--text2)' : t.dotColor, minWidth: 40, textAlign: 'right' }}>
                      {t.score}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-5">
            {/* AI TUTOR */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {/* AI Header */}
              <div className="flex items-center gap-2.5" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'var(--teal-dim)',
                    border: '1px solid var(--teal-border)',
                  }}
                >
                  <IconBrain size={17} style={{ color: 'var(--teal)' }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>AI Tutor</div>
                  <div className="flex items-center gap-1.5" style={{ fontSize: 11, color: 'var(--teal)' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', animation: 'pulse-dot 2s infinite' }} />
                    Faol
                  </div>
                </div>
                <div
                  className="flex items-center gap-1"
                  style={{
                    marginLeft: 'auto',
                    background: 'var(--purple-dim)',
                    border: '1px solid rgba(129,140,248,.3)',
                    borderRadius: 20,
                    padding: '3px 10px',
                    fontSize: 10,
                    color: 'var(--purple)',
                    fontWeight: 500,
                  }}
                >
                  <IconSparkles size={10} /> GPT-4o
                </div>
              </div>

              {/* Chat Messages */}
              <div
                className="flex flex-col gap-3"
                style={{ flex: 1, padding: '14px 16px', maxHeight: 240, overflowY: 'auto' }}
              >
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className="flex gap-2 items-start"
                    style={{ flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}
                  >
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        fontSize: 10,
                        fontWeight: 600,
                        ...(msg.role === 'ai'
                          ? { background: 'var(--teal-dim)', border: '1px solid var(--teal-border)', color: 'var(--teal)' }
                          : { background: 'var(--purple-dim)', border: '1px solid rgba(129,140,248,.3)', color: 'var(--purple)' }),
                      }}
                    >
                      {msg.role === 'ai' ? 'AI' : 'K'}
                    </div>
                    <div
                      style={{
                        padding: '9px 13px',
                        borderRadius: 10,
                        fontSize: 12,
                        lineHeight: 1.6,
                        maxWidth: '80%',
                        whiteSpace: 'pre-wrap',
                        ...(msg.role === 'ai'
                          ? { background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text2)' }
                          : { background: 'var(--purple-dim)', border: '1px solid rgba(129,140,248,.2)', color: 'var(--text)' }),
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="flex gap-2" style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                  placeholder="Savol yozing..."
                  style={{
                    flex: 1,
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--r-sm)',
                    padding: '8px 12px',
                    fontSize: 12,
                    color: 'var(--text)',
                    fontFamily: "'DM Sans', sans-serif",
                    outline: 'none',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--teal-border)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                />
                <button
                  onClick={sendChat}
                  className="flex items-center justify-center flex-shrink-0 cursor-pointer"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 'var(--r-sm)',
                    background: 'var(--teal)',
                    border: 'none',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                >
                  <IconSend size={15} color="#07090F" />
                </button>
              </div>
            </div>

            {/* STREAK CALENDAR */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
              <div className="flex items-center justify-between" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>May 2026</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>12 kunlik streak 🔥</div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--amber)', fontFamily: "'DM Serif Display', serif" }}>
                  12 <span style={{ fontSize: 12, color: 'var(--text3)', fontFamily: "'DM Sans', sans-serif" }}>kun</span>
                </div>
              </div>
              <div style={{ padding: '16px 20px' }}>
                <StreakCalendar />
              </div>
            </div>

            {/* AI RECOMMENDATIONS */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
              <div className="flex items-center justify-between" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>AI tavsiya</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>Zaif mavzular</div>
                </div>
              </div>
              <div style={{ padding: '12px 16px' }}>
                <div className="flex flex-col gap-2.5">
                  {/* Rec 1 */}
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    style={{
                      padding: '12px 14px',
                      background: 'var(--bg3)',
                      borderRadius: 'var(--r-sm)',
                      border: '1px solid transparent',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.borderColor = 'transparent'; }}
                  >
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 'var(--r-sm)',
                        background: 'var(--red-dim)',
                        border: '1px solid rgba(248,113,113,.3)',
                      }}
                    >
                      <IconFlask size={16} style={{ color: 'var(--red)' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>Kimyo — Molyar massa</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)' }}>31% progress · O'rganilmagan</div>
                    </div>
                    <IconArrowRight size={16} style={{ marginLeft: 'auto', color: 'var(--text3)' }} />
                  </div>
                  {/* Rec 2 */}
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    style={{
                      padding: '12px 14px',
                      background: 'var(--bg3)',
                      borderRadius: 'var(--r-sm)',
                      border: '1px solid transparent',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.borderColor = 'transparent'; }}
                  >
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 'var(--r-sm)',
                        background: 'var(--amber-dim)',
                        border: '1px solid rgba(251,191,36,.3)',
                      }}
                    >
                      <IconMathFunction size={16} style={{ color: 'var(--amber)' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>Matematika — Logarifm</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)' }}>Boshlanmagan · 5 savol bor</div>
                    </div>
                    <IconArrowRight size={16} style={{ marginLeft: 'auto', color: 'var(--text3)' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RECENT TESTS + FULL PROGRESS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}>
          {/* RECENT TESTS */}
          <div style={{ gridColumn: 'span 2', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
            <div className="flex items-center justify-between" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>So'nggi testlar</div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>Natijalar va tahlil</div>
              </div>
              <div className="flex items-center gap-1 cursor-pointer" style={{ fontSize: 12, color: 'var(--teal)' }}>
                Barchasi <IconArrowRight size={14} />
              </div>
            </div>
            <div style={{ padding: '16px 20px' }}>
              <div className="flex flex-col gap-2.5">
                {recentTests.map((t, i) => {
                  const Icon = t.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3.5 cursor-pointer"
                      style={{
                        padding: '12px 14px',
                        background: 'var(--bg3)',
                        borderRadius: 'var(--r-sm)',
                        border: '1px solid transparent',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.borderColor = 'transparent'; }}
                    >
                      <div
                        className="flex items-center justify-center flex-shrink-0"
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 'var(--r-sm)',
                          background: t.iconBg,
                          border: `1px solid ${t.iconBorder}`,
                        }}
                      >
                        <Icon size={17} style={{ color: t.iconColor }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>{t.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text3)' }}>{t.meta}</div>
                      </div>
                      <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                        <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'DM Serif Display', serif", color: scoreColorMap[t.level] }}>
                          {t.score}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text3)' }}>{t.pct}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* FULL PROGRESS */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
            <div className="flex items-center justify-between" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Umumiy progress</div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>Fanlar bo'yicha</div>
              </div>
            </div>
            <div style={{ padding: '16px 20px' }}>
              {progressItems.map((p, i) => (
                <div key={p.name} style={{ marginBottom: i < progressItems.length - 1 ? 16 : 0 }}>
                  <div className="flex justify-between items-center" style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{p.name}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: p.color }}>{p.pct}%</div>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,.05)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${p.pct}%`, background: p.color, borderRadius: 3, transition: 'width 0.8s cubic-bezier(.4,0,.2,1)' }} />
                  </div>
                </div>
              ))}

              {/* Overall */}
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <div className="flex justify-between items-center" style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 12, color: 'var(--text3)' }}>Umumiy progress</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', fontFamily: "'DM Serif Display', serif" }}>57%</div>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,.05)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '57%', background: 'linear-gradient(90deg, var(--teal), var(--purple))', borderRadius: 3 }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
