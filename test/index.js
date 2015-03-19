var should = require('should');
var createPhantomInstance = require('./lib/createPhantomInstance');
var createPageInstance = require('./lib/createPageInstance');

describe('test\'s test', function () {
   it( 'Test is working.', function( done ){
      (5).should.be.exactly(5);
      done();
   });
});

createPhantomInstance();
createPageInstance();
