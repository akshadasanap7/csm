const router = require('express').Router();
const { register, login, getMe, getUsers, updateProfile, changePassword, deleteUser } = require('../controllers/authController');
const { auth, authorize } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.get('/users', auth, authorize('admin', 'manager'), getUsers);
router.put('/profile', auth, updateProfile);
router.put('/password', auth, changePassword);
router.delete('/users/:id', auth, authorize('admin'), deleteUser);

module.exports = router;
