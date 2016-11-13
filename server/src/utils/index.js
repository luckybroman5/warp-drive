'use strict';

// Keep in Pryamid Order!
// _______________________________________________
const sha256 = require('sha256');
const randomstring = require('randomstring');
// ===============================================


/**
 * Generates an "unsafe" unique Identifier
 * meaning that no collisions isn't guaranteed
 */
const generateUniqueId = function() {
    const baseString = randomstring.generate() + Date.now();
    return sha256(Date.now() + baseString);
}

module.exports = {
    generateUniqueId,
};