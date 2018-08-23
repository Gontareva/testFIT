//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Comment = require('../../models/comment');

//Подключаем dev-dependencies
let chai = require('chai');
let moment = require('moment');
let chaiThings = require('chai-things');
let chaiHttp = require('chai-http');
let app = require('../../app');
let should = chai.should();

chai.use(chaiHttp);
chai.use(chaiThings);

module.exports = () => {
    describe('/GET comment', () => {
        it('it should GET all the comments', (done) => {
            chai.request(app)
                .get('/comments')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });

        it('it should GET a comment by the given name', (done) => {
            let comment = new Comment({name: "Ana", text: "comment"});
            comment.save((err, comment) => {
                chai.request(app)
                    .get('/comments')
                    .query({name: comment.name})
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.not.eql(0);
                        res.body.should.all.have.property('name', comment.name);
                        res.body.should.all.have.property('text');
                        res.body.should.all.have.property('createdAt');
                        done();
                    });
            });

        });

        it('it should GET a comment by the given text', (done) => {
            let comment = new Comment({name: "Ann", text: "text comment"});
            comment.save((err, comment) => {
                chai.request(app)
                    .get('/comments')
                    .query({text: comment.text})
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.not.eql(0);
                        res.body.should.all.have.property('name');
                        res.body.should.all.have.property('text', comment.text);
                        res.body.should.all.have.property('createdAt');
                        done();
                    });
            });

        });

        it('it should GET a comment by the given createdAt', (done) => {
            let comment = new Comment({name: "Jane", text: "text"});
            comment.save((err, comment) => {
                chai.request(app)
                    .get('/comments')
                    .query({createdAt: comment.createdAt})
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.not.eql(0);
                        res.body.should.all.have.property('name');
                        res.body.should.all.have.property('text');
                        res.body.should.all.have.property('createdAt', moment(comment.createdAt).toISOString());
                        done();
                    });
            });

        });

        it('it should GET a comment by the given name and createdAt', (done) => {
            let comment = new Comment({name: "Helen", text: "hi"});
            comment.save((err, comment) => {
                chai.request(app)
                    .get('/comments')
                    .query({createdAt: comment.createdAt, text: comment.text})
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.not.eql(0);
                        res.body.should.all.have.property('name');
                        res.body.should.all.have.property('text', comment.text);
                        res.body.should.all.have.property('createdAt', moment(comment.createdAt).toISOString());
                        done();
                    });
            });

        });

        it('it should not GET a comment with incorrect createdAt field ', (done) => {
            let comment = {
                createdAt: "2018-08-21T17:04:5gguj7.607Z"
            };
            chai.request(app)
                .get('/comments')
                .query({createdAt: comment.createdAt})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.should.have.property('kind').eql('date');
                    done();
                });
        });
    });
};
