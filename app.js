const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

// Load user model
require('./models/User');

// passport config
require('./config/passport')(passport);

// Load routes
const auth = require('./routes/auth');
const index = require('./routes/index');

// load keys
const keys = require('./config/keys');

//map global promises
mongoose.Promise = global.Promise


// connect mongoose
mongoose.connect(keys.mongoURI, {
  useMongoClient: true
})
  .then(() => console.log('mongodb connected'))
  .catch(err => console.log(err));

const app = express();

// handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// set global variables
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Use routes
app.use('/', index);
app.use('/auth', auth);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
