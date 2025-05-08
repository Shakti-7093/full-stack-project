const express = require('express');
const { sequelize } = require('../models');
const authRoutes = require('./routes/auth.routes');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors('*'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Express + MySQL server!');
});

sequelize.authenticate()
  .then(() => {
    console.log('✅ Sequelize connected to MySQL');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to DB:', err);
  });
