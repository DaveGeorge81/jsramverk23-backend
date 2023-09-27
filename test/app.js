/* global it describe */

/**
 * Test file for checking route connections
 */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
// const HTMLParser = require('node-html-parser');

chai.should();
chai.use(chaiHttp);

describe('app', () => {
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
        it('200 HAPPY PATH getting /delayed route', (done) => {
            chai.request(server)
                .get("/delayed")
                .end((err, res) => {
                    res.should.have.status(200);

                    done();
                });
        });
    });

    describe('GET /codes', () => {
        it('200 HAPPY PATH getting /codes route', (done) => {
            chai.request(server)
                .get("/codes")
                .end((err, res) => {
                    res.should.have.status(200);

                    done();
                });
        });
    });

    describe('GET /tickets', () => {
        it('200 HAPPY PATH getting /tickets route', (done) => {
            chai.request(server)
                .get("/tickets")
                .end((err, res) => {
                    res.should.have.status(200);

                    done();
                });
        });
    });
});
