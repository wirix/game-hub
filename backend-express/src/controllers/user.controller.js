const bcrypt = require('bcryptjs');
const User = require('../models/User');
const pool = require('../config/database');

const getProfile = async (req, res) => {
	try {
		const user = await User.findById(req.userId);
		if (!user) {
			return res.status(404).json({ message: 'Пользователь не найден' });
		}

		res.json(user);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Ошибка при получении профиля: ' + error.message });
	}
};

const updateProfile = async (req, res) => {
	try {
		const { fullName, username, language } = req.body;

		const updates = {};
		if (fullName) updates.fullName = fullName;
		if (username) {
			const existingUser = await User.findByUsername(username);
			if (existingUser && existingUser.id !== req.userId) {
				return res.status(400).json({ message: 'Имя пользователя уже занято' });
			}
			updates.username = username;
		}
		if (language) updates.language = language;

		const updatedUser = await User.update(req.userId, updates);
		res.json({ message: 'Профиль обновлен', user: updatedUser });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Ошибка при обновлении профиля: ' + error.message });
	}
};

const changePassword = async (req, res) => {
	try {
		const { currentPassword, newPassword } = req.body;

		// Получаем пользователя с паролем
		const query = 'SELECT password FROM users WHERE id = $1';
		const result = await pool.query(query, [req.userId]);
		const dbUser = result.rows[0];

		const isValid = await bcrypt.compare(currentPassword, dbUser.password);
		if (!isValid) {
			return res.status(401).json({ message: 'Неверный текущий пароль' });
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);
		await User.update(req.userId, { password: hashedPassword });

		res.json({ message: 'Пароль успешно изменен' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Ошибка при смене пароля: ' + error.message });
	}
};

const deleteAccount = async (req, res) => {
	try {
		const { password } = req.body;

		const query = 'SELECT password FROM users WHERE id = $1';
		const result = await pool.query(query, [req.userId]);
		const dbUser = result.rows[0];

		const isValid = await bcrypt.compare(password, dbUser.password);
		if (!isValid) {
			return res.status(401).json({ message: 'Неверный пароль' });
		}

		await User.delete(req.userId);
		res.json({ message: 'Аккаунт успешно удален' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Ошибка при удалении аккаунта: ' + error.message });
	}
};

const updateAvatar = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: 'Файл не загружен' });
		}

		const avatarUrl = `/uploads/${req.file.filename}`;
		await User.update(req.userId, { avatar: avatarUrl });

		res.json({ message: 'Аватар обновлен', avatarUrl });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Ошибка при обновлении аватара: ' + error.message });
	}
};

module.exports = {
	getProfile,
	updateProfile,
	changePassword,
	deleteAccount,
	updateAvatar
};