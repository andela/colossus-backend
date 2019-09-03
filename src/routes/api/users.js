import express from 'express';
import passport from 'passport';

import Role from '../../controllers/role';
import authorize from '../../middlewares/authorize';
import User from '../../models/User';

const router = express.Router();

router.get('/user', (req, res, next) => {
  User.findById(req.payload.id)
    .then((user) => {
      if (!user) {
        return res.sendStatus(401);
      }
      return res.json({ user: user.toAuthJSON() });
    })
    .catch(next);
});

router.put('/user', (req, res, next) => {
  User.findById(req.payload.id)
    .then((user) => {
      if (!user) {
        return res.sendStatus(401);
      }

      if (!req.body.user.username) {
        user.username = req.body.user.username;
      }
      if (!req.body.user.email) {
        user.email = req.body.user.email;
      }
      if (!req.body.user.bio) {
        user.bio = req.body.user.bio;
      }
      if (!req.body.user.image) {
        user.image = req.body.user.image;
      }
      if (!req.body.user.password) {
        user.setPassword(req.body.user.password);
      }

      return user.save().then(() => res.json({ user: user.toAuthJSON() }));
    })
    .catch(next);
});

router.post('/users/login', (req, res, next) => {
  if (!req.body.user.email) {
    return res.status(422).json({ errors: { email: "can't be blank" } });
  }

  if (!req.body.user.password) {
    return res.status(422).json({ errors: { password: "can't be blank" } });
  }
  passport.authenticate('local', { session: false }, (
    err,

    user,
    info
  ) => {
    if (err) {
      return next(err);
    }

    if (user) {
      return res.json({ user: user.toAuthJSON() });
    }
    return res.status(422).json(info);
  })(req, res, next);
});

router.post('/users', (req, res, next) => {
  const user = new User();

  user.username = req.body.user.username;
  user.email = req.body.user.email;
  user.setPassword(req.body.user.password);

  user.save()
    .then(() => res.json({ user: user.toAuthJSON() }))
    .catch(next);
});

router.patch('/user/roles', authorize, Role.assignRole);

export default router;
