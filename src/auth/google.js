/* eslint-disable no-console */
import passport from 'passport';
import dotenv from 'dotenv';
import generator from 'generate-password';
import models from '../models';

dotenv.config();

const UserModel = models.User;

// eslint-disable-next-line import/no-extraneous-dependencies
const GoogleStrategy = require('passport-google-oauth20').Strategy;


passport.use(
  new GoogleStrategy({
    clientID: process.env.googleClientID,
    clientSecret: process.env.googleClientSecret,
    callbackURL: 'http://localhost:3000/api/v1/auth/google/api/v1/auth/google/callback',
    proxy: true
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await UserModel.findOne({ where: { email: profile.emails[0].value } });
      if (user) return done(null, user);
      const genPassword = generator.generate({ length: 10, numbers: true });
      const data = {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        password: genPassword
      };
      // eslint-disable-next-line no-undef
      user = await UserModel.create(data, err);
      // eslint-disable-next-line no-undef
      if (err) return done(err);
      return done(null, user);
    } catch (err) {
      console.log(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findOne({ where: { id, } });
    if (user) return done(null, user);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
});

export default passport;
