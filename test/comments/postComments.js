//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Подключаем dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../../app');
let should = chai.should();
chai.use(chaiHttp);

module.exports = () => {
    describe('/POST comment', () => {
        it('it should not POST a comment without text field', (done) => {
            let comment = {
                name: "Sara"
            };
            chai.request(app)
                .post('/comments')
                .send(comment)
                .end((err, res) => {
                    res.should.have.status(206);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('text');
                    res.body.errors.text.should.have.property('kind').eql('required');
                    done();
                });
        });
        it('it should POST a comment ', (done) => {
            let comment = {
                name: "John",
                text: "Hi!"
            };
            chai.request(app)
                .post('/comments')
                .send(comment)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Comment successfully added!');
                    res.body.comment.should.have.property('name');
                    res.body.comment.should.have.property('text');
                    res.body.comment.should.have.property('createdAt');
                    done();
                });
        });
    });
};
