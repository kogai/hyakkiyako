var phantom = require('phantom');
var util = require('util');
var _ = require('underscore');

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
	var d = Promise.defer();
  var page = data.page;
  var hyakkiyako = data.hyakkiyako;
  var procesCount = 0;
  var queue = [];
  queue.push( data.url );

  // 再帰処理定義
  var collectLinks = function( data ){

    var url = queue[ procesCount ];

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
        /*
          ユニークチェック処理
        */
        var addLinks = checUniqLink( rawLinks );

        // console.log( "procesCount-" + procesCount,  addLinks );

        console.log( 'queue', queue );
        queue = _.rest( queue );
        // queue = queue.concat( addLinks );

        data.hyakkiyako       = data.hyakkiyako.concat( addLinks );
        data.hyakkiyakoLength = data.hyakkiyako.length;

        if( data.hyakkiyakoLengthOld === undefined ){
          data.hyakkiyakoLengthOld = 0;
        }
        // 再帰処理チェック
        /*
        if 前回と配列の数が違う
        else
        */

        if( data.hyakkiyakoLength !== data.hyakkiyakoLengthOld ){
          // 再帰処理実行
          procesCount++;
          data.hyakkiyakoLengthOld = data.hyakkiyakoLength;
          collectLinks();
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

var checUniqLink = function( rawLinks ){
    var modLinks = _.uniq( rawLinks );

    return modLinks;
};

module.exports = function( url ){
	var data = {};
	data.hyakkiyako = [];
	data.url = url;

	createPhantomInstance( data )
	.then( createPageInstance )
  .then( collectPageList )
	.then( function( data ){
		console.log( 'all promise resolved.' );
    data.ph.exit();
	});
};

/*

# キューを作る
- [x] phantomインスタンスの作成
- [x] pageインスタンスの作成
	##再帰処理
	- [x] pageインスタンスでwebページを開く
	- page.evaluateでページ内のaタグを取得してキューに保存
	- キューをチェックする
		- aタグのurlがユニークならキューに追加して再帰
		- ユニークなurlがなくなったら終了
	- キューをresolveして終了

# オプション
url: String
fs: Boolean / Object -> キューをファイルとして保存
	Object: {
		wantFile: Boolean,
		fineName: String
	}


*/
