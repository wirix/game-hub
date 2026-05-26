const pool = require('../config/database');

class UserLevel {
	// Инициализация таблиц для уровней и опыта
	static async initTables() {
		// Добавляем колонки в users таблицу
		const addColumns = `
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
      ADD COLUMN IF NOT EXISTS total_comments INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS total_likes_given INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS total_likes_received INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS total_replies_given INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS total_replies_received INTEGER DEFAULT 0
    `;

		// Создаем таблицу для истории активности
		const createActivityHistory = `
      CREATE TABLE IF NOT EXISTS user_activity_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        action_type VARCHAR(50) NOT NULL,
        xp_earned INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

		// Создаем таблицу для достижений
		const createBadges = `
      CREATE TABLE IF NOT EXISTS user_badges (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        badge_name VARCHAR(100) NOT NULL,
        badge_description TEXT,
        badge_icon VARCHAR(50),
        earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, badge_name)
      )
    `;

		try {
			await pool.query(addColumns);
			await pool.query(createActivityHistory);
			await pool.query(createBadges);
			console.log('User level tables created or already exists');
		} catch (err) {
			console.error('Error creating level tables:', err);
		}
	}

	// Расчет уровня на основе XP (формула: уровень = floor(sqrt(xp / 100)) + 1)
	static calculateLevel(xp) {
		return Math.floor(Math.sqrt(xp / 100)) + 1;
	}

	// Расчет XP для следующего уровня
	static getNextLevelXP(currentLevel) {
		return Math.pow(currentLevel, 2) * 100;
	}

	// Добавление XP пользователю
	static async addXP(user_id, amount, action_type) {
		const client = await pool.connect();

		try {
			await client.query('BEGIN');

			// Получаем текущий XP и уровень
			const current = await client.query(
				'SELECT xp, level FROM users WHERE id = $1',
				[user_id]
			);

			const oldXP = current.rows[0]?.xp || 0;
			const oldLevel = current.rows[0]?.level || 1;
			const newXP = oldXP + amount;
			const newLevel = this.calculateLevel(newXP);

			// Обновляем пользователя
			await client.query(
				'UPDATE users SET xp = $1, level = $2 WHERE id = $3',
				[newXP, newLevel, user_id]
			);

			// Записываем историю
			await client.query(
				`INSERT INTO user_activity_history (user_id, action_type, xp_earned) 
         VALUES ($1, $2, $3)`,
				[user_id, action_type, amount]
			);

			// Проверяем повышение уровня
			const leveledUp = newLevel > oldLevel;

			await client.query('COMMIT');

			return { leveledUp, oldLevel, newLevel, newXP };
		} catch (error) {
			await client.query('ROLLBACK');
			throw error;
		} finally {
			client.release();
		}
	}

	// Получение статистики пользователя
	static async getUserStats(user_id) {
		const query = `
      SELECT 
        xp, level, 
        total_comments, total_likes_given, 
        total_likes_received, total_replies_given,
        total_replies_received
      FROM users 
      WHERE id = $1
    `;
		const result = await pool.query(query, [user_id]);
		return result.rows[0];
	}

	// Получение истории активности
	static async getActivityHistory(user_id, limit = 10) {
		const query = `
      SELECT action_type, xp_earned, created_at 
      FROM user_activity_history 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2
    `;
		const result = await pool.query(query, [user_id, limit]);
		return result.rows;
	}

	// Получение достижений пользователя
	static async getUserBadges(user_id) {
		const query = 'SELECT * FROM user_badges WHERE user_id = $1 ORDER BY earned_at DESC';
		const result = await pool.query(query, [user_id]);
		return result.rows;
	}

	// Проверка и выдача достижений
	static async checkAndAwardBadges(user_id, stats) {
		const badges = [];

		// Достижение за комментарии
		if (stats.total_comments >= 1 && !await this.hasBadge(user_id, 'first_comment')) {
			await this.awardBadge(user_id, 'first_comment', 'Первый комментарий', '💬', 'Оставьте свой первый комментарий');
			badges.push('first_comment');
		}
		if (stats.total_comments >= 10 && !await this.hasBadge(user_id, 'active_commenter')) {
			await this.awardBadge(user_id, 'active_commenter', 'Активный комментатор', '🗣️', 'Оставьте 10 комментариев');
			badges.push('active_commenter');
		}
		if (stats.total_comments >= 50 && !await this.hasBadge(user_id, 'pro_commenter')) {
			await this.awardBadge(user_id, 'pro_commenter', 'Профессиональный комментатор', '🎙️', 'Оставьте 50 комментариев');
			badges.push('pro_commenter');
		}

		// Достижения за лайки
		if (stats.total_likes_received >= 10 && !await this.hasBadge(user_id, 'liked')) {
			await this.awardBadge(user_id, 'liked', 'Популярный', '👍', 'Получите 10 лайков на комментариях');
			badges.push('liked');
		}
		if (stats.total_likes_received >= 50 && !await this.hasBadge(user_id, 'super_liked')) {
			await this.awardBadge(user_id, 'super_liked', 'Звезда сообщества', '⭐', 'Получите 50 лайков на комментариях');
			badges.push('super_liked');
		}

		// Достижения за уровни
		if (stats.level >= 5 && !await this.hasBadge(user_id, 'level_5')) {
			await this.awardBadge(user_id, 'level_5', 'Опытный геймер', '🎮', 'Достигните 5 уровня');
			badges.push('level_5');
		}
		if (stats.level >= 10 && !await this.hasBadge(user_id, 'level_10')) {
			await this.awardBadge(user_id, 'level_10', 'Легендарный геймер', '🏆', 'Достигните 10 уровня');
			badges.push('level_10');
		}

		return badges;
	}

	static async hasBadge(user_id, badge_name) {
		const query = 'SELECT id FROM user_badges WHERE user_id = $1 AND badge_name = $2';
		const result = await pool.query(query, [user_id, badge_name]);
		return result.rows.length > 0;
	}

	static async awardBadge(user_id, badge_name, badge_title, badge_icon, badge_description) {
		const query = `
      INSERT INTO user_badges (user_id, badge_name, badge_description, badge_icon)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, badge_name) DO NOTHING
    `;
		await pool.query(query, [user_id, badge_name, badge_title + ': ' + badge_description, badge_icon]);
	}
}

// Инициализация
UserLevel.initTables();

module.exports = UserLevel;