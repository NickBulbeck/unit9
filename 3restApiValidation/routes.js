'use strict';

const express = require('express');
const bcrypt = require('bcrypt');

// This array is used to keep track of user records
// as they are created.
const users = [];

// Construct a router instance.
const router = express.Router();

// Route that returns a list of users.
router.get('/users', (req, res) => {
  res.json(users);
});

// Route that creates a new user.
router.post('/users', (req, res) => {
  // Get the user from the request body.
  const user = req.body;
  const errors = [];
// Also note: express-validator is a package worth kenning aboot
  if (!user.name) {
    errors.push({ // Sometimes you want tailored error messages:
      "name" : [{
        "devMessage" : "The request body must contain a 'name' field",
        "userMessage" : "Please provide a name"
      }]
    });
  }
  if (!user.email) {
    errors.push(`Please provide a value for 'email'`);
  }
  let pwd = user.password;
  if (!pwd) {
    errors.push(`Please provide a valid passwurrd`);
  } else if (pwd.length < 8 || pwd.length > 20) {
    errors.push(`Passwurrd must be between 8 and 20 characters`);
  }
  else {
    user.password = bcrypt.hashSync(user.password, 10);
  }
  if (errors.length > 0) {
    res.status(400).json({errors}); // that is, .json({"errors":"errors"})
  } else {
    // Add the user to the `users` array.
    users.push(user);
    // Set the status to 201 Created and end the response.
    res.status(201).end();
  }

});

module.exports = router;