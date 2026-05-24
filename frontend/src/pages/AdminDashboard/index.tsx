import { useEffect, useState } from 'react';
import { message } from 'antd';
import {
  IconUsers,
  IconBooks,
  IconClipboardList,
  IconQuestionMark,
  IconClipboardCheck,
  IconServer,
  IconBrain,
} from '@tabler/icons-react';
import { adminService, type AdminDashboardData } from '../../services/admin';
import { useAuth } from '../../hooks/useAuth';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await adminService.getDashboard();
        setDashboard(data);
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
          <IconServer size={48} style={{ color: 'var(--text3)', marginBottom: 12 }} />
          <div style={{ color: 'var(--text2)', fontSize: 15 }}>Ma'lumotlarni yuklash imkoni bo'lmadi</div>
          <div style={{ color: 'var(--text3)', fontSize: 13, marginTop: 4 }}>Iltimos qayta urinib ko'ring</div>
        </div>
      </div>
    );
  }

  const stats = [
    { icon: IconUsers, color: 'var(--teal)', dim: 'var(--teal-dim)', border: 'var(--teal-border)', value: dashboard.total_users, label: 'Foydalanuvchilar', sub: 'Barcha rollar' },
    { icon: IconBooks, color: 'var(--purple)', dim: 'var(--purple-dim)', border: 'rgba(129,140,248,0.3)', value: dashboard.total_subjects, label: 'Fanlar', sub: 'Faol fanlar' },
    { icon: IconClipboardList, color: 'var(--amber)', dim: 'var(--amber-dim)', border: 'rgba(251,191,36,0.3)', value: dashboard.total_topics, label: 'Mavzular', sub: 'Barcha fanlar' },
    { icon: IconQuestionMark, color: 'var(--green)', dim: 'var(--green-dim)', border: 'rgba(52,211,153,0.3)', value: dashboard.total_questions, label: 'Savollar', sub: "Test bazasi" },
    { icon: IconClipboardCheck, color: 'var(--red)', dim: 'var(--red-dim)', border: 'rgba(248,113,113,0.3)', value: dashboard.total_quiz_attempts, label: 'Test urinishlari', sub: "Jami o'tkazilgan" },
  ];

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ padding: '24px 28px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Admin paneli</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
          Assalomu alaykum, {user?.firstname}! 👋
        </div>
        <div style={{ fontSize: 14, color: 'var(--text2)' }}>
          Tizim holati: <span style={{ color: 'var(--green)', fontWeight: 600 }}>Faol</span>
        </div>
      </div>

      <div style={{ padding: '24px 28px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 28 }}>
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

        {/* System Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <IconBrain size={18} style={{ color: 'var(--teal)' }} />
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Tizim xizmatlari</div>
            </div>
            <div style={{ padding: '12px 0' }}>
              {[
                { name: 'Gemini AI', status: 'Faol', color: 'var(--green)' },
                { name: 'RAG Qidiruv', status: 'Faol', color: 'var(--green)' },
                { name: 'JWT Auth', status: 'Faol', color: 'var(--green)' },
                { name: "Ma'lumotlar bazasi", status: 'Faol', color: 'var(--green)' },
              ].map((service) => (
                <div key={service.name} style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, color: 'var(--text)' }}>{service.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: service.color }} />
                    <span style={{ fontSize: 12, color: service.color, fontWeight: 500 }}>{service.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <IconServer size={18} style={{ color: 'var(--purple)' }} />
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Tezkor ma'lumot</div>
            </div>
            <div style={{ padding: '12px 0' }}>
              {[
                { label: "O'rtacha test bali", value: dashboard.total_quiz_attempts > 0 ? 'Faol' : 'Hali yo\'q' },
                { label: 'Fan/Mavzu nisbati', value: dashboard.total_subjects > 0 ? `${(dashboard.total_topics / dashboard.total_subjects).toFixed(1)} mavzu/fan` : '—' },
                { label: 'Savol/Mavzu nisbati', value: dashboard.total_topics > 0 ? `${(dashboard.total_questions / dashboard.total_topics).toFixed(1)} savol/mavzu` : '—' },
                { label: 'Platform versiyasi', value: 'v1.0.0' },
              ].map((item) => (
                <div key={item.label} style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, color: 'var(--text2)' }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
