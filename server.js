const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = express.Router();
const appRoutes = require('./api')(router);
const session = require('express-session');
const secret = process.env.SECRET || 'mysecret';

const port = process.env.PORT || 3000;
const connection = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/spelling';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: secret,
  saveUninitialized: true,
  resave: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));
app.use(express.static(path.join(__dirname + '/dist')));
app.use('/api', appRoutes);

mongoose.connect(connection, (err) => {
  if (err) {
    console.log('Error while trying to connect to database');
  } else {
    console.log('success connecting to database');
  }
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './dist/index.html'));
});

app.listen(port, () => {
  console.log('Server listening on port ', port);
});
