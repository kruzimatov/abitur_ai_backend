import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { message } from 'antd';
import { IconChartBar, IconChevronDown, IconRefresh, IconTargetArrow } from '@tabler/icons-react';
import { progressService } from '../../services/progress';
import { getSubjectColor } from '../../utils/subjectColors';
import type { Recommendation, SubjectProgress } from '../../types';

const Progress = () => {
  const [subjects, setSubjects] = useState<SubjectProgress[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    try {
      const [subjectData, recommendationData] = await Promise.all([
        progressService.getSubjectProgress(),
        progressService.getRecommendations(),
      ]);
      setSubjects(subjectData);
      setRecommendations(recommendationData);
      setExpanded((prev) => prev ?? subjectData[0]?.subject_id ?? null);
    } catch {
      message.error('Progress ma\'lumotlari yuklanmadi');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 28px', borderBottom: '1px solid var(--border)', background: 'rgba(7,9,15,0.8)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <IconChartBar size={20} style={{ color: 'var(--teal)' }} />
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>Progress</div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>Fanlar va mavzular kesimida</div>
          </div>
        </div>
        <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '8px 12px', color: 'var(--text2)', cursor: 'pointer' }}>
          <IconRefresh size={16} /> Yangilash
        </button>
      </div>

      <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text)', fontWeight: 800, marginBottom: 16 }}>
            <IconTargetArrow size={17} style={{ color: 'var(--amber)' }} /> Tavsiyalar
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {recommendations.map((item) => {
              const colors = getSubjectColor(item.subject_name);
              return (
                <Link key={item.topic_id} to={`/mock-testlar?topic=${item.topic_id}`} style={{ border: `1px solid ${colors.border}`, background: colors.dim, borderRadius: 'var(--r-sm)', padding: 14, textDecoration: 'none' }}>
                  <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{item.topic_title}</div>
                  <div style={{ color: 'var(--text3)', fontSize: 12, marginBottom: 10 }}>{item.subject_name} · {item.reason}</div>
                  <div style={{ color: colors.color, fontWeight: 900 }}>{item.best_score ?? 0}%</div>
                </Link>
              );
            })}
            {recommendations.length === 0 && <div style={{ color: 'var(--text3)', fontSize: 13 }}>Hozircha tavsiyalar yo'q.</div>}
          </div>
        </div>

        {isLoading ? <div style={{ color: 'var(--text2)' }}>Progress yuklanmoqda...</div> : subjects.map((subject) => {
          const colors = getSubjectColor(subject.subject_name);
          const isOpen = expanded === subject.subject_id;
          return (
            <div key={subject.subject_id} style={{ background: 'var(--bg2)', border: `1px solid ${isOpen ? colors.border : 'var(--border)'}`, borderRadius: 'var(--r)', overflow: 'hidden' }}>
              <button onClick={() => setExpanded(isOpen ? null : subject.subject_id)} style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 16, padding: 18, border: 0, background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors.color }} />
                    <div style={{ color: 'var(--text)', fontWeight: 800, fontSize: 15 }}>{subject.subject_name}</div>
                    <div style={{ color: 'var(--text3)', fontSize: 12 }}>{subject.completed_topics}/{subject.total_topics} mavzu</div>
                  </div>
                  <div style={{ height: 7, borderRadius: 6, background: 'var(--bg3)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${subject.percentage}%`, background: colors.color }} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ color: colors.color, fontWeight: 900 }}>{subject.percentage}%</span>
                  <IconChevronDown size={18} style={{ color: 'var(--text3)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>
              </button>
              {isOpen && (
                <div style={{ borderTop: '1px solid var(--border)', padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(subject.topics ?? []).map((topic) => {
                    const score = topic.best_score ?? 0;
                    return (
                      <Link key={topic.topic_id} to={`/mock-testlar?topic=${topic.topic_id}`} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 70px', gap: 12, alignItems: 'center', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '10px 12px', textDecoration: 'none' }}>
                        <div>
                          <div style={{ color: 'var(--text)', fontSize: 13, fontWeight: 700 }}>{topic.topic_title}</div>
                          <div style={{ color: 'var(--text3)', fontSize: 11 }}>{topic.attempts_count} urinish · {topic.status}</div>
                        </div>
                        <div style={{ height: 5, borderRadius: 4, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${score}%`, background: colors.color }} />
                        </div>
                        <div style={{ color: colors.color, fontWeight: 900, textAlign: 'right', fontSize: 13 }}>{score}%</div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Progress;
