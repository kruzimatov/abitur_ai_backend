import { useState, useRef, useEffect } from 'react';
import {
  IconBrain,
  IconSend,
  IconSearch,
  IconPlus,
  IconMathFunction,
  IconAtom,
  IconLanguage,
  IconFlask,
  IconCopy,
  IconThumbUp,
  IconThumbDown,
  IconRefresh,
  IconPhoto,
  IconMath,
  IconSettings,
  IconMaximize,
} from '@tabler/icons-react';

interface Message {
  role: 'ai' | 'user';
  text: string;
  time: string;
  formula?: string;
  steps?: string[];
}

interface ChatHistory {
  id: string;
  title: string;
  subject: string;
  subjectColor: string;
  time: string;
  section: string;
}

const chatHistoryData: ChatHistory[] = [
  { id: '1', title: 'Kvadrat tenglamalar haqida', subject: 'Matematika', subjectColor: 'var(--teal)', time: '14:32', section: 'Bugun' },
  { id: '2', title: 'Grammar — Past Perfect', subject: 'Ingliz', subjectColor: 'var(--amber)', time: '11:05', section: 'Bugun' },
  { id: '3', title: 'Nyuton qonunlari tushuntir', subject: 'Fizika', subjectColor: 'var(--purple)', time: '19:47', section: 'Kecha' },
  { id: '4', title: 'Molyar massa hisoblash', subject: 'Kimyo', subjectColor: 'var(--red)', time: '16:20', section: 'Kecha' },
  { id: '5', title: 'Logarifm qoidalari', subject: 'Matematika', subjectColor: 'var(--teal)', time: '21:15', section: '22-may' },
  { id: '6', title: 'Trigonometriya asoslari', subject: 'Matematika', subjectColor: 'var(--teal)', time: '18:03', section: '22-may' },
];

const ctxChips = [
  { key: 'math', label: 'Matematika', icon: IconMathFunction, color: 'var(--teal)', dim: 'var(--teal-dim)', border: 'var(--teal-border)' },
  { key: 'phys', label: 'Fizika', icon: IconAtom, color: 'var(--purple)', dim: 'var(--purple-dim)', border: 'rgba(129,140,248,0.3)' },
  { key: 'eng', label: 'Ingliz tili', icon: IconLanguage, color: 'var(--amber)', dim: 'var(--amber-dim)', border: 'rgba(251,191,36,0.3)' },
  { key: 'chem', label: 'Kimyo', icon: IconFlask, color: 'var(--red)', dim: 'var(--red-dim)', border: 'rgba(248,113,113,0.3)' },
];

const quickSuggestions = [
  'Misollar keltir', 'Qoidalarni sanab ber', 'Boshqacha tushuntir',
  'DTM savollari bor?', 'Formulalarni yoz', 'Progress ko\'rsat',
];

