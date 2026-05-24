import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { message } from 'antd';
import {
  IconBrain,
  IconCalendarStats,
  IconChartBar,
  IconClock,
  IconFlame,
  IconHistory,
  IconRefresh,
  IconSend,
  IconTargetArrow,
  IconTrophy,
} from '@tabler/icons-react';
import { useAuth } from '../../hooks/useAuth';
import { dashboardService } from '../../services/dashboard';
import { chatService } from '../../services/chat';
import { getSubjectColor } from '../../utils/subjectColors';
import type { DashboardData, QuizAttempt, Recommendation, StreakDay, SubjectProgress } from '../../types';

const cardStyle: React.CSSProperties = {
  background: 'var(--bg2)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--r)',
};

function formatDate(date: string | null) {
  if (!date) return "Noma'lum";
  return new Intl.DateTimeFormat('uz-UZ', { day: '2-digit', month: 'short' }).format(new Date(date));
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  return (
    <div style={{ ...cardStyle, padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 'var(--r-sm)', background: 'var(--bg3)', display: 'grid', placeItems: 'center', color }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', fontFamily: "'DM Serif Display', serif" }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>{label}</div>
    </div>
  );
}

function SubjectsGrid({ subjects }: { subjects: SubjectProgress[] }) {
  return (
    <div style={{ ...cardStyle, padding: 20 }}>
      <SectionTitle icon={<IconChartBar size={17} />} title="Fanlar progressi" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        {subjects.map((subject) => {
          const colors = getSubjectColor(subject.subject_name);
          return (
            <Link key={subject.subject_id} to={`/topics?subject=${subject.subject_id}`} style={{ border: `1px solid ${colors.border}`, background: colors.dim, borderRadius: 'var(--r-sm)', padding: 14, textDecoration: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
                <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: 14 }}>{subject.subject_name}</div>
                <div style={{ color: colors.color, fontWeight: 800, fontSize: 13 }}>{subject.percentage}%</div>
              </div>
              <div style={{ height: 6, borderRadius: 4, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                <div style={{ width: `${subject.percentage}%`, height: '100%', background: colors.color }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, color: 'var(--text3)', fontSize: 12 }}>
                <span>{subject.completed_topics}/{subject.total_topics} mavzu</span>
                <span>{subject.avg_score}% avg</span>
              </div>
            </Link>
          );
        })}
        {subjects.length === 0 && <EmptyText text="Hali fanlar biriktirilmagan." />}
      </div>
    </div>
  );
}

function RecommendationsList({ recommendations }: { recommendations: Recommendation[] }) {
  return (
    <div style={{ ...cardStyle, padding: 20 }}>
      <SectionTitle icon={<IconTargetArrow size={17} />} title="Tavsiya etilgan mavzular" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {recommendations.map((item) => {
          const colors = getSubjectColor(item.subject_name);
          return (
            <Link key={item.topic_id} to={`/mock-testlar?topic=${item.topic_id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'var(--bg3)', textDecoration: 'none' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors.color, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.topic_title}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>{item.subject_name} · {item.reason}</div>
              </div>
              <div style={{ fontSize: 12, color: colors.color, fontWeight: 700 }}>{item.best_score ?? 0}%</div>
            </Link>
          );
        })}
        {recommendations.length === 0 && <EmptyText text="Hozircha tavsiyalar yo'q." />}
      </div>
    </div>
  );
}

function RecentTests({ attempts }: { attempts: QuizAttempt[] }) {
  return (
    <div style={{ ...cardStyle, padding: 20 }}>
      <SectionTitle icon={<IconHistory size={17} />} title="So'nggi testlar" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {attempts.map((attempt) => {
          const percentage = attempt.total ? Math.round((attempt.score / attempt.total) * 100) : 0;
          return (
            <Link key={attempt.id} to={`/history`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'var(--bg3)', textDecoration: 'none' }}>
              <div style={{ width: 42, height: 42, borderRadius: 'var(--r-sm)', background: percentage >= 70 ? 'var(--green-dim)' : percentage >= 40 ? 'var(--amber-dim)' : 'var(--red-dim)', display: 'grid', placeItems: 'center', color: percentage >= 70 ? 'var(--green)' : percentage >= 40 ? 'var(--amber)' : 'var(--red)', fontWeight: 800 }}>
                {percentage}%
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{attempt.topic?.title ?? 'Test'}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>{formatDate(attempt.completed_at)} · {attempt.score}/{attempt.total} to'g'ri</div>
              </div>
            </Link>
          );
        })}
        {attempts.length === 0 && <EmptyText text="Hali test yechilmagan." />}
      </div>
    </div>
  );
}

function StreakCalendar({ days }: { days: StreakDay[] }) {
  return (
    <div style={{ ...cardStyle, padding: 20 }}>
      <SectionTitle icon={<IconCalendarStats size={17} />} title="Faollik kalendari" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 7 }}>
        {days.slice(-30).map((day) => (
          <div key={day.date} title={`${day.date}: ${day.quizzes_done} test`} style={{ aspectRatio: '1', borderRadius: 6, background: day.active ? 'var(--teal)' : 'var(--bg3)', border: '1px solid var(--border)', opacity: day.active ? 1 : 0.7 }} />
        ))}
      </div>
      {days.length === 0 && <EmptyText text="Faollik ma'lumotlari hali yo'q." />}
    </div>
  );
}

function DashboardChat() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isSending, setIsSending] = useState(false);

  const ask = async () => {
    if (!question.trim() || isSending) return;
    setIsSending(true);
    try {
      const response = await chatService.askTutor(question.trim());
      setAnswer(response.answer);
      setQuestion('');
    } catch {
      message.error('AI Tutor javob bermadi');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ ...cardStyle, padding: 20 }}>
      <SectionTitle icon={<IconBrain size={17} />} title="Tezkor AI yordam" />
      <div style={{ minHeight: 92, border: '1px solid var(--border)', background: 'var(--bg3)', borderRadius: 'var(--r-sm)', padding: 12, color: answer ? 'var(--text2)' : 'var(--text3)', fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: 12 }}>
        {answer || "Savol yozing, Tutor qisqa javob beradi."}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && ask()} placeholder="Masalan: logarifm nima?" style={{ flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '10px 12px', color: 'var(--text)', outline: 'none' }} />
        <button onClick={ask} disabled={!question.trim() || isSending} style={{ width: 42, border: 0, borderRadius: 'var(--r-sm)', background: 'var(--purple)', color: '#fff', display: 'grid', placeItems: 'center', cursor: question.trim() ? 'pointer' : 'not-allowed', opacity: question.trim() ? 1 : 0.5 }}>
          <IconSend size={17} />
        </button>
      </div>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: 'var(--text)' }}>
      <span style={{ color: 'var(--teal)', display: 'grid', placeItems: 'center' }}>{icon}</span>
      <span style={{ fontWeight: 700, fontSize: 14 }}>{title}</span>
    </div>
  );
}

function EmptyText({ text }: { text: string }) {
  return <div style={{ color: 'var(--text3)', fontSize: 13, padding: 12 }}>{text}</div>;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      setData(await dashboardService.getStudentDashboard());
    } catch {
      message.error("Dashboard ma'lumotlari yuklanmadi");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const safeSubjects = Array.isArray(data?.subjects_progress) ? data.subjects_progress : [];
  const safeRecommendations = Array.isArray(data?.recommendations) ? data.recommendations : [];
  const safeAttempts = Array.isArray(data?.recent_attempts) ? data.recent_attempts : [];
  const safeCalendar = Array.isArray(data?.streak_calendar) ? data.streak_calendar : [];

  const avgSubjects = useMemo(() => {
    if (!safeSubjects.length) return 0;
    return Math.round(safeSubjects.reduce((sum, subject) => sum + subject.percentage, 0) / safeSubjects.length);
  }, [safeSubjects]);

  if (isLoading) {
    return <div style={{ flex: 1, display: 'grid', placeItems: 'center', color: 'var(--text2)' }}>Dashboard yuklanmoqda...</div>;
  }

  if (!data) {
    return (
      <div style={{ flex: 1, display: 'grid', placeItems: 'center', color: 'var(--text2)' }}>
        <button onClick={loadDashboard} style={{ background: 'var(--teal)', border: 0, borderRadius: 'var(--r-sm)', padding: '10px 16px', color: '#07100f', fontWeight: 700, cursor: 'pointer' }}>
          Qayta yuklash
        </button>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 28px', borderBottom: '1px solid var(--border)', background: 'rgba(7,9,15,0.86)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 5 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 3 }}>Dashboard</div>
          <div style={{ fontSize: 22, color: 'var(--text)', fontWeight: 800 }}>Assalomu alaykum, {user?.firstname ?? 'abituriyent'}</div>
        </div>
        <button onClick={loadDashboard} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '9px 12px', color: 'var(--text2)', cursor: 'pointer' }}>
          <IconRefresh size={16} /> Yangilash
        </button>
      </div>

      <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          <StatCard label="Yechilgan testlar" value={data.total_quizzes} color="var(--teal)" icon={<IconTrophy size={19} />} />
          <StatCard label="O'rtacha natija" value={`${data.avg_score}%`} color="var(--purple)" icon={<IconChartBar size={19} />} />
          <StatCard label="Kunlik streak" value={data.current_streak} color="var(--amber)" icon={<IconFlame size={19} />} />
          <StatCard label="DTMgacha kun" value={data.days_until_dtm} color="var(--green)" icon={<IconClock size={19} />} />
          <StatCard label="Fanlar progressi" value={`${avgSubjects}%`} color="var(--red)" icon={<IconTargetArrow size={19} />} />
        </div>

        <SubjectsGrid subjects={safeSubjects} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
          <RecommendationsList recommendations={safeRecommendations} />
          <DashboardChat />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
          <RecentTests attempts={safeAttempts} />
          <StreakCalendar days={safeCalendar} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
