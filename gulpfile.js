var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var util = require('gulp-util');
var jade = require('gulp-jade');
var data = require('gulp-data');

(function(){
  'use strict';

  gulp.task('jade', function () {
    return gulp.src([
      'test/mock/jade/!(_)*.jade',
      'test/mock/jade/**/!(_)*.jade',
      'test/mock/jade/**/**/!(_)*.jade'
    ])
    .pipe(data(function () {
      return require('./test/mock/jade/index.json');
    }))
    .pipe(jade())
    .on('error', function (err) {
      util.beep();
      console.log(err);
    })
    .pipe(gulp.dest('test/mock/html'));
  });

  gulp.task('browser', function () {
    browserSync({
      server: {
        baseDir: 'test/mock/html',
        index: 'index.html'
      }
    }, function (err) {
      if(err){
        return console.log(err);
      }
    });
  });

  gulp.task('default', [
    'jade',
    'browser'
  ], function () {
    gulp.watch([
      'test/mock/jade/!(_)*.jade',
      'test/mock/jade/**/!(_)*.jade',
      'test/mock/jade/**/**/!(_)*.jade'
    ], [
      'jade',
      reload
    ]);
  });

}());
