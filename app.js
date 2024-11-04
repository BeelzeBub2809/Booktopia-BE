const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const cron = require('node-cron');
const GHNController = require('./controllers/GHN.controller');
const app = express();
require('dotenv').config();
const db = require('./models/index');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const PORT_CLIENT = process.env.PORT_CLIENT || 3000;
app.use(cors({
  origin: `http://${process.env.HOST_NAME}:${PORT_CLIENT}`,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use('/api', require('./routes/index'));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  })
});

app.listen(process.env.PORT,process.env.HOST_NAME, async() => {
  console.log(`Server starting at http://${process.env.HOST_NAME}:${process.env.PORT}`);
  await db.connectDB();
})
module.exports = app;
