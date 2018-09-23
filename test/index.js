//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let Comments = require('../models/comments');

let testPostComments = require('./comments/postComments');
let testGetComments = require('./comments/getComments');

describe('Test Comments', () => {
    beforeEach((done) => { //Перед каждым тестом чистим базу
        Comments.remove({}, (err) => {
            done();
        });
    });

    testGetComments();
    testPostComments();
})
