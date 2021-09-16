const { src, dest, watch, series, parallel, lastRun } = require('gulp');
const del = require('del');
const sass = require('gulp-dart-sass');
const postcss = require('gulp-postcss');
const plumber = require('gulp-plumber');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();
const htmlmin = require('gulp-htmlmin');
const gulp = require('gulp');
const autoprefixer = require('autoprefixer')
const imagemin = require('gulp-imagemin');
/**
 * Clear folder distfunction
 */
const distFolder = './dist/';
const clearTask = () => del([distFolder])

/**
 * 
 * @path 
 */
const paths = {
  scss: {
  src: 'src/styles/**/*.scss',
  dest: './dist/styles',
},
  html: {
  src: './src/**/*.html',
  dest: './dist/',
},
  js: {
    src: './src/index.js',
    dest: './dist/',
  },
  img: {
    src: './src/assets/',
    dest: './dist/assets/images',
  }
};


/**
 * 
 * Html task 
 */
const htmlTask = () => {
  return src(paths.html.src, { since: lastRun(htmlTask)})
  .pipe(plumber())
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(dest(paths.html.dest))
  .pipe(browserSync.stream());
 }
/**
 * sass task
 */
const scssTask = () => {
  return src(paths.scss.src, { sourcemaps: true })
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest(paths.scss.dest, { sourcemaps: '.' }))
    .pipe(browserSync.stream());
};

/**
 * Images Task
 *  
 */
 const imagesTask = () => {
  return src(paths.img.src)
      .pipe(plumber())
      .pipe(imagemin())
      .pipe(dest(paths.img.dest))
      .pipe(browsersync.stream())
}

/**
 * javascript task
 */
const jsTask = () => {
  return src(paths.js.src, { sourcemaps: true })
    .pipe(terser())
    .pipe(dest(paths.js.dest, { sourcemaps: '.' }));
};

/**
 * browsersync task
 */
const browsersyncServer = (cb) => {
  browsersync.init({
    server: {
      baseDir: '.',
    },
  });
  cb();
};

/**
 * browsersync reload
 */
const browsersyncReload = (cb) => {
  browsersync.reload();
  cb();
};

/**
 * Watch tasks
 */
const watchTask = () => {
  watch('*.html', browsersyncReload);
  watch(
    ['src/styles/**/*.scss', 'src/js/**/*.js'],
    series(scssTask, jsTask, browsersyncServer)
  );
};
/**
 * default gulp task
 */

const serie = series(clearTask, htmlTask, scssTask, imagesTask, jsTask);
const build = series(serie)
const dev = series(htmlTask, scssTask, imagesTask, jsTask, parallel(watchTask, browsersyncServer));


module.exports = {
  build,
  dev,
}