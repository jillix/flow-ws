var Flow = require('flow');
var wss = require('ws').Server;
var sessions = require('client-sessions');
var demux = require('./lib/demux');

// TODO how to get server instance?
var server = new wss({server: server});

var clientSession = sessions(Flow.config.session);

// TODO move this function to flow
function getEntrypoint (req) {

    var entrypoints = config.entrypoints[req.session.role ? 'private' : 'public'];
    if (!entrypoints) {
        return;
    }

    return entrypoints[req.hostname] || entrypoints['*'];
}

// emit ws messages to flow
server.on('connection', function connection(socket) {

    // plug client session midleware
    clientSession(socket.upgradeReq, {}, function (err) {

        // multiplexer for flow event streams
        //socket.onmessage = demux(Flow, socket.upgradeReq.session);

        var instance = getEntrypoint(req);
        if (!instance) {
            res.set({'content-type': 'text/plain'}).status(400);
            return res.end(new Error('Flow.server: No entrypoint found for "' + req.hostname  + '".').stack);
        }

        var stream = Flow.flow('ws_message', {
            to: instance,
            socket: socket,
            session: socket.upgradeReq.session
        });
        stream.o.pipe(res);
        stream.o.on('error', function (err) {
            // TODO send error frame
        });
        req.pipe(stream.i);
    });
});

exports.mux = mux;
exports.demux = demux;