const AITutor = () => {
  const [activeCtx, setActiveCtx] = useState('math');
  const [activeChat, setActiveChat] = useState('1');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: "Assalomu alaykum, Kumush! 👋\n\nMen AbiturAI Tutor — DTM ga tayyorlanishda sizga yordam beraman. Hozir Matematika · Algebra konteksti faol.\n\nQanday savol bor?", time: '14:28' },
    { role: 'user', text: 'Kvadrat tenglama diskriminantini tushuntirib ber', time: '14:29' },
    { role: 'ai', text: "Albatta! Diskriminant — bu kvadrat tenglamaning yechim sonini aniqlovchi qiymat.", time: '14:29', formula: 'D = b² − 4ac', steps: ["b² ni hisoblaymiz", "4ac ni hisoblaymiz", "D = b² − 4ac farqini olamiz"] },
  ]);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages, isTyping]);

  const getTime = () => {
    const d = new Date();
    return d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
  };

  const sendMessage = (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isTyping) return;
    setMessages((prev) => [...prev, { role: 'user', text: msg, time: getTime() }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        role: 'ai',
        text: "Bu juda yaxshi savol! Keling, bosqichma-bosqich ko'rib chiqamiz.",
        time: getTime(),
        formula: 'ax² + bx + c = 0',
        steps: ["Avval asosiy formulani yozamiz", "Berilgan qiymatlarni qo'yamiz", "Hisob-kitob qilamiz"],
      }]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const sections = [...new Set(chatHistoryData.map((h) => h.section))];

  return (
    <div style={{ flex: 1, display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* History panel */}
      <div style={{ width: 240, height: '100%', background: 'var(--bg2)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>Suhbatlar</div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--purple-dim)', border: '1px solid rgba(129,140,248,0.3)', borderRadius: 'var(--r-sm)', padding: '7px 12px', fontSize: 12, color: 'var(--purple)', cursor: 'pointer', fontWeight: 500, width: '100%', fontFamily: "'DM Sans', sans-serif" }}>
            <IconPlus size={14} /> Yangi suhbat
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '7px 10px', marginTop: 10 }}>
            <IconSearch size={15} style={{ color: 'var(--text3)', flexShrink: 0 }} />
            <input placeholder="Qidirish..." style={{ background: 'none', border: 'none', outline: 'none', fontSize: 12, color: 'var(--text)', fontFamily: "'DM Sans', sans-serif", width: '100%' }} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
          {sections.map((section) => (
            <div key={section}>
              <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em', padding: '8px 6px 4px' }}>{section}</div>
              {chatHistoryData.filter((h) => h.section === section).map((h) => (
                <div key={h.id} onClick={() => setActiveChat(h.id)}
                  style={{ padding: '9px 10px', borderRadius: 'var(--r-sm)', cursor: 'pointer', marginBottom: 2, border: `1px solid ${activeChat === h.id ? 'rgba(129,140,248,0.3)' : 'transparent'}`, background: activeChat === h.id ? 'var(--bg3)' : 'transparent' }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ background: `${h.subjectColor}1a`, color: h.subjectColor, padding: '2px 6px', borderRadius: 10, fontSize: 10, fontWeight: 500 }}>{h.subject}</span>
                    <span>{h.time}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Chat main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--border)', background: 'rgba(7,9,15,0.9)', backdropFilter: 'blur(8px)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--purple-dim)', border: '1px solid rgba(129,140,248,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconBrain size={18} style={{ color: 'var(--purple)' }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>AbiturAI Tutor</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--teal)' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', animation: 'pulse-dot 2s infinite' }} />
                Faol · Gemini
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {[IconSearch, IconSettings, IconMaximize].map((Icon, i) => (
              <div key={i} style={{ width: 34, height: 34, borderRadius: 'var(--r-sm)', background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Icon size={16} style={{ color: 'var(--text2)' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Context chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', flexShrink: 0 }}>
          <span style={{ fontSize: 11, color: 'var(--text3)' }}>Kontekst:</span>
          {ctxChips.map((c) => {
            const Icon = c.icon;
            const isActive = activeCtx === c.key;
            return (
              <div key={c.key} onClick={() => setActiveCtx(c.key)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, cursor: 'pointer', background: c.dim, color: c.color, border: `1px solid ${isActive ? c.color : c.border}`, boxShadow: isActive ? `0 0 0 1px ${c.color}` : 'none' }}>
                <Icon size={12} /> {c.label}
              </div>
            );
          })}
        </div>

        {/* Messages */}
        <div ref={messagesRef} style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', ...(m.role === 'ai' ? { background: 'var(--purple-dim)', border: '1px solid rgba(129,140,248,0.3)' } : { background: 'linear-gradient(135deg,var(--teal),var(--purple))' }) }}>
                {m.role === 'ai' ? <IconBrain size={15} style={{ color: 'var(--purple)' }} /> : <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>K</span>}
              </div>
              <div style={{ maxWidth: '72%', display: 'flex', flexDirection: 'column', gap: 4, alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ padding: '12px 15px', borderRadius: m.role === 'ai' ? '14px 14px 14px 4px' : '14px 14px 4px 14px', fontSize: 14, lineHeight: 1.7, background: m.role === 'ai' ? 'var(--bg2)' : 'var(--purple-dim)', border: `1px solid ${m.role === 'ai' ? 'var(--border)' : 'rgba(129,140,248,0.3)'}`, color: m.role === 'ai' ? 'var(--text2)' : 'var(--text)', whiteSpace: 'pre-wrap' }}>
                  {m.text}
                  {m.formula && (
                    <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '10px 14px', margin: '8px 0', fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--teal)' }}>{m.formula}</div>
                  )}
                  {m.steps && (
                    <div style={{ margin: '8px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {m.steps.map((s, j) => (
                        <div key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: 'var(--text2)' }}>
                          <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--purple-dim)', border: '1px solid rgba(129,140,248,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--purple)', fontWeight: 700, flexShrink: 0 }}>{j + 1}</div>
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ fontSize: 10, color: 'var(--text3)' }}>{m.time}</div>
                  {m.role === 'ai' && (
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[IconCopy, IconThumbUp, IconThumbDown, IconRefresh].map((Icon, j) => (
                        <button key={j} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 6px', borderRadius: 20, fontSize: 11, color: 'var(--text3)', cursor: 'pointer', background: 'transparent', border: 'none', fontFamily: "'DM Sans', sans-serif" }}>
                          <Icon size={13} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--purple-dim)', border: '1px solid rgba(129,140,248,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconBrain size={15} style={{ color: 'var(--purple)' }} />
              </div>
              <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '14px 14px 14px 4px', padding: '13px 18px', display: 'flex', gap: 5 }}>
                {[0, 1, 2].map((j) => (
                  <div key={j} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text3)', animation: `pulse-dot 1.4s infinite ${j * 0.2}s` }} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick suggestions */}
        <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 7, overflowX: 'auto', flexShrink: 0 }}>
          {quickSuggestions.map((s, i) => (
            <div key={i} onClick={() => sendMessage(s)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 20, padding: '6px 13px', fontSize: 12, color: 'var(--text2)', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {s}
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', flexShrink: 0, background: 'var(--bg)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '10px 12px' }}>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {[IconPhoto, IconMath].map((Icon, i) => (
                <div key={i} style={{ width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text3)' }}>
                  <Icon size={16} />
                </div>
              ))}
              <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 2px' }} />
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Savol yozing... (Shift+Enter yangi qator)"
              rows={1}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 14, color: 'var(--text)', fontFamily: "'DM Sans', sans-serif", resize: 'none', lineHeight: 1.6, maxHeight: 120, minHeight: 24 }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, color: 'var(--text3)' }}>{input.length}</span>
              <button onClick={() => sendMessage()} disabled={!input.trim()}
                style={{ width: 36, height: 36, borderRadius: 'var(--r-sm)', background: 'var(--purple)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'not-allowed', opacity: input.trim() ? 1 : 0.4, flexShrink: 0 }}>
                <IconSend size={16} style={{ color: '#fff' }} />
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, padding: '0 2px' }}>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>
              <kbd style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 4, padding: '1px 5px', fontSize: 10, fontFamily: "'DM Mono', monospace", color: 'var(--text2)' }}>Enter</kbd> yuborish · <kbd style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 4, padding: '1px 5px', fontSize: 10, fontFamily: "'DM Mono', monospace", color: 'var(--text2)' }}>Shift+Enter</kbd> yangi qator
            </div>
            <div style={{ fontSize: 11, color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <IconBrain size={12} style={{ color: 'var(--purple)' }} /> Gemini · DTM konteksti faol
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITutor;
