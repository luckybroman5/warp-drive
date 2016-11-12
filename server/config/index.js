'use strict';

const winston = require('winston');

const logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)()
    ]
  });

module.exports = {
    port: 30000,
    logger,
};