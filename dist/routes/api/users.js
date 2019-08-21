"use strict";

var _express = _interopRequireDefault(require("express"));

var _passport = _interopRequireDefault(require("passport"));

var _User = _interopRequireDefault(require("../../models/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.get('/user', function (req, res, next) {
  _User["default"].findById(req.payload.id).then(function (user) {
    if (!user) {
      return res.sendStatus(401);
    }

    return res.json({
      user: user.toAuthJSON()
    });
  })["catch"](next);
});
router.put('/user', function (req, res, next) {
  _User["default"].findById(req.payload.id).then(function (user) {
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

    return user.save().then(function () {
      return res.json({
        user: user.toAuthJSON()
      });
    });
  })["catch"](next);
});
router.post('/users/login', function (req, res, next) {
  if (!req.body.user.email) {
    return res.status(422).json({
      errors: {
        email: "can't be blank"
      }
    });
  }

  if (!req.body.user.password) {
    return res.status(422).json({
      errors: {
        password: "can't be blank"
      }
    });
  }

  _passport["default"].authenticate('local', {
    session: false
  }, function (err, user, info) {
    if (err) {
      return next(err);
    }

    if (user) {
      return res.json({
        user: user.toAuthJSON()
      });
    }

    return res.status(422).json(info);
  })(req, res, next);
});
router.post('/users', function (req, res, next) {
  var user = new _User["default"]();
  user.username = req.body.user.username;
  user.email = req.body.user.email;
  user.setPassword(req.body.user.password);
  user.save().then(function () {
    return res.json({
      user: user.toAuthJSON()
    });
  })["catch"](next);
});
module.exports = router;