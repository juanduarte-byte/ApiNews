const express = require('express');
const router = express.Router();
const usersCtrl = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/roleMiddleware');

// List users - admin only
router.get('/', authenticateToken, isAdmin, usersCtrl.index);

// Show user - admin only (per request modifications/deletions protected to admin)
router.get('/:id', authenticateToken, isAdmin, usersCtrl.show);

// Update user - admin only
router.put('/:id', authenticateToken, isAdmin, usersCtrl.update);

// Delete (soft) - admin only
router.delete('/:id', authenticateToken, isAdmin, usersCtrl.destroy);

module.exports = router;
