
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
    const validationErrors = [];
    errors.map((error) => validationErrors.push(error.msg));
    return validationErrors;
  }
}

export default Helpers;
