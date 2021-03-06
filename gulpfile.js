'use strict';
var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var order = require('gulp-order');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
//var gulpignore = require('gulp-ignore');
var vendor_path = './js/vendor/';
var app_modules_path = './js/app_modules/';
var app_styles_path = './css/';

// Concatenate vendor js files
gulp.task('vendor-scripts', function () {

   // del(['./js/dist/vendor.js', './js/dist/vendor.js.map']);

    return gulp.src([vendor_path + '*.js', '!./js/vendor/chance.js'])//this works, re-add chance.js when testing
       // .pipe(gulpignore.exclude('./js/vendor/chance.js'))
        .pipe(sourcemaps.init())
        .pipe(order([
            'js/vendor/jquery-1.11.0.js',
            'js/vendor/jquery.easing.min.js',
            'js/vendor/leaflet.js',
            'js/vendor/leaflet.markercluster.js',
            'js/vendor/*.js'
        ], {base: './'}))
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./js/dist/'));
});

//concatenate app modules to dist folder
gulp.task('app-modules', function () {

  //  del(['./js/dist/bestpint.js']);

    return gulp.src(app_modules_path + '*.js')
      //  .pipe(sourcemaps.init())
        .pipe(concat('bestpint.js'))
       // .pipe(uglify())
      //  .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./js/dist/'));
});

//concatenate css. Use same path as destination not to screw up img and fonts urls
gulp.task('app-styles', function () {

    //del(['./css/bestpint.css']);

    return gulp.src(app_styles_path + '*.css')
        .pipe(concat('bestpint.css'))
        .pipe(gulp.dest('./css/'));
});

// Default Task (re-run manually when adding a vendor)
gulp.task('default', ['vendor-scripts', 'app-modules', 'app-styles'], function () {
    //del(['./css/bestpint.css', './js/dist/bestpint.js']);
});

gulp.task('watch', function(){
    // watch for JS changes
    gulp.watch('./js/**/*.js', ['app-modules']);
    // watch for CSS changes
    gulp.watch('./css/*.css', ['app-styles']);
});
