const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(
  session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
  })
);

let products = []; 


app.post('/login', (req, res) => {
  const { username } = req.body;
  if (username) {
    req.session.username = username;
    res.cookie('lastAccess', new Date().toLocaleString(), { maxAge: 3600000 }); // 1 hora
    res.redirect('/home.html');
  } else {
    res.redirect('/login.html?error=invalid');
  }
});


app.post('/add-product', (req, res) => {
  if (req.session.username) {
    products.push(req.body);
    res.redirect('/home.html');
  } else {
    res.redirect('/login.html?error=session');
  }
});


app.get('/products', (req, res) => {
  if (req.session.username) {
    res.json({ products, lastAccess: req.cookies.lastAccess });
  } else {
    res.status(401).send('Unauthorized');
  }
});


app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login.html');
});


app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
