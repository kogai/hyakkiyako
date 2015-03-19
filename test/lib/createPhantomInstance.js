var should = require('should');
var createPhantomInstance = require('../../lib/bundle').createPhantomInstance;

module.exports = function(){
  describe( 'Create instance of phantomjs.', function(){
    var obj;
    before(function( done ){
      createPhantomInstance({})
      .then( function( data ){
        obj = data.ph;
        done();
      });
    });

    it( 'phantom is object', function(){
      obj.should.be.instanceOf( Object );
    });

    it( 'phantom has property, named createPage and it\'s function.', function(){
      obj.should.have.property( 'createPage' );
      var createPage = obj.createPage;
      createPage.should.be.instanceOf( Function );
    });

  });
};
