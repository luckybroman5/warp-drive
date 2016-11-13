'use strict';

const utils = require('../utils');
const Socket = require('net').socket;
const quantum = require('./protocol/server/Quantum');
const randomstring = require('randomstring');

/**
 * Client class is just used to contain and abstract data
 * During the TCP connection.
 * It uses the "Quantum Tunel" protocol for messages to and fro
 * 
 * Only basic controll flow should be handled at this level 
 * 
 * Author Kade Green
 */
class Client {
    constructor(socket) {
        if (!socket || !socket instanceof Socket) {
            return null;
        }
        
        // A Unique Id for this Client
        this.id = utils.generateUniqueId();

        // How often the client will test connection
        this.pingRate = 30;
        
        // A list of transmitions made over the socket
        this.transmitions = {
            server: {},
            client: {},
        };

        this.socket.on('data', (data) => {
            this.handleData(data);
        });

        this.ProposeTunnel();
    }

    /**
     * The intial handshake
     */
    ProposeTunnel() {
        const proposal = quantum.TunnelProposal({
            id: this.id,
            sustain: true, // no timeout on connection
            pingRate: this.pingRate,
        });
        this.sendTransmition(proposal)
        .then = (data) => {
            console.log(data);
        };
    }

    /**
     * Called When the client has sent their response from ProposeTunnel()
     */
    EstablishTunnel(data) {
        if (!data) return;
    }


    // Transmitions
    // ------------------------------------------------

    // ================================================

    /**
     * Handles when messages come from the client
     */
    handleData(rawData) {
        console.log(rawData.toString());
        // const data = quantum.parseData(rawData);
    }

    sendTransmition(transmition) {
        this.socket.send(transmition.message);
        this.transmitions.server[transmition.headers.requestId] = transmition;
        return transmition;
    }
}

module.exports = Client;
