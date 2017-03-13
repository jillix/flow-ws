"use strict"

const WebSocketServer = require('ws').Server;
//const Sessions = require('client-sessions');
//const Client = require('./client');

exports.start = (event, state, args, next) => {

    // TODO start new server or check data for server instance
    // TODO check port
    // TODO default session options
    const data = event.data;
    const server = new WebSocketServer({
        port: (data ? data.port : args.port) || 8080,
        host: (data ? data.host : args.host) || "localhost"
    });
    //const clientSession = data.session || Sessions(args.session || event.scope.env.session);

    server.on('connection', (socket) => {

        // plug client session midleware
        //clientSession(socket.upgradeReq, {}, (err) => {
            console.log('Flow-ws.start: Connection');
            // emit ws messages to flow
            socket.event = event.scope.flow(args.onconnection, {
                socket: socket,
                session: socket.upgradeReq.session
            }, true);
            socket.event.on('error', (err) => {socket.event.emit('error', err)});
            socket.on('message', (chunk) => {socket.event.write(chunk)});
            socket.event.on('data', (chunk) => {socket.send(chunk)});
            socket.on('close', () => {
                socket.event.end()
                console.log('Flow-ws.connection: Ended.');
            });
        //});
    });

    console.log('Flow-ws: listening to ', server.options.host + ":" + server.options.port);
    if (data) {
        data.server = server;
    }

    next(null, data);
};

//exports.mux = Client.mux;
//exports.demux = Client.demux;
