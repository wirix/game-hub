import React, { createContext, useContext, useState, useEffect } from 'react';
import authApi from '../services/authApi';

const AuthContext = createContext({});

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [language, setLanguage] = useState('ru');

	// Функция регистрации
	const register = async (userData) => {
		try {
			console.log('Register called with:', userData);
			const response = await authApi.post('/auth/register', userData);
			console.log('Register response:', response.data);
			const { token, user } = response.data;

			if (token) {
				localStorage.setItem('token', token);
				authApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
			}

			setUser(user);
			setLanguage(user.language || 'ru');
			return user;
		} catch (error) {
			console.error('Registration error:', error);
			throw error;
		}
	};

	// Функция входа
	const login = async (login, password) => {
		try {
			const response = await authApi.post('/auth/login', { login, password });
			const { token, user } = response.data;

			if (token) {
				localStorage.setItem('token', token);
				authApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
			}

			setUser(user);
			setLanguage(user.language || 'ru');
			return user;
		} catch (error) {
			console.error('Login error:', error);
			throw error;
		}
	};

	// Функция выхода
	const logout = () => {
		localStorage.removeItem('token');
		delete authApi.defaults.headers.common['Authorization'];
		setUser(null);
	};

	// Функция обновления профиля
	const updateProfile = async (profileData) => {
		try {
			const response = await authApi.put('/user/profile', profileData);
			const { user } = response.data;
			setUser(user);
			if (profileData.language) setLanguage(profileData.language);
			return user;
		} catch (error) {
			console.error('Update profile error:', error);
			throw error;
		}
	};

	// Функция смены пароля
	const changePassword = async (currentPassword, newPassword) => {
		try {
			await authApi.put('/user/change-password', { currentPassword, newPassword });
		} catch (error) {
			console.error('Change password error:', error);
			throw error;
		}
	};

	// Функция удаления аккаунта
	const deleteAccount = async (password) => {
		try {
			await authApi.delete('/user/account', { data: { password } });
			logout();
		} catch (error) {
			console.error('Delete account error:', error);
			throw error;
		}
	};

	// Функция обновления аватара
	const updateAvatar = async (file) => {
		try {
			const formData = new FormData();
			formData.append('avatar', file);
			const response = await authApi.post('/user/avatar', formData, {
				headers: { 'Content-Type': 'multipart/form-data' }
			});
			setUser({ ...user, avatar: response.data.avatarUrl });
			return response.data.avatarUrl;
		} catch (error) {
			console.error('Update avatar error:', error);
			throw error;
		}
	};

	// Функция подтверждения email
	const verifyEmail = async (token) => {
		try {
			await authApi.post('/auth/verify-email', { token });
			if (user) {
				setUser({ ...user, isVerified: true });
			}
		} catch (error) {
			console.error('Verify email error:', error);
			throw error;
		}
	};

	// Загрузка профиля при монтировании
	useEffect(() => {
		const loadUser = async () => {
			const token = localStorage.getItem('token');
			if (token) {
				try {
					authApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
					const response = await authApi.get('/user/profile');
					setUser(response.data);
					setLanguage(response.data.language || 'ru');
				} catch (error) {
					console.error('Error loading user:', error);
					localStorage.removeItem('token');
					delete authApi.defaults.headers.common['Authorization'];
				}
			}
			setLoading(false);
		};

		loadUser();
	}, []);

	const value = {
		user,
		loading,
		language,
		register,
		login,
		logout,
		updateProfile,
		changePassword,
		deleteAccount,
		updateAvatar,
		verifyEmail,
		setLanguage
	};

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
};