const express = require('express');
const app = express();
const records = require('./records');

// IMPORTANT:
app.use(express.json());
// I think this is replacing the now-deprecated body-parser. It makes the 
// request body available to the middleware we've written, like the 
// POST-request handler to create a new quote.
// When a request comes in, it is sent through this function first.
// It tells express that we're expecting requests in json format (there's 
// an xmlparser() as well) and adds the data, in json-ised format, to the 
// request object. 


// Added for convenience (not part of the course files, but I
// was kind of missing this feature):
app.get('/',(req,res) => {
  res.redirect('/quotes');
})
//


// We want the client to be able to:
// Send a GET request to /quotes to READ a list of quotes
app.get('/quotes', async function (req,res) {
   const quotes = await records.getQuotes();
   res.json(quotes);
});  // needs an object as an argument, as you can see.

// Send a GET request to /quotes/:id to READ a quote
app.get('/quotes/:id', async (req,res) => { // the other way of writing it!
  const id = req.params.id;
  try {
    let quote = await records.getQuote(id);
    res.json(quote);  
  } catch(error) {
    // res.json({message: "Quote not found"});

    res.status(500).json({message:`Quote ${id} not found.`});
  }

  // Useful bit of objecty array method stuff follows:
  // const quote = data.quotes.find(quote => quote.id == id);
  // double == because one is a string and the other is a number)

});

// Send a PUT request to /quotes/:id to UPDATE a quote
app.put('/quotes/:id', async (req,res) => {
  const id = req.params.id;
  try {
    const quote = await records.getQuote(id);
    if (quote) {
      quote.quote = req.body.quote;
      quote.author = req.body.author;

      await records.updateQuote(quote);
      res.status(204).end(); // It's conventional to respond to a successful PUT request
                             // with a 204, but no other json.
    } else {
      res.status(404).json({message:`Quote ${id} not found.`})
    }
  } catch(error) {
    res.status(500).json({message: error.message});
  }
})


// Send a POST request to /quotes to CREATE a quote
app.post('/quotes', async(req,res) => {
  try {
    if (req.body.author && req.body.quote) {
      const quote = await records.createQuote({
        quote: req.body.quote,  // clearly, this is simplified. It depends on the
        author: req.body.author // request body being correctly formatted.
      });
      // A 201 status means a resource was created.
      res.status(201).json(quote); // It's common, in a REST API, to send a response back 
                       // to show that the request has worked. (Or, I suppose, an
                       // error instead.) This quote will contain an ID as well,
                       // for instance.  
      } else {
        res.status(400).json({message: "Quote and author required"});
        // code 400 means bad request.
      }
    } catch(error) {
      // res.status(500); This is the RESPONSE status, which defaults to 200.
      // res.json({message: error.message});
      // notice that you've got two separate res() methods here. You can chain 
      // them like this:
      res.status(500).json({message: error.message});
    }
});


// Send a DELETE request to /quotes/:id to DELETE a quote

app.delete('/quotes/:id', async (req,res) => {
  const id = req.params.id;
  try {
    const quote = await records.getQuote(id);
    await records.deleteQuote(quote);
    res.status(204).end() // again, custom dictates 204 and no content
  } catch(error) {
    res.status(500).json({message: error.message});
  }
})


// Send a GET request to /quotes/random to READ a random quote

app.listen(3000, () => console.log('Quote API listening on port 3000!'));

