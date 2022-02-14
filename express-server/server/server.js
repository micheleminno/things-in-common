const express = require('express');
const cors = require('cors');

const things = require('./things');
const facts = require('./facts');
const utilities = require('./utilities');

const app = express();

app.use(cors());

app.get('/', function(req, res) {

  console.log("Server is working!");
  res.send('Welcome');
});

app.get('/things/load', things.load);
app.post('/things/index', things.index);
app.get('/things/matching', things.matching);

app.get('/facts', facts.list);
app.get('/facts/add', facts.add);
app.get('/facts/remove', facts.remove);
app.get('/facts/delete', facts.removeAll);
app.get('/facts/update', facts.update);
app.get('/facts/getThings', facts.getMatchingThings);

app.get('/utilities/url-exists', utilities.checkUrl);

const server = app.listen(3000, function() {

  console.log("Listening to port %s", server.address().port);
});

module.exports = server;
