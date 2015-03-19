var bundle 								= require('./bundle');
var createPhantomInstance = bundle.createPhantomInstance;
var collectPageList 			= bundle.collectPageList;
var createPageInstance 		= bundle.createPageInstance;

module.exports = function( url ){
	var deffer 			= Promise.defer();
	var data 				= {};
	data.hyakkiyako = [];
	data.url 				= url;

	createPhantomInstance( data )
	.then( createPageInstance )
  .then( collectPageList )
	.then( function( data ){
    data.ph.exit();
		deffer.resolve( data.hyakkiyako );
	});
	return deffer.promise;
};
