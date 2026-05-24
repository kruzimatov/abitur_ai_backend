import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { message } from 'antd';
import {
  IconArrowRight,
  IconCheck,
  IconClipboardList,
  IconPlayerPlay,
  IconRefresh,
  IconSearch,
} from '@tabler/icons-react';
import { progressService } from '../../services/progress';
import { subjectService } from '../../services/subjects';
import { getSubjectColor } from '../../utils/subjectColors';
import type { Subject, SubjectProgress, Topic } from '../../types';

const Topics = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSubjectId = Number(searchParams.get('subject') ?? 0);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
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
      const safeSubs = Array.isArray(subjectData) ? subjectData : [];
      const safeProg = Array.isArray(progressData) ? progressData : [];
      setSubjects(safeSubs);
      setProgress(safeProg);

      const subjectId = safeSubs.some((subject) => subject.id === selectedSubjectId)
        ? selectedSubjectId
        : safeSubs[0]?.id;
      if (subjectId) {
        setSearchParams({ subject: String(subjectId) }, { replace: true });
        const topicData = await subjectService.getSubjectTopics(subjectId);
        setTopics(Array.isArray(topicData) ? topicData : []);
      } else {
        setTopics([]);
      }
    } catch {
      message.error('Mavzular yuklanmadi');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [selectedSubjectId]);

  const selectedSubject = subjects.find((subject) => subject.id === selectedSubjectId) ?? subjects[0];
  const subjectProgress = progress.find((item) => item.subject_id === selectedSubject?.id);
  const topicProgress = useMemo(() => new Map((subjectProgress?.topics ?? []).map((item) => [item.topic_id, item])), [subjectProgress]);
  const filteredTopics = topics.filter((topic) => topic.title.toLowerCase().includes(query.toLowerCase()));
  const colors = getSubjectColor(selectedSubject?.name ?? 'Fan');
  const completedCount = subjectProgress?.topics?.filter((topic) => topic.status === 'completed').length ?? 0;
  const inProgressCount = subjectProgress?.topics?.filter((topic) => topic.status === 'in_progress').length ?? 0;

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 28px', borderBottom: '1px solid var(--border)', background: 'rgba(7,9,15,0.8)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <IconClipboardList size={20} style={{ color: colors.color }} />
          <div>
            <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)' }}>Mavzular</div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>{selectedSubject?.name ?? 'Fan'} · {topics.length} mavzu</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <select value={selectedSubject?.id ?? ''} onChange={(event) => setSearchParams({ subject: event.target.value })} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', color: 'var(--text)', padding: '7px 10px', outline: 'none' }}>
            {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
          </select>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '7px 12px' }}>
            <IconSearch size={15} style={{ color: 'var(--text3)' }} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Mavzu qidirish..." style={{ background: 'none', border: 'none', outline: 'none', fontSize: 12, color: 'var(--text)', fontFamily: "'DM Sans', sans-serif", width: 140 }} />
          </div>
          <button onClick={load} style={{ width: 34, height: 34, borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--text2)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <IconRefresh size={16} />
          </button>
        </div>
      </div>

      <div style={{ padding: '24px 28px' }}>
        {isLoading ? (
          <div style={{ color: 'var(--text2)' }}>Mavzular yuklanmoqda...</div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
              <Badge color="var(--green)" bg="var(--green-dim)"><IconCheck size={12} /> {completedCount} bajarildi</Badge>
              <Badge color="var(--teal)" bg="var(--teal-dim)">{inProgressCount} davom etmoqda</Badge>
              <Badge color="var(--text3)" bg="var(--bg3)">{Math.max(0, topics.length - completedCount - inProgressCount)} yangi</Badge>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredTopics.map((topic) => {
                const stats = topicProgress.get(topic.id);
                const status = stats?.status ?? 'new';
                const score = stats?.best_score ?? 0;
                const isCompleted = status === 'completed';

                return (
                  <div key={topic.id} style={{ background: 'var(--bg2)', border: `1px solid ${isCompleted ? 'rgba(52,211,153,0.2)' : 'var(--border)'}`, borderRadius: 'var(--r)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, borderLeft: `3px solid ${isCompleted ? 'var(--green)' : status === 'in_progress' ? colors.color : 'transparent'}` }}>
                    <div style={{ width: 36, height: 36, borderRadius: 'var(--r-sm)', background: isCompleted ? 'var(--green-dim)' : colors.dim, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {isCompleted ? <IconCheck size={17} style={{ color: 'var(--green)' }} /> : <IconPlayerPlay size={17} style={{ color: colors.color }} />}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{topic.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text3)' }}>{stats?.attempts_count ?? 0} urinish · eng yaxshi natija {score}%</div>
                    </div>

                    <div style={{ width: 130 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 11 }}>
                        <span style={{ color: 'var(--text3)' }}>Natija</span>
                        <span style={{ color: isCompleted ? 'var(--green)' : colors.color, fontWeight: 700 }}>{score}%</span>
                      </div>
                      <div style={{ height: 4, background: 'var(--bg3)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${score}%`, background: isCompleted ? 'var(--green)' : colors.color }} />
                      </div>
                    </div>

                    <Link to={`/mock-testlar?topic=${topic.id}`} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: colors.color, fontWeight: 700, textDecoration: 'none' }}>
                      {stats ? 'Qayta' : 'Boshlash'} <IconArrowRight size={14} />
                    </Link>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

function Badge({ children, color, bg }: { children: React.ReactNode; color: string; bg: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: bg, border: '1px solid var(--border)', borderRadius: 20, padding: '5px 14px', fontSize: 12, color, fontWeight: 600 }}>
      {children}
    </div>
  );
}

export default Topics;
