const Comment = require('../models/Comment');
const UserLevel = require('../models/UserLevel');
const CommentLike = require('../models/CommentLike');
const pool = require('../config/database');

// XP награды
const XP_REWARDS = {
	CREATING_COMMENT: 10,      // За создание комментария
	GETTING_LIKE_ON_COMMENT: 5, // За получение лайка на комментарий
	REPLAYING_TO_COMMENT: 8,    // За ответ на чужой комментарий
	GETTING_REPLY: 3,           // За получение ответа
	LIKING_OTHER_COMMENT: 2,    // За лайк чужого комментария
};

// Создание комментария
const createComment = async (req, res) => {
	try {
		const { content, game_slug, parent_id = null } = req.body;
		const user_id = req.userId;

		if (!content || !game_slug) {
			return res.status(400).json({ message: 'Content and game_slug are required' });
		}

		if (!user_id) {
			return res.status(401).json({ message: 'User not authenticated' });
		}

		const user_name = req.user?.username || 'Anonymous';
		const user_avatar = req.user?.avatar || null;

		// Создаем комментарий
		const comment = await Comment.create({
			content,
			game_slug,
			user_id,
			user_name,
			user_avatar,
			parent_id
		});

		// Начисляем XP за создание комментария
		const xpResult = await UserLevel.addXP(user_id, XP_REWARDS.CREATING_COMMENT, 'created_comment');

		// Обновляем счетчик комментариев пользователя
		const stats = await UserLevel.getUserStats(user_id);

		// Проверяем достижения
		await UserLevel.checkAndAwardBadges(user_id, {
			...stats,
			total_comments: (stats.total_comments || 0) + 1
		});

		// Если комментарий является ответом на другой комментарий
		if (parent_id) {
			const parentComment = await Comment.findById(parent_id);
			if (parentComment && parentComment.user_id !== user_id) {
				// Начисляем XP автору за получение ответа
				await UserLevel.addXP(parentComment.user_id, XP_REWARDS.GETTING_REPLY, 'received_reply');
				// Начисляем XP автору ответа
				await UserLevel.addXP(user_id, XP_REWARDS.REPLAYING_TO_COMMENT, 'replied_to_comment');
			}
		}

		res.status(201).json({
			message: xpResult.leveledUp ? `Поздравляем! Вы достигли ${xpResult.newLevel} уровня! 🎉` : 'Comment created successfully',
			comment,
			xpEarned: XP_REWARDS.CREATING_COMMENT,
			leveledUp: xpResult.leveledUp,
			newLevel: xpResult.newLevel
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

// Лайк комментария
const likeComment = async (req, res) => {
	try {
		const { comment_id } = req.body;
		const user_id = req.userId;

		if (!comment_id) {
			return res.status(400).json({ message: 'comment_id is required' });
		}

		const result = await CommentLike.addLike(comment_id, user_id);

		if (result.alreadyLiked) {
			return res.status(400).json({ message: 'You already liked this comment' });
		}

		// Начисляем XP за лайк
		const xpResult = await UserLevel.addXP(user_id, XP_REWARDS.LIKING_OTHER_COMMENT, 'liked_comment');

		// Обновляем счетчик лайков пользователя
		const stats = await UserLevel.getUserStats(user_id);
		await UserLevel.checkAndAwardBadges(user_id, {
			...stats,
			total_likes_given: (stats.total_likes_given || 0) + 1
		});

		// Получаем автора комментария и начисляем ему XP
		const comment = await Comment.findById(comment_id);
		if (comment && comment.user_id !== user_id) {
			await UserLevel.addXP(comment.user_id, XP_REWARDS.GETTING_LIKE_ON_COMMENT, 'received_like');

			// Обновляем счетчик полученных лайков автора
			const authorStats = await UserLevel.getUserStats(comment.user_id);
			await UserLevel.checkAndAwardBadges(comment.user_id, {
				...authorStats,
				total_likes_received: (authorStats.total_likes_received || 0) + 1
			});
		}

		res.json({
			message: xpResult.leveledUp ? `Поздравляем! Вы достигли ${xpResult.newLevel} уровня! 🎉` : 'Comment liked',
			xpEarned: XP_REWARDS.LIKING_OTHER_COMMENT,
			leveledUp: xpResult.leveledUp,
			newLevel: xpResult.newLevel
		});
	} catch (error) {
		console.error('Error liking comment:', error);
		res.status(500).json({ message: 'Error liking comment: ' + error.message });
	}
};

// Удаление лайка
const unlikeComment = async (req, res) => {
	try {
		const { comment_id } = req.body;
		const user_id = req.userId;

		if (!comment_id) {
			return res.status(400).json({ message: 'comment_id is required' });
		}

		const removed = await CommentLike.removeLike(comment_id, user_id);

		if (!removed) {
			return res.status(400).json({ message: 'Like not found' });
		}

		res.json({ message: 'Comment unliked' });
	} catch (error) {
		console.error('Error unliking comment:', error);
		res.status(500).json({ message: 'Error unliking comment: ' + error.message });
	}
};

// Получить информацию об уровне пользователя
const getUserLevelInfo = async (req, res) => {
	try {
		const user_id = req.userId;

		const stats = await UserLevel.getUserStats(user_id);
		const history = await UserLevel.getActivityHistory(user_id);
		const badges = await UserLevel.getUserBadges(user_id);

		const nextLevelXP = UserLevel.getNextLevelXP(stats?.level || 1);
		const xpForCurrentLevel = UserLevel.getNextLevelXP((stats?.level || 1) - 1);
		const xpProgress = ((stats?.xp || 0) - xpForCurrentLevel) / (nextLevelXP - xpForCurrentLevel) * 100;

		res.json({
			level: stats?.level || 1,
			xp: stats?.xp || 0,
			xpToNextLevel: nextLevelXP - (stats?.xp || 0),
			xpProgress: Math.min(100, Math.max(0, xpProgress)),
			stats: {
				totalComments: stats?.total_comments || 0,
				totalLikesGiven: stats?.total_likes_given || 0,
				totalLikesReceived: stats?.total_likes_received || 0,
				totalRepliesGiven: stats?.total_replies_given || 0,
				totalRepliesReceived: stats?.total_replies_received || 0
			},
			recentActivity: history,
			badges: badges
		});
	} catch (error) {
		console.error('Error getting user level info:', error);
		res.status(500).json({ message: 'Error getting user level info' });
	}
};

// Получить XP требования для уровней
const getLevelRequirements = async (req, res) => {
	try {
		const requirements = [];
		for (let level = 1; level <= 10; level++) {
			requirements.push({
				level,
				xpRequired: UserLevel.getNextLevelXP(level - 1),
				xpToNext: UserLevel.getNextLevelXP(level)
			});
		}
		res.json(requirements);
	} catch (error) {
		console.error('Error getting level requirements:', error);
		res.status(500).json({ message: 'Error getting level requirements' });
	}
};

// Добавьте эту функцию в конец файла, перед module.exports

// Получить комментарии текущего пользователя
const getMyComments = async (req, res) => {
	try {
		const user_id = req.userId;
		const { limit = 20, offset = 0 } = req.query;

		const comments = await Comment.findByUserId(user_id, parseInt(limit), parseInt(offset));
		const total = await Comment.getCountByUserId(user_id);

		res.json({
			comments,
			total,
			limit: parseInt(limit),
			offset: parseInt(offset)
		});
	} catch (error) {
		console.error('Error fetching user comments:', error);
		res.status(500).json({ message: 'Error fetching user comments: ' + error.message });
	}
};
// Добавьте эту функцию в конец файла, перед module.exports

const getMyReviews = async (req, res) => {
	try {
		const user_id = req.userId;
		const { limit = 10, offset = 0 } = req.query;

		// Здесь нужно получать обзоры (reviews) пользователя
		// Пока что используем моковые данные, так как таблица reviews еще не создана
		// В будущем нужно создать таблицу reviews и получать реальные данные

		// Временное решение - возвращаем пустой массив
		// Когда будет создана таблица reviews, замените на реальные данные
		const reviews = [];
		const total = 0;

		res.json({
			reviews,
			total,
			limit: parseInt(limit),
			offset: parseInt(offset)
		});
	} catch (error) {
		console.error('Error fetching user reviews:', error);
		res.status(500).json({ message: 'Error fetching user reviews: ' + error.message });
	}
};

// Получить данные для календаря активности
const getUserActivityCalendar = async (req, res) => {
	try {
		const user_id = req.userId;
		const { year, month } = req.query;

		const targetYear = parseInt(year) || new Date().getFullYear();
		const targetMonth = parseInt(month) || new Date().getMonth() + 1;

		// Получаем активность пользователя за указанный месяц
		const query = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as activity_count,
        string_agg(DISTINCT action_type, ',') as action_types
      FROM user_activity_history 
      WHERE user_id = $1 
        AND EXTRACT(YEAR FROM created_at) = $2 
        AND EXTRACT(MONTH FROM created_at) = $3
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

		const result = await pool.query(query, [user_id, targetYear, targetMonth]);

		// Создаем карту активности по дням
		const activityMap = {};
		result.rows.forEach(row => {
			activityMap[row.date] = {
				count: parseInt(row.activity_count),
				types: row.action_types.split(',')
			};
		});

		res.json({
			year: targetYear,
			month: targetMonth,
			activity: activityMap
		});
	} catch (error) {
		console.error('Error fetching activity calendar:', error);
		res.status(500).json({ message: 'Error fetching activity calendar: ' + error.message });
	}
};

module.exports = {
	createComment,
	getCommentsByGame,
	updateComment,
	deleteComment,
	likeComment,
	unlikeComment,
	getUserLevelInfo,
	getMyComments,
	getMyReviews,
	getLevelRequirements,
	getUserActivityCalendar
};