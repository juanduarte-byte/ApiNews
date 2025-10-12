const express = require('express');
const router = express.Router();
const newsCtrl = require('../controllers/newsController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { isAdmin, isContributorOrAdmin } = require('../middlewares/roleMiddleware');

// public
router.get('/', newsCtrl.index);
router.get('/:id', newsCtrl.show);

// protected: create by contributor or admin
router.post('/', authenticateToken, isContributorOrAdmin, newsCtrl.create);

// update by owner or admin
router.put('/:id', authenticateToken, newsCtrl.update);

// change state - only admin
router.patch('/:id/state', authenticateToken, isAdmin, newsCtrl.changeState);

// delete (soft) - only admin
router.delete('/:id', authenticateToken, isAdmin, newsCtrl.destroy);

module.exports = router;
