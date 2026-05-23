import { message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/auth';
import type { Field, RegisterData, SubjectShort } from '../../types';

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
      navigate('/dashboard', { replace: true });
    } catch {
      message.error("Ma'lumotlarni tekshirib qayta urinib ko'ring");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold text-white mb-1">Hisob yaratish</h2>
        <p className="text-gray-400 text-sm">Bepul boshlang</p>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-sm text-gray-300 block mb-1">Ism</label>
          <input value={formData.firstname} onChange={(e) => updateField('firstname', e.target.value)} placeholder="Alisher" className="w-full p-3 bg-transparent border border-gray-700 rounded-lg outline-none focus:border-blue-500 transition" required />
        </div>
        <div className="flex-1">
          <label className="text-sm text-gray-300 block mb-1">Familiya</label>
          <input value={formData.lastname} onChange={(e) => updateField('lastname', e.target.value)} placeholder="Karimov" className="w-full p-3 bg-transparent border border-gray-700 rounded-lg outline-none focus:border-blue-500 transition" required />
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-300 block mb-1">Email</label>
        <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} placeholder="sizning@email.com" className="w-full p-3 bg-transparent border border-gray-700 rounded-lg outline-none focus:border-blue-500 transition" required />
      </div>

      <div>
        <label className="text-sm text-gray-300 block mb-1">Parol</label>
        <input type="password" value={formData.password} onChange={(e) => updateField('password', e.target.value)} placeholder="Kamida 6 belgi" className="w-full p-3 bg-transparent border border-gray-700 rounded-lg outline-none focus:border-blue-500 transition" required minLength={6} />
      </div>

      <div>
        <label className="text-sm text-gray-300 block mb-1">Parolni tasdiqlang</label>
        <input type="password" value={formData.password_confirmation} onChange={(e) => updateField('password_confirmation', e.target.value)} placeholder="Parolni qayta yozing" className="w-full p-3 bg-transparent border border-gray-700 rounded-lg outline-none focus:border-blue-500 transition" required minLength={6} />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-sm text-gray-300 block mb-1">Jins</label>
          <select value={formData.gender} onChange={(e) => updateField('gender', e.target.value as RegisterData['gender'])} className="w-full p-3 bg-[#1A1A2E] border border-gray-700 rounded-lg outline-none text-white focus:border-blue-500 transition">
            <option value="male">Erkak</option>
            <option value="female">Ayol</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="text-sm text-gray-300 block mb-1">Rol</label>
          <select value={formData.role} onChange={(e) => updateField('role', e.target.value as RegisterData['role'])} className="w-full p-3 bg-[#1A1A2E] border border-gray-700 rounded-lg outline-none text-white focus:border-blue-500 transition">
            <option value="student">O'quvchi</option>
            <option value="teacher">O'qituvchi</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-300 block mb-1">{formData.role === 'student' ? "Yo'nalish" : 'Fan'}</label>
        <select
          value={formData.role === 'student' ? formData.field_id ?? '' : formData.subject_id ?? ''}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (formData.role === 'student') updateField('field_id', value);
            else updateField('subject_id', value);
          }}
          className="w-full p-3 bg-[#1A1A2E] border border-gray-700 rounded-lg outline-none text-white focus:border-blue-500 transition"
          required
        >
          {(formData.role === 'student' ? fields : subjects).map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
      </div>

      <button disabled={isSubmitting} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-blue-900/20 disabled:opacity-60 disabled:cursor-not-allowed">
        {isSubmitting ? 'Yaratilmoqda...' : 'Hisob yaratish'}
      </button>
    </form>
  );
};
export default Registration;
