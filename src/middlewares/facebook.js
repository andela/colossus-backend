/* eslint-disable no-console */
import passport from 'passport';
import dotenv from 'dotenv';
import generator from 'generate-password';
import models from '../models';

dotenv.config();

const UserModel = models.User;

const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(
  new FacebookStrategy({
    clientID: process.env.AppID,
    clientSecret: process.env.AppSecret,
    callbackURL: 'https://barefoot-nomad.herokuapp.com/api/v1/auth/facebook/callback',
    proxy: true,
    profileFields: ['id', 'emails', 'name']
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
      user = await UserModel.create(data);
      // eslint-disable-next-line no-undef
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
    console.log(err);
  }
});
export default passport;
