/**
 * @class CommonHelper
 */
class CommonHelper {
  /**
   *
   * @param {String} location
   * @param {String} url
   * @param {String} token
   * @return {String} link
   */
  static generateEmailLink(location, url, token) {
    const link = `${location}${url}?query=${token}`;
    return link;
  }
}

export default CommonHelper;
