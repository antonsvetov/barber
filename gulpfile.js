// npx gulp image; - оптимизация изображения, запускать в указанном порядке, оптим изобр собираются в папку img-optim
// npx gulp svg - создание svg-спрайта;
// npx gulp webp;

// gulp build - сборка в продакшен
// gulp - режим разработки с запуском сервера - ничего в build  не сохраняет

//Подключаем локальные пакеты
const gulp = require("gulp");
const sass = require("gulp-sass");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const del = require("del");
const imagemin = require("gulp-imagemin");
const webP = require("gulp-webp");
const svgstore = require("gulp-svgstore");


exports.css = () => {
  return (
    gulp
      .src("source/sass/style.scss")
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(sass().on("error", sass.logError))
      .pipe(postcss([autoprefixer()]))
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest("source/"))
      .pipe(browserSync.stream())
  );
};



exports.style = () => {
  return (
    gulp
      .src("source/sass/style.scss")
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(sass().on("error", sass.logError))
      .pipe(postcss([autoprefixer()]))
      .pipe(csso())
      .pipe(rename("styles.min.css"))
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest("source/"))
      .pipe(browserSync.stream())
  );
};


exports.server = () => {
  browserSync.init({
    server: {
      baseDir: "source",
    },
      notify: false, // Отключаем уведомления
      online: true,
      cors: true,
      ui: false,
  });
}

exports.copy = () => {
  (async () => {
    const clear = await del("build");
  })();
  return gulp
    .src(
      [
        "source/fonts/**/*.{woff,woff2}",
        "soorce/css/*min.css",
        "source/img/**/*",
        "source/*.ico",
        "source/*.html",
      ],
      { base: "source" }
    )
    .pipe(gulp.dest("build"));
}


exports.startWatch = () => {
  gulp.watch("source/sass/**/*.scss", css);
  gulp.watch("source/*.html").on("change", browserSync.reload);
  }


exports.image = () => (
  gulp.src('source/image/**/*')
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.svgo(),
        ])
     )
    .pipe(gulp.dest('source/img'))
);


exports.webp = () => (
  gulp.src("source/img/**/*.jpg")
      .pipe(webP())
      .pipe(gulp.dest("source/img/webP"))
);

exports.svg = () => (
  gulp.src("source/image/*.svg")
      .pipe(svgstore())
      .pipe(rename("sprite.svg"))
      .pipe(gulp.dest("source/img"))
);





exports.build = gulp.series(style, copy);
exports.default = gulp.parallel(css, server, startWatch);
