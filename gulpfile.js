'use strict';

let gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    exec = require('gulp-exec'),
    cp = require('child_process'),
    $ = require('gulp-load-plugins')();
// spawn = process.platform === 'win32' ? require('win-spawn') : require('child_process').spawn;

let path = {
    SCSS_SRC: '_assets/scss/**/*.scss',
    SCSS_DST: './docs/css/',
    HTML_SRC: ['./*.html',
        './_includes/*.html',
        './_layouts/*.html',
        './_posts/**/*.*']
};

gulp.task('scss', function () {
    return gulp.src(path.SCSS_SRC)
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer())
        /*.pipe($.size({ showFiles: true}))
        .pipe($.csso())
        .pipe($.size({ showFiles: true}))*/
        /*.pipe($.sourcemaps.write('map'))*/
        .pipe(gulp.dest(path.SCSS_DST))
        .pipe(browserSync.stream({match: '**/*.css'}));
});


//  Jekyll

gulp.task('jekyll', () =>  {
    return cp.spawn('bundle', ['exec', 'jekyll', 'build'], {stdio: "inherit", shell: true});
});

gulp.task('watch', function () {
    browserSync.init({
        server: {
            baseDir: './docs/'
        }
    });

    gulp.watch('_assets/scss/**/*.scss', gulp.series('scss'));

    gulp.watch(path.HTML_SRC).on('change', gulp.series('jekyll', 'scss'));

    gulp.watch('docs/**/*.html').on('change', browserSync.reload);
    gulp.watch('docs/**/*.js').on('change', browserSync.reload);

});

gulp.task('default', gulp.series('jekyll', 'scss', 'watch'));