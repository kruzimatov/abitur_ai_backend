import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { message } from 'antd';
import {
  IconArrowRight,
  IconBrain,
  IconCheck,
  IconClock,
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
import type { DiagnosisItem, Question, QuizSubmitResponse, Topic } from '../../types';

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
  const [hintMessages, setHintMessages] = useState<{ text: string; isAi: boolean }[]>([
    { text: "Salom! Savolda qiyinchilik bo'lsa yordam beraman.", isAi: true },
  ]);

  useEffect(() => {
    if (!topicId) return;
    subjectService.getTopic(topicId)
      .then(setTopic)
      .catch(() => message.error("Mavzu ma'lumotlari yuklanmadi"));
  }, [topicId]);

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
      setTopic((prev) => prev ?? ({ id: data.topic.id, subject_id: 0, title: data.topic.title, order_num: 0 } as Topic));
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
      const response = await quizService.submitQuiz({ topic_id: topicId, answers: selectedAnswers });
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
    if (!questionText) return;

    setHintMessages((prev) => [...prev, { text: questionText, isAi: false }]);
    setHintInput('');
    try {
      const activeQuestion = questions[current];
      const response = await chatService.askTutor(`${activeQuestion?.question_text ?? ''}\n\n${questionText}`, topic?.subject?.name);
      setHintMessages((prev) => [...prev, { text: response.answer, isAi: true }]);
    } catch {
      setHintMessages((prev) => [...prev, { text: "Hozir javob bera olmadim. Keyinroq qayta urinib ko'ring.", isAi: true }]);
    }
  };

  const currentQuestion = questions[current];
  const selectedCount = questions.filter((question) => answers[question.id]).length;
  const skipped = Math.max(0, questions.length - selectedCount);
  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timerColor = secondsLeft <= 60 ? 'var(--red)' : secondsLeft <= 180 ? 'var(--amber)' : 'var(--text)';

  if (!topicId) {
    return (
      <div style={{ flex: 1, display: 'grid', placeItems: 'center', color: 'var(--text2)', padding: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, color: 'var(--text)', fontWeight: 700, marginBottom: 8 }}>Mavzu tanlanmagan</div>
          <Link to="/topics" style={{ color: 'var(--teal)', textDecoration: 'none', fontWeight: 700 }}>Mavzularga o'tish</Link>
        </div>
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
            <Link to="/topics" style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '14px 20px', fontSize: 14, color: 'var(--text2)', textDecoration: 'none' }}>Bekor qilish</Link>
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
            </div>
            <div style={{ padding: 12, borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
              <input value={hintInput} onChange={(event) => setHintInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && sendHint()} placeholder="Savol bering..." style={{ flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '8px 10px', fontSize: 12, color: 'var(--text)', outline: 'none' }} />
              <button onClick={sendHint} style={{ width: 32, height: 32, borderRadius: 'var(--r-sm)', background: 'var(--purple)', border: 'none', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
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
        <DiagnosisList diagnosis={result?.diagnosis ?? []} />
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 20 }}>
          <button onClick={startTest} style={{ background: 'var(--teal)', border: 'none', borderRadius: 'var(--r)', padding: '12px 24px', fontSize: 14, fontWeight: 800, color: '#07090F', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconRefresh size={16} /> Qayta urinish
          </button>
          <Link to="/topics" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '12px 24px', fontSize: 14, color: 'var(--text2)', textDecoration: 'none', fontWeight: 700 }}>
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
