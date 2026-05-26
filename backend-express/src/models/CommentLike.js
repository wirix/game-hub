const pool = require('../config/database');

class CommentLike {
	static async initTable() {
		const query = `
      CREATE TABLE IF NOT EXISTS comment_likes (
        id SERIAL PRIMARY KEY,
        comment_id INTEGER NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(comment_id, user_id)
      )
    `;

		try {
			await pool.query(query);
			console.log('Comment likes table created or already exists');
		} catch (err) {
			console.error('Error creating comment likes table:', err);
		}
	}

	// Добавить лайк
	static async addLike(comment_id, user_id) {
		const client = await pool.connect();

		try {
			await client.query('BEGIN');

			// Проверяем, не лайкнул ли уже пользователь
			const existing = await client.query(
				'SELECT id FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
				[comment_id, user_id]
			);

			if (existing.rows.length > 0) {
				await client.query('ROLLBACK');
				return { liked: false, alreadyLiked: true };
			}

			// Добавляем лайк
			await client.query(
				'INSERT INTO comment_likes (comment_id, user_id) VALUES ($1, $2)',
				[comment_id, user_id]
			);

			// Обновляем счетчик лайков в таблице comments
			await client.query(
				'UPDATE comments SET likes_count = likes_count + 1 WHERE id = $1',
				[comment_id]
			);

			await client.query('COMMIT');
			return { liked: true, alreadyLiked: false };
		} catch (error) {
			await client.query('ROLLBACK');
			throw error;
		} finally {
			client.release();
		}
	}

	// Удалить лайк
	static async removeLike(comment_id, user_id) {
		const client = await pool.connect();

		try {
			await client.query('BEGIN');

			const result = await client.query(
				'DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2 RETURNING id',
				[comment_id, user_id]
			);

			if (result.rowCount > 0) {
				await client.query(
					'UPDATE comments SET likes_count = likes_count - 1 WHERE id = $1',
					[comment_id]
				);
			}

			await client.query('COMMIT');
			return result.rowCount > 0;
		} catch (error) {
			await client.query('ROLLBACK');
			throw error;
		} finally {
			client.release();
		}
	}

	// Проверить, лайкнул ли пользователь
	static async hasUserLiked(comment_id, user_id) {
		const query = 'SELECT id FROM comment_likes WHERE comment_id = $1 AND user_id = $2';
		const result = await pool.query(query, [comment_id, user_id]);
		return result.rows.length > 0;
	}

	// Получить количество лайков комментария
	static async getLikeCount(comment_id) {
		const query = 'SELECT likes_count FROM comments WHERE id = $1';
		const result = await pool.query(query, [comment_id]);
		return result.rows[0]?.likes_count || 0;
	}
}

CommentLike.initTable();

module.exports = CommentLike;