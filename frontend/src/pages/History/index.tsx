import { useEffect, useState } from 'react';
import { message } from 'antd';
import { IconChevronLeft, IconChevronRight, IconHistory, IconRefresh } from '@tabler/icons-react';
import { quizService } from '../../services/quiz';
import type { PaginatedResponse, QuizAttempt } from '../../types';

function formatDate(date: string | null) {
  if (!date) return 'Noma\'lum';
  return new Intl.DateTimeFormat('uz-UZ', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

const History = () => {
  const [page, setPage] = useState(1);
  const [history, setHistory] = useState<PaginatedResponse<QuizAttempt> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = async (nextPage = page) => {
    setIsLoading(true);
    try {
      setHistory(await quizService.getQuizHistory(nextPage, 10));
      setPage(nextPage);
    } catch {
      message.error('Test tarixi yuklanmadi');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, []);

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 28px', borderBottom: '1px solid var(--border)', background: 'rgba(7,9,15,0.8)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <IconHistory size={20} style={{ color: 'var(--teal)' }} />
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>Test tarixi</div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>{history?.total ?? 0} ta urinish</div>
          </div>
        </div>
        <button onClick={() => load(page)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '8px 12px', color: 'var(--text2)', cursor: 'pointer' }}>
          <IconRefresh size={16} /> Yangilash
        </button>
      </div>

      <div style={{ padding: 28 }}>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
          {isLoading ? (
            <div style={{ padding: 20, color: 'var(--text2)' }}>Tarix yuklanmoqda...</div>
          ) : history?.data.length ? history.data.map((attempt) => {
            const percentage = attempt.total ? Math.round((attempt.score / attempt.total) * 100) : 0;
            const color = percentage >= 70 ? 'var(--green)' : percentage >= 40 ? 'var(--amber)' : 'var(--red)';
            return (
              <div key={attempt.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 16, alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{attempt.topic?.title ?? 'Mock test'}</div>
                  <div style={{ color: 'var(--text3)', fontSize: 12 }}>{formatDate(attempt.completed_at)}</div>
                </div>
                <div style={{ color: 'var(--text2)', fontSize: 13 }}>{attempt.score}/{attempt.total}</div>
                <div style={{ minWidth: 62, textAlign: 'right', color, fontWeight: 900 }}>{percentage}%</div>
              </div>
            );
          }) : (
            <div style={{ padding: 20, color: 'var(--text3)' }}>Hali test yechilmagan.</div>
          )}
        </div>

        {history && history.last_page > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 18 }}>
            <button onClick={() => load(page - 1)} disabled={page <= 1} style={{ width: 36, height: 36, borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text2)', display: 'grid', placeItems: 'center', cursor: page <= 1 ? 'not-allowed' : 'pointer', opacity: page <= 1 ? 0.4 : 1 }}>
              <IconChevronLeft size={17} />
            </button>
            <span style={{ color: 'var(--text2)', fontSize: 13 }}>{history.current_page} / {history.last_page}</span>
            <button onClick={() => load(page + 1)} disabled={page >= history.last_page} style={{ width: 36, height: 36, borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text2)', display: 'grid', placeItems: 'center', cursor: page >= history.last_page ? 'not-allowed' : 'pointer', opacity: page >= history.last_page ? 0.4 : 1 }}>
              <IconChevronRight size={17} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
