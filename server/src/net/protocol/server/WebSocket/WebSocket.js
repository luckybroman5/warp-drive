'use strict';

const HttpHeaderParser = require('../../shared/http').HeaderParser;
const config = require('../../../../../config');
const crypto = require('crypto');
const logger = config.logger;

/**
 * All of this is static functions. There is no need to 
 * instantiate a new object everytime because we ditch http
 * as soon as we have done the dance with the browser
 * 
 * Author Kade S. Green
 */

const validateHeaders = function (headers) {
    return Boolean(
        headers['Sec-WebSocket-Version']
        && headers['Sec-WebSocket-Key']
        && headers['Sec-WebSocket-Extensions']
    );
}

const WebSockets = function(rawHeaders) {
    const headers = HttpHeaderParser(rawHeaders);
    if (!validateHeaders(headers)) {
        logger.info('Websocket: Received Connection, however, invalid headers!');
        return null;
    }
    const guid = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
    logger.info('Websocket: Successfully parsed headers');
    logger.debug(headers);
    const sha1 = crypto.createHash('sha1');
    // const concat = 'dGhlIHNhbXBsZSBub25jZQ==' + guid;
    const concat = headers['Sec-WebSocket-Key'] + guid;
    sha1.end(concat);

    const responseHeaders = `HTTP-1.1 101 Switching Protocols\r\n` +
        `Upgrade: WebSocket\r\n` +
        `Connection: Upgrade\r\n` +
        `Sec-WebSocket-Accept: ${sha1.read().toString('base64')}\n\n`;

    return responseHeaders;

}


module.exports = WebSockets;