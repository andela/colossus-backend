
/**
 *
 *
 * @class Helpers
 *
 */
class Helpers {
  /**
   *
   *
   * @static
   * @param {object} errors - The error messages
   * @returns {object} - The response
   * @memberof Helpers
   */
  static extractErrors(errors) {
    let validationErrors;
    errors.map((error => validationErrors = error.msg));
    return validationErrors;
  }
}

export default Helpers;
