
var gulp = require('gulp');
var uglify = require('gulp-uglify-es').default; //"uglify-es" is no longer maintained.
var cssmin = require('gulp-cssmin');
var uncss = require('gulp-uncss');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var clean = require('gulp-clean');

const moduleJsFiles = [
    './node_modules/bootstrap/**/*.js',
    './node_modules/jquery/**/*.js',
    './node_modules/jquery-validation/**/*.js',
    './node_modules/jquery-validation-unobtrusive/**/*.js',
];
const moduleCssFiles = [
    './node_modules/bootstrap/**/*.css',
];
const moduleFiles = [].concat(moduleJsFiles, moduleCssFiles);

const customJsFiles = ['./scripts/**/*.js'];
const customCssFiles = ['./styles/**/*.css'];

const concatJsFiles = [
    './node_modules/jquery/dist/jquery.js',
    './node_modules/jquery-validation/dist/jquery.validate.js',
    './node_modules/jquery-validation-unobtrusive/dist/jquery.validate.unobtrusive.js',
    './node_modules/bootstrap/dist/js/bootstrap.js',
    './scripts/site1.js',
    './scripts/site2.js',
];
const concatCssFiles = [
    './node_modules/bootstrap/dist/css/bootstrap.css',
    './styles/site1.css',
    './styles/site2.css',
];
const concatJsFileName = 'site.concatenated.js';
const concatCssFileName = 'site.concatenated.css';

const uncssPageFiles = ['./Views/**/*.cshtml'];

const watchModuleFiles = moduleFiles;
const watchJsFiles = [].concat(moduleJsFiles, customJsFiles);
const watchCssFiles = [].concat(moduleCssFiles, customCssFiles);

//clean up destiny files
gulp.task('clean-modules', function () {
    return gulp.src('wwwroot/lib/', { read: false, allowEmpty: true })
        .pipe(clean());
});
gulp.task('clean-scripts', function () {
    return gulp.src('wwwroot/js/', { read: false, allowEmpty: true })
        .pipe(clean());
});
gulp.task('clean-styles', function () {
    return gulp.src('wwwroot/css/', { read: false, allowEmpty: true })
        .pipe(clean());
});
gulp.task('clean', gulp.parallel('clean-modules', 'clean-scripts', 'clean-styles'));

//copy files from the directory and paste to the destiny directory
gulp.task('copy-modules', function () {
    return gulp.src(moduleFiles, { base: "node_modules" })
        .pipe(gulp.dest('wwwroot/lib/'));
});
gulp.task('copy-scripts', function () {
    return gulp.src(customJsFiles)
        .pipe(gulp.dest('wwwroot/js/'));
});
gulp.task('copy-styles', function () {
    return gulp.src(customCssFiles)
        .pipe(gulp.dest('wwwroot/css/'));
});
gulp.task('copy', gulp.parallel('copy-modules', 'copy-scripts', 'copy-styles'));

//concatenate/join files
gulp.task('concat-scripts', function () {
    return gulp.src(concatJsFiles)
        .pipe(concat(concatJsFileName))
        .pipe(gulp.dest('wwwroot/js/'));
});
gulp.task('concat-styles', function () {
    return gulp.src(concatCssFiles)
        .pipe(concat(concatCssFileName))
        .pipe(gulp.dest('wwwroot/css/'));
});
gulp.task('concat', gulp.parallel('concat-scripts', 'concat-styles'));

//uncss files
gulp.task('uncss', function () {
    return gulp.src(concatCssFiles)
        .pipe(concat(concatCssFileName))
        .pipe(rename({ suffix: '.uncss' }))
        .pipe(uncss({ html: uncssPageFiles }))
        .pipe(gulp.dest('wwwroot/css/'));
});

//minify files
gulp.task('minify-scripts', function () {
    return gulp.src('./wwwroot/js/**/!(*.spec|*.min)*.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('wwwroot/js/'));
});
gulp.task('minify-styles', function () {
    return gulp.src('./wwwroot/css/**/!(*.spec|*.min)*.css')
        .pipe(cssmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('wwwroot/css/'));
});
gulp.task('minify', gulp.parallel('minify-scripts', 'minify-styles'));

//run all tasks
gulp.task('default', gulp.series('clean', 'copy', gulp.parallel('concat', 'uncss'), 'minify'));

//watch for files changes
gulp.task('watch-modules', function () {
    console.log('Watching for MODULES in:');
    console.log(watchModuleFiles);
    gulp.watch(watchModuleFiles, gulp.series(
        'clean-modules',
        'copy-modules',
    ));
});
gulp.task('watch-scripts', function () {
    console.log('Watching for SCRIPTS in:');
    console.log(watchJsFiles);
    gulp.watch(watchJsFiles, gulp.series(
        'clean-scripts',
        'copy-scripts',
        'concat-scripts',
        'minify-scripts',
    ));
});
gulp.task('watch-styles', function () {
    console.log('Watching for STYLES in:');
    console.log(watchCssFiles);
    gulp.watch(watchCssFiles, gulp.series(
        'clean-styles',
        'copy-styles',
        gulp.parallel('concat-styles', 'uncss'),
        'minify-styles',
    ));
});

gulp.task('watch', gulp.parallel('watch-modules', 'watch-scripts', 'watch-styles'));
