import authApi from './authApi';

class CommentService {
	// Получить комментарии для игры
	async getCommentsByGame(slug, limit = 50, offset = 0) {
		const response = await authApi.get(`/comments/game/${slug}`, {
			params: { limit, offset }
		});
		return response.data;
	}

	// Создать комментарий
	async createComment(content, game_slug) {
		const response = await authApi.post('/comments', { content, game_slug });
		return response.data;
	}

	// Обновить комментарий
	async updateComment(id, content) {
		const response = await authApi.put(`/comments/${id}`, { content });
		return response.data;
	}

	// Удалить комментарий
	async deleteComment(id) {
		const response = await authApi.delete(`/comments/${id}`);
		return response.data;
	}
}

export default new CommentService();