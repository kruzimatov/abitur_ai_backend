import { message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

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
      navigate('/dashboard', { replace: true });
    } catch {
      message.error('Email yoki parol xato!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-3">
      <h2 className="text-2xl font-bold">Kirish</h2>

      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        className="w-full p-3 bg-transparent border border-gray-700 rounded-lg outline-none focus:border-blue-500 transition"
        onChange={(e) =>
          setFormData({ ...formData, email: e.target.value })
        }
        required
      />

      <input
        type="password"
        placeholder="Parol"
        value={formData.password}
        className="w-full p-3 bg-transparent border border-gray-700 rounded-lg outline-none focus:border-blue-500 transition"
        onChange={(e) =>
          setFormData({ ...formData, password: e.target.value })
        }
        required
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full p-3 bg-blue-600 rounded cursor-pointer text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Kirilmoqda...' : 'Kirish'}
      </button>
    </form>
  );
};

export default Login;
