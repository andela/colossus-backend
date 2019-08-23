/* eslint-disable require-jsdoc */

class CommonHelper {
  /**
     * @param {String} location host environment
     * @param {String} url the host url
     * @param {String} token users's token
     * @description creates a random link to be sent to user
     */

  static generateEmailLink(location, url, token) {
    const link = `${location}${url}?query=${token}`;
    return link;
  }
}

export default CommonHelper;
