"use strict"

const WebSocketServer = require('ws').Server;
//const Sessions = require('client-sessions');
//const Client = require('./client');

exports.start = (scope, state, args, data, stream, next) => {

    // TODO start new server or check data for server instance
    // TODO check port
    // TODO default session options
    const server = new WebSocketServer({
        port: (data ? data.port : args.port) || 8080,
        host: (data ? data.host : args.host) || "localhost"
    });
    //const clientSession = data.session || Sessions(args.session || scope.env.session);

    server.on('connection', function connection(socket) {

        // plug client session midleware
        //clientSession(socket.upgradeReq, {}, (err) => {

            // emit ws messages to flow
            console.log('Connect:', args.onconnection);
            socket.flow = scope.flow(args.onconnection, {
                socket: socket,
                session: socket.upgradeReq.session
            }, true);
            socket.flow.on('error', (err) => {stream.emit('error', err)});
            socket.on('message', (chunk) => {socket.flow.write(chunk)});
            socket.flow.on('data', (chunk) => {socket.send(chunk)});
        //});
    });

    console.log('Flow-ws: listening to ', server.options.host + ":" + server.options.port);
    if (data) {
        data.server = server;
    }

    next(null, data, stream);
};

//exports.mux = Client.mux;
//exports.demux = Client.demux;
