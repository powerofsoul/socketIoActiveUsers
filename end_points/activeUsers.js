const _ = require('underscore');

function activeUsers(io){
    const activeUsers = io.of('/activeusers');
    const pages = {
    };
    
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
        socket.broadcast.emit('stateChande', {connectedUsers: activeUsers});

        socket.on('disconnect', () => {
            pages[uri] = _.without(pages[uri], address);
        });
    });
}

exports.activeUsers = activeUsers;