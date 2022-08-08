const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const router = require('./router');
//////////////////////////////////////////

const port = process.env.PORT || 3000;
const app = express();

//////////////////////////////////////////////////////////
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//////////////////////////////////////////////////////////
app.set('view engine', 'ejs');
//load static assets
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

app.use(session({ secret: uuidv4(), resave: false, saveUninitialized: true }));

app.use('/route', router);
//home route
app.get('/', (req, res) => {
  res.render('base', { title: 'Login System' });
});

app.listen(port, () => {
  console.log('listening on port ' + port);
});
