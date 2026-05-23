import { useState, useEffect, useCallback } from 'react';
import {
  IconClock,
  IconStar,
  IconListNumbers,
  IconCheck,
  IconX,
  IconArrowRight,
  IconPlayerPlay,
  IconBrain,
  IconRefresh,
  IconCornerDownRight,
  IconFlagCheck,
  IconMathFunction,
  IconMinus,
} from '@tabler/icons-react';

const questions = [
  { q: "Agar x² − 5x + 6 = 0 bo'lsa, x ning qiymatlari nechaga teng?", opts: ["x = 1 va x = 6", "x = −2 va x = −3", "x = 2 va x = 3", "x = 0 va x = 5"], correct: 2, explanation: "Tenglamani ko'paytmalarga ajratamiz: x² − 5x + 6 = (x−2)(x−3) = 0. Demak x = 2 yoki x = 3." },
  { q: "3x + 7 = 22 tenglamasining yechimi qaysi?", opts: ["x = 3", "x = 4", "x = 5", "x = 6"], correct: 2, explanation: "3x = 22 − 7 = 15, x = 15 ÷ 3 = 5." },
  { q: "Ikki sonning EKUB si 12, EKUK si 60 bo'lsa, bu sonlarning ko'paytmasi qancha?", opts: ["480", "720", "360", "960"], correct: 1, explanation: "a × b = EKUB(a,b) × EKUK(a,b) = 12 × 60 = 720." },
  { q: "Arifmetik progressiyada a₁ = 3, d = 4 bo'lsa, a₅ nechaga teng?", opts: ["15", "17", "19", "21"], correct: 2, explanation: "aₙ = a₁ + (n−1)·d formulasidan: a₅ = 3 + (5−1)·4 = 3 + 16 = 19." },
  { q: "f(x) = 2x² − 3x + 1 funksiyasining x = 2 dagi qiymati qancha?", opts: ["2", "3", "4", "5"], correct: 1, explanation: "f(2) = 2(2)² − 3(2) + 1 = 8 − 6 + 1 = 3." },
  { q: "|2x − 6| = 8 tenglamasining yechimlar yig'indisi nechaga teng?", opts: ["6", "8", "10", "12"], correct: 0, explanation: "2x−6 = 8 → x = 7 yoki 2x−6 = −8 → x = −1. Yig'indi: 7 + (−1) = 6." },
  { q: "Geometrik progressiyada b₁ = 2, q = 3 bo'lsa, b₄ nechaga teng?", opts: ["18", "36", "54", "162"], correct: 2, explanation: "bₙ = b₁ · q^(n−1): b₄ = 2 · 3³ = 2 · 27 = 54." },
  { q: "Agar log₂(x) = 5 bo'lsa, x nechaga teng?", opts: ["10", "16", "32", "64"], correct: 2, explanation: "log₂(x) = 5 → 2⁵ = x = 32." },
  { q: "Kvadrat tenglamaning diskriminanti D = 0 bo'lsa, bu nima anglatadi?", opts: ["Yechimi yo'q", "Bitta yechim bor", "Ikkita yechim bor", "Uchta yechim bor"], correct: 1, explanation: "D = 0 → bitta (takrorlanuvchi) yechim: x = −b/(2a)." },
  { q: "sin(30°) + cos(60°) + tan(45°) = ?", opts: ["1", "1.5", "2", "2.5"], correct: 2, explanation: "sin(30°) = 0.5, cos(60°) = 0.5, tan(45°) = 1. Yig'indi: 2." },
];

type Screen = 'start' | 'test' | 'result';

