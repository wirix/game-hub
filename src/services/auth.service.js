import authApi from './authApi';

class AuthService {
	// Регистрация
	async register(userData) {
		const response = await authApi.post('/auth/register', userData);
		if (response.data.token) {
			localStorage.setItem('token', response.data.token);
		}
		return response.data;
	}

	// Вход
	async login(login, password) {
		const response = await authApi.post('/auth/login', { login, password });
		if (response.data.token) {
			localStorage.setItem('token', response.data.token);
		}
		return response.data;
	}

	// Подтверждение email
	async verifyEmail(token) {
		const response = await authApi.post('/auth/verify-email', { token });
		return response.data;
	}

	// Запрос сброса пароля
	async forgotPassword(email) {
		const response = await authApi.post('/auth/forgot-password', { email });
		return response.data;
	}

	// Сброс пароля
	async resetPassword(token, newPassword) {
		const response = await authApi.post('/auth/reset-password', { token, newPassword });
		return response.data;
	}

	// Получение профиля
	async getProfile() {
		const response = await authApi.get('/user/profile');
		return response.data;
	}

	// Обновление профиля
	async updateProfile(profileData) {
		const response = await authApi.put('/user/profile', profileData);
		return response.data;
	}

	// Смена пароля
	async changePassword(currentPassword, newPassword) {
		const response = await authApi.put('/user/change-password', { currentPassword, newPassword });
		return response.data;
	}

	// Удаление аккаунта
	async deleteAccount(password) {
		const response = await authApi.delete('/user/account', { data: { password } });
		return response.data;
	}

	// Обновление аватара
	async updateAvatar(file) {
		const formData = new FormData();
		formData.append('avatar', file);
		const response = await authApi.post('/user/avatar', formData, {
			headers: { 'Content-Type': 'multipart/form-data' }
		});
		return response.data;
	}

	// Выход
	logout() {
		localStorage.removeItem('token');
	}

	// Проверка авторизации
	isAuthenticated() {
		return !!localStorage.getItem('token');
	}

	// Получение текущего токена
	getToken() {
		return localStorage.getItem('token');
	}
}

export default new AuthService();