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
			const response = await authApi.post('/auth/register', userData);
			const { token, user } = response.data;

			if (token) {
				localStorage.setItem('token', token);
				authApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
			}

			setUser({
				...user,
				background_image: user.background_image || null,
				favorite_genres: user.favorite_genres || [],
				level: user.level || 1,
				xp: user.xp || 0,
			});
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

			setUser({
				...user,
				background_image: user.background_image || null,
				favorite_genres: user.favorite_genres || [],
				level: user.level || 1,
				xp: user.xp || 0,
			});
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
			const { user: updatedUser } = response.data;
			setUser(prev => ({
				...prev,
				...updatedUser,
				favorite_genres: updatedUser.favorite_genres || prev?.favorite_genres || [],
			}));
			if (profileData.language) setLanguage(profileData.language);
			return updatedUser;
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

			// Обновляем пользователя с новым аватаром из ответа сервера
			if (response.data.user) {
				setUser(prev => ({ ...prev, avatar: response.data.user.avatar }));
			} else if (response.data.avatarUrl) {
				setUser(prev => ({ ...prev, avatar: response.data.avatarUrl }));
			}

			return response.data;
		} catch (error) {
			console.error('Update avatar error:', error);
			throw error;
		}
	};

	// Функция обновления фона
	const updateBackground = async (backgroundData) => {
		try {
			let response;

			if (typeof backgroundData === 'string') {
				response = await authApi.post('/user/background', { background: backgroundData });
			} else {
				const formData = new FormData();
				formData.append('background', backgroundData);
				response = await authApi.post('/user/background', formData, {
					headers: { 'Content-Type': 'multipart/form-data' }
				});
			}

			// Обновляем пользователя с новым фоном из ответа сервера
			if (response.data.user) {
				setUser(prev => ({ ...prev, background_image: response.data.user.background_image }));
			} else if (response.data.backgroundUrl) {
				setUser(prev => ({ ...prev, background_image: response.data.backgroundUrl }));
			}

			return response.data;
		} catch (error) {
			console.error('Update background error:', error);
			throw error;
		}
	};

	// Функция удаления фона
	const removeBackground = async () => {
		try {
			const response = await authApi.delete('/user/background');
			if (response.data.user) {
				setUser(prev => ({ ...prev, background_image: null }));
			} else {
				setUser(prev => ({ ...prev, background_image: null }));
			}
		} catch (error) {
			console.error('Remove background error:', error);
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

					setUser({
						...response.data,
						background_image: response.data.background_image || null,
						favorite_genres: response.data.favorite_genres || [],
						level: response.data.level || 1,
						xp: response.data.xp || 0,
					});
					setLanguage(response.data.language || 'ru');
				} catch (error) {
					console.error('Error loading user:', error);
					if (error.response?.status === 401) {
						localStorage.removeItem('token');
						delete authApi.defaults.headers.common['Authorization'];
					}
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
		updateBackground,
		removeBackground,
		verifyEmail,
		setLanguage
	};

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
};