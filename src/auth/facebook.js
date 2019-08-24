import passport from 'passport';
import models from '../models';
import dotenv from 'dotenv';
import generator from 'generate-password';

dotenv.config();

const UserModel = models.User;

const FacebookStrategy = require('passport-facebook').Strategy;

  passport.use(
    new FacebookStrategy({
      clientID:process.env.AppID,
      clientSecret:process.env.AppSecret,
      callbackURL:'https://barefoot-nomad.herokuapp.com/api/v1/auth/facebook/callback',
      proxy: true,
      profileFields: ['id', 'emails', 'name']
    }, async (accessToken, refreshToken, profile, done) => {
      try{
        const user = await UserModel.findOne({ where: { email:profile.emails[0].value } });
          if(user) return done(null, user);
           else {
            const genPassword = generator.generate({ length: 10, numbers: true});
            const data = {
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              email: profile.emails[0].value,
              password: genPassword
              };
            const user = await UserModel.create(data,err);
              if (err) return done(err)
                return done(null, user);
            }
        } catch (err){
            console.log(err);
          }
        })
      );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async(id, done) => {
    try{
      const user = await UserModel.findOne({ where: { id, } });
       if (user) return done(null, user);
      }catch(err){
        console.log(err);
      }
    });
 
  export default passport;