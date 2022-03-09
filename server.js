require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyparser = require('body-parser');
const isurl = require('is-url');


// Basic Configuration
const port = process.env.PORT || 3000;
const url_map = new Map();
let count = 0;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyparser.urlencoded([{ extended : false}]));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res) {
  const original_url = req.body.url;
  const short_url = count;
  if(!isurl(original_url)){
    res.json({ error: 'invalid url' })
  }
  else if (Array.from(url_map.values()).includes(original_url) === false){
    url_map.set(short_url, original_url);
    count++;
  }
  res.json({original_url, short_url});
});

app.get('/api/shorturl/:id', function(req, res) {
  const shorturl_id = parseInt(req.params.id);
  original_url = url_map.get(shorturl_id);
  res.redirect(original_url);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
