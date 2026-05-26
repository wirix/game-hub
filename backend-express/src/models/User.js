const bcrypt = require('bcryptjs');
const pool = require('../config/database');

class User {
	// Инициализация таблицы
	static async initTable() {
		const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        "fullName" VARCHAR(255) NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        avatar VARCHAR(500),
        language VARCHAR(10) DEFAULT 'ru',
        "isVerified" BOOLEAN DEFAULT FALSE,
        "verificationToken" VARCHAR(255),
        "resetPasswordToken" VARCHAR(255),
        "resetPasswordExpires" BIGINT,
        xp INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        total_comments INTEGER DEFAULT 0,
        total_likes_given INTEGER DEFAULT 0,
        total_likes_received INTEGER DEFAULT 0,
        total_replies_given INTEGER DEFAULT 0,
        total_replies_received INTEGER DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

		try {
			await pool.query(query);
			console.log('Users table created or already exists');
		} catch (err) {
			console.error('Error creating users table:', err);
		}
	}

	static async create(userData) {
		const { email, password, fullName, username, verificationToken } = userData;
		const hashedPassword = await bcrypt.hash(password, 10);

		const query = `
      INSERT INTO users (email, password, "fullName", username, "verificationToken")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, "fullName", username
    `;

		const values = [email, hashedPassword, fullName, username, verificationToken];
		const result = await pool.query(query, values);

		return result.rows[0];
	}

	static async findByEmail(email) {
		const query = 'SELECT * FROM users WHERE email = $1';
		const result = await pool.query(query, [email]);
		return result.rows[0];
	}

	static async findByUsername(username) {
		const query = 'SELECT * FROM users WHERE username = $1';
		const result = await pool.query(query, [username]);
		return result.rows[0];
	}

	static async findById(id) {
		const query = `
      SELECT id, email, "fullName", username, avatar, language, 
             "isVerified", level, xp, total_comments, total_likes_given, 
             total_likes_received, total_replies_given, total_replies_received, "createdAt"
      FROM users 
      WHERE id = $1
    `;
		const result = await pool.query(query, [id]);
		return result.rows[0];
	}

	static async update(id, updates) {
		const fields = [];
		const values = [];
		let paramCounter = 1;

		Object.entries(updates).forEach(([key, value]) => {
			if (value !== undefined) {
				let dbField;
				if (key === 'fullName') dbField = '"fullName"';
				else if (key === 'isVerified') dbField = '"isVerified"';
				else if (key === 'verificationToken') dbField = '"verificationToken"';
				else if (key === 'resetPasswordToken') dbField = '"resetPasswordToken"';
				else if (key === 'resetPasswordExpires') dbField = '"resetPasswordExpires"';
				else dbField = key;

				fields.push(`${dbField} = $${paramCounter}`);
				values.push(value);
				paramCounter++;
			}
		});

		values.push(id);

		const query = `
      UPDATE users 
      SET ${fields.join(', ')}, "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = $${paramCounter}
      RETURNING id, email, "fullName", username, avatar, language, "isVerified", level, xp
    `;

		const result = await pool.query(query, values);
		return result.rows[0];
	}

	static async delete(id) {
		const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
		const result = await pool.query(query, [id]);
		return { deleted: result.rowCount };
	}

	static async findByVerificationToken(token) {
		const query = 'SELECT * FROM users WHERE "verificationToken" = $1';
		const result = await pool.query(query, [token]);
		return result.rows[0];
	}

	static async findByResetToken(token) {
		const query = `
      SELECT * FROM users 
      WHERE "resetPasswordToken" = $1 AND "resetPasswordExpires" > $2
    `;
		const result = await pool.query(query, [token, Date.now()]);
		return result.rows[0];
	}

	static async comparePassword(plainPassword, hashedPassword) {
		return bcrypt.compare(plainPassword, hashedPassword);
	}
}

// Инициализация таблицы при загрузке модуля
User.initTable();

module.exports = User;