const MockTests = () => {
  const [screen, setScreen] = useState<Screen>('start');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [secondsLeft, setSecondsLeft] = useState(900);
  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [filter, setFilter] = useState<'all' | 'correct' | 'wrong'>('all');
  const [hintInput, setHintInput] = useState('');
  const [hintMessages, setHintMessages] = useState<{ text: string; isAi: boolean }[]>([
    { text: "Salom! Savolda qiyinchilik bo'lsa yordam beraman.", isAi: true },
  ]);

  useEffect(() => {
    if (screen !== 'test') return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          finishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [screen]);

  const startTest = () => {
    setCurrent(0);
    setAnswers(new Array(questions.length).fill(null));
    setSecondsLeft(900);
    setStartTime(Date.now());
    setHintMessages([{ text: "Salom! Savolda qiyinchilik bo'lsa yordam beraman.", isAi: true }]);
    setScreen('test');
  };

  const finishTest = useCallback(() => {
    setElapsed(Math.floor((Date.now() - startTime) / 1000));
    setScreen('result');
  }, [startTime]);

  const selectOption = (i: number) => {
    const newAnswers = [...answers];
    newAnswers[current] = i;
    setAnswers(newAnswers);
  };

  const timerColor = secondsLeft <= 60 ? 'var(--red)' : secondsLeft <= 180 ? 'var(--amber)' : 'var(--text)';
  const timerBg = secondsLeft <= 60 ? 'var(--red-dim)' : secondsLeft <= 180 ? 'var(--amber-dim)' : 'var(--bg3)';
  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  const correct = answers.filter((a, i) => a === questions[i].correct).length;
  const wrong = answers.filter((a, i) => a !== null && a !== -1 && a !== questions[i].correct).length;
  const skipped = answers.filter((a) => a === null || a === -1).length;
  const pct = Math.round((correct / questions.length) * 100);

  const sendHint = () => {
    if (!hintInput.trim()) return;
    setHintMessages((prev) => [...prev, { text: hintInput, isAi: false }]);
    setHintInput('');
    setTimeout(() => {
      setHintMessages((prev) => [...prev, { text: "Bu savolda formulani qo'llang va variantlarni sinab ko'ring.", isAi: true }]);
    }, 600);
  };

  // START SCREEN
  if (screen === 'start') {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflowY: 'auto', padding: '40px 20px', background: 'radial-gradient(ellipse at 50% 0%,rgba(0,196,154,.06) 0%,transparent 60%)' }}>
        <div style={{ width: '100%', maxWidth: 560 }}>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ padding: '28px 28px 24px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--r)', background: 'var(--teal-dim)', border: '1px solid var(--teal-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconMathFunction size={22} style={{ color: 'var(--teal)' }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text3)' }}>Fan · Mavzu</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>Matematika — Algebra · Tenglamalar</div>
                </div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', marginBottom: 6, letterSpacing: '-0.5px', fontFamily: "'DM Serif Display', serif" }}>Mock Test #7</div>
              <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>Bu test DTM formatida tuzilgan. Har bir savol uchun 4 variant beriladi — faqat bittasi to'g'ri.</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, padding: '20px 28px', borderBottom: '1px solid var(--border)' }}>
              {[
                { icon: <IconListNumbers size={18} style={{ color: 'var(--teal)' }} />, bg: 'var(--teal-dim)', border: 'var(--teal-border)', val: '10', label: 'Savol' },
                { icon: <IconClock size={18} style={{ color: 'var(--amber)' }} />, bg: 'var(--amber-dim)', border: 'rgba(251,191,36,0.3)', val: '15:00', label: 'Vaqt' },
                { icon: <IconStar size={18} style={{ color: 'var(--purple)' }} />, bg: 'var(--purple-dim)', border: 'rgba(129,140,248,0.3)', val: "O'rta", label: 'Qiyinlik' },
              ].map((m, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--r-sm)', background: m.bg, border: `1px solid ${m.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{m.icon}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', fontFamily: "'DM Serif Display', serif" }}>{m.val}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>{m.label}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>Qoidalar</div>
              {["Har bir savolga faqat bitta javob belgilash mumkin", "Savollarni o'tkazib yuborish mumkin", "Vaqt tugasa test avtomatik yakunlanadi", "AI tutor yordamida maslahat so'rash mumkin", "Test natijasi darhol ko'rsatiladi"].map((rule, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10, fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>
                  <IconCheck size={16} style={{ color: 'var(--teal)', flexShrink: 0, marginTop: 1 }} />
                  {rule}
                </div>
              ))}
            </div>
            <div style={{ padding: '20px 28px', display: 'flex', gap: 10 }}>
              <button style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '14px 20px', fontSize: 14, color: 'var(--text2)', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Bekor qilish</button>
              <button onClick={startTest} style={{ flex: 1, background: 'var(--teal)', border: 'none', borderRadius: 'var(--r)', padding: 14, fontSize: 15, fontWeight: 700, color: '#07090F', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: "'DM Sans', sans-serif" }}>
                <IconPlayerPlay size={18} /> Testni boshlash
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // TEST SCREEN
  if (screen === 'test') {
    const q = questions[current];
    const letters = ['A', 'B', 'C', 'D'];
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 28px', borderBottom: '1px solid var(--border)', background: 'rgba(7,9,15,0.9)', backdropFilter: 'blur(8px)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'var(--teal-dim)', border: '1px solid var(--teal-border)', borderRadius: 20, padding: '5px 14px', fontSize: 12, color: 'var(--teal)', fontWeight: 500 }}>
              <IconMathFunction size={14} /> Matematika
            </div>
            <div style={{ fontSize: 13, color: 'var(--text2)' }}>Savol <span style={{ color: 'var(--text)', fontWeight: 600 }}>{current + 1}</span> / {questions.length}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 16px', borderRadius: 20, fontSize: 14, fontWeight: 700, fontFamily: "'DM Mono', monospace", background: timerBg, border: '1px solid var(--border)', color: timerColor }}>
              <IconClock size={15} /> {minutes}:{secs < 10 ? '0' : ''}{secs}
            </div>
            <button onClick={() => { if (confirm('Testni yakunlashni xohlaysizmi?')) finishTest(); }} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '6px 14px', fontSize: 12, color: 'var(--text3)', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Chiqish</button>
          </div>
        </div>

        {/* Progress dots */}
        <div style={{ padding: '16px 28px 0', display: 'flex', gap: 6, flexShrink: 0 }}>
          {questions.map((_, i) => {
            let bg = 'rgba(255,255,255,0.06)';
            if (i === current) bg = 'var(--purple)';
            else if (answers[i] === -1) bg = 'var(--amber)';
            else if (answers[i] !== null) bg = 'var(--teal)';
            return <div key={i} onClick={() => setCurrent(i)} style={{ width: 32, height: 6, borderRadius: 3, background: bg, cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }} />;
          })}
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Question area */}
          <div style={{ flex: 1, padding: '24px 28px', overflowY: 'auto' }}>
            <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              Savol <span style={{ background: 'var(--purple-dim)', border: '1px solid rgba(129,140,248,0.3)', borderRadius: 20, padding: '3px 12px', fontSize: 11, color: 'var(--purple)' }}>{current + 1} / {questions.length}</span>
            </div>
            <div style={{ fontSize: 18, color: 'var(--text)', lineHeight: 1.65, marginBottom: 28, fontWeight: 500 }}>{q.q}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              {q.opts.map((opt, i) => {
                const isSelected = answers[current] === i;
                return (
                  <div key={i} onClick={() => selectOption(i)}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '15px 18px', borderRadius: 'var(--r)', border: `1.5px solid ${isSelected ? 'var(--purple)' : 'var(--border)'}`, background: isSelected ? 'var(--purple-dim)' : 'var(--bg2)', cursor: 'pointer', transition: 'all 0.18s' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: isSelected ? 'var(--purple)' : 'rgba(255,255,255,0.06)', border: `1px solid ${isSelected ? 'var(--purple)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: isSelected ? '#fff' : 'var(--text2)', flexShrink: 0, fontFamily: "'DM Mono', monospace" }}>
                      {letters[i]}
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.55, paddingTop: 5 }}>{opt}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={() => { const a = [...answers]; a[current] = -1; setAnswers(a); if (current < questions.length - 1) setCurrent(current + 1); }}
                style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '10px 20px', fontSize: 13, color: 'var(--text3)', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: 4 }}>
                <IconCornerDownRight size={14} /> O'tkazib yuborish
              </button>
              <div style={{ display: 'flex', gap: 10 }}>
                {current < questions.length - 1 ? (
                  <button onClick={() => setCurrent(current + 1)} disabled={answers[current] === null}
                    style={{ background: 'var(--teal)', border: 'none', borderRadius: 'var(--r-sm)', padding: '10px 28px', fontSize: 14, fontWeight: 700, color: '#07090F', cursor: answers[current] === null ? 'not-allowed' : 'pointer', opacity: answers[current] === null ? 0.4 : 1, display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'DM Sans', sans-serif" }}>
                    Keyingisi <IconArrowRight size={16} />
                  </button>
                ) : (
                  <button onClick={finishTest}
                    style={{ background: 'var(--amber)', border: 'none', borderRadius: 'var(--r-sm)', padding: '10px 28px', fontSize: 14, fontWeight: 700, color: '#07090F', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'DM Sans', sans-serif" }}>
                    <IconFlagCheck size={16} /> Yakunlash
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* AI hint panel */}
          <div style={{ width: 280, borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'var(--bg2)', flexShrink: 0 }}>
            <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--purple-dim)', border: '1px solid rgba(129,140,248,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconBrain size={14} style={{ color: 'var(--purple)' }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>AI Tutor</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>Yordam so'rang</div>
              </div>
            </div>
            <div style={{ flex: 1, padding: 16, overflowY: 'auto' }}>
              {hintMessages.map((m, i) => (
                <div key={i} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: 12, fontSize: 12, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 10, borderLeft: m.isAi ? '2px solid var(--purple)' : 'none' }}>
                  {m.text}
                </div>
              ))}
            </div>
            <div style={{ padding: 12, borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
              <input value={hintInput} onChange={(e) => setHintInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendHint()}
                placeholder="Savol bering..." style={{ flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '8px 10px', fontSize: 12, color: 'var(--text)', fontFamily: "'DM Sans', sans-serif", outline: 'none' }} />
              <button onClick={sendHint} style={{ width: 32, height: 32, borderRadius: 'var(--r-sm)', background: 'var(--purple)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <IconArrowRight size={14} style={{ color: '#fff' }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // RESULT SCREEN
  const ringCircumference = 408.4;
  const scoreColor = pct >= 80 ? 'var(--green)' : pct >= 60 ? 'var(--teal)' : pct >= 40 ? 'var(--amber)' : 'var(--red)';
  const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '😊' : pct >= 40 ? '💪' : '📚';
  const title = pct >= 80 ? 'Ajoyib natija!' : pct >= 60 ? 'Yaxshi natija!' : pct >= 40 ? 'Davom eting!' : "Ko'proq mashq qiling!";
  const em = Math.floor(elapsed / 60);
  const es = elapsed % 60;

  const filteredQ = questions.map((q, i) => ({ ...q, idx: i })).filter((q) => {
    const a = answers[q.idx];
    const isCorrect = a === q.correct;
    const isSkipped = a === null || a === -1;
    if (filter === 'correct') return isCorrect;
    if (filter === 'wrong') return !isCorrect && !isSkipped;
    return true;
  });

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: 680 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{emoji}</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--text)', fontFamily: "'DM Serif Display', serif", letterSpacing: '-0.5px', marginBottom: 6 }}>{title}</div>
          <div style={{ fontSize: 15, color: 'var(--text2)' }}>Matematika — Algebra testini yakunladingiz</div>
        </div>

        {/* Score ring */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <div style={{ position: 'relative', width: 160, height: 160 }}>
            <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="80" cy="80" r="65" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
              <circle cx="80" cy="80" r="65" fill="none" stroke={scoreColor} strokeWidth="10" strokeLinecap="round"
                strokeDasharray={ringCircumference} strokeDashoffset={ringCircumference * (1 - pct / 100)} style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(.4,0,.2,1)' }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--text)', fontFamily: "'DM Serif Display', serif", lineHeight: 1 }}>{correct}/{questions.length}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3 }}>{pct}%</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { icon: <IconCheck size={18} style={{ color: 'var(--green)' }} />, val: correct, label: "To'g'ri", color: 'var(--green)', bg: 'var(--green-dim)', border: 'rgba(52,211,153,0.3)' },
            { icon: <IconX size={18} style={{ color: 'var(--red)' }} />, val: wrong, label: "Noto'g'ri", color: 'var(--red)', bg: 'var(--red-dim)', border: 'rgba(248,113,113,0.3)' },
            { icon: <IconMinus size={18} style={{ color: 'var(--amber)' }} />, val: skipped, label: "O'tkazilgan", color: 'var(--amber)', bg: 'var(--amber-dim)', border: 'rgba(251,191,36,0.3)' },
            { icon: <IconClock size={18} style={{ color: 'var(--teal)' }} />, val: `${em}:${es < 10 ? '0' : ''}${es}`, label: 'Sarflangan vaqt', color: 'var(--teal)', bg: 'var(--teal-dim)', border: 'var(--teal-border)' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: 16, textAlign: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--r-sm)', background: s.bg, border: `1px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "'DM Serif Display', serif" }}>{s.val}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Answers review */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Javoblar tahlili</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['all', 'correct', 'wrong'] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)} style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: `1px solid ${filter === f ? (f === 'wrong' ? 'rgba(248,113,113,0.2)' : f === 'correct' ? 'rgba(52,211,153,0.2)' : 'var(--border)') : 'transparent'}`, background: filter === f ? (f === 'wrong' ? 'var(--red-dim)' : f === 'correct' ? 'var(--green-dim)' : 'var(--bg3)') : 'transparent', color: f === 'wrong' ? 'var(--red)' : f === 'correct' ? 'var(--green)' : 'var(--text2)', fontFamily: "'DM Sans', sans-serif" }}>
                  {f === 'all' ? 'Barchasi' : f === 'correct' ? "To'g'ri" : "Noto'g'ri"}
                </button>
              ))}
            </div>
          </div>
          {filteredQ.map((q) => {
            const a = answers[q.idx];
            const isCorrect = a === q.correct;
            const isSkipped = a === null || a === -1;
            return (
              <div key={q.idx} style={{ borderBottom: '1px solid var(--border)', padding: '14px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
                  <div style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: 'var(--text3)', width: 20 }}>{q.idx + 1}</div>
                  <div style={{ flex: 1, fontSize: 13, color: 'var(--text)' }}>{q.q}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: isSkipped ? 'var(--amber-dim)' : isCorrect ? 'var(--green-dim)' : 'var(--red-dim)', color: isSkipped ? 'var(--amber)' : isCorrect ? 'var(--green)' : 'var(--red)' }}>
                    {isSkipped ? "O'tkazildi" : isCorrect ? "To'g'ri" : "Noto'g'ri"}
                  </div>
                </div>
                {!isCorrect && !isSkipped && (
                  <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: 12, display: 'flex', gap: 10, marginTop: 8 }}>
                    <IconBrain size={18} style={{ color: 'var(--purple)', flexShrink: 0, marginTop: 1 }} />
                    <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.65 }}><strong>Izoh:</strong> {q.explanation}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={startTest} style={{ background: 'var(--teal)', border: 'none', borderRadius: 'var(--r)', padding: '12px 28px', fontSize: 14, fontWeight: 700, color: '#07090F', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'DM Sans', sans-serif" }}>
            <IconRefresh size={16} /> Qayta urinish
          </button>
          <button style={{ background: 'var(--purple-dim)', border: '1px solid rgba(129,140,248,0.3)', borderRadius: 'var(--r)', padding: '12px 28px', fontSize: 14, color: 'var(--purple)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
            <IconBrain size={16} /> AI tahlil
          </button>
        </div>
      </div>
    </div>
  );
};

export default MockTests;
