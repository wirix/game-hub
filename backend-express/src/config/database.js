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

module.exports = pool;