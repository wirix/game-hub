const pool = require('../config/database');

class Comment {
	// Создание таблицы комментариев
	static async initTable() {
		const query = `
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        game_slug VARCHAR(255) NOT NULL,
        user_id INTEGER NOT NULL,
        user_name VARCHAR(100) NOT NULL,
        user_avatar VARCHAR(500),
        parent_id INTEGER DEFAULT NULL,
        likes_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

		try {
			await pool.query(query);
			console.log('Comments table created or already exists');
		} catch (err) {
			console.error('Error creating comments table:', err);
		}
	}

	// Создание комментария
	static async create(commentData) {
		const { content, game_slug, user_id, user_name, user_avatar, parent_id } = commentData;

		const query = `
      INSERT INTO comments (content, game_slug, user_id, user_name, user_avatar, parent_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

		const values = [content, game_slug, user_id, user_name, user_avatar, parent_id || null];
		const result = await pool.query(query, values);
		return result.rows[0];
	}

	// Получение комментария по ID
	static async findById(id) {
		const query = 'SELECT * FROM comments WHERE id = $1';
		const result = await pool.query(query, [id]);
		return result.rows[0];
	}

	// Получение комментариев по slug игры
	static async findByGameSlug(game_slug, limit = 50, offset = 0) {
		const query = `
      SELECT * FROM comments 
      WHERE game_slug = $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;
		const result = await pool.query(query, [game_slug, limit, offset]);
		return result.rows;
	}

	// Получение количества комментариев для игры
	static async getCountByGameSlug(game_slug) {
		const query = 'SELECT COUNT(*) as count FROM comments WHERE game_slug = $1';
		const result = await pool.query(query, [game_slug]);
		return parseInt(result.rows[0].count);
	}

	// Обновление комментария
	static async update(id, content, user_id) {
		const query = `
      UPDATE comments 
      SET content = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND user_id = $3
      RETURNING *
    `;
		const result = await pool.query(query, [content, id, user_id]);
		return result.rows[0];
	}

	// Удаление комментария
	static async delete(id, user_id) {
		const query = 'DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING id';
		const result = await pool.query(query, [id, user_id]);
		return result.rowCount > 0;
	}

	// Добавьте эти методы в класс Comment

	// Получение комментариев пользователя
	static async findByUserId(user_id, limit = 20, offset = 0) {
		const query = `
    SELECT * FROM comments 
    WHERE user_id = $1 
    ORDER BY created_at DESC 
    LIMIT $2 OFFSET $3
  `;
		const result = await pool.query(query, [user_id, limit, offset]);
		return result.rows;
	}

	// Получение количества комментариев пользователя
	static async getCountByUserId(user_id) {
		const query = 'SELECT COUNT(*) as count FROM comments WHERE user_id = $1';
		const result = await pool.query(query, [user_id]);
		return parseInt(result.rows[0].count);
	}
}

// Инициализация таблицы при загрузке модуля
Comment.initTable();

module.exports = Comment;