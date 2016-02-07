var Flow = require('flow');
var ws = require('ws').Server;
var sessions = require('client-sessions');
var client = require('./client');

function emit (message) {

    var stream = Flow.flow('ws_message', {
        socket: socket,
        session: socket.upgradeReq.session
    });
    stream.o.pipe(socket);
    stream.o.on('error', function (err) {
        // TODO send error frame
    });
    socket.pipe(stream.i);
}

exports.start = function (options, data, next) {

    var server = new ws({server: Flow.server});
    var clientSession = sessions(Flow.config.session);

    server.on('connection', function connection(socket) {

        // plug client session midleware
        clientSession(socket.upgradeReq, {}, function (err) {

            // emit ws messages to flow
            socket.onmessage = emit; 
        });
    });

    console.log('flow-ws is listening on port', Flow.server.address().port);
};

exports.mux = client.mux;
exports.demux = client.demux;
