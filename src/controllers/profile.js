/* eslint-disable import/named */
/* eslint-disable require-jsdoc */
import CommonHelper from '../helpers/commonHelper';
import { onEvent, eventEmitter } from '../services/websocket';


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
        console.log('we made it so far');
        const socket = io();
        socket.on('message', (data) => { 
          console.log(data, 'here');
        })
        socket.on('4', (data) => { 
          console.log(data, 'This is ned');
        })
        socket.on('confirmation', (data) => { 
          console.log(data, 'here is the confirmation of the connection');
        })
        socket.emit('great guy', 'how are you sugar ban')
      </script>
    </head>
    <body>
      <div id="message-container"></div>
      <form id="message-container">
        <input type="text" id="message-input">
        <button type="submit" id="send-button">Send</button>
      </form>
    </body>
    </html>
    
    `;
    console.log();

    res.send(message);
  }
}

export default ProfileController;
