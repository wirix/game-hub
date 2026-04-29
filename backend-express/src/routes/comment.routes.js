const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const { verifyToken } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Управление комментариями к играм
 */

/**
 * @swagger
 * /comments/game/{slug}:
 *   get:
 *     summary: Получить комментарии для игры
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug игры
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Лимит комментариев
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Смещение для пагинации
 *     responses:
 *       200:
 *         description: Список комментариев
 */
router.get('/game/:slug', commentController.getCommentsByGame);

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Создать новый комментарий (требуется авторизация)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - game_slug
 *             properties:
 *               content:
 *                 type: string
 *                 description: Текст комментария
 *               game_slug:
 *                 type: string
 *                 description: Slug игры
 *     responses:
 *       201:
 *         description: Комментарий создан
 *       401:
 *         description: Не авторизован
 */
router.post('/', verifyToken, commentController.createComment);

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Обновить комментарий (только автор)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Комментарий обновлен
 *       404:
 *         description: Комментарий не найден
 */
router.put('/:id', verifyToken, commentController.updateComment);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Удалить комментарий (только автор)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Комментарий удален
 *       404:
 *         description: Комментарий не найден
 */
router.delete('/:id', verifyToken, commentController.deleteComment);

module.exports = router;