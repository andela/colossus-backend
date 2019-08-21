"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 *
 *
 * @class Helpers
 *
 */
var Helpers =
/*#__PURE__*/
function () {
  function Helpers() {
    _classCallCheck(this, Helpers);
  }

  _createClass(Helpers, null, [{
    key: "extractErrors",

    /**
     *
     *
     * @static
     * @param {object} errors - The error messages
     * @returns {object} - The response
     * @memberof Helpers
     */
    value: function extractErrors(errors) {
      var validationErrors = [];
      errors.map(function (error) {
        return validationErrors.push(error.msg);
      });
      return validationErrors;
    }
  }]);

  return Helpers;
}();

var _default = Helpers;
exports["default"] = _default;