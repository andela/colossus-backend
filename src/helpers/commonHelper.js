/* eslint-disable require-jsdoc */

class CommonHelper {
  /**
     * create a random link
     * @param {String} location host environment
     * @param {String} url the host url
     * @param {String} token users's token
     */

  static generateEmailLink(location, url, token) {
    const link = `${location}${url}?query=${token}`;
    return link;
  }
}

export default CommonHelper;
