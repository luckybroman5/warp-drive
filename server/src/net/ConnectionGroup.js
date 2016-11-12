'use strict';

const utils = require('../utils');
const config = require('../../config');
const Client = require('./Client');
const R = require('ramda');

const logger = config.logger;

/**
 * A list of connected clients that are sharing the same socket
 * Takes care of dropping idle clients, adding clients, and removing them
 *
 * It calls a recursive funtion for a set amount of ms that handles
 * upkeep. If configured to terminate if no clients are connected,
 * after an optional amount of time, it will fire an event that can
 * decide if it should be terminated. All of that is decided by the
 * Server However.
 *
 * @Author Kade S. Green
 */
class ConnectionGroup {
    constructor(options) {
        this.options = options || {};
        this.id = utils.generateUniqueId();
        this.startTime = Date.now();

        // Just a list of object refs
        this.clients = {}; // Used to find clients by ID
        this.list = []; // Used to apply Iterate over each client

        // while true, this obj won't ask for termination
        this.keepAlive = options.keepAlive || false;

        // The rate this obj will ask for termination when
        // there aren't any clients connected
        this.idleTimeout = this.options.idleTimeout || 60000;

        // Determines at which point clients will be dropped
        this.clientTimeout = this.options.clientTimeout || 200;

        // Determines how often this Group will cleanup After itself
        this.maintenanceRate = this.options.maintenanceRate || 10;

        // State Props
        this.isIdle = false;
        this.timeIdle = 0;
        this.lastRun = 0;

        // Kit it Off
        this.run();
    }

    /**
     * Creates and adds references for a client
     * Should be used on new connections
     */
    addClient() {
        this.isIdle = false;
        const client = new Client();
        this.clients[client.id] = client;
        this.list.push(client);
        logger.debug(`ConnectionGroup ${this.id} adding connection. # ${this.list.length}`);
        // Returns the client to be used by the caller
        return client;
    }

    /**
     * Dereferences the client, and destroys the Client Obj
     */
    removeClient(id) {
        if (!id || !this.clients[id]) return null;

        logger.debug(`ConnectionGroup: ${this.id} dropping connection: ${id}`);

        const index = R.findIndex(R.propEq('id', id))(this.list);

        // Dereference from Array..
        R.drop(index, this.list);

        // Off with the Garbage man.
        this.clients[id] = null;
    }

    /**
     * The main function of this class.
     * Recusively calls itself
     */
    run() {
        this.lastRun = Date.now();

        setTimeout(() => {
            const now = Date.now();
            this.clean();
            if (!this.list.length) {
                logger.debug(`ConnectionGroup ${this.id} is ${this.isIdle ? 'now' : 'still'} idle.`);
                if (!this.isIdle) this.isIdle = true;
                // Considered to be in an "idle state"
                this.timeIdle += (this.lastRun - now);
                // Alert the Server that this Obj may be destroyed
                if (this.timeIdle > this.idleTimeout && !this.keepAlive) this.promptTermination();
            } else {
                if (this.timeIdle) this.timeIdle = 0;
                if (this.isIdle) this.isIdle = false;
            }
            
            logger.info(`Connection: ${this.id}`
            + `----------------------------`
            + `Active Connections: ${this.list.length}`
            + `Run Time: ${now - this.startTime}`
            + `============================`
            );

            // calls itself again
            this.run();
        }, this.maintenanceRate);
    }

    /**
     * Iterates over clients to find inactive ones
     * Will Drop them not connected for a certain
     * Amount of time
     */
    clean() {
        this.applyActionToClients((client) => {
            if (client.syncAge > this.clientTimeout) {
                this.removeClient(client.id);
                logger.debug(`ConnectionGroup: Client Timed Out! ${this.clientTimeout}`);
            } else if (client.disconnecting) {
                this.removeClient(client.id);
                logger.debug(`ConnectionGroup: Client Disconected.`);
            }
        });
    }

    /**
     * Applies a function to each client. 
     * see clean() for usage
     */
    applyActionToClients(action) {
        if (!action) return null;
        for(let i=0; i<this.list.length; i++) {
            if (!this.list[i] || !this.list[i] instanceof Client) continue;
            action(this.list[i]);
        }
    }

    
}

module.exports = ConnectionGroup;