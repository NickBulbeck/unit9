'use strict';
const auth = require('basic-auth');
const { User } = require('../models');
const bcrypt = require('bcrypt');

// Middleware to authenticate the request using Basic Authentication.
// May as well get used to the other way of exportig:
exports.authenticateUser = async (req,res,next) => {
  let message;
  // Parse the user's credentials fae the Authorization header.
  const credentials = auth(req);
  // If the user's credentials are available;
  if (credentials) {
    const user = await User.findOne({ where: {username : credentials.name}});
    if (user) {
      const authenticated = bcrypt.compareSync( // returns a boolean
        credentials.pass, user.confirmedPassword
      )
      if (authenticated) {
        console.log(`Authentication successful for username ${user.username}`);
        req.currentUser = user;
      } else {
        message = `Authentication failed for user ${user.username}`
      }
    } else {
      message = `user ${credentials.name} not found`;
    }
  } else {
    message = `Auth header not found`;
  }
  // If user authentication fails:
    // Return a response with a 401 Unauthorized HTTP status code
  if (message) {
    console.warn(message);
    res.status(401).json({message: 'Access denied'})
    // This message is deliberatly vague, because if it's a hacker you don't want
    // to give them information.
  } else {
    // if authentication succeeds, call the next() method
    next();
  }

}