const Comment = require('../models/Comment');

// Создание комментария
const createComment = async (req, res) => {
	try {
		const { content, game_slug } = req.body;
		const user_id = req.userId;

		console.log('Creating comment:', { content, game_slug, user_id, user: req.user });

		if (!content || !game_slug) {
			return res.status(400).json({ message: 'Content and game_slug are required' });
		}

		if (!user_id) {
			return res.status(401).json({ message: 'User not authenticated' });
		}

		// Получаем имя пользователя из req.user или из базы
		const user_name = req.user?.username || 'Anonymous';
		const user_avatar = req.user?.avatar || null;

		const comment = await Comment.create({
			content,
			game_slug,
			user_id,
			user_name,
			user_avatar
		});

		res.status(201).json({
			message: 'Comment created successfully',
			comment
		});
	} catch (error) {
		console.error('Error creating comment:', error);
		res.status(500).json({ message: 'Error creating comment: ' + error.message });
	}
};

// Получение комментариев для игры
const getCommentsByGame = async (req, res) => {
	try {
		const { slug } = req.params;
		const { limit = 50, offset = 0 } = req.query;

		const comments = await Comment.findByGameSlug(slug, parseInt(limit), parseInt(offset));
		const total = await Comment.getCountByGameSlug(slug);

		res.json({
			comments,
			total,
			limit: parseInt(limit),
			offset: parseInt(offset)
		});
	} catch (error) {
		console.error('Error fetching comments:', error);
		res.status(500).json({ message: 'Error fetching comments: ' + error.message });
	}
};

// Обновление комментария
const updateComment = async (req, res) => {
	try {
		const { id } = req.params;
		const { content } = req.body;
		const user_id = req.userId;

		if (!content) {
			return res.status(400).json({ message: 'Content is required' });
		}

		const updated = await Comment.update(parseInt(id), content, user_id);

		if (!updated) {
			return res.status(404).json({ message: 'Comment not found or you are not the author' });
		}

		res.json({
			message: 'Comment updated successfully',
			comment: updated
		});
	} catch (error) {
		console.error('Error updating comment:', error);
		res.status(500).json({ message: 'Error updating comment: ' + error.message });
	}
};

// Удаление комментария
const deleteComment = async (req, res) => {
	try {
		const { id } = req.params;
		const user_id = req.userId;

		const deleted = await Comment.delete(parseInt(id), user_id);

		if (!deleted) {
			return res.status(404).json({ message: 'Comment not found or you are not the author' });
		}

		res.json({ message: 'Comment deleted successfully' });
	} catch (error) {
		console.error('Error deleting comment:', error);
		res.status(500).json({ message: 'Error deleting comment: ' + error.message });
	}
};

module.exports = {
	createComment,
	getCommentsByGame,
	updateComment,
	deleteComment
};