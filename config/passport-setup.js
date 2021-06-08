// Setup for passport google authentication

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
require('dotenv').config();
const { User } = require('../sequelize/index');
const dbHelpers = require('../sequelize/db-helpers');

// get information from user to create cookie to send to browser
passport.serializeUser((user, next) => {
  next(null, user.googleId); // possibly change to user.id
});

// take id from stored cookie sent from browser and find user
passport.deserializeUser((id, next) => {
  User.findOne({
    where: {
      googleId: id,
    },
  })
    .then((user) => {
      next(null, user);
    });
});

passport.use(
  new GoogleStrategy({
    callbackURL: 'http://localhost:8080/auth/google/redirect',
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  }, (accessToken, refreshToken, profile, next) => {
    // check if user already exists in DB
    // find user with matching googleId and profile.id
    // console.log('accessToken', accessToken);
    // console.log('refreshToken', refreshToken);
    // console.log('profile', profile);
    User.findOne({
      where: {
        googleId: profile.id,
      },
    })
      .then((currentUser) => {
        console.log('currentUser', currentUser);
        if (currentUser) {
          // if user exists
          next(null, currentUser);
        } else {
          console.log('currentUser doesn\'t exist, profile is:', profile);
          // if user doesn't exist
          // use profile.id & profile.displayName for saving in db
          // create new sequelize User given ^
          User.create({
            username: profile.displayName,
            googleId: profile.id,
            isQuizzed: false,
          })
            .then((newUser) => {
              dbHelpers.createPreferences(newUser.dataValues.id);
              next(null, newUser);
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }),
);
