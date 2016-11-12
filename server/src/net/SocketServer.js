'use strict';

const config = require('../../config');
const R = require('ramda');
const driver = require('./drivers/libuv');
const ConnectionGroup = require('./ConnectionGroup');

const logger = config.logger;
/**
 * Defines all behavior for the server, regardless of 
 * the underlying, actual TCP Code
 */
class SocketServer {
    constructor(options) {
        this.options = options || null;

        // stores all open connections
        this.connectionGroups = {};

        // Used to iterate over each Group
        this.pool = [];

        // List of active Groups
        this.activeList = [];

        // List of inactive Groups
        this.inactiveList = [];

        this.driver = new driver();

        // Every new incomming connection
        this.driver.on('connection', (client) => {
            this.assignClientToGroup(client);
        });

        this.driver.on('error', (err) => {
            logger.error(err);
        });
    }

    addConnectionGroup() {
        logger.info(`SocketServer: Adding new Connection Group`);
        const connectionGroup = new ConnectionGroup();
        this.connectionGroups[connectionGroup.id] = connectionGroup;
        this.list.push(connectionGroup);
        return connectionGroup;
    }

    removeConnectionGroup(id) {
        if (!id || !this.connectionGroups[id]) return null;
        logger.info(`SocketServer: Removing Connection Group`);
        this.connectionGroups[id] = null;
        delete this.connectionGroups;
        this.pool.filter(e => e);
        this.activeList.filter(e => e);
        this.inactiveList.filter(e => e);
    }

    assignClientToGroup(client) {
        if (!client) return;
        const requestedGroup = (client.requestedGroup) ? 
            this.connectionGroups[client.requestedGroup] : null;
        if (!requestedGroup) {
            this._findAvailableConnectionGroup(client);
        }
    }

    _findAvailableConnectionGroup(client) {
        const suggestedGroup = (this.inactiveList.length) ? this.inactiveList : this.pool;
        if (!suggestedGroup || !suggestedGroup.length) {
            this.addConnectionGroup();
            this._findAvailableConnectionGroup(client);
        }
        for (let i=0; i<suggestedGroup.length; i++) {
            if (suggestedGroup[i].canAddClient) {
                suggestedGroup[i].addClient(client);
                break;
            }
        }
        // Create a new Connection group, and add the client there
        this.addConnectionGroup()(client);
    }
}

module.exports = SocketServer;