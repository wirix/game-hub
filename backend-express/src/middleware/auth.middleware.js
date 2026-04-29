const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Токен не предоставлен' });
	}

	const token = authHeader.split(' ')[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.userId = decoded.userId;

		// Получаем данные пользователя для req.user
		const user = await User.findById(req.userId);
		if (user) {
			req.user = {
				id: user.id,
				username: user.username,
				avatar: user.avatar,
				email: user.email,
				fullName: user.fullName
			};
		}

		next();
	} catch (error) {
		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({ message: 'Токен истек' });
		}
		return res.status(401).json({ message: 'Неверный токен' });
	}
};

module.exports = { verifyToken };