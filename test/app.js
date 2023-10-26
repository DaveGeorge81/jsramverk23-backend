/* global it describe before beforeEach afterEach */

/**
 * Test file for checking route connections
 */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const database = require('../db/database.js');
const collectionName = "users";

chai.should();
chai.use(chaiHttp);

let apiKey = "";
let token = "";
let db;

describe('app', () => {
    before(async () => {
        db = await database.getUserDb();

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

    beforeEach(async () => {
        const response = await chai.request(server).get('/token');

        token = response._body.data.token;

        await chai.request(server).get('/register').send({email: "app@email.se", password: "test"});
        db = await database.getUserDb();

        let found = await db.collection.findOne({ email: "app@email.se" });

        apiKey = found.key;
    });

    afterEach(async () => {
        await db.collection.drop();
    });

    describe('GET /', () => {
        it('200 HAPPY PATH getting base', (done) => {
            chai.request(server)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);

                    done();
                });
        });
    });

    describe('GET /delayed', () => {
        it('200 getting /delayed route with api key and token', (done) => {
            chai.request(server)
                .get("/delayed?api_key=" + apiKey)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);

                    done();
                });
        });

        it('401 getting /delayed route without api key and token', (done) => {
            chai.request(server)
                .get("/delayed")
                .end((err, res) => {
                    res.should.have.status(401);

                    done();
                });
        });

        it('401 getting /delayed route without token', (done) => {
            chai.request(server)
                .get("/delayed?api_key=" + apiKey)
                .end((err, res) => {
                    res.should.have.status(401);

                    done();
                });
        });

        it('401 getting /delayed route without api key', (done) => {
            chai.request(server)
                .get("/delayed")
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(401);

                    done();
                });
        });
    });

    describe('GET /codes', () => {
        it('200 HAPPY PATH getting /codes route with api key and token', (done) => {
            chai.request(server)
                .get("/codes?api_key=" + apiKey)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);

                    done();
                });
        });

        it('401 getting /codes route without api key and token', (done) => {
            chai.request(server)
                .get("/codes")
                .end((err, res) => {
                    res.should.have.status(401);

                    done();
                });
        });

        it('401 getting /codes route without token', (done) => {
            chai.request(server)
                .get("/codes?api_key=" + apiKey)
                .end((err, res) => {
                    res.should.have.status(401);

                    done();
                });
        });

        it('401 getting /codes route without api key', (done) => {
            chai.request(server)
                .get("/codes")
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(401);

                    done();
                });
        });
    });

    describe('GET /tickets', () => {
        it('200 HAPPY PATH getting /tickets route with api key and token', (done) => {
            chai.request(server)
                .get("/tickets?api_key=" + apiKey)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);

                    done();
                });
        });

        it('401 getting /tickets route without api key and token', (done) => {
            chai.request(server)
                .get("/tickets")
                .end((err, res) => {
                    res.should.have.status(401);

                    done();
                });
        });

        it('401 getting /tickets route without token', (done) => {
            chai.request(server)
                .get("/tickets?api_key=" + apiKey)
                .end((err, res) => {
                    res.should.have.status(401);

                    done();
                });
        });

        it('401 getting /tickets route without api key', (done) => {
            chai.request(server)
                .get("/tickets")
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(401);

                    done();
                });
        });
    });
});
