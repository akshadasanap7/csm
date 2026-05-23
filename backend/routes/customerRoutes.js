const router = require('express').Router();
const { getAll, getOne, create, update, remove } = require('../controllers/customerController');
const { auth } = require('../middleware/authMiddleware');

router.use(auth);
router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
