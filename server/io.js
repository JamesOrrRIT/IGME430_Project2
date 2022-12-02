const http = require('http');
const { Server } = require('socket.io');
const MessageModel = require('./models/Message');

let io;

// convert a connect middleware to a Socket.IO middleware
const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);

const saveMessage = async (incomingMessage) => {
  const save = {
    messageText: incomingMessage.message,
    postedBy: incomingMessage.postedBy,
    channel: incomingMessage.channel,
  };

  try {
    const newMessage = await new MessageModel(save);
    await newMessage.save();
  } catch (err) {
    console.log(err);
    // return res.status(400).json({ error: 'An error has occurred.' });
  }

  return false;
};

const socketSetup = (app, sessionMiddleware) => {
  const server = http.createServer(app);
  io = new Server(server);
  io.use(wrap(sessionMiddleware));

  io.on('connection', (socket) => {
    console.log(socket.request.session);

    socket.on('disconnect', () => {
      console.log('a user disconnected');
    });

    socket.on('chat message', (msg) => {
      let messageOutput = `${socket.request.session.account.username} `;
      if (socket.request.session.account.nickname) {
        messageOutput += `(${socket.request.session.account.nickname})`;
      }
      messageOutput += `: ${msg.message}`;

      const date = new Date();
      const day = date.toJSON().slice(0, 10).replace(/-/g, '/');
      const hours = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

      messageOutput += `\nPosted on: ${day} at ${hours}`;

      if (socket.request.session.account.colorPicker) {
        messageOutput += `\nColor: ${socket.request.session.account.colorPicker}`;
      }

      io.emit(msg.channel, messageOutput);

      // Function to save message
      msg.postedBy = socket.request.session.account._id;

      saveMessage(msg);
    });
  });

  return server;
};

module.exports = socketSetup;
