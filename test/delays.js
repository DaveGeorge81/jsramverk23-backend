/* global it describe */

/**
 * Test file for checking train delay functions
 */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const delayed = require('../models/delayed.js');
const codes = require('../models/codes.js');

chai.should();
chai.use(chaiHttp);

describe('delays', () => {
    describe('related functions', () => {
        it('getDelayedTrains should return delayed trains', async function() {
            let delayedTrains = await delayed.getDelayedTrains();

            chai.expect(delayedTrains).to.be.an('array');
            chai.expect(delayedTrains[0]).to.have.property("OperationalTrainNumber");
            chai.expect(delayedTrains[0]).to.have.property("AdvertisedTimeAtLocation");
            chai.expect(delayedTrains[0]).to.have.property("EstimatedTimeAtLocation");
            chai.expect(delayedTrains[0]).to.have.property("ActivityId");
            chai.expect(delayedTrains[0]).to.have.property("ActivityType");
            chai.expect(Number(delayedTrains[0].OperationalTrainNumber)).to.be.a('number');
        });

        it('getCodes should return reason codes', async function() {
            let reasonCodes = await codes.getCodes();

            chai.expect(reasonCodes).to.be.an('array');
            chai.expect(reasonCodes[0]).to.have.property("Code");
            chai.expect(reasonCodes[0]).to.have.property("Level1Description");
            chai.expect(reasonCodes[0]).to.have.property("Level2Description");
            chai.expect(reasonCodes[0]).to.have.property("Level3Description");
            chai.expect(reasonCodes[0].Code).to.not.be.an("undefined");
            chai.expect(reasonCodes[0].Code).to.be.equal("ANA002");
        });
    });
});
