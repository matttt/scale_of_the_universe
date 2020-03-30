const gulp = require("gulp");
const { src, dest } = require('gulp');
const browserify = require("browserify");
const watchify = require("watchify");
const source = require('vinyl-source-stream');
const tsify = require("tsify");
const gutil = require("gulp-util");
const pipeline = require('readable-stream').pipeline;
const fancy_log = require('fancy-log');


const uglifyjs = require('uglify-es'); 
const composer = require('gulp-uglify/composer');
const minify = composer(uglifyjs, console);


const paths = {
    pages: ['src/*.html'],
    data: 'src/data/**/*',
    bundle: "dist/js"
};

const watchedBrowserify = watchify(browserify({
  basedir: '.',
  debug: true,
  entries: ['src/ts/main.ts'],
  project: 'tsconfig.json',
  cache: {},
  packageCache: {}
}).plugin(tsify, { "baseUrl": "." }).on('error', console.log))
  


gulp.task("copy-html", function (done) {
    return src(paths.pages)
        .pipe(dest("dist"))
});

gulp.task("copy-data", function (done) {
  return src(paths.data)
      .pipe(dest("dist/data"))
});

gulp.task('compress', function () {
  return pipeline(
    gulp.src('dist/js/bundle.js'),
    minify(),
    gulp.dest('dist/js/bundle.min.js')
    );
  });
  
function bundle() {
  return pipeline(
    watchedBrowserify.bundle()
    .on('error', fancy_log),
    source('bundle.js'),
    dest(paths.bundle)
  );
}
gulp.task("default", gulp.parallel(["copy-html", "copy-data"], () =>{
  gulp.watch('src/index.html', gulp.parallel(['copy-html']))
  gulp.watch(paths.data, gulp.parallel(['copy-data']))
  
  bundle()
}));

watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", fancy_log);