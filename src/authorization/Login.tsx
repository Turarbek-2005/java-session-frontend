import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import logo from '../assets/Logo.png';      

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginRequest, string>>>({});
  const [message, setMessage] = useState('');

  const validateForm = () => {
    const newErrors: Partial<Record<keyof LoginRequest, string>> = {};
    if (!formData.email) {
      newErrors.email = 'Электронная почта обязательна';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Неверный формат электронной почты';
    }
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать не менее 6 символов';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const request: LoginRequest = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await api.post<LoginResponse>('/api/auth/login', request, {
        headers: { 'Content-Type': 'application/json' },
      });
      const { accessToken, refreshToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setMessage('Вход выполнен успешно!');
      console.log('Login successful:', response.data);
      // window.location.href = '/dashboard'; // Пример перенаправления
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(`Ошибка при входе: ${error.message}`);
        console.error('Login failed:', error.message);
      } else {
        setMessage('Неизвестная ошибка при входе');
        console.error('Login failed:', error);
      }
    }
  };

  return (
    <div>
      <img className="mt-10 ml-10" src={logo} alt="Logo" />

      <div className="flex items-center justify-center bg-white">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border-2 border-solid">
          <h2 className="text-2xl font-bold mb-6 text-center">Вход</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите свой email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="mb-5">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите пароль"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full text-white p-2 rounded bg-black mb-4"
            >
              Войти
            </button>
            <Link
              to="/"
              className="w-full text-center block text-blue-500 hover:underline"
            >
              Нет аккаунта? Зарегистрироваться
            </Link>
          </form>
          {message && <p className="text-green-500 text-sm mt-4 text-center">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;