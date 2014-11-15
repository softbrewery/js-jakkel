var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var size = require('gulp-size');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var karma = require('gulp-karma');

gulp.task('clean', function() {
  return gulp.src('dist/', {read: false})
        .pipe(clean());
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

gulp.task('build', function() {
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

gulp.task('default', ['clean', 'test'], function() {
  gulp.start('build');
});