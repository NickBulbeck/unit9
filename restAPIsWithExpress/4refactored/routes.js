const express = require('express');
const router = express.Router();
const records = require('./records.js');

// Now, the async-handling function you've seen before. It takes a callback as an
// argument. We'll demonstrate this with the .post route first.
const asyncHandler = (cb) => {
  return async (req,res,next) => {
    try {
      await cb(req,res,next);
    } catch(error) {
      next(error);
    }
  }
}



// Send a GET request to /quotes to READ a list of quotes
router.get('/quotes', async (req, res)=>{
    const quotes = await records.getQuotes();
    res.json(quotes);
});
// Send a GET request to /quotes/:id to READ(view) a quote
router.get('/quotes/:id', async (req, res)=>{
    try {
        const quote = await records.getQuote(req.params.id);
        if(quote){
            res.json(quote);
        } else {
            res.status(404).json({message: "Quote not found."});
        }
        
    } catch(err) {
        res.status(500).json({message: err.message});
    }
});

//Send a POST request to /quotes to  CREATE a new quote.
// First stab, without using the async handler...
// router.post('/quotes', async (req,res) =>{
//     try {
//         if(req.body.author && req.body.quote){
//             const quote = await records.createQuote({
//                 quote: req.body.quote,
//                 author: req.body.author
//             });
//             res.status(201).json(quote);
//         } else {
//             res.status(400).json({message: "Quote and author required."});
//         }

//     } catch(err) {
//         res.status(500).json({message: err.message});
//     } 
// });
// And now with the async handler:
router.post('/quotes', asyncHandler( async (req,res) => { // Pass in an anonymous function.
// It has exactly the code we had before, but with no try/catch. 
  if (req.body.author && req.body.quote) {
      const quote = await records.createQuote({
          quote: req.body.quote,
          author: req.body.author
      });
      res.status(201).json(quote);
  } else {
      res.status(400).json({message: "Quote and author required."});
  }
}));



// Send a PUT request to /quotes/:id to UPDATE (edit) a quote
// Again - firstly, longhand, and secondly with the async handler.
// router.put('/quotes/:id', async(req,res) => {
//     try {
//         const quote = await records.getQuote(req.params.id);
//         if(quote){
//             quote.quote = req.body.quote;
//             quote.author = req.body.author;
//             await records.updateQuote(quote);
//             res.status(204).end();
//         } else {
//             res.status(404).json({message: "Quote Not Found"});
//         }     
//     } catch(err){
//         res.status(500).json({message: err.message});
//     }
// });
router.put('/quotes/:id', asyncHandler(async (req,res) => {
  const quote = await records.getQuote(req.params.id);
  if(quote){
      quote.quote = req.body.quote;
      quote.author = req.body.author;
      await records.updateQuote(quote);
      res.status(204).end();
  } else {
      res.status(404).json({message: "Quote Not Found"});
  }    
}));



// Send a DELETE request to /quotes/:id DELETE a quote 
router.delete("/quotes/:id", async(req,res, next) => {
    try {
      // dummy server error for testing:
      // throw new Error("Something terrible happened and we're doomed!")
        const quote = await records.getQuote(req.params.id);
        await records.deleteQuote(quote);
        res.status(204).end();
    } catch(err){
      // dummy code to use next(err) to force express to go and look for a
      // global error-handler (which we've wrtten at the end of the file):
        // next(err);
      // incidentally, next() acts like a return statement; so there's no need
      // to comment out the actual code below. It won't execute. I think...
        res.status(500).json({ message: err.message });
    }
});
// Send a GET request to /quotes/quote/random to READ (view) a random quote
router.get('/quotes/quote/random', asyncHandler(async(req,res) => {
  const quote = await records.getRandomQuote();
  res.json(quote);
}));

module.exports = router;



