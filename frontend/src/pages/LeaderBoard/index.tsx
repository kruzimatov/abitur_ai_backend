import { useEffect, useState } from 'react';
import { message } from 'antd';
import {
  IconChartBar,
  IconFlame,
  IconRefresh,
  IconTargetArrow,
  IconTrophy,
} from '@tabler/icons-react';
import { profileService } from '../../services/profile';
import { progressService } from '../../services/progress';
import { getSubjectColor } from '../../utils/subjectColors';
import { useAuth } from '../../hooks/useAuth';
import type { ProfileResponse, SubjectProgress } from '../../types';

const Leaderboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [subjects, setSubjects] = useState<SubjectProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    try {
      const [profileData, subjectData] = await Promise.all([
        profileService.getProfile(),
        progressService.getSubjectProgress(),
      ]);
      setProfile(profileData);
      setSubjects(Array.isArray(subjectData) ? subjectData : []);
    } catch {
      message.error("Ma'lumotlar yuklanmadi");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stats = profile?.stats;
  const avgProgress = subjects.length
    ? Math.round(subjects.reduce((s, item) => s + item.percentage, 0) / subjects.length)
    : 0;

  const sortedSubjects = [...subjects].sort((a, b) => b.percentage - a.percentage);

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 28px', borderBottom: '1px solid var(--border)', background: 'rgba(7,9,15,0.8)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <IconTrophy size={20} style={{ color: 'var(--amber)' }} />
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>Mening natijalarim</div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>Shaxsiy statistika va reyting</div>
          </div>
        </div>
        <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '8px 12px', color: 'var(--text2)', cursor: 'pointer' }}>
          <IconRefresh size={16} /> Yangilash
        </button>
      </div>

      <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {isLoading ? (
          <div style={{ color: 'var(--text2)' }}>Yuklanmoqda...</div>
        ) : (
          <>
            {/* Profile header */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: 28, display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, var(--teal), var(--purple))', display: 'grid', placeItems: 'center', fontSize: 22, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                {user?.firstname?.[0] ?? 'A'}{user?.lastname?.[0] ?? ''}
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', fontFamily: "'DM Serif Display', serif" }}>
                  {user?.firstname} {user?.lastname}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 4 }}>
                  {user?.field?.name ?? user?.email}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
              <StatCard label="Jami testlar" value={stats?.total_quizzes ?? 0} icon={<IconTrophy size={19} />} color="var(--teal)" />
              <StatCard label="O'rtacha ball" value={`${stats?.avg_score ?? 0}%`} icon={<IconChartBar size={19} />} color="var(--purple)" />
              <StatCard label="Joriy streak" value={stats?.current_streak ?? 0} icon={<IconFlame size={19} />} color="var(--amber)" />
              <StatCard label="Eng uzun streak" value={stats?.longest_streak ?? 0} icon={<IconFlame size={19} />} color="var(--red)" />
              <StatCard label="Umumiy progress" value={`${avgProgress}%`} icon={<IconTargetArrow size={19} />} color="var(--green)" />
            </div>

            {/* Subject ranking */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <IconTrophy size={17} style={{ color: 'var(--amber)' }} />
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>Fanlar reytingi</div>
              </div>
              {sortedSubjects.length === 0 ? (
                <div style={{ padding: 20, color: 'var(--text3)', fontSize: 13 }}>Hali progress ma'lumotlari yo'q.</div>
              ) : sortedSubjects.map((subject, index) => {
                const colors = getSubjectColor(subject.subject_name);
                const medalColor = index === 0 ? 'var(--amber)' : index === 1 ? 'var(--text2)' : index === 2 ? 'var(--red)' : 'var(--text3)';
                return (
                  <div key={subject.subject_id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', display: 'grid', placeItems: 'center',
                      fontSize: 13, fontWeight: 800, flexShrink: 0,
                      background: index < 3 ? `${medalColor}20` : 'var(--bg3)',
                      color: medalColor,
                      border: `1px solid ${index < 3 ? `${medalColor}40` : 'var(--border)'}`,
                    }}>
                      {index + 1}
                    </div>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors.color, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{subject.subject_name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)' }}>{subject.completed_topics}/{subject.total_topics} mavzu &middot; avg {subject.avg_score}%</div>
                    </div>
                    <div style={{ width: 100, marginRight: 10 }}>
                      <div style={{ height: 6, borderRadius: 4, background: 'var(--bg3)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${subject.percentage}%`, background: colors.color }} />
                      </div>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: colors.color, fontFamily: "'DM Mono', monospace", minWidth: 48, textAlign: 'right' }}>
                      {subject.percentage}%
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Achievements */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <IconTrophy size={17} style={{ color: 'var(--amber)' }} />
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>Yutuqlar</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                <Achievement
                  title="Birinchi test"
                  desc="Birinchi testni yechish"
                  earned={(stats?.total_quizzes ?? 0) >= 1}
                />
                <Achievement
                  title="10 ta test"
                  desc="10 ta test yechish"
                  earned={(stats?.total_quizzes ?? 0) >= 10}
                />
                <Achievement
                  title="Streak boshlovchi"
                  desc="3 kunlik streak"
                  earned={(stats?.current_streak ?? 0) >= 3}
                />
                <Achievement
                  title="Streak master"
                  desc="7 kunlik streak"
                  earned={(stats?.longest_streak ?? 0) >= 7}
                />
                <Achievement
                  title="A'lochi"
                  desc="O'rtacha ball 80%+"
                  earned={(stats?.avg_score ?? 0) >= 80}
                />
                <Achievement
                  title="Barcha fanlar"
                  desc="Barcha fanlarda progress"
                  earned={subjects.length > 0 && subjects.every((s) => s.percentage > 0)}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: 18 }}>
      <div style={{ width: 36, height: 36, borderRadius: 'var(--r-sm)', background: 'var(--bg3)', display: 'grid', placeItems: 'center', color, marginBottom: 14 }}>
        {icon}
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', fontFamily: "'DM Serif Display', serif" }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>{label}</div>
    </div>
  );
}

function Achievement({ title, desc, earned }: { title: string; desc: string; earned: boolean }) {
  return (
    <div style={{
      padding: 16,
      borderRadius: 'var(--r-sm)',
      border: `1px solid ${earned ? 'var(--teal-border)' : 'var(--border)'}`,
      background: earned ? 'var(--teal-dim)' : 'var(--bg3)',
      opacity: earned ? 1 : 0.5,
    }}>
      <div style={{ fontSize: 20, marginBottom: 6 }}>{earned ? '⭐' : '🔒'}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: earned ? 'var(--text)' : 'var(--text3)' }}>{title}</div>
      <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{desc}</div>
    </div>
  );
}

export default Leaderboard;
