import { useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import {
  IconUsers,
  IconBooks,
  IconClipboardList,
  IconQuestionMark,
  IconClipboardCheck,
  IconServer,
  IconBrain,
  IconUpload,
  IconFile,
  IconCheck,
  IconRefresh,
  IconX,
} from '@tabler/icons-react';
import { adminService, type AdminDashboardData, type RagHealth, type UploadResult } from '../../services/admin';
import { subjectService } from '../../services/subjects';
import { useAuth } from '../../hooks/useAuth';
import type { Subject } from '../../types';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [ragHealth, setRagHealth] = useState<RagHealth | null>(null);
  const [ragLoading, setRagLoading] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [dashData, subjectData] = await Promise.all([
        adminService.getDashboard(),
        subjectService.getSubjects(),
      ]);
      setDashboard(dashData);
      setSubjects(Array.isArray(subjectData) ? subjectData : []);
    } catch {
      message.error("Ma'lumotlarni yuklashda xato");
    } finally {
      setLoading(false);
    }
  };

  const checkRag = async () => {
    setRagLoading(true);
    try {
      const data = await adminService.getRagHealth();
      setRagHealth(data);
    } catch {
      setRagHealth(null);
    } finally {
      setRagLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    checkRag();
  }, []);

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'grid', placeItems: 'center' }}>
        <div style={{ color: 'var(--text3)', fontSize: 14 }}>Yuklanmoqda...</div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div style={{ flex: 1, display: 'grid', placeItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <IconServer size={48} style={{ color: 'var(--text3)', marginBottom: 12 }} />
          <div style={{ color: 'var(--text2)', fontSize: 15 }}>Ma'lumotlarni yuklash imkoni bo'lmadi</div>
          <button onClick={loadAll} style={{ marginTop: 12, background: 'var(--teal)', border: 'none', borderRadius: 'var(--r-sm)', padding: '10px 20px', color: '#07090F', fontWeight: 700, cursor: 'pointer' }}>Qayta yuklash</button>
        </div>
      </div>
    );
  }

  const stats = [
    { icon: IconUsers, color: 'var(--teal)', dim: 'var(--teal-dim)', border: 'var(--teal-border)', value: dashboard.total_users, label: 'Foydalanuvchilar', sub: 'Barcha rollar' },
    { icon: IconBooks, color: 'var(--purple)', dim: 'var(--purple-dim)', border: 'rgba(129,140,248,0.3)', value: dashboard.total_subjects, label: 'Fanlar', sub: 'Faol fanlar' },
    { icon: IconClipboardList, color: 'var(--amber)', dim: 'var(--amber-dim)', border: 'rgba(251,191,36,0.3)', value: dashboard.total_topics, label: 'Mavzular', sub: 'Barcha fanlar' },
    { icon: IconQuestionMark, color: 'var(--green)', dim: 'var(--green-dim)', border: 'rgba(52,211,153,0.3)', value: dashboard.total_questions, label: 'Savollar', sub: "Test bazasi" },
    { icon: IconClipboardCheck, color: 'var(--red)', dim: 'var(--red-dim)', border: 'rgba(248,113,113,0.3)', value: dashboard.total_quiz_attempts, label: 'Test urinishlari', sub: "Jami o'tkazilgan" },
  ];

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ padding: '24px 28px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Admin paneli</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>
            Assalomu alaykum, {user?.firstname}!
          </div>
        </div>
        <button onClick={loadAll} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '9px 14px', color: 'var(--text2)', cursor: 'pointer' }}>
          <IconRefresh size={16} /> Yangilash
        </button>
      </div>

      <div style={{ padding: '24px 28px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 28 }}>
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--r-sm)', background: s.dim, border: `1px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} style={{ color: s.color }} />
                  </div>
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)', fontFamily: "'DM Serif Display', serif" }}>{s.value}</div>
                <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{s.sub}</div>
              </div>
            );
          })}
        </div>

        {/* Material Upload + RAG Health */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <MaterialUpload subjects={subjects} onSuccess={checkRag} />
          <RagHealthPanel health={ragHealth} loading={ragLoading} onRefresh={checkRag} />
        </div>

        {/* System Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <IconBrain size={18} style={{ color: 'var(--teal)' }} />
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Tizim xizmatlari</div>
            </div>
            <div style={{ padding: '12px 0' }}>
              {[
                { name: 'Gemini AI', status: 'Faol', color: 'var(--green)' },
                { name: 'RAG Qidiruv', status: ragHealth ? 'Faol' : 'Nofaol', color: ragHealth ? 'var(--green)' : 'var(--red)' },
                { name: 'JWT Auth', status: 'Faol', color: 'var(--green)' },
                { name: "Ma'lumotlar bazasi", status: 'Faol', color: 'var(--green)' },
              ].map((service) => (
                <div key={service.name} style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, color: 'var(--text)' }}>{service.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: service.color }} />
                    <span style={{ fontSize: 12, color: service.color, fontWeight: 500 }}>{service.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <IconServer size={18} style={{ color: 'var(--purple)' }} />
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Tezkor ma'lumot</div>
            </div>
            <div style={{ padding: '12px 0' }}>
              {[
                { label: "O'rtacha test bali", value: dashboard.total_quiz_attempts > 0 ? 'Faol' : 'Hali yo\'q' },
                { label: 'Fan/Mavzu nisbati', value: dashboard.total_subjects > 0 ? `${(dashboard.total_topics / dashboard.total_subjects).toFixed(1)} mavzu/fan` : '--' },
                { label: 'Savol/Mavzu nisbati', value: dashboard.total_topics > 0 ? `${(dashboard.total_questions / dashboard.total_topics).toFixed(1)} savol/mavzu` : '--' },
                { label: 'Platform versiyasi', value: 'v1.0.0' },
              ].map((item) => (
                <div key={item.label} style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, color: 'var(--text2)' }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function MaterialUpload({ subjects, onSuccess }: { subjects: Subject[]; onSuccess: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [subjectId, setSubjectId] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !subjectId) {
      message.warning('Fayl va fanni tanlang');
      return;
    }
    setUploading(true);
    try {
      const data = await adminService.uploadMaterial(selectedFile, subjectId, title || undefined);
      setResult(data);
      message.success(`Material yuklandi: ${data.chunks} chunk, ${data.characters} belgi`);
      setSelectedFile(null);
      setTitle('');
      if (fileRef.current) fileRef.current.value = '';
      onSuccess();
    } catch {
      message.error("Material yuklanmadi. RAG xizmati ishlamayotgan bo'lishi mumkin.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <IconUpload size={18} style={{ color: 'var(--teal)' }} />
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Material yuklash</div>
      </div>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.6 }}>
          PDF, DOCX yoki TXT fayl yuklang — AI avtomatik bo'limlarga ajratadi va RAG bazasiga qo'shadi. Shundan keyin AI Tutor bu ma'lumotlardan foydalanadi.
        </div>

        {/* Subject select */}
        <select
          value={subjectId}
          onChange={(e) => setSubjectId(Number(e.target.value))}
          style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', color: 'var(--text)', padding: '10px 12px', outline: 'none', fontSize: 13 }}
        >
          <option value={0}>Fan tanlang...</option>
          {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        {/* Title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Material nomi (ixtiyoriy)"
          style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', color: 'var(--text)', padding: '10px 12px', outline: 'none', fontSize: 13 }}
        />

        {/* File select */}
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <button
          onClick={() => fileRef.current?.click()}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: '16px 20px', borderRadius: 'var(--r-sm)',
            border: '2px dashed var(--border2)', background: 'var(--bg3)',
            color: selectedFile ? 'var(--text)' : 'var(--text3)',
            cursor: 'pointer', fontSize: 13,
          }}
        >
          <IconFile size={18} />
          {selectedFile ? `${selectedFile.name} (${(selectedFile.size / 1024).toFixed(0)} KB)` : 'PDF, DOCX yoki TXT tanlang'}
        </button>

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={!selectedFile || !subjectId || uploading}
          style={{
            background: !selectedFile || !subjectId ? 'var(--bg3)' : 'var(--teal)',
            border: 'none', borderRadius: 'var(--r-sm)', padding: '12px 20px',
            fontSize: 14, fontWeight: 800,
            color: !selectedFile || !subjectId ? 'var(--text3)' : '#07090F',
            cursor: !selectedFile || !subjectId || uploading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <IconUpload size={16} /> {uploading ? 'Yuklanmoqda...' : 'RAG bazasiga yuklash'}
        </button>

        {/* Result */}
        {result && (
          <div style={{ padding: 14, background: 'var(--green-dim)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <IconCheck size={18} style={{ color: 'var(--green)', flexShrink: 0 }} />
            <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--green)' }}>{result.subject}</strong> faniga yuklandi: {result.chunks} chunk, {result.characters} belgi
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RagHealthPanel({ health, loading, onRefresh }: { health: RagHealth | null; loading: boolean; onRefresh: () => void }) {
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <IconBrain size={18} style={{ color: 'var(--purple)' }} />
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>RAG bazasi</div>
        </div>
        <button onClick={onRefresh} disabled={loading} style={{ width: 30, height: 30, borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--text2)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
          <IconRefresh size={14} />
        </button>
      </div>
      <div style={{ padding: 20 }}>
        {loading ? (
          <div style={{ color: 'var(--text3)', fontSize: 13 }}>Tekshirilmoqda...</div>
        ) : !health ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 14, background: 'var(--red-dim)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 'var(--r-sm)' }}>
            <IconX size={18} style={{ color: 'var(--red)', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--red)' }}>RAG xizmati ishlamayapti</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>Serverda rag_service ni ishga tushiring</div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 10, background: 'var(--green-dim)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 'var(--r-sm)' }}>
              <IconCheck size={16} style={{ color: 'var(--green)' }} />
              <span style={{ fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>RAG xizmati faol</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ padding: 14, background: 'var(--bg3)', borderRadius: 'var(--r-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--purple)', fontFamily: "'DM Serif Display', serif" }}>{health.total_documents}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>Hujjatlar</div>
              </div>
              <div style={{ padding: 14, background: 'var(--bg3)', borderRadius: 'var(--r-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--teal)', fontFamily: "'DM Serif Display', serif" }}>{health.total_topics}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>Mavzular</div>
              </div>
            </div>

            {health.subjects.length > 0 && (
              <div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 6 }}>Indekslangan fanlar:</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {health.subjects.map((s) => (
                    <span key={s} style={{ background: 'var(--purple-dim)', color: 'var(--purple)', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
