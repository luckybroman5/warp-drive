'use strict';

const randomstring = require('randomstring');

/**
 * The functions define the quantum protocol in a way that is shared by both
 * the client and server. These need to remain static functions
 * 
 * Author Kade Green
 */


// Private Functions
// --------------------------------------

/**
 * Just stringifies Objects
 */
const stringifyMessage(obj) {
    if (!obj) return null;
    let message;
    try {
        message = JSON.stringify(obj);
    } catch(e) {
        // Do something about it
    }

    return message;
}

const generateRequestId() {
    return randomstring();
}

// Main Functions
// --------------------------------------

// structs:
const transmitionTypes = {
    proposal: 1,
    message: 2,
    request: 3,
};

const proposalTypes = {
    setValue: 1,
    setValues: 2,
    setupTunnel: 3,
};

const baseTransmittion = function() {
    return {
        // What is kept on the transmitter for tracking
        header: {
            requestId : '',
            transmittionType: '',
            payload: {},
        },
        // Compressed and sent over the wire
        message: {
            // compressed Trans Type
            t: 0,
            // specific payload
            s: 0,
            // compressed id
            i: 0,
            // compressed payload
            p: 0,
        },
    };
};

const Proposal = function() {
    const base = baseTransmittion();
    base.header.requestId = generateRequestId();
    base.header.transmitionType = 'proposal';
    return base;
};

const Message() = function() {

};

const Request() = function() {

};

const Prepare = function(transmition) {
    
};

/**
 * A Bulky message with a lot of information
 */
const FullMessage = function(obj) {
    const params = obj || null;
    const additionalParams = {
        sendTime: Date.now(),
    };
    const final = Object.assing(params, additionalParams);
    return stringifyMessage(final);
}

module.exports = {
    FullMessage,
    Proposal,
    Message,
    Request,
};
