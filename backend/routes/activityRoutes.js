const router = require('express').Router();
const { getAll } = require('../controllers/activityController');
const { auth, authorize } = require('../middleware/authMiddleware');

router.get('/', auth, authorize('admin', 'manager'), getAll);

module.exports = router;
