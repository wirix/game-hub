import axios from 'axios';

const authApi = axios.create({
	baseURL: 'http://localhost:7000/api',
	headers: {
		'Content-Type': 'application/json'
	}
});

authApi.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

authApi.interceptors.response.use(
	(response) => response,
	(error) => {
		const ignoreLogoutUrls = ['/comments/user-level'];
		const shouldIgnore = ignoreLogoutUrls.some(url => error.config?.url?.includes(url));

		if (error.response?.status === 401 && !shouldIgnore) {
			localStorage.removeItem('token');
			delete authApi.defaults.headers.common['Authorization'];
			if (!['/login', '/register'].includes(window.location.pathname)) {
				window.location.href = '/login';
			}
		}
		return Promise.reject(error);
	}
);

export default authApi;