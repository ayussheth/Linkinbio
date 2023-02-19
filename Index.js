const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define an array to store the links
let links = [];

// Define a route to handle link submissions
app.post('/links', (req, res) => {
  const link = {
    id: uuidv4(), // Generate a unique ID for the link
    name: req.body.name,
    url: req.body.url
  };
  links.push(link);
  res.json({ linkId: link.id }); // Return the link ID to the user
});

// Define a route to handle link redirection
app.get('/:linkId', (req, res) => {
  const link = links.find(l => l.id === req.params.linkId);
  if (link) {
    res.redirect(link.url);
  } else {
    res.status(404).send('Link not found');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
