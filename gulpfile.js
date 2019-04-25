
var gulp = require('gulp');
var ugligy = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var uncss = require('gulp-uncss');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var all = require('gulp-all');

var moduleDirectories = [
    './node_modules/bootstrap/**/*.js',
    './node_modules/bootstrap/**/*.css',
    './node_modules/jquery/**/*.js',
    './node_modules/jquery-validation/**/*.js',
    './node_modules/jquery-validation-unobtrusive/**/*.js',
];

var scriptDirectories = ['./scripts/**/*.js'];

var styleDirectories = ['./styles/**/*.css'];

var concatStyleDirectories = [
    './styles/site.css',
    './node_modules/bootstrap/dist/css/bootstrap.css',
];

var concatStyleFileName = 'site.concatenated.css';

var pageFileDiretories = ['./Views/**/*.cshtml'];

function build() {

    var copyModules =
        gulp.src(moduleDirectories, { base: "node_modules" })
            .pipe(gulp.dest('wwwroot/lib/'));

    var copyScripts =
        gulp.src(scriptDirectories)
            .pipe(gulp.dest('wwwroot/js/'));

    var copyStyles =
        gulp.src(styleDirectories)
            .pipe(gulp.dest('wwwroot/css/'));

    var minifyScripts =
        gulp.src(scriptDirectories)
            .pipe(ugligy())
            .pipe(rename({ suffix: '.min' }))
            .pipe(gulp.dest('wwwroot/js/'));

    var minifyStyles =
        gulp.src(styleDirectories)
            .pipe(cssmin())
            .pipe(rename({ suffix: '.min' }))
            .pipe(gulp.dest('wwwroot/css/'));

    var concatStyles =
        gulp.src(concatStyleDirectories)
            .pipe(concat(concatStyleFileName))
            .pipe(gulp.dest('wwwroot/css/'));

    var concatAndMinifyStyles =
        gulp.src(concatStyleDirectories)
            .pipe(concat(concatStyleFileName))
            .pipe(cssmin())
            .pipe(rename({ suffix: '.min' }))
            .pipe(gulp.dest('wwwroot/css/'));

    var uncssStyles =
        gulp.src(concatStyleDirectories)
            .pipe(concat(concatStyleFileName))
            .pipe(rename({ suffix: '.uncss' }))
            .pipe(uncss({ html: pageFileDiretories }))
            .pipe(gulp.dest('wwwroot/css/'));

    var uncssAndMinifyStyles =
        gulp.src(concatStyleDirectories)
            .pipe(concat(concatStyleFileName))
            .pipe(cssmin())
            .pipe(rename({ suffix: '.uncss.min' }))
            .pipe(uncss({ html: pageFileDiretories }))
            .pipe(gulp.dest('wwwroot/css/'));

    return all(
        copyModules,
        copyScripts,
        copyStyles,
        minifyScripts,
        minifyStyles,
        concatStyles,
        concatAndMinifyStyles,
        uncssStyles,
        uncssAndMinifyStyles,
    );
}

gulp.task('build', build);

gulp.task('watch', function () {

    var watchDiretories = []
    watchDiretories = watchDiretories.concat(
        moduleDirectories,
        scriptDirectories,
        styleDirectories,
    );

    console.log('WATCHING FOR CHANGES IN:');
    console.log(watchDiretories);

    gulp.watch(watchDiretories, build);
});
