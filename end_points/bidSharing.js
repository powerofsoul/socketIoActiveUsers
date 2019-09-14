function bidShare(io){
    var state = {};
    const bidShare = io.of('/bid');

    bidShare.on('connect', (socket) => {
        socket.emit('stateChanged', state);

        socket.on('stateChanged', (data) => {
            state = data;
            socket.broadcast.emit('stateChanged', state)
        })
    });
}

exports.bidShare = bidShare;