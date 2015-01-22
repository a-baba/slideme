var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  jshint = require('gulp-jshint'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename');

gulp.task('lint', function() {
  gulp.src(['js/var.js', 'js/helpers.js', 'js/create.js',  'js/loadjson.js', 'js/preloader.js', 'js/playlist.js', 'js/video.js', 'js/config.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('scripts', function() {
  gulp.src(['js/var.js', 'js/helpers.js', 'js/create.js',  'js/loadjson.js', 'js/preloader.js', 'js/playlist.js', 'js/video.js', 'js/config.js'])
    .pipe(concat('slideme.js'))
    .pipe(gulp.dest('build'))
    .pipe(rename('slideme.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
  gulp.watch(['js/var.js', 'js/helpers.js', 'js/create.js',  'js/loadjson.js', 'js/preloader.js', 'js/playlist.js', 'js/video.js', 'js/config.js'], ['lint', 'scripts']);
});

gulp.task('default', ['lint', 'scripts', 'watch']);