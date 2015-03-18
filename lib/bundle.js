var phantom = require('phantom');
var util = require('util');
// var entryPageList = require('lib/entryPageList');

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

var entryPageList = function( data ){
	var d = Promise.defer();
  var page = data.page;
  var hyakkiyako = data.hyakkiyako;

  // 再帰処理定義
  var collectLinks = function( data ){

    var url = data.url;

    page.open( url, function( status ){
      page.evaluate( function() {
        var ele = document.getElementsByTagName('a');
        var res = [];
        for (var i = 0; i < ele.length; i++) {
          res.push({
            title:  ele[i].innerHTML,
            href:   ele[i].href
          });
        }
        return res;
      },
      function( result ){
        console.log( result );
        data.hyakkiyako.push( result );
        if( false ){
          // 再帰処理実行
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


module.exports = function( url ){
	var data = {};
	data.hyakkiyako = [];
	data.url = url;

	createPhantomInstance( data )
	.then( createPageInstance )
  .then( entryPageList )
	.then( function( data ){
		console.log( 'all promise resolved.' );
    // data.ph.exit();
	});
};

/*

# キューを作る
- [x] phantomインスタンスの作成
- [x] pageインスタンスの作成
	##再帰処理
	- pageインスタンスでwebページを開く
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
