var should = require('should');
var createPhantomInstance = require('../../lib/bundle').createPhantomInstance;
var createPageInstance = require('../../lib/bundle').createPageInstance;

module.exports = function(){
  describe( 'Create instance of web-page.', function(){
    var obj;
    before(function( done ){
      createPhantomInstance({})
      .then( createPageInstance )
      .then( function( data ){
        obj = data.page;
        done();
      });
    });

    it( 'phantom is object', function(){
      obj.should.be.instanceOf( Object );
    });


    it( 'phantom has property, named open and it\'s function.', function(){
      obj.should.have.property( 'open' );
      var open = obj.open;
      open.should.be.instanceOf( Function );
    });

    it( 'phantom has property, named evaluate and it\'s function.', function(){
      obj.should.have.property( 'evaluate' );
      var evaluate = obj.evaluate;
      evaluate.should.be.instanceOf( Function );
    });

  });
};
