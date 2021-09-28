const express = require('express');
const app = express();
const routes = require('./routes.js');


app.use(express.json());
// Remember: app.use() middleware runs every time a request is sent. The middleware
// runs in the order it's written, unless specified otherwise (e.g. with
// app.get/post/put/etc followed by a route).

// Now: the final refactoring here. It's common practice to send a REST API via routes that
// actually start 'api'. This means that you can have BOTH a single-page app AND a REST API
// fae the same server. So, [host and site name]/quotes might give you a page with quotes
// on, whereas [ditto]/api/quotes would give you the JSON equivalent. A lot of sites have
// this - web pages, and a load of /api stuff as well.
app.use('/api', routes); 

// Error handling. There are two basic types: 
//      - stuff that's wrong with the request
//      - stuff that went wrong with the server
// By default, express sends dummy html. But we want to send a JSON object.
// The error middleware here runs every time a request is sent unless it's been
// ended with a response from some of the middleware above.
// Middleware must do one of two things (if you don't want your app just to hang).
// It must either end the request with a response, or use next() to tell express to
// move on to the next middleware function.
// REMEMBER: calling next() with a parameter makes express assume that the parameter
// is an error, and it looks for a global error handler.

app.use((req,res,next) => {
  const error = new Error("Not found");
  error.status = 404; // Because this is an unhandled route, not an internal server error.
  next(error); // calling next() with a parameter tells express that there's an error
});
// express kens that this next yin is the error handler purely because it has
// four parameters - arguments.length = 4, if you will.
app.use((error,req,res,next) => {
  // for an internal server error, the error status won't have been defined yet.
   res.status(error.status || 500); // remember res.status() sets up the response status
   res.json({
     error: {
       message: error.message
     }
   })
});


app.listen(3000, () => console.log('Quote API listening on port 3000!'));

