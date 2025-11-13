const express = require('express');

const { getUsers, getUserById } = require('../controllers/userController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

// User Management Routes
router.get('/', protect, adminOnly, getUsers);
router.get('/:id', protect, getUserById);

module.exports = router;
