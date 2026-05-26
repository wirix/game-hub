const Wishlist = require('../models/Wishlist');

// Добавить игру в вишлист
const addToWishlist = async (req, res) => {
	try {
		const { game_id, game_slug, game_name, game_image } = req.body;
		const user_id = req.userId;

		if (!game_id || !game_slug || !game_name) {
			return res.status(400).json({ message: 'Missing required fields' });
		}

		const result = await Wishlist.addToWishlist(user_id, {
			game_id,
			game_slug,
			game_name,
			game_image
		});

		if (!result) {
			return res.status(400).json({ message: 'Game already in wishlist' });
		}

		res.status(201).json({
			message: 'Game added to wishlist',
			inWishlist: true
		});
	} catch (error) {
		console.error('Error adding to wishlist:', error);
		res.status(500).json({ message: 'Error adding to wishlist: ' + error.message });
	}
};

// Удалить игру из вишлиста
const removeFromWishlist = async (req, res) => {
	try {
		const { game_id } = req.params;
		const user_id = req.userId;

		const removed = await Wishlist.removeFromWishlist(user_id, parseInt(game_id));

		if (!removed) {
			return res.status(404).json({ message: 'Game not found in wishlist' });
		}

		res.json({
			message: 'Game removed from wishlist',
			inWishlist: false
		});
	} catch (error) {
		console.error('Error removing from wishlist:', error);
		res.status(500).json({ message: 'Error removing from wishlist: ' + error.message });
	}
};

// Проверить статус игры в вишлисте
const checkWishlistStatus = async (req, res) => {
	try {
		const { game_id } = req.params;
		const user_id = req.userId;

		const isInWishlist = await Wishlist.isInWishlist(user_id, parseInt(game_id));

		res.json({ inWishlist: isInWishlist });
	} catch (error) {
		console.error('Error checking wishlist status:', error);
		res.status(500).json({ message: 'Error checking wishlist status: ' + error.message });
	}
};

// Получить вишлист пользователя
const getUserWishlist = async (req, res) => {
	try {
		const user_id = req.userId;
		const { limit = 20, offset = 0 } = req.query;

		const wishlist = await Wishlist.getUserWishlist(user_id, parseInt(limit), parseInt(offset));
		const total = await Wishlist.getWishlistCount(user_id);

		res.json({
			wishlist,
			total,
			limit: parseInt(limit),
			offset: parseInt(offset)
		});
	} catch (error) {
		console.error('Error fetching wishlist:', error);
		res.status(500).json({ message: 'Error fetching wishlist: ' + error.message });
	}
};

module.exports = {
	addToWishlist,
	removeFromWishlist,
	checkWishlistStatus,
	getUserWishlist
};