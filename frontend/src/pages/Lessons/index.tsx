import { useEffect, useState } from 'react';
import { message } from 'antd';
import {
  IconBook,
  IconBrain,
  IconCheck,
  IconChevronDown,
  IconRefresh,
  IconSend,
  IconX,
} from '@tabler/icons-react';
import { subjectService } from '../../services/subjects';
import { feynmanService } from '../../services/feynman';
import { getSubjectColor } from '../../utils/subjectColors';
import type { FeynmanResponse, Subject, Topic } from '../../types';

type Screen = 'select' | 'write' | 'result';

const Lessons = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [explanation, setExplanation] = useState('');
  const [result, setResult] = useState<FeynmanResponse | null>(null);
  const [screen, setScreen] = useState<Screen>('select');
  const [isLoading, setIsLoading] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    setIsLoading(true);
    try {
      const data = await subjectService.getSubjects();
      setSubjects(Array.isArray(data) ? data : []);
    } catch {
      message.error('Fanlar yuklanmadi');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTopics = async (subject: Subject) => {
    setSelectedSubject(subject);
    try {
      const data = await subjectService.getSubjectTopics(subject.id);
      setTopics(Array.isArray(data) ? data : []);
    } catch {
      message.error('Mavzular yuklanmadi');
    }
  };

  const startFeynman = (topic: Topic) => {
    setSelectedTopic(topic);
    setExplanation('');
    setResult(null);
    setScreen('write');
  };

  const submitExplanation = async () => {
    if (!selectedTopic || explanation.trim().length < 20) {
      message.warning("Kamida 20 ta belgi yozing");
      return;
    }
    setIsEvaluating(true);
    try {
      const data = await feynmanService.evaluate(selectedTopic.id, explanation.trim());
      setResult(data);
      setScreen('result');
    } catch {
      message.error("AI baholay olmadi. Qayta urinib ko'ring.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const reset = () => {
    setScreen('select');
    setSelectedTopic(null);
    setExplanation('');
    setResult(null);
  };

  if (screen === 'write' && selectedTopic) {
    const colors = getSubjectColor(selectedSubject?.name ?? 'Fan');
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '16px 28px', borderBottom: '1px solid var(--border)', background: 'rgba(7,9,15,0.8)', backdropFilter: 'blur(8px)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--r-sm)', background: 'var(--purple-dim)', border: '1px solid rgba(129,140,248,0.3)', display: 'grid', placeItems: 'center' }}>
              <IconBrain size={20} style={{ color: 'var(--purple)' }} />
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>Feynman usuli</div>
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>{selectedSubject?.name} &middot; {selectedTopic.title}</div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 28, gap: 20, overflowY: 'auto' }}>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Qanday ishlaydi?</div>
            <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7 }}>
              <strong style={{ color: colors.color }}>{selectedTopic.title}</strong> mavzusini o'z so'zlaringiz bilan tushuntiring.
              AI sizning tushuntirishingizni baholaydi va qayerda xato qilganingizni, nimalarni tushunib, nimalarni tushirmay qolganingizni ko'rsatadi.
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
              Sizning tushuntirishingiz
            </div>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder={`"${selectedTopic.title}" mavzusini oddiy so'zlar bilan tushuntiring. Formulalar, misollar, qoidalar yozing...`}
              style={{
                flex: 1,
                minHeight: 200,
                padding: 18,
                background: 'var(--bg3)',
                border: 'none',
                outline: 'none',
                fontSize: 14,
                color: 'var(--text)',
                lineHeight: 1.7,
                resize: 'none',
                fontFamily: "'DM Sans', sans-serif",
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, color: explanation.length < 20 ? 'var(--red)' : 'var(--text3)' }}>
                {explanation.length} / kamida 20 belgi
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={reset} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '10px 18px', fontSize: 13, color: 'var(--text2)', cursor: 'pointer' }}>
                  Bekor qilish
                </button>
                <button
                  onClick={submitExplanation}
                  disabled={explanation.trim().length < 20 || isEvaluating}
                  style={{
                    background: 'var(--purple)',
                    border: 'none',
                    borderRadius: 'var(--r-sm)',
                    padding: '10px 24px',
                    fontSize: 14,
                    fontWeight: 800,
                    color: '#fff',
                    cursor: explanation.trim().length >= 20 && !isEvaluating ? 'pointer' : 'not-allowed',
                    opacity: explanation.trim().length >= 20 ? 1 : 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <IconSend size={16} /> {isEvaluating ? 'AI baholamoqda...' : 'Baholash'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'result' && result && selectedTopic) {
    const scoreColor = result.score >= 80 ? 'var(--green)' : result.score >= 50 ? 'var(--amber)' : 'var(--red)';
    return (
      <div style={{ flex: 1, overflowY: 'auto', padding: '36px 20px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 700 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', fontFamily: "'DM Serif Display', serif", marginBottom: 6 }}>
              {result.score >= 80 ? 'Ajoyib tushunish!' : result.score >= 50 ? 'Yaxshi boshlanish' : "Ko'proq mashq kerak"}
            </div>
            <div style={{ fontSize: 14, color: 'var(--text2)' }}>{selectedTopic.title}</div>
          </div>

          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: 24, marginBottom: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 52, fontWeight: 800, color: scoreColor, fontFamily: "'DM Serif Display', serif" }}>{result.score}%</div>
            <div style={{ height: 10, borderRadius: 8, background: 'var(--bg3)', overflow: 'hidden', margin: '16px 0' }}>
              <div style={{ height: '100%', width: `${result.score}%`, background: scoreColor }} />
            </div>
            <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{result.feedback}</div>
          </div>

          {result.correct.length > 0 && (
            <div style={{ background: 'var(--bg2)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 'var(--r)', padding: 20, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, fontWeight: 800, color: 'var(--green)' }}>
                <IconCheck size={17} /> To'g'ri tushunilgan
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {result.correct.map((item, i) => (
                  <div key={i} style={{ padding: '10px 14px', background: 'var(--green-dim)', borderRadius: 'var(--r-sm)', fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{item}</div>
                ))}
              </div>
            </div>
          )}

          {result.wrong.length > 0 && (
            <div style={{ background: 'var(--bg2)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 'var(--r)', padding: 20, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, fontWeight: 800, color: 'var(--red)' }}>
                <IconX size={17} /> Noto'g'ri tushunilgan
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {result.wrong.map((item, i) => (
                  <div key={i} style={{ padding: '10px 14px', background: 'var(--red-dim)', borderRadius: 'var(--r-sm)', fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{item}</div>
                ))}
              </div>
            </div>
          )}

          {result.missing.length > 0 && (
            <div style={{ background: 'var(--bg2)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 'var(--r)', padding: 20, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, fontWeight: 800, color: 'var(--amber)' }}>
                <IconBrain size={17} /> Tushirib qoldirilgan
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {result.missing.map((item, i) => (
                  <div key={i} style={{ padding: '10px 14px', background: 'var(--amber-dim)', borderRadius: 'var(--r-sm)', fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{item}</div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
            <button onClick={() => { setScreen('write'); setResult(null); }} style={{ background: 'var(--purple)', border: 'none', borderRadius: 'var(--r)', padding: '12px 24px', fontSize: 14, fontWeight: 800, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconRefresh size={16} /> Qayta yozish
            </button>
            <button onClick={reset} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '12px 24px', fontSize: 14, color: 'var(--text2)', cursor: 'pointer', fontWeight: 700 }}>
              Boshqa mavzu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 28px', borderBottom: '1px solid var(--border)', background: 'rgba(7,9,15,0.8)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <IconBook size={20} style={{ color: 'var(--purple)' }} />
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>Feynman usuli</div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>Mavzuni o'z so'zlaringiz bilan tushuntiring</div>
          </div>
        </div>
        <button onClick={loadSubjects} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '8px 12px', color: 'var(--text2)', cursor: 'pointer' }}>
          <IconRefresh size={16} /> Yangilash
        </button>
      </div>

      <div style={{ padding: 28 }}>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: 20, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <IconBrain size={20} style={{ color: 'var(--purple)' }} />
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>Feynman texnikasi nima?</div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.8 }}>
            Nobel mukofoti sovrindori Richard Feynman ishlab chiqqan o'rganish usuli.
            Mavzuni <strong style={{ color: 'var(--teal)' }}>oddiy tilda</strong> tushuntirishga harakat qiling — go'yoki
            sinfda do'stingizga tushuntiryapsiz. AI sizning tushuntirishingizni tahlil qilib, <strong style={{ color: 'var(--green)' }}>to'g'ri</strong>,&nbsp;
            <strong style={{ color: 'var(--red)' }}>noto'g'ri</strong> va <strong style={{ color: 'var(--amber)' }}>tushirib qoldirilgan</strong> narsalarni ko'rsatadi.
          </div>
        </div>

        {isLoading ? (
          <div style={{ color: 'var(--text2)' }}>Fanlar yuklanmoqda...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {subjects.map((subject) => {
              const colors = getSubjectColor(subject.name);
              const isOpen = selectedSubject?.id === subject.id;
              return (
                <div key={subject.id} style={{ background: 'var(--bg2)', border: `1px solid ${isOpen ? colors.border : 'var(--border)'}`, borderRadius: 'var(--r)', overflow: 'hidden' }}>
                  <button
                    onClick={() => isOpen ? setSelectedSubject(null) : loadTopics(subject)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      border: 0,
                      background: 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors.color }} />
                      <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: 15 }}>{subject.name}</div>
                      <div style={{ color: 'var(--text3)', fontSize: 12 }}>{subject.topics_count ?? 0} mavzu</div>
                    </div>
                    <IconChevronDown size={18} style={{ color: 'var(--text3)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                  {isOpen && (
                    <div style={{ borderTop: '1px solid var(--border)', padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {topics.length === 0 && <div style={{ color: 'var(--text3)', fontSize: 13, padding: 8 }}>Mavzular yo'q</div>}
                      {topics.map((topic) => (
                        <button
                          key={topic.id}
                          onClick={() => startFeynman(topic)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            background: 'var(--bg3)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--r-sm)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            width: '100%',
                          }}
                        >
                          <div>
                            <div style={{ color: 'var(--text)', fontSize: 14, fontWeight: 600 }}>{topic.title}</div>
                            <div style={{ color: 'var(--text3)', fontSize: 11, marginTop: 3 }}>Feynman usuli bilan o'rganing</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: colors.color, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                            <IconBrain size={15} /> Boshlash
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {subjects.length === 0 && <div style={{ color: 'var(--text3)', fontSize: 13 }}>Hali fanlar yo'q.</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Lessons;
