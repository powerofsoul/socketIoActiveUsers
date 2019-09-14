const activeUsers = require("./end_points/activeUsers").activeUsers;
const bidShare = require("./end_points/bidSharing").bidShare;

const server = require('http').createServer();

const io = require('socket.io')(server, {
  path: '',
  serveClient: false,
  // below are engine.IO options
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});

activeUsers(io);
bidShare(io);

server.listen(3000);