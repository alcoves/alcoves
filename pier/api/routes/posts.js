const express = require('express');
const c = require('../controllers/posts');

const router = express.Router();

router.get('/', c.getPosts);
router.get('/:id', c.getPost);
router.post('/', c.createPost);
router.patch('/:id', c.patchPost);
router.delete('/:id', c.deletePost);

module.exports = router;
