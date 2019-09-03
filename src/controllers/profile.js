/* eslint-disable import/named */
/* eslint-disable require-jsdoc */
import CommonHelper from '../helpers/commonHelper';

class ProfileController extends CommonHelper {
  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} the new user
   * @description register a new client
   */
  static async getProfile(req, res) {
    const { userId } = req.params;

    const message = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Chat App</title>
      <script src="/socket.io/socket.io.js"></script>
      <script>
        const appendMessage = (message) => {
          const div = document.getElementById('message-container');
          let para = document.createElement('p');
          para.appendChild(document.createTextNode(message));
          div.appendChild(para);
        };
        const socket = io();
        socket.on('${userId}', (data) => { 
          appendMessage(data);
        })
      </script>
    </head>
    <body>
      <div id="message-container">
        <h3>Notify User Trips</h3>
        
      </div>
      
    </body>
    </html>
    
    `;

    res.send(message);
  }
}

export default ProfileController;
