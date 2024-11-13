const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express();


// Configure CORS
const corsOptions = {
  origin: 'http://localhost:3001', // Allow requests from this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 204 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};


// Use the cors middleware
app.use(cors(corsOptions));

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
