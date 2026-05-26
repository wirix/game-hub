const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Публичные маршруты
router.get('/game/:slug', commentController.getCommentsByGame);

// Защищенные маршруты (требуют авторизации)
router.get('/user/my-comments', verifyToken, commentController.getMyComments);
router.get('/user/my-reviews', verifyToken, commentController.getMyReviews); // Новый маршрут
router.post('/', verifyToken, commentController.createComment);
router.put('/:id', verifyToken, commentController.updateComment);
router.delete('/:id', verifyToken, commentController.deleteComment);
router.post('/like', verifyToken, commentController.likeComment);
router.delete('/like', verifyToken, commentController.unlikeComment);
router.get('/user-level', verifyToken, commentController.getUserLevelInfo);
router.get('/level-requirements', commentController.getLevelRequirements);
// Добавьте новый маршрут
router.get('/user/activity-calendar', verifyToken, commentController.getUserActivityCalendar);

module.exports = router;