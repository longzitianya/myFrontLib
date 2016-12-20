var gulp = require('gulp'),
    assetRev = require('gulp-asset-rev'),
    del = require('del'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-ruby-sass'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    htmlmin = require('gulp-minify-html'),
    cssmin = require('gulp-minify-css'),
    jsmin = require('gulp-uglify'),
    sequence = require('gulp-sequence'),
    imagemin = require('gulp-imagemin');

// 管理资源文件路径集合
var config = {};

// 源资源文件路径
config.assets = {
    global: '*.*',
    static: 'public/**',
    sass: 'public/sass/**.*',
    css: 'public/css/**.*',
    css_files: 'public/css/',
    font: 'public/fonts/*.*',
    img: 'public/img/*.*',
    _img:'public/img/**',
    js: 'public/js/*.*',
    js_files: 'public/js/**/',
    plugins: 'public/plugins/*.*',
    html: 'templates/*.html',
    html2: 'templates/**/*.html',
    html_base: 'templates/index.html'
};

// 目标文件路径 不用替换
config.dist = {
    global: 'dist/',
    static: 'dist/public/',
    css: 'dist/public/css/',
    sass: 'dist/public/sass/',
    font: 'dist/public/fonts/',
    img: 'dist/public/img/',
    js: 'dist/public/js/',
    plugins: 'public/plugins/',
    html: 'dist/html/',
    rev_json: 'dist/rev-manifest.json'
};
// 编译sass
gulp.task('sass', function () {
    sass(['public/sass/common.scss','public/sass/user/*.scss'])
        .on('error', sass.logError)
        .pipe(gulp.dest('public/css'));
});
/**
 * Clean task 清空
 */
gulp.task('clean', function (cb) {
   return  del(['dist'], cb);
});

/**
 * Lint task
 */
gulp.task('lint', function () {
    gulp.src([config.assets.js, config.assets.js_files + '*.js', 'gulpfile.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

/**
 * Min task
 */
gulp.task('htmlmin', function () {
    return gulp.src([config.assets.html, config.assets.html2])
        //.pipe(htmlmin({empty: true}))
        .pipe(gulp.dest(config.dist.html));
});

gulp.task('cssmin', function () {
    return gulp.src([config.assets.css, config.assets.css_files + '**/*.css'])
        .pipe(cssmin())
        .pipe(gulp.dest(config.dist.css))
        .pipe(browserSync.stream());
});

gulp.task('jsmin', function () {
    return gulp.src([config.assets.js, config.assets.js_files])
        //.pipe(jsmin())
        .pipe(gulp.dest(config.dist.js));
});

gulp.task('imgmin', function () {
    gulp.src([config.assets.img,config.assets._img])
        .pipe(imagemin())
        .pipe(gulp.dest(config.dist.img));
});

gulp.task('compress', ['htmlmin', 'cssmin', 'jsmin', 'imgmin']);

/**
 * Copy task
 */
gulp.task('copy', function () {
    return gulp.src(['public/fonts/**/', 'public/plugins/**','public/css/**'], {base: './'})
        .pipe(gulp.dest('dist'));
});
/*
 * 版本化IMG
 *
 */
gulp.task('rev-img', function () {
    return gulp.src(config.assets.img)
        .pipe(assetRev())
        .pipe(gulp.dest(config.dist.img));
});

/*
 * 版本化CSS
 *
 */
gulp.task('rev-css', function () {
    return gulp.src(config.assets.css)
        .pipe(assetRev())
        .pipe(gulp.dest(config.dist.css));
});

/*
 * 版本化JS
 *
 */
gulp.task('rev-js', function () {
    return gulp.src(config.assets.js)
        .pipe(assetRev())
        .pipe(gulp.dest(config.dist.js));
});
// 生成文件版本
gulp.task('rev', ['rev-img', 'rev-css', 'rev-js']);


gulp.task('serve', function () {
    browserSync.init({
        files: "**", //监听整个项目
        server: {
            baseDir: [config.assets.global,config.dist.html,config.dist.global,config.dist.html],
            index: "product/productList.html"
        },
        port: 8080,
        ghostMode: {
            clicks: true,
            forms: true,
            scroll: false
        },
        logConnections: true,
        // Open the site in Chrome
        browser: "google chrome",
        // don't auto-reload all browsers following a Browsersync reload
        reloadOnRestart: true,
        reloadDelay: 0
    });
});
//监控改动并自动刷新任务;

//命令行使用gulp auto启动;

gulp.task('auto', function () {

    gulp.watch([config.assets.js, config.assets.js_files], ['jsmin']);

    gulp.watch([config.assets.css, config.assets.css_files], ['cssmin']);

    gulp.watch(config.assets.img, ['imgmin']);

    gulp.watch([config.assets.html, config.assets.html2], ['htmlmin']);

    gulp.watch('dist/**/*').on('change', browserSync.reload);

});
// 发布
//gulp.task('build', function(cb) {
// $.sequence('clean', 'rev', 'revh','serve', cb);

//});
/**
 * Build task
 */
gulp.task('build', function (cb) {
    sequence(['clean'], ['compress', 'copy', 'lint'], 'serve', 'auto')(cb);
});