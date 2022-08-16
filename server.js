const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const router = require('./router');
const mongoose = require('mongoose');
const User = require('./model/user');
const { nextTick } = require('process');
const fs = require('fs');
//////////////////////////////////////////
const port = process.env.PORT || 3000;
const app = express();

//////////////////////////////////////////////////////////connect DB
const initDB = async () => {
  await mongoose.connect(
    'mongodb+srv://drogo:1234@cluster0.gobpslr.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  console.log('Connected to DB');
};

initDB();
////////////////////////////////////////
async function createUser() {
  let user = await new User({
    email: 'admin@gmail.com',
    password: 'admin123',
  }).save();
}
createUser();
/////////////////////////////////////////////////////////
app.use(async (req, res, next) => {
  try {
    const user = await User.find();
    fs.writeFileSync('data/credential.json', JSON.stringify(user));
    next();
  } catch (err) {
    console.log(err);
  }
});
/////////////////////////////////////////////////////
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
