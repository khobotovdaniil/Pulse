const gulp        = require('gulp');
const webpack = require("webpack-stream");
const browserSync = require('browser-sync');
const sass        = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');

const dist = "./dist";
// const dist = "/openserver/domains/dist";

gulp.task('build-sass', function() {
    return gulp.src("./src/sass/**/*.+(scss|sass)")
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoprefixer())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(`${dist}/css`))
        .pipe(browserSync.stream());
});

gulp.task('copy-html', function () {
  return gulp.src("./src/*.html")
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest(dist))
      .pipe(browserSync.stream());
});

gulp.task('scripts', function () {
  return gulp.src("./src/js/**/*.js")
      .pipe(gulp.dest(`${dist}/js`))
      .pipe(browserSync.stream());
});

gulp.task('fonts', function () {
  return gulp.src("./src/fonts/**/*")
      .pipe(gulp.dest(`${dist}/fonts`))
      .pipe(browserSync.stream());
});

gulp.task('icons', function () {
  return gulp.src("./src/icons/**/*")
      .pipe(imagemin())
      .pipe(gulp.dest(`${dist}/icons`))
      .pipe(browserSync.stream());
});

gulp.task('images', function () {
  return gulp.src("./src/img/**/*")
      .pipe(imagemin())
      .pipe(gulp.dest(`${dist}/img`))
      .pipe(browserSync.stream());
});

gulp.task('mailer', function () {
  return gulp.src("./src/mailer/**/*")
      .pipe(gulp.dest(`${dist}/mailer`));
});

gulp.task('clock', function () {
  return gulp.src("./src/clock/*")
      .pipe(imagemin())
      .pipe(gulp.dest(`${dist}/clock`));
});

gulp.task('watch', function() {
  browserSync.init({
		server: "./dist/",
		port: 4000,
		notify: true
    });
    
    gulp.watch("src/sass/**/*.+(scss|sass|css)", gulp.parallel('build-sass'));
    gulp.watch("src/*.html").on('change', gulp.parallel('copy-html'));
    gulp.watch("src/js/**/*.js").on('change', gulp.parallel('scripts'));
    gulp.watch("src/fonts/**/*").on('add', gulp.parallel('fonts'));
    gulp.watch("src/icons/**/*").on('add', gulp.parallel('icons'));
    gulp.watch("src/img/**/*").on('add', gulp.parallel('images'));
});

gulp.task('default', gulp.parallel('watch', 'build-sass', 'copy-html', 'scripts', 'fonts', 'icons', 'images', 'mailer', 'clock'));