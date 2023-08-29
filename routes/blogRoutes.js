const express = require('express');
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', blogController.getBlogs);
router.get('/:id', blogController.getBlog);

// Protect routes
router.post('/', authMiddleware, blogController.createBlog);
router.put('/:id', authMiddleware, blogController.updateBlog);
router.delete('/:id', authMiddleware, blogController.deleteBlog);

module.exports = router;
