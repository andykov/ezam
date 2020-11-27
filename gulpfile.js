const distFolder = 'dist';
// const distFolder = require('path').basename(__dirname);
const sourceFolder = 'src';

const path = {
  build: {
    html: distFolder + '/',
    css: distFolder + '/css/',
    js: distFolder + '/js/',
    img: distFolder + '/img/',
    fonts: distFolder + '/fonts/',
  },
  src: {
    html: [sourceFolder + '/html/*.html', '!' + sourceFolder + '/**/_*.html'],
    scss: sourceFolder + '/scss/style.scss',
    js: sourceFolder + '/js/script.js',
    images: sourceFolder + '/images/**/*.{png,jpg,svg,gif,ico,webp}',
    fonts: sourceFolder + '/fonts/*.ttf',
  },
  watch: {
    html: sourceFolder + '/html/**/*.html',
    scss: sourceFolder + '/scss/**/*.scss',
    js: sourceFolder + '/js/**/*.js',
    images: sourceFolder + '/images/**/*.{png,jpg,svg,gif,ico,webp}',
  },
  clean: './' + distFolder + '/',
};

const { src, dest, task } = require('gulp'),
  gulp = require('gulp'),
  fs = require('fs'),
  browserSync = require('browser-sync').create(),
  fileInclude = require('gulp-file-include'),
  scss = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  groupMediaQueries = require('gulp-group-css-media-queries'),
  cleanCss = require('gulp-clean-css'),
  uglify = require('gulp-uglify-es').default,
  rename = require('gulp-rename'),
  babel = require('gulp-babel'),
  plumber = require('gulp-plumber'),
  imagemin = require('gulp-imagemin'),
  webp = require('gulp-webp'),
  svgSprite = require('gulp-svg-sprite'),
  fonter = require('gulp-fonter'),
  ttf2woff = require('gulp-ttf2woff'),
  ttf2woff2 = require('gulp-ttf2woff2'),
  del = require('del');

function bs() {
  browserSync.init({
    server: {
      baseDir: path.clean,
    },
    port: 3000,
    notify: false,
  });
}

function html() {
  return (
    src(path.src.html)
      .pipe(fileInclude())
      // .pipe(webpHTML())
      .pipe(dest(path.build.html))
      .pipe(browserSync.stream())
  );
}

function css() {
  return src(path.src.scss)
    .pipe(
      scss({
        outputStyle: 'expanded',
      })
    )
    .pipe(groupMediaQueries())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 5 versions'],
        cascade: true,
      })
    )
    .pipe(dest(path.build.css))
    .pipe(cleanCss())
    .pipe(
      rename({
        extname: '.min.css',
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browserSync.stream());
}

function js() {
  return src(path.src.js)
    .pipe(fileInclude())
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(
      rename({
        extname: '.min.js',
      })
    )
    .pipe(dest(path.build.js))
    .pipe(browserSync.stream());
}

function images() {
  return (
    src(path.src.images)
      // .pipe(
      //   webp({
      //     quality: 70,
      //   })
      // )
      // .pipe(dest(path.build.img))
      // .pipe(src(path.src.images))
      .pipe(
        imagemin({
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          interlaced: true,
          optimizationLevel: 5, // 0 to 7
        })
      )
      .pipe(dest(path.build.img))
      .pipe(browserSync.stream())
  );
}

function fonts() {
  src(path.src.fonts).pipe(ttf2woff()).pipe(dest(path.build.fonts));

  return src(path.src.fonts).pipe(ttf2woff2()).pipe(dest(path.build.fonts));
}

// run command - gulp otf2ttf
gulp.task('otf2ttf', function () {
  return src([sourceFolder + '/fonts/*.otf'])
    .pipe(
      fonter({
        formats: ['ttf'],
      })
    )
    .pipe(dest(sourceFolder + '/fonts/'));
});

// run command - gulp svgSprite
gulp.task('svgSprite', function () {
  return gulp
    .src([sourceFolder + '/icons/*.svg'])
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: '../icons/sprite.svg',
            // example: true
          },
        },
      })
    )
    .pipe(dest(path.build.img));
});

function fontsStyle() {
  let fileContent = fs.readFileSync(sourceFolder + '/scss/mixins/_typo.scss');
  if (fileContent == '') {
    fs.writeFile(sourceFolder + '/scss/mixins/_typo.scss', '', cb);
    return fs.readdir(path.build.fonts, function (err, items) {
      if (items) {
        let cFontname;
        for (var i = 0; i < items.length; i++) {
          let fontname = items[i].split('.');
          fontname = fontname[0];
          if (cFontname != fontname) {
            fs.appendFile(
              sourceFolder + '/scss/mixins/_typo.scss',
              '@include font-include("' +
                fontname +
                '", "' +
                fontname +
                '", "400", "normal");\r\n',
              cb
            );
          }
          cFontname = fontname;
        }
      }
    });
  }
}

function cb() {}

function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.scss], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.images], images);
}

function clean() {
  return del(path.clean);
}

let build = gulp.series(
  clean,
  gulp.parallel(js, css, html, images, fonts),
  fontsStyle
);
let watch = gulp.parallel(build, watchFiles, bs);

exports.js = js;
exports.css = css;
exports.html = html;
exports.images = images;
exports.fonts = fonts;
exports.fontsStyle = fontsStyle;
exports.build = build;
exports.watch = watch;
exports.default = watch;
