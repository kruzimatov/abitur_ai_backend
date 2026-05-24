import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { message } from 'antd';
import {
  IconArrowRight,
  IconBooks,
  IconClipboardList,
  IconRefresh,
  IconSearch,
} from '@tabler/icons-react';
import { progressService } from '../../services/progress';
import { subjectService } from '../../services/subjects';
import { getSubjectColor } from '../../utils/subjectColors';
import type { Subject, SubjectProgress } from '../../types';

const Subjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [progress, setProgress] = useState<SubjectProgress[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    try {
      const [subjectData, progressData] = await Promise.all([
        subjectService.getSubjects(),
        progressService.getSubjectProgress(),
      ]);
      setSubjects(Array.isArray(subjectData) ? subjectData : []);
      setProgress(Array.isArray(progressData) ? progressData : []);
    } catch {
      message.error("Fanlar ro'yxati yuklanmadi");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const progressBySubject = useMemo(() => new Map(progress.map((item) => [item.subject_id, item])), [progress]);
  const filteredSubjects = subjects.filter((subject) => subject.name.toLowerCase().includes(query.toLowerCase()));
  const totalTopics = subjects.reduce((sum, subject) => sum + (subject.topics_count ?? 0), 0);
  const avgProgress = progress.length ? Math.round(progress.reduce((sum, item) => sum + item.percentage, 0) / progress.length) : 0;

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 28px', borderBottom: '1px solid var(--border)', background: 'rgba(7,9,15,0.8)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <IconBooks size={20} style={{ color: 'var(--teal)' }} />
          <div>
            <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)' }}>Fanlar</div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>{subjects.length} ta fan · {totalTopics} mavzu</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '7px 12px' }}>
            <IconSearch size={15} style={{ color: 'var(--text3)' }} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Qidirish..." style={{ background: 'none', border: 'none', outline: 'none', fontSize: 12, color: 'var(--text)', fontFamily: "'DM Sans', sans-serif", width: 140 }} />
          </div>
          <button onClick={load} style={{ width: 34, height: 34, borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--text2)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <IconRefresh size={16} />
          </button>
        </div>
      </div>

      <div style={{ padding: '24px 28px' }}>
        {isLoading ? (
          <div style={{ color: 'var(--text2)' }}>Fanlar yuklanmoqda...</div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 32 }}>
              {filteredSubjects.map((subject) => {
                const stats = progressBySubject.get(subject.id);
                const colors = getSubjectColor(subject.name);
                const percentage = stats?.percentage ?? 0;

                return (
                  <Link key={subject.id} to={`/topics?subject=${subject.id}`} style={{ background: 'var(--bg2)', border: `1px solid ${colors.border}`, borderRadius: 'var(--r)', padding: 22, textDecoration: 'none', transition: 'transform 0.2s', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: colors.color }} />
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18, gap: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 'var(--r)', background: colors.dim, border: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IconClipboardList size={24} style={{ color: colors.color }} />
                        </div>
                        <div>
                          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>{subject.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text3)' }}>{subject.topics_count ?? stats?.total_topics ?? 0} mavzu</div>
                        </div>
                      </div>
                      <IconArrowRight size={18} style={{ color: colors.color, flexShrink: 0 }} />
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, minHeight: 42, marginBottom: 16 }}>{subject.description || 'DTM tayyorgarligi uchun mavzular va testlar.'}</div>
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                        <span style={{ color: 'var(--text3)' }}>Progress</span>
                        <span style={{ color: colors.color, fontWeight: 700 }}>{percentage}%</span>
                      </div>
                      <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${percentage}%`, background: colors.color, borderRadius: 3 }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, paddingTop: 14, borderTop: '1px solid var(--border)', fontSize: 11 }}>
                      <span style={{ background: colors.dim, color: colors.color, borderRadius: 20, padding: '4px 10px', fontWeight: 700 }}>{stats?.completed_topics ?? 0} bajarildi</span>
                      <span style={{ background: 'var(--bg3)', color: 'var(--text3)', borderRadius: 20, padding: '4px 10px' }}>{stats?.avg_score ?? 0}% avg</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14 }}>
              {[
                { label: 'Jami fanlar', value: subjects.length, color: 'var(--teal)' },
                { label: 'Jami mavzular', value: totalTopics, color: 'var(--purple)' },
                { label: "O'rtacha progress", value: `${avgProgress}%`, color: 'var(--amber)' },
                { label: 'Bajarilgan mavzu', value: progress.reduce((sum, item) => sum + item.completed_topics, 0), color: 'var(--green)' },
              ].map((stat) => (
                <div key={stat.label} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '18px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: stat.color, fontFamily: "'DM Serif Display', serif" }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Subjects;
