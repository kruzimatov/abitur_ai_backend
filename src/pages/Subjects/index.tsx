import { Link } from 'react-router-dom';
import {
  IconBooks,
  IconMathFunction,
  IconAtom,
  IconLanguage,
  IconFlask,
  IconArrowRight,
  IconSearch,
} from '@tabler/icons-react';

const subjects = [
  { id: 'math', name: 'Matematika', icon: IconMathFunction, color: 'var(--teal)', dim: 'var(--teal-dim)', border: 'var(--teal-border)', topics: 24, questions: 340, progress: 68, lastActivity: 'Bugun' },
  { id: 'physics', name: 'Fizika', icon: IconAtom, color: 'var(--purple)', dim: 'var(--purple-dim)', border: 'rgba(129,140,248,0.3)', topics: 18, questions: 210, progress: 45, lastActivity: 'Kecha' },
  { id: 'english', name: 'Ingliz tili', icon: IconLanguage, color: 'var(--amber)', dim: 'var(--amber-dim)', border: 'rgba(251,191,36,0.3)', topics: 20, questions: 280, progress: 52, lastActivity: '2 kun oldin' },
  { id: 'chemistry', name: 'Kimyo', icon: IconFlask, color: 'var(--red)', dim: 'var(--red-dim)', border: 'rgba(248,113,113,0.3)', topics: 16, questions: 190, progress: 30, lastActivity: '3 kun oldin' },
];

const Subjects = () => {
  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 28px', borderBottom: '1px solid var(--border)', background: 'rgba(7,9,15,0.8)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <IconBooks size={20} style={{ color: 'var(--teal)' }} />
          <div>
            <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)' }}>Fanlar</div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>{subjects.length} ta fan · {subjects.reduce((a, s) => a + s.topics, 0)} mavzu</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '7px 12px' }}>
          <IconSearch size={15} style={{ color: 'var(--text3)' }} />
          <input placeholder="Qidirish..." style={{ background: 'none', border: 'none', outline: 'none', fontSize: 12, color: 'var(--text)', fontFamily: "'DM Sans', sans-serif", width: 140 }} />
        </div>
      </div>

      <div style={{ padding: '24px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 32 }}>
          {subjects.map((s) => {
            const Icon = s.icon;
            return (
              <Link key={s.id} to={`/topics?subject=${s.id}`} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, textDecoration: 'none', transition: 'border-color 0.2s', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = s.border; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.color, borderRadius: '16px 16px 0 0' }} />
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 'var(--r)', background: s.dim, border: `1px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={24} style={{ color: s.color }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text3)' }}>{s.topics} mavzu · {s.questions} savol</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>{s.lastActivity}</div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                    <span style={{ color: 'var(--text3)' }}>Progress</span>
                    <span style={{ color: s.color, fontWeight: 600 }}>{s.progress}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${s.progress}%`, background: s.color, borderRadius: 3, transition: 'width 1s ease' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ background: s.dim, borderRadius: 20, padding: '4px 10px', fontSize: 11, color: s.color, fontWeight: 500 }}>{s.topics} mavzu</div>
                    <div style={{ background: 'var(--bg3)', borderRadius: 20, padding: '4px 10px', fontSize: 11, color: 'var(--text3)' }}>{s.questions} savol</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: s.color, fontWeight: 500 }}>
                    Mavzular <IconArrowRight size={14} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            { label: 'Jami mavzular', value: '78', color: 'var(--teal)' },
            { label: 'Jami savollar', value: '1,020', color: 'var(--purple)' },
            { label: "O'rtacha progress", value: '49%', color: 'var(--amber)' },
            { label: 'Yechilgan testlar', value: '34', color: 'var(--green)' },
          ].map((stat, i) => (
            <div key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '18px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: stat.color, fontFamily: "'DM Serif Display', serif", letterSpacing: '-0.5px' }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subjects;
