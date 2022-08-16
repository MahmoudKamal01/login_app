const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const credential = JSON.parse(
  fs.readFileSync(path.join(__dirname, '/data/credential.json'), 'utf8')
);

router.post('/login', (req, res) => {
  if (
    req.body.email == credential[0].email &&
    req.body.password == credential[0].password
  ) {
    req.session.user = req.body.email;
    res.redirect('/route/dashboard');
    //res.end('login success');
  } else {
    res.end('invalid Username or Password');
  }
});

// route for dashboard
router.get('/dashboard', (req, res) => {
  if (req.session.user) {
    res.render('dashboard', { user: req.session.user });
  } else {
    res.send('Unauthorized User');
  }
});
// route for logout
router.get('/logout', (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
      res.send('Error');
    } else {
      res.render('base', {
        title: 'Express',
        logout: 'logout Successfully...!',
      });
    }
  });
});
module.exports = router;
