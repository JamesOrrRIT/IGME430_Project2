const http = require('http');
const { Server } = require('socket.io');

let io;

// convert a connect middleware to a Socket.IO middleware
const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);

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
      const date = new Date();
      const day = date.toJSON().slice(0, 10).replace(/-/g, '/');
      const hours = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      io.emit(msg.channel, `${socket.request.session.account.username} (${socket.request.session.account.nickname}): ${msg.message} \nPosted on: ${day} at ${hours}`);

      // Function to save message
    });
  });

  return server;
};

module.exports = socketSetup;
