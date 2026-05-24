import { message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  background: 'var(--bg3)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--r-sm)',
  color: 'var(--text)',
  fontSize: 14,
  outline: 'none',
  transition: 'border-color 0.2s',
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login({
        email: formData.email.trim(),
        password: formData.password,
      });
      message.success('Tizimga xush kelibsiz!');
      navigate('/', { replace: true });
    } catch {
      message.error('Email yoki parol xato!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Kirish</div>
        <div style={{ fontSize: 13, color: 'var(--text3)' }}>AbiturAI hisobingizga kiring</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>Email</label>
        <input
          type="email"
          placeholder="sizning@email.com"
          value={formData.email}
          style={inputStyle}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--teal)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>Parol</label>
        <input
          type="password"
          placeholder="Parolingiz"
          value={formData.password}
          style={inputStyle}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--teal)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          width: '100%',
          padding: '12px 0',
          background: 'var(--teal)',
          color: '#07090F',
          fontSize: 14,
          fontWeight: 700,
          border: 'none',
          borderRadius: 'var(--r-sm)',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          opacity: isSubmitting ? 0.6 : 1,
          transition: 'opacity 0.2s',
          marginTop: 4,
        }}
      >
        {isSubmitting ? 'Kirilmoqda...' : 'Kirish'}
      </button>
    </form>
  );
};

export default Login;
