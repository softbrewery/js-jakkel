var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var size = require('gulp-size');
var rename = require('gulp-rename');
var rimraf = require('gulp-rimraf');
var karma = require('gulp-karma');

gulp.task('clean', function() {
  return gulp.src('dist/', {read: false})
        .pipe(rimraf());
});

gulp.task('test', function() {
  return gulp.src(['src/**/*.js', 'test/**/*.js'])
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      throw err;
    });
});

gulp.task('build', ['clean', 'test'], function() {
  return gulp.src('src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(rename('jakkel.js'))
    .pipe(gulp.dest('dist/'))
    .pipe(uglify())
    .pipe(rename('jakkel.min.js'))
    .pipe(gulp.dest('dist/'))
    .pipe(size());
});

gulp.task('default', function() {
  gulp.start('build');
});