import authApi from './authApi';

class WishlistService {
	// Добавить игру в вишлист
	async addToWishlist(game) {
		const response = await authApi.post('/wishlist', {
			game_id: game.id,
			game_slug: game.slug,
			game_name: game.name,
			game_image: game.background_image
		});
		return response.data;
	}

	// Удалить игру из вишлиста
	async removeFromWishlist(gameId) {
		const response = await authApi.delete(`/wishlist/${gameId}`);
		return response.data;
	}

	// Проверить статус игры
	async checkWishlistStatus(gameId) {
		const response = await authApi.get(`/wishlist/check/${gameId}`);
		return response.data;
	}

	// Получить вишлист пользователя
	async getUserWishlist(limit = 20, offset = 0) {
		const response = await authApi.get('/wishlist', {
			params: { limit, offset }
		});
		return response.data;
	}
}

export default new WishlistService();