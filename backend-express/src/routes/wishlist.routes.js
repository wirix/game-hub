const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Все маршруты требуют авторизации
router.use(verifyToken);

router.get('/', wishlistController.getUserWishlist);
router.post('/', wishlistController.addToWishlist);
router.delete('/:game_id', wishlistController.removeFromWishlist);
router.get('/check/:game_id', wishlistController.checkWishlistStatus);

module.exports = router;	