const assert = require('chai').assert;
const app = require('../app.js');

describe('App', function(){
    it('view engine should be pug', function(){
        assert.equal(app.get('view engine'), 'pug');
    });
});