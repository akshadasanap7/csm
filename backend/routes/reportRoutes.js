const router = require('express').Router();
const { getDashboard } = require('../controllers/reportController');
const { auth } = require('../middleware/authMiddleware');

router.get('/dashboard', auth, getDashboard);

module.exports = router;
