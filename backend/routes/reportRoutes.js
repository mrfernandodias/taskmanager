const express = require('express');

const router = express.Router();

const { exportTasksReport, exportUsersReport } = require('../controllers/reportController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.get('/exports/tasks', protect, adminOnly, exportTasksReport); // Export all tasks as Excel/PDF
router.get('/exports/users', protect, adminOnly, exportUsersReport); // Export user-task report

module.exports = router;
