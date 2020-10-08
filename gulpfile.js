const gulp = require("gulp");
const { src, dest } = require('gulp');
const browserify = require("browserify");
const watchify = require("watchify");
const source = require('vinyl-source-stream');
const tsify = require("tsify");
const gutil = require("gulp-util");
const pipeline = require('readable-stream').pipeline;
const fancy_log = require('fancy-log');
const closureCompiler = require('google-closure-compiler').gulp();
const replace = require('gulp-replace');

const shell = require('gulp-shell')

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
}).plugin(tsify, {}).on('error', console.log))
  


gulp.task("copy-html", function (done) {
    return src(paths.pages)
        .pipe(dest("dist"))
});

gulp.task("copy-data", function (done) {
  return src(paths.data)
      .pipe(dest("dist/data"))
});

gulp.task("serve", function (done) {
  return require('./serve');
});

gulp.task('ghio-deploy', shell.task('sh ghio_deploy.sh'))

gulp.task('compress', function () {
  gulp.src(['dist/index.html'])
    .pipe(replace('js/bundle.js', 'js/bundle.min.js'))
    .pipe(gulp.dest('dist/'));

  return pipeline(
      gulp.src('dist/js/bundle.js'),
      closureCompiler({
        compilation_level: 'SIMPLE',
        language_in: 'ECMASCRIPT6_STRICT',
        language_out: 'ECMASCRIPT5_STRICT',
        // output_wrapper: '(function(){\n%output%\n}).call(this)',
        js_output_file: 'bundle.min.js'
      }, {
        platform: ['native', 'java', 'javascript']
      }),
      minify(),
      gulp.dest('dist/js')
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
gulp.task("default", gulp.parallel(["copy-html", "copy-data", "serve"], () =>{
  gulp.watch('src/index.html', gulp.parallel(['copy-html']))
  gulp.watch(paths.data, gulp.parallel(['copy-data']))
  
  bundle()
}));

watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", fancy_log);