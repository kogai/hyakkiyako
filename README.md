# hyakkiyako
A utility for phantomjs, pass a list of the pages within the site.


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

TODO
- test
