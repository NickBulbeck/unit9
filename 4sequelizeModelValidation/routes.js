'use strict';

const express = require('express');

// Construct a router instance.
const router = express.Router();
const User = require('./models').User;

// Handler function to wrap each route.
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  }
}

// Route that returns a list of users.
router.get('/users', asyncHandler(async (req, res) => {
  let users = await User.findAll();
  res.json(users);
}));

// Route that creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
  try {
    await User.create(req.body);
    res.status(201).json({ "message": "Account successfully created!" });
  } catch (error) {
    console.log('ERROR: ', error.name);
// Note below that the unique constraint error is created by the database itself (remember
// - sequelize doesn't know what emails are in the database), but is then passed up to us via
// sequelize. 
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);  // process the array of errors that comes
      res.status(400).json({ errors });                     // with a Sequelize error
    } else {
      throw error; // this goes into the error-handling route at the end of app.js
    }
  }
}));

module.exports = router;
