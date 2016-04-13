var Flow = require('flow');
var ws = require('ws').Server;
var sessions = require('client-sessions');
var client = require('./client');

function emit (instance, socket, message) {
    instance.flow('message').write({
        message: message,
        socket: socket,
        session: socket.upgradeReq.session
    });
}

exports.start = function (options, data, next) {

    // TODO start new server or check data for server instance
    // TODO check port
    // TODO default session options

    var instance = this;
    var server = new ws({server: data.server});
    var clientSession = data.session || sessions(options.session);

    server.on('connection', function connection(socket) {

        // plug client session midleware
        clientSession(socket.upgradeReq, {}, function (err) {

            // emit ws messages to flow
            socket.onmessage = emit.bind(instance, socket); 
        });
    });

    console.log('flow-ws is listening on port', data.server.address().port);
};

exports.mux = client.mux;
exports.demux = client.demux;
