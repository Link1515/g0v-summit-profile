const { src, dest, watch, series, parallel } = require('gulp');
const pug = require('gulp-pug');
const postcss = require('gulp-postcss');
const tailwind = require('@tailwindcss/postcss');
const autoprefixer = require('autoprefixer');
const terser = require('gulp-terser');
const browserSync = require('browser-sync').create();

const version = getTimestamp();

function compilePug() {
  return src('src/pug/*.pug')
    .pipe(pug({ locals: { version } }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

function minifyCSS() {
  return src('src/css/*.css')
    .pipe(postcss([tailwind(), autoprefixer]))
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream());
}

function minifyJS() {
  return src('src/js/*.js')
    .pipe(terser())
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream());
}

function serve() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });
  watch('src/pug/**/*.pug', series(minifyCSS, compilePug));
  watch('src/css/**/*.css', minifyCSS);
  watch('src/js/**/*.js', minifyJS);
}

exports.build = series(compilePug, minifyCSS, minifyJS);
exports.default = series(parallel(compilePug, minifyCSS, minifyJS), serve);

function getTimestamp() {
  const now = new Date();

  const YYYY = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, '0');
  const DD = String(now.getDate()).padStart(2, '0');
  const HH = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');

  return `${YYYY}${MM}${DD}${HH}${mm}${ss}`;
}
