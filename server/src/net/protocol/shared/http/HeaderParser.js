'use strict';

/**
 * Breaks up the lines
 */
const extractLines = function(rawString) {
    return rawString.split("\n");
}

/**
 * Converts into an object
 */
const tokenize = function(headerArray) {
    // @TODO: Limit to only the desiredHeaders...
    // Question -- Wouldn't the additional processing
    // involved in checking to see if we actually want the
    // headerArray defeat the purpose?
    const tokenized = {};
    if (headerArray && Array.isArray(headerArray)) {
        headerArray.forEach((rheader) => {
            const split = rheader.split(':');
            if (!split.length || split.length < 2) return null;
            tokenized[split[0]] = rheader.replace(split[0] + ':', '').trim();
        });
    }
    return tokenized;
}

const HeaderParser = function(rawHeaders, desiredHeaders) {
    if (!rawHeaders || typeof rawHeaders !== 'string') return null;
    const desired = (desiredHeaders && desiredHeaders.length)
        ? desiredHeaders : [];
    const rawLines = extractLines(rawHeaders);

    if (!rawLines || !rawLines.length) return null; 

    return tokenize(rawLines, desired);
};


module.exports = HeaderParser;