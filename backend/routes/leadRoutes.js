const router = require('express').Router();
const { getAll, create, update, remove, pipeline } = require('../controllers/leadController');
const { auth } = require('../middleware/authMiddleware');

router.use(auth);
router.get('/', getAll);
router.get('/pipeline', pipeline);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
