'use strict';

const net = require('net');
const EventEmitter = require('events');
const config = require('../../../../config');
const logger = config.logger;


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
            this._handshake(socket);
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

    _handshake(socket) {
        // If the protocol passes, the socket will be returned
        // As if it were just a plain old TCP Socket, with no listeners
        socket.once('data', (data) => {
            const rawData = data.toString();
            const responseHeaders = webSocketProtocol(rawData);
            if (!responseHeaders) {
                logger.info('Libuv: Invalid Connection Request.. Closing..');
                socket.destroy();
                return;
            }
            socket.write(responseHeaders);
            this.emitter.emit('connection', socket);
        });
    }
}

module.exports = LibuvDriver;