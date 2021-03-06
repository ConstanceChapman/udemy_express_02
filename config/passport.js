const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

// Load User model
const User = mongoose.model('users');

module.exports = function(passport){
  passport.use(
    new GoogleStrategy({
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    }, (accessToken, refreshToken, profile, done) => {
      const pic = profile.photos[0].value;
      const image = pic.substring(0, pic.indexOf('?'));
      const newUser = {
        googleID: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        image: image
      }

      // Check if user is already in db
      User.findOne({
        googleID: profile.id
      }).then(user => {
        if(user){
          // return user
          done(null, user);
        } else {
          // create user
          new User(newUser)
            .save()
            .then(user => done(null, user));
        }
      })
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
  });
}
