const pool = require('../config/database');

class Wishlist {
	// Создание таблицы вишлиста
	static async initTable() {
		const query = `
      CREATE TABLE IF NOT EXISTS wishlist (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        game_id INTEGER NOT NULL,
        game_slug VARCHAR(255) NOT NULL,
        game_name VARCHAR(255) NOT NULL,
        game_image VARCHAR(500),
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, game_id)
      )
    `;

		try {
			await pool.query(query);
			console.log('Wishlist table created or already exists');
		} catch (err) {
			console.error('Error creating wishlist table:', err);
		}
	}

	// Добавить игру в вишлист
	static async addToWishlist(user_id, gameData) {
		const { game_id, game_slug, game_name, game_image } = gameData;

		const query = `
      INSERT INTO wishlist (user_id, game_id, game_slug, game_name, game_image)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id, game_id) DO NOTHING
      RETURNING *
    `;

		const values = [user_id, game_id, game_slug, game_name, game_image];
		const result = await pool.query(query, values);
		return result.rows[0];
	}

	// Удалить игру из вишлиста
	static async removeFromWishlist(user_id, game_id) {
		const query = 'DELETE FROM wishlist WHERE user_id = $1 AND game_id = $2 RETURNING id';
		const result = await pool.query(query, [user_id, game_id]);
		return result.rowCount > 0;
	}

	// Проверить, есть ли игра в вишлисте
	static async isInWishlist(user_id, game_id) {
		const query = 'SELECT id FROM wishlist WHERE user_id = $1 AND game_id = $2';
		const result = await pool.query(query, [user_id, game_id]);
		return result.rows.length > 0;
	}

	// Получить все игры из вишлиста пользователя
	static async getUserWishlist(user_id, limit = 20, offset = 0) {
		const query = `
      SELECT * FROM wishlist 
      WHERE user_id = $1 
      ORDER BY added_at DESC 
      LIMIT $2 OFFSET $3
    `;
		const result = await pool.query(query, [user_id, limit, offset]);
		return result.rows;
	}

	// Получить количество игр в вишлисте
	static async getWishlistCount(user_id) {
		const query = 'SELECT COUNT(*) as count FROM wishlist WHERE user_id = $1';
		const result = await pool.query(query, [user_id]);
		return parseInt(result.rows[0].count);
	}
}

// Инициализация таблицы
Wishlist.initTable();

module.exports = Wishlist;