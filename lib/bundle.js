var phantom = require('phantom');
var util = require('util');
var _ = require('underscore');
var utilUrl = require('url');

var createPhantomInstance = function( data ){
	var d = Promise.defer();
	phantom.create( function( ph ){
		data.ph = ph;
		d.resolve( data );
	});
	return d.promise;
};

var createPageInstance = function( data ){
	var d = Promise.defer();
	var ph = data.ph;
	ph.createPage( function( page ){
		data.page = page;
		d.resolve( data );
	});
	return d.promise;
};

var collectPageList = function( data ){
	var d 		= Promise.defer();
	var page 	= data.page;
	var queue = [];
			queue.push( data.url );

	data.host =	utilUrl.parse( data.url );

  // 再帰処理定義
  var collectLinks = function( data ){
    var url = queue[ 0 ];
		console.log( 'checking ' + queue.length + ' : ' + url );

    page.open( url, function( status ){
      page.evaluate( function() {
        var ele = document.getElementsByTagName('a');
        var res = [];
        for (var i = 0; i < ele.length; i++) {
          res.push( ele[i].href );
        }
        return res;
      },
      function( rawLinks ){
        var addLinks = checkUniqLink( rawLinks, data.hyakkiyako );
						addLinks = removeOuterLink( addLinks, data.host );
						addLinks = removeHash( addLinks );

        queue = _.rest( queue );

        queue = queue.concat( addLinks );

        data.hyakkiyako       = data.hyakkiyako.concat( addLinks );
        data.hyakkiyakoLength = data.hyakkiyako.length;

        if( data.hyakkiyakoLengthOld === undefined ){
          data.hyakkiyakoLengthOld = 0;
        }

				var isDiffFromPrev = data.hyakkiyakoLength !== data.hyakkiyakoLengthOld;
				var isQueueExist = queue.length > 0;

        if( isDiffFromPrev || isQueueExist ){
          // 再帰処理実行
          data.hyakkiyakoLengthOld = data.hyakkiyakoLength;

					collectLinks( data );
        }else{
          // 再帰処理終了
          d.resolve( data );
        }
      });
    });
  };

  // 初回再帰処理開始
  collectLinks( data );

	return d.promise;
};

var checkUniqLink = function( rawLinks, storeList ){
	var modLinks = _.uniq( rawLinks );
			modLinks = _.difference( modLinks, storeList );
    return modLinks;
};

var removeOuterLink = function( rawLinks, urlHost ){
	var modLinks = [];

	for (var i = 0; i < rawLinks.length; i++) {
		var parseUrl = utilUrl.parse( rawLinks[i] );
		if( parseUrl.host === urlHost.host ){
			modLinks.push( rawLinks[i] );
		}
	}

	return modLinks;
};

var removeHash = function( rawLinks ){
	var modLinks = [];

	for (var i = 0; i < rawLinks.length; i++) {
		var parseUrl = utilUrl.parse( rawLinks[i] );
		if( !parseUrl.hash ){
			modLinks.push( rawLinks[i] );
		}
	}
	return modLinks;
};

module.exports = {
	createPhantomInstance: 	createPhantomInstance,
	collectPageList: 				collectPageList,
	createPageInstance: 		createPageInstance,
	_checkUniqLink: 				checkUniqLink,
	_removeOuterLink: 			removeOuterLink,
	_removeHash: 						removeHash
};
