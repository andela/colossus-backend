import passport from 'passport';
import models from '../models';
import dotenv from 'dotenv';
import generator from 'generate-password';

dotenv.config();

const UserModel = models.User;

const GoogleStrategy = require('passport-google-oauth20').Strategy;


  passport.use(
    new GoogleStrategy({
      clientID: process.env.googleClientID,
      clientSecret: process.env.googleClientSecret,
      callbackURL:'https://barefoot-nomad.herokuapp.com/api/v1/auth/google/callback',
      proxy: true
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