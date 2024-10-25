const mongoose = require('mongoose');
const express = require('express');
require('dotenv').config();

const bodyParser = require('body-parser');

const app = express();

const authRoutes = require('./controllers/AuthController');
const swipeRoutes = require('./controllers/SwipeController');

app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use(swipeRoutes);

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

console.log('connection', `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/`);

mongoose.connect(`mongodb+srv://ariebrian22:FjZ0LRNwVUCrM5Ov@cluster0.bmozg.mongodb.net/`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.listen(3000, () => console.log('Server running on port 3000'));
