const router = require('express').Router();
const { getAll, create, update, remove } = require('../controllers/followUpController');
const { auth } = require('../middleware/authMiddleware');

router.use(auth);
router.get('/', getAll);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
