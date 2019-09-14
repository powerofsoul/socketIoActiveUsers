const _ = require('underscore');

function activeUsers(io){
    const activeUsers = io.of('/activeusers');
    const pages = {
    };
    
    function countUsers(uri){
        const activeUsersCount = _.uniq(pages[uri]).length - 1;

        return activeUsersCount;
    }
    activeUsers.on('connect', (socket) => {
        console.log("connected");
        const uri = socket.request.headers.referer;
        const address = socket.handshake.address;

        if(pages[uri]){
            pages[uri].push(address)
        }else{
            pages[uri] = [address];
        }

        activeUsers.emit('stateChanged', {connectedUsers: countUsers(uri)});

        socket.on('disconnect', () => {
            pages[uri] = _.without(pages[uri], address);
            activeUsers.emit('stateChagned', {connectedUsers: countUsers(uri)});
        });
    });
}

exports.activeUsers = activeUsers;