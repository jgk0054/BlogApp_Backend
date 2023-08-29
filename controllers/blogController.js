const Blog = require('../models/blogModel');

exports.getBlogs = async (req, res) => {
  const blogs = await Blog.findAllBlogs();
  res.json(blogs);
};

exports.getBlog = async (req, res) => {
  const blog = await Blog.findBlogById(req.params.id);
  if (!blog) return res.status(404).send('Blog not found.');
  
  res.json(blog);
};

exports.createBlog = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;
  if(!userId){
    return res.status(404).send('Null userID')
  }
  const newBlog = await Blog.createBlog(title, content, userId);
  res.status(201).json(newBlog);
};

exports.updateBlog = async (req, res) => {
  const { title, blocks } = req.body;
  const userId = req.user.id;
  if(!userId){
    return res.status(404).send('Null userID')
  }

  const updatedBlog = await Blog.updateBlog(req.params.id, title, blocks, userId);
  if (!updatedBlog) return res.status(404).send('Blog not found.');

  res.json(updatedBlog);
};

exports.deleteBlog = async (req, res) => {
  const success = await Blog.deleteBlog(req.params.id);
  if (!success) return res.status(404).send('Blog not found.');

  res.status(204).send();  // Successful HTTP delete status code
};
