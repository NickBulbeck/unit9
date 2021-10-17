'use strict';

const express = require('express');
const { asyncHandler } = require('./middleware/async-handler');
const { User } = require('./models');
const { authenticateUser } = require('./middleware/auth-user');

// Construct a router instance.
const router = express.Router();

// Route that returns a list of users.
// Note carefully the argument list her. It instrucs Express to go through the 
// custom middleware function authenticateUser first, and then the anonymous
// function we've written here. Remember that this adds the user details to
// the req body (or else it has already sent a 401 response and execution never 
// reaches this point)
router.get('/users', authenticateUser, asyncHandler(async (req,res) => {
  const user = req.currentUser;
  res.json({
    name: user.name,
    username: user.username
  })
}))

// Route that creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
  try {
    await User.create(req.body);
    res.status(201).json({ "message": "Account successfully created!" });
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

module.exports = router;