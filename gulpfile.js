'use strict';

let gulp = require('gulp');
let browserify = require('browserify');
let minifycss = require('gulp-uglifycss');
let uglify = require('gulp-uglify');
let rename = require('gulp-rename');
let sass = require('gulp-sass');
let plumber = require('gulp-plumber');
let vinylSourceStream = require('vinyl-source-stream');
let fs = require('fs');
let del = require('del');

gulp.task('css-compile', () => {
  return gulp.src('./assets/sass/*.sass')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(plumber.stop())
    .pipe(gulp.dest('./assets/css/src'));
});

gulp.task('js-compile', () => {
  return browserify('./assets/js/app.js')
    .bundle()
    .on( 'error', function ( err ) {
      notify().write( err );
      this.emit("end")
    })
    .pipe(vinylSourceStream( 'app.js' ))
    .pipe( gulp.dest('./assets/js/src'))
});

gulp.task('watch', () => {
  console.log('\n', "\x1b[35m", "  Start watch task", '\n');
  gulp.watch('./assets/sass/**/*.sass', ['css-compile']);
  gulp.watch('./assets/js/*.js', ['js-compile']);
});

gulp.task('default', ['watch'], () => {
  console.log('\n',"\x1b[34m", "  Starting build process",'\n');

});