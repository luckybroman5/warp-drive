'use strict';

const net = require('net');
const EventEmitter = require('events');


const webSocketProtocol = require('../../protocol/server/WebSocket');

/**
 * Just a wrapper for a normal node TCP Server
 * the main thing here is that it uses clients and such
 * 
 * Author Kade S. Green
 */
class LibuvDriver {
    constructor(options) {
        this.options = options || {};

        this.emitter = new EventEmitter();

        this.port = this.options.port || null;
        this.server = net.createServer((socket) => {
            this._handleConnection(socket);
        });

        const params = {
            port: this.port || 10000,
        };

        this.server.listen(params, () => {
            console.log('Server Up and Listening on port: ' + this.server.address().port);
        });
    }

    on(eventName, callBack) {
        this.emitter.on(eventName, callBack);
    }

    emit(eventName, data) {
       this.emitter.emit(eventName, data); 
    }

    _handleConnection(socket) {
        socket.on('data', (data) => {
            const rawData = data.toString();
            webSocketProtocol(rawData);
        });
    }
}

module.exports = LibuvDriver;