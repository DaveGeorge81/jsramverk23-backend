/* global it describe before beforeEach */

/**
 * Test file for graphql queries
 */

process.env.NODE_ENV = 'test';


const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const database = require("../db/database.js");
const collectionName = "tickets";
const functions = require("../db/src/functions.js");

const fs = require("fs");
const path = require("path");
const docs = JSON.parse(fs.readFileSync(
    path.resolve(__dirname, "../db/src/setup.json"),
    "utf8"
));

// const { GraphQLSchema } = require('graphql')

// const RootQueryType = require("../graphql/root.js");
// const RootMutationType = require("../graphql/mutate.js");

// const schema = new GraphQLSchema({
//     query: RootQueryType,
//     mutation: RootMutationType
// });

const codesQuery = `{ Codes {
    Code,
    Level1Description,
    Level2Description,
    Level3Description
}}`;

const delaysQuery = `{ Delays {
    OperationalTrainNumber, 
    LocationSignature, 
    FromLocation { LocationName }, 
    ToLocation { LocationName }, 
    AdvertisedTimeAtLocation, 
    EstimatedTimeAtLocation } }`;


const ticketsQuery = `{ Tickets {
    id,
    code,
    trainnumber,
    traindate }
    }`;


chai.should();
chai.use(chaiHttp);

let token;
let apiKey;

describe('root', () => {
    before(async () => {
        const db = await database.getDb();

        db.db.listCollections(
            { name: collectionName }
        )
            .next()
            .then(async function(info) {
                if (info) {
                    await db.collection.drop();
                }
            })
            .catch(function(err) {
                console.error(err);
            })
            .finally(async function() {
                await db.client.close();
            });
        await functions.resetCollection("tickets", docs)
            .catch(err => console.log(err));
    });

    beforeEach(async () => {
        const response = await chai.request(server).get('/token');

        token = response._body.data.token;

        await chai.request(server).get('/register').send({email: "app@email.se", password: "test"});
        let db = await database.getUserDb();
        let found = await db.collection.findOne({ email: "app@email.se" });

        apiKey = found.key;
    });

    /* GET codes from graphql */
    describe('Get codes from graphql', () => {
        it('should get 200 when getting codes', (done) => {
            chai.request(server)
                .post("/graphql?api_key=" + apiKey)
                .set('x-access-token', token)
                .send({ query: codesQuery})
                .end((err, res) => {
                    res.body.data.should.have.property('Codes');
                    res.should.have.status(200);
                    res.body.should.have.property("data");
                    res.body.data.Codes.length.should.equal(2);

                    done();
                });
        });
    });

    /* GET delays from graphql */
    describe('Get delays from graphql', () => {
        it('should get 200 when getting delays', (done) => {
            chai.request(server)
                .post("/graphql?api_key=" + apiKey)
                .set('x-access-token', token)
                .send({ query: delaysQuery})
                .end((err, res) => {
                    res.body.data.should.have.property('Delays');
                    res.should.have.status(200);
                    res.body.data.Delays.length.should.equal(2);


                    done();
                });
        });
    });

    /* GET tickets from graphql */
    describe('Get tickets from graphql', () => {
        it('should get 200 when getting tickets', (done) => {
            chai.request(server)
                .post("/graphql?api_key=" + apiKey)
                .set('x-access-token', token)
                .send({ query: ticketsQuery})
                .end((err, res) => {
                    res.body.data.should.have.property('Tickets');
                    res.should.have.status(200);
                    res.body.should.have.property("data");
                    res.body.data.Tickets.should.be.an("array");
                    res.body.data.Tickets.length.should.equal(2);

                    done();
                });
        });
    });

    /* GET single code from graphql */
    describe('Get single code from graphql', () => {
        it('should get 200 when getting single code', (done) => {
            chai.request(server)
                .post("/graphql?api_key=" + apiKey)
                .set('x-access-token', token)
                .send({ query: `{Code(Code: "ANA002"){Level1Description}}`})
                .end((err, res) => {
                    res.body.data.should.have.property('Code');
                    res.should.have.status(200);
                    res.body.should.have.property("data");
                    res.body.data.Code.Level1Description.should.equal('Brofel');

                    done();
                });
        });
    });

    /* GET single ticket from graphql */
    describe('Get single ticket from graphql', () => {
        it('should get 200 when getting single ticket', (done) => {
            chai.request(server)
                .post("/graphql?api_key=" + apiKey)
                .set('x-access-token', token)
                .send({ query: `{Ticket(id: 1){code}}`})
                .end((err, res) => {
                    res.body.data.should.have.property('Ticket');
                    res.should.have.status(200);
                    res.body.should.have.property("data");
                    res.body.data.Ticket.code.should.equal("ANA002");

                    done();
                });
        });
    });
});
