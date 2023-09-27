/* global it describe before */

/**
 * Test file for database actions
 */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

chai.should();

const database = require("../db/database.js");
const collectionName = "tickets";
const functions = require("../db/src/functions.js");

chai.use(chaiHttp);

describe('tickets', () => {
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
    });

    /* GET route */
    describe('GET /tickets', () => {
        it('should get 200 when getting tickets', (done) => {
            chai.request(server)
                .get("/tickets")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("data");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.equal(0);

                    done();
                });
        });
    });

    /* POST route */
    describe('POST /tickets', () => {
        it('should get 200 when adding ticket', (done) => {
            const doc = {
                id: 1,
                code: "A1102",
                trainnumber: 266,
                traindate: "2023-09-21",
            };

            chai.request(server)
                .post("/tickets")
                .send(doc)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("data");
                    res.body.data.should.include(doc);

                    done();
                });
        });
    });

    /* Reset function */
    describe('Reset collection',  () => {
        it('should reset collection to given values', (done) => {
            const doc = [{
                id: 1,
                code: "A1102",
                trainnumber: 266,
                traindate: "2023-09-21",
            },
            {
                id: 2,
                code: "B1103",
                trainnumber: 560,
                traindate: "2023-09-21"
            }];

            functions.resetCollection(collectionName, doc);

            chai.request(server)
                .get("/tickets")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("data");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.equal(2);
                    res.body.data[1].code.should.include(doc[1].code);

                    done();
                });
        });
    });
});
