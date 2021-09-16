const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-dart-sass");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const terser = require("gulp-terser");
const browsersync = require("browser-sync").create();

/**
 * sass task
 */
const scssTask = () => {
  return src("src/styles/**/*.scss", { sourcemaps: true })
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([cssnano()]))
    .pipe(dest("dist/styles", { sourcemaps: "." }));
};

/**
 * javascript task
 */
const jsTask = () => {
  return src("src/index.js", { sourcemaps: true })
    .pipe(terser())
    .pipe(dest("dist", { sourcemaps: "." }));
};

/**
 * browsersync task
 */
const browsersyncServer = (cb) => {
  browsersync.init({
    server: {
      baseDir: ".",
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
  watch("*.html", browsersyncReload);
  watch(
    ["src/styles/**/*.scss", "src/js/**/*.js"],
    series(scssTask, jsTask, browsersyncServer)
  );
};
/**
 * default gulp task
 */
exports.default = series(scssTask, jsTask, browsersyncServer, watchTask);
