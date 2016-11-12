'use strict';

// Dependencies
//=======================================

const config = require('./config');
const SocketServer = require('./src/net');

//=======================================

// Main

const params = {
    port: config.port,
};

const server = new SocketServer(params);