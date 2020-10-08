var assert = require('chai').assert;
var request = require('supertest');

describe('Loading express server', function(){
    /** Reference from: https://glebbahmutov.com/blog/how-to-correctly-unit-test-express-server/ */
    var myModule, app, server;
    beforeEach(function(){
        delete require.cache[require.resolve('../app')];
        myModule = require('../app');
        app = myModule.app;
        server = myModule.server;
    });
    afterEach(function(done){
        server.close(done);
    });
    it('responds to /', function(done){
        request(server).get('/').expect(200, done);
    });
    it('404 everything else', function(done){
        request(server).get('/foo/bar').expect(404, done);
    });
});

describe('POST /search', function(){
    var myModule, app, server;
    beforeEach(function(){
        delete require.cache[require.resolve('../app')];
        myModule = require('../app');
        app = myModule.app;
        server = myModule.server;
    });
    afterEach(function(done){
        server.close(done);
    });
    it('responds with json', function(done){
        request(server)
            .post('/search')
            .send({value: ''})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res){
                if (err) return done(err);
                done();
            });
    });
    it('empty request yields found=0', function(done){
        request(server)
            .post('/search')
            .send({value: ''})
            .set('Accept', 'application/json')
            .expect(200, {
                found: 0,
                upc: 0,
                name: "",
                price: 0
            }, done);
    });
    it('valid upc yields corresponding name and price', function(done){
        request(server)
            .post('/search')
            .send({value: '100009'})
            .set('Accept', 'application/json')
            .expect(200, {
                found: 1,
                upc: 100009,
                name: 'Organic banana',
                price: 0.41
            }, done);
    });
    it('invalid upc yields found=0', function(done){
        request(server)
            .post('/search')
            .send({value: '200009'})
            .set('Accept', 'application/json')
            .expect(200, {
                found: 0,
                upc: 0,
                name: '',
                price: 0
            }, done);
    });
});