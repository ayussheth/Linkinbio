const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { nanoid } = require('nanoid');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const dataFile = './data.json';

// Route to handle form submission and save data
app.post('/save', (req, res) => {
  const links = req.body;
  const id = nanoid(10);
  const data = {
    id,
    links,
  };
  let jsonData = [];
  try {
    const dataStr = fs.readFileSync(dataFile);
    jsonData = JSON.parse(dataStr);
  } catch (err) {
    console.error('Error reading data file:', err);
  }
  jsonData.push(data);
  fs.writeFile(dataFile, JSON.stringify(jsonData), (err) => {
    if (err) {
      console.error('Error writing data file:', err);
      res.sendStatus(500);
    } else {
      res.send(`Your link is: https://example.com/${id}`);
    }
  });
});

// Route to handle link redirect
app.get('/:id', (req, res) => {
  const id = req.params.id;
  let jsonData = [];
  try {
    const dataStr = fs.readFileSync(dataFile);
    jsonData = JSON.parse(dataStr);
  } catch (err) {
    console.error('Error reading data file:', err);
    res.sendStatus(500);
    return;
  }
  const data = jsonData.find((d) => d.id === id);
  if (!data) {
    res.sendStatus(404);
    return;
  }
  const links = data.links;
  res.send(`
    <html>
      <head>
        <title>My Linktree</title>
      </head>
      <body>
        <ul>
          ${Object.entries(links)
            .map(
              ([key, value]) =>
                `<li><a href="${value}"><img src="https://www.google.com/s2/favicons?domain=${value}" width="16" height="16" style="vertical-align: middle;"> ${key}</a></li>`
            )
            .join('')}
        </ul>
      </body>
    </html>
  `);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
