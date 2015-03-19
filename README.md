# hyakkiyako
A utility for nodejs, pass a list of the pages within the site.
using phantomjs.

[![Circle CI](https://circleci.com/gh/kogai/hyakkiyako.svg?style=svg)](https://circleci.com/gh/kogai/hyakkiyako) [![npm version](https://badge.fury.io/js/hyakkiyako.svg)](http://badge.fury.io/js/hyakkiyako)

## install
```shell
npm install --save-dev hyakkiyako
```

## example
```js
var hyakkiyako = require('hyakkiyako');

hyakkiyako('https://www.npmjs.com/')
.then( function( listOfPages ){
  /*
  do stuff
  */
});

```

## current todo
See [here](https://github.com/kogai/hyakkiyako/blob/master/TODO.md)
