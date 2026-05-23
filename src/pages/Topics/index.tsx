import { Link } from 'react-router-dom';
import {
  IconClipboardList,
  IconSearch,
  IconCheck,
  IconLock,
  IconPlayerPlay,
  IconArrowRight,
} from '@tabler/icons-react';

const topicsList = [
  { id: 1, name: 'Tenglamalar', questionsCount: 25, progress: 100, status: 'completed' as const, difficulty: 'Oson' },
  { id: 2, name: 'Tengsizliklar', questionsCount: 20, progress: 80, status: 'in-progress' as const, difficulty: 'Oson' },
  { id: 3, name: 'Kvadrat tenglamalar', questionsCount: 30, progress: 65, status: 'in-progress' as const, difficulty: "O'rta" },
  { id: 4, name: 'Logarifm va darajalar', questionsCount: 28, progress: 40, status: 'in-progress' as const, difficulty: "O'rta" },
  { id: 5, name: 'Trigonometriya asoslari', questionsCount: 35, progress: 20, status: 'in-progress' as const, difficulty: "O'rta" },
  { id: 6, name: 'Trigonometrik tenglamalar', questionsCount: 22, progress: 0, status: 'locked' as const, difficulty: 'Qiyin' },
  { id: 7, name: 'Geometriya — uchburchaklar', questionsCount: 18, progress: 0, status: 'locked' as const, difficulty: "O'rta" },
  { id: 8, name: 'Geometriya — aylanalar', questionsCount: 20, progress: 0, status: 'locked' as const, difficulty: 'Qiyin' },
  { id: 9, name: 'Funktsiyalar va grafiklar', questionsCount: 32, progress: 0, status: 'locked' as const, difficulty: 'Qiyin' },
  { id: 10, name: 'Arifmetik va geometrik progressiya', questionsCount: 15, progress: 0, status: 'locked' as const, difficulty: "O'rta" },
];

const difficultyColors: Record<string, { bg: string; color: string }> = {
  'Oson': { bg: 'var(--green-dim)', color: 'var(--green)' },
  "O'rta": { bg: 'var(--amber-dim)', color: 'var(--amber)' },
  'Qiyin': { bg: 'var(--red-dim)', color: 'var(--red)' },
};

const Topics = () => {
  const completedCount = topicsList.filter((t) => t.status === 'completed').length;
  const inProgressCount = topicsList.filter((t) => t.status === 'in-progress').length;

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 28px', borderBottom: '1px solid var(--border)', background: 'rgba(7,9,15,0.8)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ClipboardIcon />
          <div>
            <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)' }}>Mavzular</div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>Matematika · {topicsList.length} mavzu</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '7px 12px' }}>
            <IconSearch size={15} style={{ color: 'var(--text3)' }} />
            <input placeholder="Mavzu qidirish..." style={{ background: 'none', border: 'none', outline: 'none', fontSize: 12, color: 'var(--text)', fontFamily: "'DM Sans', sans-serif", width: 140 }} />
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 28px' }}>
        {/* Stats strip */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <div style={{ background: 'var(--green-dim)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 20, padding: '5px 14px', fontSize: 12, color: 'var(--green)', fontWeight: 500 }}>
            <IconCheck size={12} style={{ marginRight: 4 }} /> {completedCount} bajarildi
          </div>
          <div style={{ background: 'var(--teal-dim)', border: '1px solid var(--teal-border)', borderRadius: 20, padding: '5px 14px', fontSize: 12, color: 'var(--teal)', fontWeight: 500 }}>
            {inProgressCount} davom etmoqda
          </div>
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 20, padding: '5px 14px', fontSize: 12, color: 'var(--text3)' }}>
            {topicsList.length - completedCount - inProgressCount} qulflangan
          </div>
        </div>

        {/* Topic list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {topicsList.map((topic) => {
            const dc = difficultyColors[topic.difficulty] || difficultyColors["O'rta"];
            const isLocked = topic.status === 'locked';
            const isCompleted = topic.status === 'completed';

            return (
              <div
                key={topic.id}
                style={{
                  background: 'var(--bg2)',
                  border: `1px solid ${isCompleted ? 'rgba(52,211,153,0.2)' : 'var(--border)'}`,
                  borderRadius: 'var(--r)',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  opacity: isLocked ? 0.5 : 1,
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  transition: 'border-color 0.2s',
                  borderLeft: isCompleted ? '3px solid var(--green)' : topic.status === 'in-progress' ? '3px solid var(--teal)' : '3px solid transparent',
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 'var(--r-sm)', background: isCompleted ? 'var(--green-dim)' : isLocked ? 'var(--bg3)' : 'var(--teal-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {isCompleted ? (
                    <IconCheck size={17} style={{ color: 'var(--green)' }} />
                  ) : isLocked ? (
                    <IconLock size={17} style={{ color: 'var(--text3)' }} />
                  ) : (
                    <IconPlayerPlay size={17} style={{ color: 'var(--teal)' }} />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: isLocked ? 'var(--text3)' : 'var(--text)' }}>{topic.name}</span>
                    <span style={{ background: dc.bg, color: dc.color, fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 10 }}>{topic.difficulty}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text3)' }}>{topic.questionsCount} savol</div>
                </div>

                {!isLocked && (
                  <div style={{ width: 120 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 11 }}>
                      <span style={{ color: 'var(--text3)' }}>Progress</span>
                      <span style={{ color: isCompleted ? 'var(--green)' : 'var(--teal)', fontWeight: 600 }}>{topic.progress}%</span>
                    </div>
                    <div style={{ height: 4, background: 'var(--bg3)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${topic.progress}%`, background: isCompleted ? 'var(--green)' : 'var(--teal)', borderRadius: 2 }} />
                    </div>
                  </div>
                )}

                {!isLocked && (
                  <Link to="/mock-testlar" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--teal)', fontWeight: 500, textDecoration: 'none' }}>
                    {isCompleted ? 'Qayta' : 'Boshlash'} <IconArrowRight size={14} />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function ClipboardIcon() {
  return <IconClipboardList size={20} style={{ color: 'var(--teal)' }} />;
}

export default Topics;
