import { message } from 'antd';
import { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const username = formData.username.trim();
    const password = formData.password.trim();

    const users = [
      {
        user: 'admin',
        pass: '12345',
        role: 'admin',
      },
      {
        user: 'teacher',
        pass: '12345',
        role: 'teacher',
      },
      {
        user: 'student',
        pass: '12345',
        role: 'student',
      },
    ];

    const foundUser = users.find(
      (u) => u.user === username && u.pass === password
    );

    if (foundUser) {
      localStorage.setItem('is_auth', 'true');
      localStorage.setItem('role_name', foundUser.role);

      message.success('Tizimga xush kelibsiz!');

      window.location.reload();
    } else {
      message.error('Login yoki parol xato!');
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-3">
      <h2 className="text-2xl font-bold">Kirish</h2>

      <input
        type="text"
        placeholder="Login"
        className="w-full p-3 bg-transparent border border-gray-700 rounded-lg outline-none focus:border-blue-500 transition"
        onChange={(e) =>
          setFormData({ ...formData, username: e.target.value })
        }
        required
      />

      <input
        type="password"
        placeholder="Parol"
        className="w-full p-3 bg-transparent border border-gray-700 rounded-lg outline-none focus:border-blue-500 transition"
        onChange={(e) =>
          setFormData({ ...formData, password: e.target.value })
        }
        required
      />

      <button
        type="submit"
        className="w-full p-3 bg-blue-600 rounded cursor-pointer text-white font-semibold hover:bg-blue-700 transition"
      >
        Kirish
      </button>
    </form>
  );
};

export default Login;