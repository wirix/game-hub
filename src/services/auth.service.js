import authApi from './authApi';

class AuthService {
	// Регистрация
	async register(userData) {
		const response = await authApi.post('/auth/register', userData);
		if (response.data.token) {
			localStorage.setItem('token', response.data.token);
			authApi.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
		}
		return response.data;
	}

	// Вход
	async login(login, password) {
		const response = await authApi.post('/auth/login', { login, password });
		if (response.data.token) {
			localStorage.setItem('token', response.data.token);
			authApi.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
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

	// Обновление фонового изображения профиля
	async updateBackground(file) {
		const formData = new FormData();
		formData.append('background', file);
		const response = await authApi.post('/user/background', formData, {
			headers: { 'Content-Type': 'multipart/form-data' }
		});
		return response.data;
	}

	// Обновление фона через URL или градиент
	async updateBackgroundFromUrl(backgroundData) {
		const response = await authApi.post('/user/background', { background: backgroundData });
		return response.data;
	}

	// Удаление фонового изображения
	async removeBackground() {
		const response = await authApi.delete('/user/background');
		return response.data;
	}

	// Выход
	logout() {
		localStorage.removeItem('token');
		delete authApi.defaults.headers.common['Authorization'];
	}

	// Проверка авторизации
	isAuthenticated() {
		return !!localStorage.getItem('token');
	}

	// Получение текущего токена
	getToken() {
		return localStorage.getItem('token');
	}

	// Получение информации об уровне пользователя
	async getUserLevelInfo() {
		const response = await authApi.get('/comments/user-level');
		return response.data;
	}

	// Получение требований для уровней
	async getLevelRequirements() {
		const response = await authApi.get('/comments/level-requirements');
		return response.data;
	}
}

export default new AuthService();