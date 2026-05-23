import { useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import {
  IconBrain,
  IconCopy,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconSend,
  IconTrash,
} from '@tabler/icons-react';
import { chatService } from '../../services/chat';
import { subjectService } from '../../services/subjects';
import { getSubjectColor } from '../../utils/subjectColors';
import type { ChatMessage, ChatSession, Subject } from '../../types';

const quickSuggestions = [
  'Misollar keltir',
  'Qoidalarni sanab ber',
  'Boshqacha tushuntir',
  'DTM formatida savol ber',
  'Formulalarni yoz',
];

function formatTime(date: string) {
  return new Intl.DateTimeFormat('uz-UZ', { hour: '2-digit', minute: '2-digit' }).format(new Date(date));
}

function groupLabel(date: string) {
  const value = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (value.toDateString() === today.toDateString()) return 'Bugun';
  if (value.toDateString() === yesterday.toDateString()) return 'Kecha';
  return new Intl.DateTimeFormat('uz-UZ', { day: '2-digit', month: 'short' }).format(value);
}

const AITutor = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | undefined>(undefined);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const loadInitial = async () => {
    setIsLoading(true);
    try {
      const [subjectData, sessionData] = await Promise.all([
        subjectService.getSubjects(),
        chatService.getChatHistory(),
      ]);
      setSubjects(subjectData);
      setSessions(sessionData);
      setSelectedSubjectId((prev) => prev ?? subjectData[0]?.id);

      const firstSession = sessionData[0];
      if (firstSession) {
        setActiveSessionId(firstSession.id);
        const fullSession = await chatService.getChat(firstSession.id);
        setMessages(fullSession.messages ?? []);
      }
    } catch {
      message.error('AI Tutor ma\'lumotlari yuklanmadi');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitial();
  }, []);

  const filteredSessions = sessions.filter((session) => session.title.toLowerCase().includes(search.toLowerCase()));
  const groupedSessions = useMemo(() => {
    return filteredSessions.reduce<Record<string, ChatSession[]>>((groups, session) => {
      const label = groupLabel(session.updated_at);
      groups[label] = groups[label] ?? [];
      groups[label].push(session);
      return groups;
    }, {});
  }, [filteredSessions]);

  const activeSession = sessions.find((session) => session.id === activeSessionId) ?? null;

  const loadSession = async (sessionId: number) => {
    setActiveSessionId(sessionId);
    try {
      const session = await chatService.getChat(sessionId);
      setMessages(session.messages ?? []);
    } catch {
      message.error('Suhbat ochilmadi');
    }
  };

  const createSession = async () => {
    try {
      const session = await chatService.createChat(selectedSubjectId);
      setSessions((prev) => [session, ...prev]);
      setActiveSessionId(session.id);
      setMessages([]);
    } catch {
      message.error('Yangi suhbat yaratilmadi');
    }
  };

  const deleteSession = async (sessionId: number) => {
    try {
      await chatService.deleteChat(sessionId);
      const nextSessions = sessions.filter((session) => session.id !== sessionId);
      setSessions(nextSessions);
      if (activeSessionId === sessionId) {
        const next = nextSessions[0];
        setActiveSessionId(next?.id ?? null);
        setMessages([]);
        if (next) loadSession(next.id);
      }
      message.success("Suhbat o'chirildi");
    } catch {
      message.error("Suhbat o'chirilmadi");
    }
  };

  const sendMessage = async (text?: string) => {
    const question = (text ?? input).trim();
    if (!question || isTyping) return;

    let sessionId = activeSessionId;
    setInput('');
    setIsTyping(true);

    try {
      if (!sessionId) {
        const session = await chatService.createChat(selectedSubjectId);
        sessionId = session.id;
        setSessions((prev) => [session, ...prev]);
        setActiveSessionId(session.id);
      }

      const tempMessage: ChatMessage = {
        id: Date.now(),
        chat_session_id: sessionId,
        role: 'user',
        content: question,
        sources: null,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempMessage]);

      const response = await chatService.askChat(sessionId, question);
      setMessages((prev) => [...prev.filter((item) => item.id !== tempMessage.id), response.user_message, response.ai_message]);
      setSessions(await chatService.getChatHistory());
    } catch {
      message.error('Xabar yuborilmadi');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', height: '100%', overflow: 'hidden' }}>
      <div style={{ width: 260, height: '100%', background: 'var(--bg2)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Suhbatlar</div>
            <button onClick={loadInitial} style={{ width: 30, height: 30, display: 'grid', placeItems: 'center', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', color: 'var(--text2)', cursor: 'pointer' }}>
              <IconRefresh size={14} />
            </button>
          </div>
          <button onClick={createSession} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'var(--purple-dim)', border: '1px solid rgba(129,140,248,0.3)', borderRadius: 'var(--r-sm)', padding: '8px 12px', fontSize: 12, color: 'var(--purple)', cursor: 'pointer', fontWeight: 700, width: '100%' }}>
            <IconPlus size={14} /> Yangi suhbat
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '7px 10px', marginTop: 10 }}>
            <IconSearch size={15} style={{ color: 'var(--text3)', flexShrink: 0 }} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Qidirish..." style={{ background: 'none', border: 'none', outline: 'none', fontSize: 12, color: 'var(--text)', width: '100%' }} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
          {isLoading ? <div style={{ color: 'var(--text3)', fontSize: 12, padding: 8 }}>Yuklanmoqda...</div> : Object.entries(groupedSessions).map(([section, items]) => (
            <div key={section}>
              <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 6px 4px' }}>{section}</div>
              {items.map((session) => {
                const colors = getSubjectColor(session.subject?.name ?? 'Tutor');
                return (
                  <div key={session.id} onClick={() => loadSession(session.id)} style={{ padding: '9px 10px', borderRadius: 'var(--r-sm)', cursor: 'pointer', marginBottom: 2, border: `1px solid ${activeSessionId === session.id ? 'rgba(129,140,248,0.3)' : 'transparent'}`, background: activeSessionId === session.id ? 'var(--bg3)' : 'transparent' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{session.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ background: colors.dim, color: colors.color, padding: '2px 6px', borderRadius: 10, fontSize: 10, fontWeight: 600 }}>{session.subject?.name ?? 'Umumiy'}</span>
                          <span>{formatTime(session.updated_at)}</span>
                        </div>
                      </div>
                      <button onClick={(event) => { event.stopPropagation(); deleteSession(session.id); }} style={{ width: 26, height: 26, border: 0, background: 'transparent', color: 'var(--text3)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                        <IconTrash size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          {!isLoading && sessions.length === 0 && <div style={{ color: 'var(--text3)', fontSize: 12, padding: 8 }}>Hali suhbat yo'q.</div>}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--border)', background: 'rgba(7,9,15,0.9)', backdropFilter: 'blur(8px)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--purple-dim)', border: '1px solid rgba(129,140,248,0.3)', display: 'grid', placeItems: 'center' }}>
              <IconBrain size={18} style={{ color: 'var(--purple)' }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{activeSession?.title ?? 'AbiturAI Tutor'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--teal)' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', animation: 'pulse-dot 2s infinite' }} />
                RAG · Gemini · {activeSession?.subject?.name ?? 'Umumiy kontekst'}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', flexShrink: 0, overflowX: 'auto' }}>
          <span style={{ fontSize: 11, color: 'var(--text3)', flexShrink: 0 }}>Yangi suhbat konteksti:</span>
          {subjects.map((subject) => {
            const colors = getSubjectColor(subject.name);
            const isActive = selectedSubjectId === subject.id;
            return (
              <button key={subject.id} onClick={() => setSelectedSubjectId(subject.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: 'pointer', background: colors.dim, color: colors.color, border: `1px solid ${isActive ? colors.color : colors.border}`, boxShadow: isActive ? `0 0 0 1px ${colors.color}` : 'none', whiteSpace: 'nowrap' }}>
                {subject.name}
              </button>
            );
          })}
        </div>

        <div ref={messagesRef} style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.length === 0 && (
            <div style={{ margin: 'auto', maxWidth: 420, textAlign: 'center', color: 'var(--text3)', lineHeight: 1.7 }}>
              <IconBrain size={34} style={{ color: 'var(--purple)', marginBottom: 10 }} />
              <div style={{ color: 'var(--text)', fontWeight: 800, marginBottom: 4 }}>Savol berishga tayyor</div>
              <div style={{ fontSize: 13 }}>Yangi suhbat yarating yoki pastdan savol yuboring.</div>
            </div>
          )}
          {messages.map((item) => <MessageBubble key={item.id} message={item} />)}
          {isTyping && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--purple-dim)', border: '1px solid rgba(129,140,248,0.3)', display: 'grid', placeItems: 'center' }}>
                <IconBrain size={15} style={{ color: 'var(--purple)' }} />
              </div>
              <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '14px 14px 14px 4px', padding: '13px 18px', display: 'flex', gap: 5 }}>
                {[0, 1, 2].map((index) => <div key={index} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text3)', animation: `pulse-dot 1.4s infinite ${index * 0.2}s` }} />)}
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 7, overflowX: 'auto', flexShrink: 0 }}>
          {quickSuggestions.map((suggestion) => (
            <button key={suggestion} onClick={() => sendMessage(suggestion)} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 20, padding: '6px 13px', fontSize: 12, color: 'var(--text2)', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {suggestion}
            </button>
          ))}
        </div>

        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', flexShrink: 0, background: 'var(--bg)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '10px 12px' }}>
            <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendMessage(); } }} placeholder="Savol yozing..." rows={1} style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 14, color: 'var(--text)', resize: 'none', lineHeight: 1.6, maxHeight: 120, minHeight: 24 }} />
            <button onClick={() => sendMessage()} disabled={!input.trim() || isTyping} style={{ width: 36, height: 36, borderRadius: 'var(--r-sm)', background: 'var(--purple)', border: 'none', display: 'grid', placeItems: 'center', cursor: input.trim() ? 'pointer' : 'not-allowed', opacity: input.trim() ? 1 : 0.4, flexShrink: 0 }}>
              <IconSend size={16} style={{ color: '#fff' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexDirection: isUser ? 'row-reverse' : 'row' }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, display: 'grid', placeItems: 'center', ...(isUser ? { background: 'linear-gradient(135deg,var(--teal),var(--purple))' } : { background: 'var(--purple-dim)', border: '1px solid rgba(129,140,248,0.3)' }) }}>
        {isUser ? <span style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>S</span> : <IconBrain size={15} style={{ color: 'var(--purple)' }} />}
      </div>
      <div style={{ maxWidth: '72%', display: 'flex', flexDirection: 'column', gap: 4, alignItems: isUser ? 'flex-end' : 'flex-start' }}>
        <div style={{ padding: '12px 15px', borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px', fontSize: 14, lineHeight: 1.7, background: isUser ? 'var(--purple-dim)' : 'var(--bg2)', border: `1px solid ${isUser ? 'rgba(129,140,248,0.3)' : 'var(--border)'}`, color: isUser ? 'var(--text)' : 'var(--text2)', whiteSpace: 'pre-wrap' }}>
          {message.content}
          {!isUser && message.sources && message.sources.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
              {message.sources.map((source) => <span key={source} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text3)', borderRadius: 20, padding: '2px 8px', fontSize: 11 }}>{source}</span>)}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ fontSize: 10, color: 'var(--text3)' }}>{formatTime(message.created_at)}</div>
          {!isUser && (
            <button onClick={() => navigator.clipboard.writeText(message.content)} style={{ padding: '4px 6px', borderRadius: 20, color: 'var(--text3)', cursor: 'pointer', background: 'transparent', border: 'none' }}>
              <IconCopy size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AITutor;
