"use strict"

const ws = require("./index");

exports.start = (event, state, args, next) => {

    const data = event.data;
    //port, host -> def to 8080, localhost
    
    const server = ws.start(data.host, data.port, (err) => {

        console.log('Flow-ws: listening to ', server.options.host + ":" + server.options.port);
        if (data) {
            data.server = server;
        }

        next(null, data);
    });
    server.on("message", () => {});
};
