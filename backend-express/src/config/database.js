const { Pool } = require('pg');

const pool = new Pool({
	host: process.env.DB_HOST || 'localhost',
	port: process.env.DB_PORT || 5432,
	database: process.env.DB_NAME || 'game_hub',
	user: process.env.DB_USER || 'postgres',
	password: process.env.DB_PASSWORD || '123456',
});

// Проверка подключения
pool.connect((err, client, release) => {
	if (err) {
		console.error('Error connecting to PostgreSQL:', err.stack);
	} else {
		console.log('Connected to PostgreSQL database');
		release();
	}
});

// Создание таблиц
const initDatabase = async () => {
	const createUsersTable = `
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
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

	try {
		await pool.query(createUsersTable);
		console.log('Users table created or already exists');
	} catch (err) {
		console.error('Error creating users table:', err);
	}
};

initDatabase();

module.exports = pool;