"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Helpers = _interopRequireDefault(require("../helpers/Helpers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var extractErrors = _Helpers["default"].extractErrors;
/**
 *
 * validates user sign up inputs
 *
 * @export
 * @class AuthValidator
 * @param {callback} next
 */

var AuthValidator =
/*#__PURE__*/
function () {
  function AuthValidator() {
    _classCallCheck(this, AuthValidator);
  }

  _createClass(AuthValidator, null, [{
    key: "validateSignUp",

    /**
     *
     *
     * @static
     * @param {object} req - The request entered by the user.
     * @param {object} res  - The response sent to the user is error if validation fails
     * @param {callback} next - The next middleware is called if validation is successful
     * @returns {object} The response
     * @memberof AuthValidator
     */
    value: function validateSignUp(req, res, next) {
      req.check('email', 'Email is required').notEmpty().isEmail().withMessage('Invalid email');
      req.check('firstName', 'First Name is required').notEmpty().trim();
      req.check('lastName', 'Last Name is required').notEmpty().trim();
      req.check('password', 'Password is required').notEmpty().trim().isLength({
        min: 8
      }).withMessage('password cannot be less then 8 characters').isAlphanumeric().withMessage('Password must be alphanumeric');
      req.check('phoneNumber', 'The phone number is required').notEmpty().trim().isLength({
        min: 11
      }).withMessage('Enter a valid phone number');
      req.check('address', 'Address is required').trim().isLength({
        min: 11
      }).withMessage('Invalid address, the address cannot be less that 11 characters');
      var errors = req.validationErrors();

      if (errors) {
        return res.status(400).json({
          status: 'error',
          error: extractErrors(errors)
        });
      }

      return next();
    }
    /**
     *
     *
     * @static
     * @param {object} req - The request entered by the user.
     * @param {object} res  - The response sent to the user is error if validation fails
     * @param {callback} next - The next middleware is called if validation is successful
     * @returns {number} The response
     * @memberof AuthValidator
     */

  }, {
    key: "validateLogin",
    value: function validateLogin(req, res, next) {
      req.check('email', 'Email is required').notEmpty().isEmail().trim().withMessage('Invalid email');
      req.check('password', 'Password is required').notEmpty().trim();
      var errors = req.validationErrors();

      if (errors) {
        return res.status(400).json({
          status: 'error',
          errors: extractErrors(errors)
        });
      }

      return next();
    }
  }]);

  return AuthValidator;
}();

exports["default"] = AuthValidator;