var createError = require('http-errors');
var express = require('express');
const cors = require("cors");
require("dotenv").config();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const connectDb = require('./config/db')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth')
const mongoose = require("mongoose");

var app = express();
connectDb()

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler - UPDATED FOR REACT FRONTEND
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  const isDevelopment = req.app.get('env') === 'development';
  
  // Return JSON error response instead of rendering
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
      status: err.status || 500,
      ...(isDevelopment && { stack: err.stack }) // Only include stack in development
    }
  });
});

module.exports = app;