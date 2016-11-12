'use strict';

const HttpHeaderParser = require('../../shared/http').HeaderParser;

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
    if (!validateHeaders(headers)) return null;
}


module.exports = WebSockets;