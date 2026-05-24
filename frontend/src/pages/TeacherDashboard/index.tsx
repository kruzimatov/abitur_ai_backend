import { useEffect, useState } from 'react';
import { message } from 'antd';
import {
  IconUsers,
  IconBooks,
  IconClipboardCheck,
  IconChartLine,
  IconTrophy,
  IconBrain,
} from '@tabler/icons-react';
import { teacherService, type TeacherDashboardData, type TeacherAnalytics } from '../../services/teacher';
import { useAuth } from '../../hooks/useAuth';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<TeacherDashboardData | null>(null);
  const [analytics, setAnalytics] = useState<TeacherAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [dash, anal] = await Promise.all([
          teacherService.getDashboard(),
          teacherService.getAnalytics(),
        ]);
        setDashboard(dash);
        setAnalytics(anal);
      } catch {
        message.error("Ma'lumotlarni yuklashda xato");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'grid', placeItems: 'center' }}>
        <div style={{ color: 'var(--text3)', fontSize: 14 }}>Yuklanmoqda...</div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div style={{ flex: 1, display: 'grid', placeItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <IconBrain size={48} style={{ color: 'var(--text3)', marginBottom: 12 }} />
          <div style={{ color: 'var(--text2)', fontSize: 15 }}>Fan biriktirilmagan</div>
          <div style={{ color: 'var(--text3)', fontSize: 13, marginTop: 4 }}>Admin sizga fan biriktirishi kerak</div>
        </div>
      </div>
    );
  }

  const stats = [
    { icon: IconUsers, color: 'var(--teal)', dim: 'var(--teal-dim)', border: 'var(--teal-border)', value: dashboard.active_students, label: 'Faol talabalar', sub: 'Oxirgi 30 kun' },
    { icon: IconBooks, color: 'var(--purple)', dim: 'var(--purple-dim)', border: 'rgba(129,140,248,0.3)', value: dashboard.total_topics, label: 'Mavzular', sub: dashboard.subject.name },
    { icon: IconClipboardCheck, color: 'var(--amber)', dim: 'var(--amber-dim)', border: 'rgba(251,191,36,0.3)', value: dashboard.total_questions, label: 'Savollar', sub: `${dashboard.total_attempts} urinish` },
    { icon: IconChartLine, color: 'var(--green)', dim: 'var(--green-dim)', border: 'rgba(52,211,153,0.3)', value: `${Math.round(dashboard.avg_score)}%`, label: "O'rtacha ball", sub: 'Barcha talabalar' },
  ];

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ padding: '24px 28px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>O'qituvchi paneli</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
          Assalomu alaykum, {user?.firstname}! 👋
        </div>
        <div style={{ fontSize: 14, color: 'var(--text2)' }}>
          Fan: <span style={{ color: 'var(--teal)', fontWeight: 600 }}>{dashboard.subject.name}</span>
        </div>
      </div>

      <div style={{ padding: '24px 28px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--r-sm)', background: s.dim, border: `1px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} style={{ color: s.color }} />
                  </div>
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)', fontFamily: "'DM Serif Display', serif" }}>{s.value}</div>
                <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{s.sub}</div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Topic Scores */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Mavzular bo'yicha natijalar</div>
            </div>
            <div style={{ padding: '8px 0' }}>
              {analytics?.topic_scores.length === 0 && (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>Hali test natijalari yo'q</div>
              )}
              {analytics?.topic_scores.map((ts) => {
                const scoreColor = ts.avg_score >= 70 ? 'var(--green)' : ts.avg_score >= 40 ? 'var(--amber)' : 'var(--red)';
                return (
                  <div key={ts.topic_id} style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{ts.topic_title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)' }}>{ts.unique_students} talaba · {ts.total_attempts} urinish</div>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: scoreColor, fontFamily: "'DM Mono', monospace" }}>
                      {Math.round(ts.avg_score)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Student Rankings */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Top talabalar</div>
              <IconTrophy size={18} style={{ color: 'var(--amber)' }} />
            </div>
            <div style={{ padding: '8px 0' }}>
              {analytics?.student_rankings.length === 0 && (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>Hali natijalar yo'q</div>
              )}
              {analytics?.student_rankings.map((sr, i) => (
                <div key={sr.user_id} style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border)' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0,
                    background: i === 0 ? 'var(--amber-dim)' : i === 1 ? 'var(--teal-dim)' : 'var(--bg3)',
                    color: i === 0 ? 'var(--amber)' : i === 1 ? 'var(--teal)' : 'var(--text3)',
                    border: `1px solid ${i === 0 ? 'rgba(251,191,36,0.3)' : i === 1 ? 'var(--teal-border)' : 'var(--border)'}`,
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{sr.firstname} {sr.lastname}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>{sr.total_tests} test</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--teal)', fontFamily: "'DM Mono', monospace" }}>
                    {Math.round(sr.avg_score)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
