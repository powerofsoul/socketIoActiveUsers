const _ = require('underscore');

const server = require('http').createServer();
const pages = {
};

const io = require('socket.io')(server, {
  path: '',
  serveClient: false,
  // below are engine.IO options
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});

const activeUsers = io.of('/activeusers');

activeUsers.on('connect', (socket) => {
    console.log("connected");
    const uri = socket.request.headers.referer;
    const address = socket.handshake.address;

    if(pages[uri]){
        pages[uri].push(address)
    }else{
        pages[uri] = [address];
    }

    const activeUsersCount = _.uniq(pages[uri]).length - 1;
    console.log(pages[uri]);
    console.log(`${uri}: ${activeUsersCount}`);

    socket.emit('stateChanged', {connectedUsers: activeUsersCount});

    socket.on('disconnect', () => {
        pages[uri] = _.without(pages[uri], address);
    });
});

server.listen(3000);