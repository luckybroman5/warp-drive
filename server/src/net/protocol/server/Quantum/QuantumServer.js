'use strict';

const shared = require('../../shared/Quantum');

/**
 * This file will define all messaging protocol used by
 * the server. These functions need to remain static
 * 
 * Author Kade S. Green
 */


const TunnelProposal = function(params) {
    const proposal = shared.Proposal();
    proposal.payload = params;
    proposal.message = JSON.stringify(params);
    return proposal;
};

module.exports {
    ProposeTunnel,
};