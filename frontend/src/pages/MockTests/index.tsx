import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { message } from 'antd';
import {
  IconArrowRight,
  IconBrain,
  IconCheck,
  IconClock,
  IconClipboardCheck,
  IconCornerDownRight,
  IconFlagCheck,
  IconListNumbers,
  IconPlayerPlay,
  IconRefresh,
  IconSend,
  IconX,
} from '@tabler/icons-react';
import { chatService } from '../../services/chat';
import { quizService } from '../../services/quiz';
import { subjectService } from '../../services/subjects';
import { getSubjectColor } from '../../utils/subjectColors';
import type { DiagnosisItem, Question, QuizAnswerReview, QuizAttempt, QuizSubmitResponse, Subject, Topic } from '../../types';

type Screen = 'start' | 'test' | 'result';
type AnswerState = Record<number, 'A' | 'B' | 'C' | 'D' | null>;

const letters = ['A', 'B', 'C', 'D'] as const;

const MockTests = () => {
  const [searchParams] = useSearchParams();
  const topicId = Number(searchParams.get('topic') ?? 0);
  const [screen, setScreen] = useState<Screen>('start');
  const [topic, setTopic] = useState<Topic | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [current, setCurrent] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(900);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<QuizSubmitResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hintInput, setHintInput] = useState('');
  const [hintLoading, setHintLoading] = useState(false);
  const [hintMessages, setHintMessages] = useState<{ text: string; isAi: boolean }[]>([
    { text: "Salom! Savolda qiyinchilik bo'lsa yordam beraman.", isAi: true },
  ]);

  // Quiz history state (when no topic selected)
  const [history, setHistory] = useState<QuizAttempt[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'new'>('all');

  useEffect(() => {
    if (!topicId) {
      loadHistory();
      return;
    }
    subjectService.getTopic(topicId)
      .then(setTopic)
      .catch(() => message.error("Mavzu ma'lumotlari yuklanmadi"));
  }, [topicId]);

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const [historyData, subjectData] = await Promise.all([
        quizService.getQuizHistory(1, 50),
        subjectService.getSubjects(),
      ]);
      const safeHistory = Array.isArray(historyData?.data) ? historyData.data : [];
      setHistory(safeHistory);
      setSubjects(Array.isArray(subjectData) ? subjectData : []);
    } catch {
      message.error("Tarix yuklanmadi");
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (screen !== 'test') return;

    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          submitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [screen]);

  const startTest = async () => {
    if (!topicId) {
      message.error('Avval mavzu tanlang');
      return;
    }

    setIsLoading(true);
    try {
      const data = await quizService.startQuiz(topicId);
      setTopic((prev) => prev ?? ({
        id: data.topic.id,
        subject_id: data.topic.subject_id ?? 0,
        title: data.topic.title,
        order_num: 0,
        subject: data.topic.subject,
      } as Topic));
      setQuestions(data.questions);
      setAnswers(Object.fromEntries(data.questions.map((question) => [question.id, null])));
      setCurrent(0);
      setSecondsLeft(900);
      setStartedAt(Date.now());
      setElapsed(0);
      setResult(null);
      setHintMessages([{ text: "Savolni o'qing, kerak bo'lsa maslahat so'rang.", isAi: true }]);
      setScreen('test');
    } catch {
      message.error('Test savollari yuklanmadi');
    } finally {
      setIsLoading(false);
    }
  };

  const submitTest = async () => {
    if (isSubmitting || questions.length === 0) return;
    const selectedAnswers = questions
      .map((question) => ({ question_id: question.id, selected_answer: answers[question.id] }))
      .filter((answer): answer is { question_id: number; selected_answer: 'A' | 'B' | 'C' | 'D' } => Boolean(answer.selected_answer));

    if (selectedAnswers.length === 0) {
      message.error('Kamida bitta savolga javob belgilang');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await quizService.submitQuiz({ topic_id: topicId, answers: selectedAnswers, with_diagnosis: false });
      setResult(response);
      setElapsed(startedAt ? Math.floor((Date.now() - startedAt) / 1000) : 0);
      setScreen('result');
    } catch {
      message.error('Test yakunlanmadi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendHint = async () => {
    const questionText = hintInput.trim();
    if (!questionText || hintLoading) return;

    setHintMessages((prev) => [...prev, { text: questionText, isAi: false }]);
    setHintInput('');
    setHintLoading(true);
    try {
      const activeQuestion = questions[current];
      const subjectName = topic?.subject?.name ?? topic?.title?.split(' — ')[0];
      const response = await chatService.askTutor(`${activeQuestion?.question_text ?? ''}\n\n${questionText}`, subjectName);
      setHintMessages((prev) => [...prev, { text: response.answer, isAi: true }]);
    } catch {
      setHintMessages((prev) => [...prev, { text: "Hozir javob bera olmadim. Keyinroq qayta urinib ko'ring.", isAi: true }]);
    } finally {
      setHintLoading(false);
    }
  };

  const currentQuestion = questions[current];
  const selectedCount = questions.filter((question) => answers[question.id]).length;
  const skipped = Math.max(0, questions.length - selectedCount);
  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timerColor = secondsLeft <= 60 ? 'var(--red)' : secondsLeft <= 180 ? 'var(--amber)' : 'var(--text)';
  const backToTopicsUrl = topic?.subject_id ? `/topics?subject=${topic.subject_id}` : '/topics';

  if (!topicId) {
    // Group history by topic
    const grouped = new Map<string, { topic: QuizAttempt['topic']; attempts: QuizAttempt[]; best: number; count: number }>();
    for (const attempt of history) {
      const key = String(attempt.topic_id);
      const existing = grouped.get(key);
      const pct = attempt.percentage ?? Math.round(((attempt.score ?? 0) / Math.max(attempt.total ?? 1, 1)) * 100);
      if (existing) {
        existing.attempts.push(attempt);
        existing.count++;
        if (pct > existing.best) existing.best = pct;
      } else {
        grouped.set(key, { topic: attempt.topic, attempts: [attempt], best: pct, count: 1 });
      }
    }
    const entries = Array.from(grouped.values());
    const completedEntries = entries.filter((e) => e.count > 0);
    const completedCount = completedEntries.length;

    const filteredEntries = filterStatus === 'all' ? entries : entries.filter((e) => filterStatus === 'completed' ? e.count > 0 : false);

    return (
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <IconClipboardCheck size={22} style={{ color: 'var(--teal)' }} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>Mock testlar</div>
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>{history.length} ta urinish · {completedCount} ta mavzu</div>
            </div>
          </div>
          <button onClick={loadHistory} disabled={historyLoading} style={{ width: 32, height: 32, borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--text2)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <IconRefresh size={14} />
          </button>
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {([
            { key: 'all' as const, label: `Barchasi (${entries.length})` },
            { key: 'completed' as const, label: `${completedCount} bajarildi` },
          ]).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterStatus(f.key)}
              style={{
                padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                background: filterStatus === f.key ? 'var(--teal-dim)' : 'var(--bg3)',
                border: `1px solid ${filterStatus === f.key ? 'var(--teal-border)' : 'var(--border)'}`,
                color: filterStatus === f.key ? 'var(--teal)' : 'var(--text2)',
              }}
            >
              {f.key === 'completed' && <IconCheck size={12} style={{ marginRight: 4, verticalAlign: -2 }} />}
              {f.label}
            </button>
          ))}
        </div>

        {/* Browse subjects to start new test */}
        {subjects.length > 0 && (
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Yangi test boshlash</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {subjects.map((s) => {
                const c = getSubjectColor(s.name);
                return (
                  <Link
                    key={s.id}
                    to={`/topics?subject=${s.id}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '10px 18px', borderRadius: 'var(--r-sm)',
                      background: c.dim, border: `1px solid ${c.border}`,
                      color: c.color, fontSize: 13, fontWeight: 700, textDecoration: 'none',
                    }}
                  >
                    <IconPlayerPlay size={14} /> {s.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* History list */}
        {historyLoading ? (
          <div style={{ color: 'var(--text3)', fontSize: 14, padding: 20 }}>Yuklanmoqda...</div>
        ) : filteredEntries.length === 0 ? (
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: 40, textAlign: 'center' }}>
            <IconClipboardCheck size={40} style={{ color: 'var(--text3)', marginBottom: 12 }} />
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Hali test yechilmagan</div>
            <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 16 }}>Mavzularga o'ting va birinchi testingizni boshlang</div>
            <Link to="/topics" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--teal)', borderRadius: 'var(--r-sm)', padding: '12px 24px', fontSize: 14, fontWeight: 800, color: '#07090F', textDecoration: 'none' }}>
              <IconPlayerPlay size={16} /> Mavzularga o'tish
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredEntries.map((entry) => {
              const subjectName = entry.topic?.title?.split(' — ')[0] ?? '';
              const topicTitle = entry.topic?.title ?? `Mavzu #${entry.attempts[0]?.topic_id}`;
              const scoreColor = entry.best >= 70 ? 'var(--green)' : entry.best >= 40 ? 'var(--amber)' : 'var(--red)';
              const colors = getSubjectColor(subjectName);
              return (
                <div
                  key={entry.attempts[0]?.topic_id}
                  style={{
                    background: 'var(--bg2)', border: `1px solid ${colors.border}`,
                    borderRadius: 'var(--r)', padding: '16px 20px',
                    display: 'flex', alignItems: 'center', gap: 14,
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', display: 'grid', placeItems: 'center', flexShrink: 0,
                    background: entry.best >= 70 ? 'var(--green-dim)' : 'var(--bg3)',
                    border: `1px solid ${entry.best >= 70 ? 'rgba(52,211,153,0.3)' : 'var(--border)'}`,
                  }}>
                    {entry.best >= 70 ? <IconCheck size={18} style={{ color: 'var(--green)' }} /> : <IconPlayerPlay size={18} style={{ color: 'var(--text3)' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>{topicTitle}</div>
                    <div style={{ fontSize: 12, color: 'var(--text3)' }}>
                      {entry.count} urinish · eng yaxshi natija {entry.best}%
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text3)' }}>Natija</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: scoreColor }}>{entry.best}%</div>
                      <div style={{ height: 3, borderRadius: 2, background: 'var(--bg3)', width: 60, marginTop: 4 }}>
                        <div style={{ height: '100%', borderRadius: 2, background: scoreColor, width: `${entry.best}%` }} />
                      </div>
                    </div>
                    <Link
                      to={`/mock-testlar?topic=${entry.attempts[0]?.topic_id}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '8px 16px', borderRadius: 'var(--r-sm)',
                        background: 'transparent', border: '1px solid var(--border)',
                        color: 'var(--teal)', fontSize: 13, fontWeight: 700,
                        textDecoration: 'none', whiteSpace: 'nowrap',
                      }}
                    >
                      Qayta <IconArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (screen === 'start') {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflowY: 'auto', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: 560, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
          <div style={{ padding: '28px 28px 24px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--r)', background: 'var(--teal-dim)', border: '1px solid var(--teal-border)', display: 'grid', placeItems: 'center' }}>
                <IconListNumbers size={22} style={{ color: 'var(--teal)' }} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text3)' }}>Mavzu</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{topic?.title ?? 'Yuklanmoqda...'}</div>
              </div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', marginBottom: 6, fontFamily: "'DM Serif Display', serif" }}>Mock test</div>
            <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>Backenddan 10 ta savol olinadi. Test yakunida natija va AI xato tahlili ko'rsatiladi.</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, padding: '20px 28px', borderBottom: '1px solid var(--border)' }}>
            <Metric icon={<IconListNumbers size={18} />} value="10" label="Savol" color="var(--teal)" />
            <Metric icon={<IconClock size={18} />} value="15:00" label="Vaqt" color="var(--amber)" />
            <Metric icon={<IconBrain size={18} />} value="AI" label="Tahlil" color="var(--purple)" />
          </div>
          <div style={{ padding: '20px 28px', display: 'flex', gap: 10 }}>
            <Link to={backToTopicsUrl} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '14px 20px', fontSize: 14, color: 'var(--text2)', textDecoration: 'none' }}>Bekor qilish</Link>
            <button onClick={startTest} disabled={isLoading} style={{ flex: 1, background: 'var(--teal)', border: 'none', borderRadius: 'var(--r)', padding: 14, fontSize: 15, fontWeight: 800, color: '#07090F', cursor: isLoading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <IconPlayerPlay size={18} /> {isLoading ? 'Yuklanmoqda...' : 'Testni boshlash'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'test' && currentQuestion) {
    const options = [currentQuestion.option_a, currentQuestion.option_b, currentQuestion.option_c, currentQuestion.option_d];

    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 28px', borderBottom: '1px solid var(--border)', background: 'rgba(7,9,15,0.9)', backdropFilter: 'blur(8px)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'var(--teal-dim)', border: '1px solid var(--teal-border)', borderRadius: 20, padding: '5px 14px', fontSize: 12, color: 'var(--teal)', fontWeight: 700 }}>{topic?.subject?.name ?? 'Test'}</div>
            <div style={{ fontSize: 13, color: 'var(--text2)' }}>Savol <span style={{ color: 'var(--text)', fontWeight: 700 }}>{current + 1}</span> / {questions.length}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 16px', borderRadius: 20, fontSize: 14, fontWeight: 800, fontFamily: "'DM Mono', monospace", background: 'var(--bg3)', border: '1px solid var(--border)', color: timerColor }}>
              <IconClock size={15} /> {minutes}:{secs < 10 ? '0' : ''}{secs}
            </div>
            <button onClick={submitTest} disabled={isSubmitting} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '6px 14px', fontSize: 12, color: 'var(--text2)', cursor: 'pointer' }}>Yakunlash</button>
          </div>
        </div>

        <div style={{ padding: '16px 28px 0', display: 'flex', gap: 6, flexShrink: 0, overflowX: 'auto' }}>
          {questions.map((question, index) => {
            const bg = index === current ? 'var(--purple)' : answers[question.id] ? 'var(--teal)' : 'rgba(255,255,255,0.06)';
            return <button key={question.id} onClick={() => setCurrent(index)} style={{ width: 32, height: 6, borderRadius: 3, border: 0, background: bg, cursor: 'pointer', flexShrink: 0 }} />;
          })}
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <div style={{ flex: 1, padding: '24px 28px', overflowY: 'auto' }}>
            <div style={{ fontSize: 18, color: 'var(--text)', lineHeight: 1.65, marginBottom: 28, fontWeight: 600 }}>{currentQuestion.question_text}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              {options.map((option, index) => {
                const letter = letters[index];
                const isSelected = answers[currentQuestion.id] === letter;
                return (
                  <button key={letter} onClick={() => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: letter }))} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '15px 18px', borderRadius: 'var(--r)', border: `1.5px solid ${isSelected ? 'var(--purple)' : 'var(--border)'}`, background: isSelected ? 'var(--purple-dim)' : 'var(--bg2)', cursor: 'pointer', textAlign: 'left' }}>
                    <span style={{ width: 32, height: 32, borderRadius: '50%', background: isSelected ? 'var(--purple)' : 'rgba(255,255,255,0.06)', display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 800, color: isSelected ? '#fff' : 'var(--text2)', flexShrink: 0 }}>{letter}</span>
                    <span style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.55, paddingTop: 5 }}>{option}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={() => { setAnswers((prev) => ({ ...prev, [currentQuestion.id]: null })); if (current < questions.length - 1) setCurrent(current + 1); }} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '10px 20px', fontSize: 13, color: 'var(--text3)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                <IconCornerDownRight size={14} /> O'tkazib yuborish
              </button>
              {current < questions.length - 1 ? (
                <button onClick={() => setCurrent(current + 1)} style={{ background: 'var(--teal)', border: 'none', borderRadius: 'var(--r-sm)', padding: '10px 28px', fontSize: 14, fontWeight: 800, color: '#07090F', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  Keyingisi <IconArrowRight size={16} />
                </button>
              ) : (
                <button onClick={submitTest} disabled={isSubmitting} style={{ background: 'var(--amber)', border: 'none', borderRadius: 'var(--r-sm)', padding: '10px 28px', fontSize: 14, fontWeight: 800, color: '#07090F', cursor: isSubmitting ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <IconFlagCheck size={16} /> {isSubmitting ? 'Yakunlanmoqda...' : 'Yakunlash'}
                </button>
              )}
            </div>
          </div>

          <div style={{ width: 300, borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'var(--bg2)', flexShrink: 0 }}>
            <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconBrain size={18} style={{ color: 'var(--purple)' }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>AI Tutor</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>Savol bo'yicha yordam</div>
              </div>
            </div>
            <div style={{ flex: 1, padding: 16, overflowY: 'auto' }}>
              {hintMessages.map((item, index) => (
                <div key={index} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: 12, fontSize: 12, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 10, borderLeft: item.isAi ? '2px solid var(--purple)' : '2px solid var(--teal)', whiteSpace: 'pre-wrap' }}>
                  {item.text}
                </div>
              ))}
              {hintLoading && (
                <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: 12, fontSize: 12, color: 'var(--text3)', marginBottom: 10, borderLeft: '2px solid var(--purple)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ animation: 'pulse-dot 1.2s infinite' }}>●</span>
                  <span style={{ animation: 'pulse-dot 1.2s infinite 0.2s' }}>●</span>
                  <span style={{ animation: 'pulse-dot 1.2s infinite 0.4s' }}>●</span>
                </div>
              )}
            </div>
            <div style={{ padding: 12, borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
              <input value={hintInput} onChange={(event) => setHintInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && sendHint()} placeholder={hintLoading ? 'Javob kutilmoqda...' : 'Savol bering...'} disabled={hintLoading} style={{ flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '8px 10px', fontSize: 12, color: 'var(--text)', outline: 'none', opacity: hintLoading ? 0.5 : 1 }} />
              <button onClick={sendHint} disabled={hintLoading} style={{ width: 32, height: 32, borderRadius: 'var(--r-sm)', background: hintLoading ? 'var(--bg3)' : 'var(--purple)', border: 'none', display: 'grid', placeItems: 'center', cursor: hintLoading ? 'not-allowed' : 'pointer' }}>
                <IconSend size={14} style={{ color: '#fff' }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const percentage = result?.percentage ?? 0;
  const scoreColor = percentage >= 70 ? 'var(--green)' : percentage >= 40 ? 'var(--amber)' : 'var(--red)';
  const em = Math.floor(elapsed / 60);
  const es = elapsed % 60;

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '36px 20px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 760 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--text)', fontFamily: "'DM Serif Display', serif", marginBottom: 6 }}>{percentage >= 70 ? 'Yaxshi natija' : "Mashqni davom ettiring"}</div>
          <div style={{ fontSize: 14, color: 'var(--text2)' }}>{topic?.title ?? 'Test'} yakunlandi</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
          <Metric icon={<IconCheck size={18} />} value={`${result?.score ?? 0}/${result?.total ?? 0}`} label="To'g'ri" color="var(--green)" />
          <Metric icon={<IconX size={18} />} value={`${Math.max(0, (result?.total ?? 0) - (result?.score ?? 0))}`} label="Noto'g'ri" color="var(--red)" />
          <Metric icon={<IconCornerDownRight size={18} />} value={skipped} label="O'tkazilgan" color="var(--amber)" />
          <Metric icon={<IconClock size={18} />} value={`${em}:${es < 10 ? '0' : ''}${es}`} label="Vaqt" color="var(--teal)" />
        </div>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ color: 'var(--text)', fontWeight: 800 }}>Umumiy natija</span>
            <span style={{ color: scoreColor, fontWeight: 900 }}>{percentage}%</span>
          </div>
          <div style={{ height: 10, borderRadius: 8, background: 'var(--bg3)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${percentage}%`, background: scoreColor }} />
          </div>
        </div>
        {(result?.diagnosis?.length ?? 0) > 0 && <DiagnosisList diagnosis={result?.diagnosis ?? []} />}
        <AnswerReviewList answers={result?.answers_review ?? []} />
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 20 }}>
          <button onClick={startTest} style={{ background: 'var(--teal)', border: 'none', borderRadius: 'var(--r)', padding: '12px 24px', fontSize: 14, fontWeight: 800, color: '#07090F', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconRefresh size={16} /> Qayta urinish
          </button>
          <Link to={backToTopicsUrl} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '12px 24px', fontSize: 14, color: 'var(--text2)', textDecoration: 'none', fontWeight: 700 }}>
            Mavzularga qaytish
          </Link>
        </div>
      </div>
    </div>
  );
};

function Metric({ icon, value, label, color }: { icon: React.ReactNode; value: string | number; label: string; color: string }) {
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: 16, textAlign: 'center' }}>
      <div style={{ width: 36, height: 36, borderRadius: 'var(--r-sm)', background: 'var(--bg3)', display: 'grid', placeItems: 'center', color, margin: '0 auto 10px' }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color, fontFamily: "'DM Serif Display', serif" }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>{label}</div>
    </div>
  );
}

function AnswerReviewList({ answers }: { answers: QuizAnswerReview[] }) {
  if (answers.length === 0) {
    return null;
  }

  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden', marginTop: 18 }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 800, color: 'var(--text)' }}>
        Savollar va javoblar
      </div>
      {answers.map((item, index) => {
        const selectedText = item.options[item.selected_answer];
        const correctText = item.options[item.correct_answer];
        return (
          <div key={item.question_id} style={{ padding: 18, borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: item.is_correct ? 'var(--green-dim)' : 'var(--red-dim)', color: item.is_correct ? 'var(--green)' : 'var(--red)', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>
                {index + 1}
              </div>
              <div style={{ color: 'var(--text)', fontWeight: 700, lineHeight: 1.55 }}>{item.question_text}</div>
            </div>
            <div style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.7, paddingLeft: 34 }}>
              <div><strong style={{ color: item.is_correct ? 'var(--green)' : 'var(--red)' }}>Sizning javobingiz:</strong> {item.selected_answer}) {selectedText}</div>
              {!item.is_correct && <div><strong style={{ color: 'var(--green)' }}>To'g'ri javob:</strong> {item.correct_answer}) {correctText}</div>}
              {item.explanation && <div><strong style={{ color: 'var(--amber)' }}>Izoh:</strong> {item.explanation}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DiagnosisList({ diagnosis }: { diagnosis: DiagnosisItem[] }) {
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, color: 'var(--text)' }}>
        <IconBrain size={17} style={{ color: 'var(--purple)' }} /> AI xato tahlili
      </div>
      {diagnosis.length === 0 ? (
        <div style={{ padding: 18, color: 'var(--text3)', fontSize: 13 }}>Xato javoblar uchun tahlil yo'q.</div>
      ) : diagnosis.map((item, index) => (
        <div key={`${item.question}-${index}`} style={{ padding: 18, borderBottom: '1px solid var(--border)' }}>
          <div style={{ color: 'var(--text)', fontWeight: 700, marginBottom: 8 }}>{item.question}</div>
          <div style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.7 }}>
            <div><strong style={{ color: 'var(--red)' }}>Xato tushuncha:</strong> {item.misconception}</div>
            <div><strong style={{ color: 'var(--green)' }}>To'g'ri yo'l:</strong> {item.correct_reasoning}</div>
            <div><strong style={{ color: 'var(--amber)' }}>Maslahat:</strong> {item.tip}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MockTests;
