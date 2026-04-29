import axios from 'axios';

const authApi = axios.create({
	baseURL: 'http://localhost:7000/api',
	headers: {
		'Content-Type': 'application/json'
	}
});

// Интерцептор для добавления токена
// Добавьте лог для отладки
authApi.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		console.log('Token being sent:', token ? 'Present' : 'Missing');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Интерцептор для обработки ошибок
authApi.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			localStorage.removeItem('token');
			delete authApi.defaults.headers.common['Authorization'];
			// Не перенаправляем автоматически, чтобы избежать циклических перенаправлений
			if (window.location.pathname !== '/login') {
				window.location.href = '/login';
			}
		}
		return Promise.reject(error);
	}
);

export default authApi;