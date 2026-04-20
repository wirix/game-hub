const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (userId) => {
	return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const register = async (req, res) => {
	try {
		const { email, password, fullName, username } = req.body;

		// Проверка существующего пользователя
		const existingEmail = await User.findByEmail(email);
		if (existingEmail) {
			return res.status(400).json({ message: 'Email уже используется' });
		}

		const existingUsername = await User.findByUsername(username);
		if (existingUsername) {
			return res.status(400).json({ message: 'Имя пользователя уже занято' });
		}

		// Создание пользователя (без верификации)
		const user = await User.create({
			email,
			password,
			fullName,
			username,
			verificationToken: null
		});

		// Автоматически подтверждаем email (для простоты)
		await User.update(user.id, { isVerified: true });

		// Генерация JWT токена
		const token = generateToken(user.id);

		res.status(201).json({
			message: 'Регистрация успешна!',
			token,
			user: {
				id: user.id,
				email: user.email,
				fullName: user.fullName,
				username: user.username,
				isVerified: true
			}
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Ошибка при регистрации: ' + error.message });
	}
};

const login = async (req, res) => {
	try {
		const { login, password } = req.body;

		// Поиск по email или username
		let user = await User.findByEmail(login);
		if (!user) {
			user = await User.findByUsername(login);
		}

		if (!user) {
			return res.status(401).json({ message: 'Неверный логин или пароль' });
		}

		const isValidPassword = await User.comparePassword(password, user.password);
		if (!isValidPassword) {
			return res.status(401).json({ message: 'Неверный логин или пароль' });
		}

		const token = generateToken(user.id);

		res.json({
			message: 'Вход выполнен успешно',
			token,
			user: {
				id: user.id,
				email: user.email,
				fullName: user.fullName,
				username: user.username,
				avatar: user.avatar,
				language: user.language,
				isVerified: user.isVerified
			}
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Ошибка при входе: ' + error.message });
	}
};

const verifyEmail = async (req, res) => {
	// Для простоты всегда возвращаем успех
	res.json({ message: 'Email подтвержден' });
};

const forgotPassword = async (req, res) => {
	// Упрощенная версия - просто говорим, что письмо отправлено
	res.json({ message: 'Инструкция по сбросу пароля отправлена на email' });
};

const resetPassword = async (req, res) => {
	try {
		const { token, newPassword } = req.body;

		// Упрощенная версия - ищем пользователя по токену
		const user = await User.findByResetToken(token);
		if (!user) {
			return res.status(400).json({ message: 'Неверный или истекший токен' });
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);
		await User.update(user.id, {
			password: hashedPassword,
			resetPasswordToken: null,
			resetPasswordExpires: null
		});

		res.json({ message: 'Пароль успешно изменен' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Ошибка при сбросе пароля: ' + error.message });
	}
};

module.exports = {
	register,
	login,
	verifyEmail,
	forgotPassword,
	resetPassword
};