const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express();
// Use the cors middleware
app.use(cors());

const userRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

app.use(express.json());
app.use('/api/auth', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api', uploadRoutes);

app.listen(3000, () => {
  // console.log('Server is running on port 3000');
});

module.exports = app;  // Export for testing
