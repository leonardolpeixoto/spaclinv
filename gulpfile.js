let gulp = require('gulp');
let $ = require('gulp-load-plugins')();
let httpProxy = require('http-proxy');
let browserify = require('browserify');
let watchify = require('watchify');
let jstify = require('jstify');
let babelify = require('babelify');
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');
let browserSync = require('browser-sync');
let minifyCss = require('gulp-minify-css');
let KarmaServer = require('karma').Server;
let reload = browserSync.reload;

// Bundle files with browserify
gulp.task('browserify', () => {
  // set up the browserify instance on a task basis
  let bundler = browserify({
    entries: 'app/js/main.js',
    debug: true,
    // defining transforms here will avoid crashing your stream
    transform: [jstify]
  });

  bundler = watchify(bundler);

  let rebundle = function() {
    return bundler.bundle()
      .on('error', $.util.log)
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe($.sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .on('error', $.util.log)
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest('.tmp/js'));
  };

  bundler.on('update', rebundle);

  return rebundle();
});

// Bundle files with browserify for production
gulp.task('browserify:dist', function () {
  // set up the browserify instance on a task basis
  let bundler = browserify({
    entries: 'app/js/main.js',
    // defining transforms here will avoid crashing your stream
    transform: [babelify, jstify]
  });

  return bundler.bundle()
    .on('error', $.util.log)
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe($.uglify())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('html', function() {
  let assets = $.useref.assets();

  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', minifyCss()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
  gulp.src('app/images/*.{jpg,gif,svg,png}')
    .pipe($.imagemin())
    .pipe(gulp.dest('dist/images'));
});

gulp.task('express', () => {
  $.nodemon({
    script: 'server/index.js',
    ignore: ['app']
  });
});

gulp.task('test', callback => {
  let karma = new KarmaServer({
    configFile: __dirname + '/karma.conf.js'
  }, callback);

  karma.start();
});

gulp.task('serve', ['browserify', 'express'], () => {
  let serverProxy = httpProxy.createProxyServer();

  browserSync({
    port: 9000,
    ui: {
      port: 9001
    },
    server: {
      baseDir: ['.tmp', 'app'],
      middleware: [
        function (req, res, next) {
          if (req.url.match(/^\/(api|avatar)\/.*/)) {
            serverProxy.web(req, res, {
              target: 'http://localhost:8000'
            });
          } else {
            next();
          }
        }
      ]
    }
  });

  gulp.watch([
    'app/*.html',
    'app/**/*.css',
    '.tmp/**/*.js'
  ]).on('change', reload);
});

gulp.task('serve:dist', ['browserify:dist', 'images', 'express'], () => {
  let serverProxy = httpProxy.createProxyServer();

  browserSync({
    port: 9000,
    ui: {
      port: 9001
    },
    server: {
      baseDir: ['dist', 'app'],
      middleware: [
        function (req, res, next) {
          if (req.url.match(/^\/(api|avatar)\/.*/)) {
            serverProxy.web(req, res, {
              target: 'http://localhost:8000'
            });
          } else {
            next();
          }
        }
      ]
    }
  });
});

