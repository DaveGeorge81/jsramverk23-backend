/* global it describe before beforeEach*/

/**
 * Test file for graphql mutations
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

const newTicket = `mutation{addTicket(
    id: 3,
    code: "ANA005",
    trainnumber: "1221",
    traindate: "2023-10-25"
    ){
        id
        code
        trainnumber
        traindate
    }}`;


const updateTicket = `mutation{updateTicket(
    id: 1,
    code: "ANA006",
    trainnumber: "8888",
    traindate: "2023-10-25"
    ){
        id
        code
        trainnumber
        traindate
    }}`;

chai.should();
chai.use(chaiHttp);

let token;
let apiKey;

describe('mutation', () => {
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

    /* make a new ticket */
    describe('make new ticket in graphql', () => {
        it('should get 200 when making new ticket', (done) => {
            chai.request(server)
                .post("/graphql?api_key=" + apiKey)
                .set('x-access-token', token)
                .send({ query: newTicket})
                .end((err, res) => {
                    res.body.data.addTicket.should.have.property('id');
                    res.body.data.addTicket.should.have.property('code');
                    res.body.data.addTicket.should.have.property('trainnumber');
                    res.body.data.addTicket.should.have.property('traindate');
                    res.should.have.status(200);
                    res.body.should.have.property("data");
                    res.body.data.addTicket.id.should.equal(3);
                    // res.body.data.Codes.should.be.an("array");
                    // res.body.data.Codes.length.should.equal(0);

                    done();
                });
        });
    });

    /* update ticket in graphql */
    describe('update ticket in graphql', () => {
        it('should get 200 when updating a ticket', (done) => {
            chai.request(server)
                .post("/graphql?api_key=" + apiKey)
                .set('x-access-token', token)
                .send({ query: updateTicket})
                .end((err, res) => {
                    res.body.data.updateTicket.should.have.property('id');
                    res.body.data.updateTicket.should.have.property('code');
                    res.body.data.updateTicket.should.have.property('trainnumber');
                    res.body.data.updateTicket.should.have.property('traindate');
                    res.should.have.status(200);
                    res.body.should.have.property("data");
                    res.body.data.updateTicket.code.should.equal("ANA006");

                    done();
                });
        });
    });
});
