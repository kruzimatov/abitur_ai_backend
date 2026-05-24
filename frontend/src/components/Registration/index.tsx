import { message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/auth';
import type { Field, RegisterData, SubjectShort } from '../../types';

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

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none' as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 14px center',
  paddingRight: 36,
};

const Registration = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [fields, setFields] = useState<Field[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<RegisterData>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    password_confirmation: '',
    gender: 'male',
    role: 'student',
    field_id: undefined,
    subject_id: undefined,
  });

  const subjects = useMemo(() => {
    const map = new Map<number, SubjectShort>();
    fields.forEach((field) => field.subjects?.forEach((subject) => map.set(subject.id, subject)));
    return Array.from(map.values());
  }, [fields]);

  useEffect(() => {
    authService.getFields()
      .then((data) => {
        setFields(data);
        setFormData((prev) => ({
          ...prev,
          field_id: prev.field_id ?? data[0]?.id,
          subject_id: prev.subject_id ?? data[0]?.subjects?.[0]?.id,
        }));
      })
      .catch(() => message.error("Yo'nalishlar ro'yxati yuklanmadi"));
  }, []);

  const updateField = <K extends keyof RegisterData>(key: K, value: RegisterData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const payload: RegisterData = {
      firstname: formData.firstname.trim(),
      lastname: formData.lastname.trim(),
      email: formData.email.trim(),
      password: formData.password,
      password_confirmation: formData.password_confirmation,
      gender: formData.gender,
      role: formData.role,
      ...(formData.role === 'student' ? { field_id: formData.field_id } : { subject_id: formData.subject_id }),
    };

    try {
      await register(payload);
      message.success('Hisob yaratildi');
      navigate('/', { replace: true });
    } catch {
      message.error("Ma'lumotlarni tekshirib qayta urinib ko'ring");
    } finally {
      setIsSubmitting(false);
    }
  };

  const focusHandler = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'var(--teal)';
  };
  const blurHandler = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'var(--border)';
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Hisob yaratish</div>
        <div style={{ fontSize: 13, color: 'var(--text3)' }}>Bepul boshlang</div>
      </div>

      {/* Name row */}
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>Ism</label>
          <input value={formData.firstname} onChange={(e) => updateField('firstname', e.target.value)} placeholder="Alisher" style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} required />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>Familiya</label>
          <input value={formData.lastname} onChange={(e) => updateField('lastname', e.target.value)} placeholder="Karimov" style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} required />
        </div>
      </div>

      {/* Email */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>Email</label>
        <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} placeholder="sizning@email.com" style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} required />
      </div>

      {/* Password */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>Parol</label>
        <input type="password" value={formData.password} onChange={(e) => updateField('password', e.target.value)} placeholder="Kamida 6 belgi" style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} required minLength={6} />
      </div>

      {/* Confirm password */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>Parolni tasdiqlang</label>
        <input type="password" value={formData.password_confirmation} onChange={(e) => updateField('password_confirmation', e.target.value)} placeholder="Parolni qayta yozing" style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} required minLength={6} />
      </div>

      {/* Gender + Role */}
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>Jins</label>
          <select value={formData.gender} onChange={(e) => updateField('gender', e.target.value as RegisterData['gender'])} style={selectStyle} onFocus={focusHandler} onBlur={blurHandler}>
            <option value="male">Erkak</option>
            <option value="female">Ayol</option>
          </select>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>Rol</label>
          <select value={formData.role} onChange={(e) => updateField('role', e.target.value as RegisterData['role'])} style={selectStyle} onFocus={focusHandler} onBlur={blurHandler}>
            <option value="student">O'quvchi</option>
            <option value="teacher">O'qituvchi</option>
          </select>
        </div>
      </div>

      {/* Field / Subject */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>
          {formData.role === 'student' ? "Yo'nalish" : 'Fan'}
        </label>
        <select
          value={formData.role === 'student' ? formData.field_id ?? '' : formData.subject_id ?? ''}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (formData.role === 'student') updateField('field_id', value);
            else updateField('subject_id', value);
          }}
          style={selectStyle}
          onFocus={focusHandler}
          onBlur={blurHandler}
          required
        >
          {(formData.role === 'student' ? fields : subjects).map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
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
        {isSubmitting ? 'Yaratilmoqda...' : 'Hisob yaratish'}
      </button>
    </form>
  );
};

export default Registration;
