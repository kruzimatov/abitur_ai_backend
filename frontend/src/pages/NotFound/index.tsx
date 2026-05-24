import { Link } from 'react-router-dom';
import { IconArrowLeft, IconMoodSad } from '@tabler/icons-react';

const NotFound = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'grid', placeItems: 'center', padding: 20 }}>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <IconMoodSad size={56} style={{ color: 'var(--text3)', marginBottom: 16 }} />
        <div style={{ fontSize: 72, fontWeight: 800, color: 'var(--text)', fontFamily: "'DM Serif Display', serif", lineHeight: 1 }}>404</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text2)', marginTop: 12, marginBottom: 8 }}>Sahifa topilmadi</div>
        <div style={{ fontSize: 14, color: 'var(--text3)', marginBottom: 28, lineHeight: 1.6 }}>
          Siz qidirayotgan sahifa mavjud emas yoki boshqa manzilga ko'chirilgan.
        </div>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--teal)', border: 'none', borderRadius: 'var(--r)', padding: '12px 24px', fontSize: 14, fontWeight: 800, color: '#07090F', textDecoration: 'none' }}>
          <IconArrowLeft size={16} /> Bosh sahifaga qaytish
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
