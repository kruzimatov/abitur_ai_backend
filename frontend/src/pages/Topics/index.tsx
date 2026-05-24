import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { message } from 'antd';
import {
  IconArrowLeft,
  IconBook,
  IconBrain,
  IconCheck,
  IconClipboardCheck,
  IconClipboardList,
  IconPlayerPlay,
  IconRefresh,
  IconSearch,
  IconSend,
} from '@tabler/icons-react';
import { progressService } from '../../services/progress';
import { subjectService } from '../../services/subjects';
import { chatService } from '../../services/chat';
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
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [aiExplanation, setAiExplanation] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');

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

      const subjectId = selectedSubjectId || safeSubs[0]?.id;
      if (subjectId) {
        setSearchParams({ subject: String(subjectId) }, { replace: true });
        const topicData = await subjectService.getSubjectTopics(subjectId);
        const safeTopics = Array.isArray(topicData) ? topicData : [];
        setTopics(safeTopics);
        if (!activeTopic && safeTopics.length > 0) {
          setActiveTopic(safeTopics[0]);
          setAiExplanation('');
        }
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

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId) ?? subjects[0];
  const subjectProgress = progress.find((p) => p.subject_id === selectedSubject?.id);
  const topicProgress = useMemo(() => new Map((subjectProgress?.topics ?? []).map((t) => [t.topic_id, t])), [subjectProgress]);
  const filteredTopics = topics.filter((t) => t.title.toLowerCase().includes(query.toLowerCase()));
  const colors = getSubjectColor(selectedSubject?.name ?? 'Fan');

  const openTopic = (topic: Topic) => {
    setActiveTopic(topic);
    setAiExplanation('');
    setAiQuestion('');
  };

  const askAI = async (questionText?: string) => {
    if (!activeTopic) return;
    const q = questionText ?? aiQuestion.trim();
    if (!q && activeTopic.content) return;

    setAiLoading(true);
    setAiQuestion('');
    try {
      const prompt = q
        ? `${activeTopic.title} mavzusi haqida: ${q}`
        : `"${activeTopic.title}" mavzusini batafsil tushuntir. DTM imtihoniga tayyorgarlik uchun muhim formulalar, qoidalar va misollar bilan.`;
      const response = await chatService.askTutor(prompt, selectedSubject?.name);
      setAiExplanation(response.answer);
    } catch {
      message.error('AI javob bermadi');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
      {/* Left panel — topic list */}
      <div style={{ width: 300, height: '100%', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0, background: 'var(--bg2)' }}>
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconClipboardList size={17} style={{ color: colors.color }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Mavzular</span>
            </div>
            <button onClick={load} style={{ width: 28, height: 28, borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--text2)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
              <IconRefresh size={13} />
            </button>
          </div>
          <select
            value={selectedSubject?.id ?? ''}
            onChange={(e) => { setSearchParams({ subject: e.target.value }); setActiveTopic(null); }}
            style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', color: 'var(--text)', padding: '8px 10px', outline: 'none', fontSize: 12, marginBottom: 8 }}
          >
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '7px 10px' }}>
            <IconSearch size={14} style={{ color: 'var(--text3)', flexShrink: 0 }} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Qidirish..." style={{ background: 'none', border: 'none', outline: 'none', fontSize: 12, color: 'var(--text)', width: '100%' }} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
          {isLoading ? (
            <div style={{ color: 'var(--text3)', fontSize: 12, padding: 8 }}>Yuklanmoqda...</div>
          ) : filteredTopics.map((topic, index) => {
            const stats = topicProgress.get(topic.id);
            const isActive = activeTopic?.id === topic.id;
            const isCompleted = stats?.status === 'completed';
            return (
              <button
                key={topic.id}
                onClick={() => openTopic(topic)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: '10px 12px', marginBottom: 2, borderRadius: 'var(--r-sm)',
                  border: `1px solid ${isActive ? colors.border : 'transparent'}`,
                  background: isActive ? 'var(--bg3)' : 'transparent',
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                <div style={{
                  width: 26, height: 26, borderRadius: '50%', display: 'grid', placeItems: 'center',
                  fontSize: 11, fontWeight: 700, flexShrink: 0,
                  background: isCompleted ? 'var(--green-dim)' : 'var(--bg3)',
                  color: isCompleted ? 'var(--green)' : 'var(--text3)',
                  border: `1px solid ${isCompleted ? 'rgba(52,211,153,0.3)' : 'var(--border)'}`,
                }}>
                  {isCompleted ? <IconCheck size={12} /> : index + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: isActive ? 'var(--text)' : 'var(--text2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{topic.title}</div>
                  {stats && <div style={{ fontSize: 10, color: 'var(--text3)' }}>{stats.attempts_count} urinish &middot; {stats.best_score ?? 0}%</div>}
                </div>
              </button>
            );
          })}
          {!isLoading && filteredTopics.length === 0 && (
            <div style={{ color: 'var(--text3)', fontSize: 12, padding: 12 }}>Mavzu topilmadi.</div>
          )}
        </div>
      </div>

      {/* Right panel — topic content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {activeTopic ? (
          <>
            {/* Topic header */}
            <div style={{ padding: '16px 28px', borderBottom: '1px solid var(--border)', background: 'rgba(7,9,15,0.8)', backdropFilter: 'blur(8px)', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--r-sm)', background: colors.dim, border: `1px solid ${colors.border}`, display: 'grid', placeItems: 'center' }}>
                    <IconBook size={20} style={{ color: colors.color }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>{activeTopic.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text3)' }}>{selectedSubject?.name}</div>
                  </div>
                </div>
                <Link
                  to={`/mock-testlar?topic=${activeTopic.id}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'var(--teal)', border: 'none', borderRadius: 'var(--r-sm)',
                    padding: '10px 18px', fontSize: 13, fontWeight: 800, color: '#07090F',
                    textDecoration: 'none',
                  }}
                >
                  <IconClipboardCheck size={16} /> Test yechish
                </Link>
              </div>
            </div>

            {/* Content area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
              {/* DB content */}
              {activeTopic.content ? (
                <div style={{
                  background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)',
                  padding: 24, marginBottom: 20,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <IconBook size={17} style={{ color: colors.color }} />
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>Darslik materiali</span>
                  </div>
                  <div style={{
                    fontSize: 14, color: 'var(--text2)', lineHeight: 1.9,
                    whiteSpace: 'pre-wrap', fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {activeTopic.content}
                  </div>
                </div>
              ) : (
                <div style={{
                  background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)',
                  padding: 24, marginBottom: 20, textAlign: 'center',
                }}>
                  <IconBook size={36} style={{ color: 'var(--text3)', marginBottom: 12 }} />
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Darslik hali qo'shilmagan</div>
                  <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 16 }}>AI dan bu mavzu haqida tushuntirish oling</div>
                  <button
                    onClick={() => askAI()}
                    disabled={aiLoading}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      background: 'var(--purple)', border: 'none', borderRadius: 'var(--r-sm)',
                      padding: '12px 24px', fontSize: 14, fontWeight: 800, color: '#fff',
                      cursor: aiLoading ? 'wait' : 'pointer',
                    }}
                  >
                    <IconBrain size={16} /> {aiLoading ? 'AI tushuntiryapti...' : "AI bilan o'rganish"}
                  </button>
                </div>
              )}

              {/* AI explanation */}
              {aiExplanation && (
                <div style={{
                  background: 'var(--bg2)', border: '1px solid rgba(129,140,248,0.2)', borderRadius: 'var(--r)',
                  padding: 24, marginBottom: 20,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <IconBrain size={17} style={{ color: 'var(--purple)' }} />
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>AI tushuntirish</span>
                  </div>
                  <div style={{
                    fontSize: 14, color: 'var(--text2)', lineHeight: 1.9,
                    whiteSpace: 'pre-wrap',
                  }}>
                    {aiExplanation}
                  </div>
                </div>
              )}

              {aiLoading && !aiExplanation && (
                <div style={{
                  background: 'var(--bg2)', border: '1px solid rgba(129,140,248,0.2)', borderRadius: 'var(--r)',
                  padding: 24, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <IconBrain size={18} style={{ color: 'var(--purple)' }} />
                  <span style={{ fontSize: 14, color: 'var(--text3)' }}>AI tushuntirish tayyorlanmoqda...</span>
                  <span style={{ display: 'flex', gap: 4 }}>
                    {[0, 1, 2].map((i) => <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--purple)', animation: `pulse-dot 1.4s infinite ${i * 0.2}s` }} />)}
                  </span>
                </div>
              )}

              {/* AI Ask section */}
              <div style={{
                background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)',
                padding: 20, marginBottom: 20,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <IconBrain size={17} style={{ color: 'var(--purple)' }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Savolingiz bormi?</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && aiQuestion.trim() && askAI()}
                    placeholder={`"${activeTopic.title}" haqida savol bering...`}
                    style={{
                      flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)',
                      borderRadius: 'var(--r-sm)', padding: '10px 14px', fontSize: 13,
                      color: 'var(--text)', outline: 'none',
                    }}
                  />
                  <button
                    onClick={() => askAI()}
                    disabled={!aiQuestion.trim() || aiLoading}
                    style={{
                      width: 40, height: 40, borderRadius: 'var(--r-sm)',
                      background: aiQuestion.trim() ? 'var(--purple)' : 'var(--bg3)',
                      border: 'none', display: 'grid', placeItems: 'center',
                      cursor: aiQuestion.trim() && !aiLoading ? 'pointer' : 'not-allowed',
                    }}
                  >
                    <IconSend size={16} style={{ color: '#fff' }} />
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                  {['Formulalarini yoz', 'Misol bilan tushuntir', 'DTM savoli ber', "Qoidalarini ayt"].map((q) => (
                    <button key={q} onClick={() => askAI(q)} disabled={aiLoading} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 20, padding: '5px 12px', fontSize: 11, color: 'var(--text2)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to={`/mock-testlar?topic=${activeTopic.id}`} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--teal)', borderRadius: 'var(--r-sm)', padding: '12px 24px', fontSize: 14, fontWeight: 800, color: '#07090F', textDecoration: 'none' }}>
                  <IconClipboardCheck size={16} /> Mock test yechish
                </Link>
                <Link to="/darsliklar" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '12px 24px', fontSize: 14, color: 'var(--text2)', textDecoration: 'none', fontWeight: 700 }}>
                  <IconPlayerPlay size={16} /> Feynman usuli
                </Link>
                {activeTopic.content && !aiExplanation && (
                  <button onClick={() => askAI()} disabled={aiLoading} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--purple-dim)', border: '1px solid rgba(129,140,248,0.3)', borderRadius: 'var(--r-sm)', padding: '12px 24px', fontSize: 14, color: 'var(--purple)', cursor: 'pointer', fontWeight: 700 }}>
                    <IconBrain size={16} /> AI tushuntirish
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'grid', placeItems: 'center', color: 'var(--text3)' }}>
            <div style={{ textAlign: 'center' }}>
              <IconArrowLeft size={36} style={{ marginBottom: 12, opacity: 0.5 }} />
              <div style={{ fontSize: 15, fontWeight: 600 }}>Chap paneldan mavzu tanlang</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Mavzu materiallarini o'qish va AI bilan o'rganish</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topics;
