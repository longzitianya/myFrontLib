//需要导入的文件
var 	gulp = require('gulp');
var 	assetRev = require('gulp-asset-rev');
var 	del = require('del');
var 	watch = require('gulp-watch'); //监听文件变化
var     browserSync = require('browser-sync').create();
var     rev = require('gulp-rev');
var     revAll = require('gulp-rev-all');
var     revCollector = require('gulp-rev-collector');
var     jshint = require('gulp-jshint');
var     stylish = require('jshint-stylish');
var     useref = require('gulp-useref');
var     htmlmin = require('gulp-htmlmin');
var     cssClean = require('gulp-clean-css');
var     cssnano = require('gulp-cssnano');
var 	autoprefixer = require('gulp-autoprefixer');
var 	csslint = require('gulp-csslint');//检查css有无报错或警告
var 	csslintstylish = require('csslint-stylish');//
var     uglify = require('gulp-uglify');
var 	rename = require('gulp-rename');//重命名
var     sequence = require('run-sequence');
var 	gReplace=require('gulp-replace');
var 	revReplace = require('gulp-rev-replace');
var 	notify = require('gulp-notify');//加控制台文字描述用的
var     imagemin = require('gulp-imagemin');
	
	
// 管理资源文件路径集合
var config = {},
	sourcePath="D:/2016.09.18/csbc-mpp-1.0.0/src/main/webapp/WEB-INF",
	compilePath="D:/2016.09.18/csbc-mpp-1.0.0/src/main/webapp/WEB-INF/";

// 源资源文件路径
config.assets = {
    global: sourcePath+'/*.*',
    static: sourcePath+'/public',
    sass: sourcePath+'/public/sass/**.*',
    css: sourcePath+'/public/css/*.*',
    css_files: sourcePath+'/public/css/**/',
    font: sourcePath+'/public/fonts/*.*',
    img: sourcePath+'/public/img/*.*',
    _img:sourcePath+'/public/img/**',
    js: sourcePath+'/public/js/*.*',
    js_files: sourcePath+'/public/js/**/',
    plugins: sourcePath+'/public/plugins/**/**/',
    html: sourcePath+'/templates/*.html',
    html2: sourcePath+'/templates/**/*.html',
    html_base: sourcePath+'/templates/my/subscription.html'
};

// 目标文件路径 不用替换
config.dist = {
    global: compilePath+'/',
    static: compilePath+'_public',
    css: compilePath+'_public/css/',
    sass: compilePath+'_public/sass/',
    font:compilePath+'_public/fonts/',
    img: compilePath+'_public/img/',
    js: compilePath+'_public/js/',
    plugins: compilePath+'_public/plugins',
	plugins2:compilePath+'_public/plugins2',
    html: compilePath+'_templates/',
    rev_json: compilePath+'_rev/'
};
// 编译sass
gulp.task('sass', function () {
    return sass([sourcePath+'/public/sass/common.scss',sourcePath+'/public/sass/user/*.scss'])
        .on('error', sass.logError)
        .pipe(gulp.dest(compilePath+'/public/css'));
});
/**
 * Clean task 清空
 */
gulp.task('clean', function () {
   return  del([compilePath+'_public/',compilePath+'_templates/',compilePath+'_rev/','dist']);
});

/**
 * Lint task
 */
gulp.task('jslint', function () {
    return  gulp.src([config.assets.js, config.assets.js_files + '*.js', 'gulpfile.js'])
        //检测JS风格
		.pipe(jshint({
			"undef": true,
			"unused": true
		}))
	/**	
	.pipe(notify(function (file) {
      if (file.jshint.success) {
        // Don't show something if success 
        return false;
      }
 
      var errors = file.jshint.results.map(function (data) {
        if (data.error) {
          return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
        }
      }).join("\n");
      return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
    }));*/
	.pipe(jshint.reporter(stylish));   //高亮提示;
});
// 检查css
gulp.task('csslint', function() {
    return gulp.src([config.assets.css, config.assets.css_files + '**/*.css'])
			 .pipe(csslint({
				'shorthand': true
			  }).on('error', function(e){
					console.log(e);
				}))
			 .pipe(csslint.formatter(csslintstylish));
});


gulp.task('lint', ['jslint']);

gulp.task('imgmin', function () {
    return gulp.src([config.assets.img,config.assets._img])
		.pipe(imagemin({
			optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
			progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
			interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
			multipass: false //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
		.pipe(rev())
        .pipe(gulp.dest(config.dist.img))
		.pipe(rev.manifest({
                merge: true   // 设置为true
            }))
		 .pipe(gulp.dest(config.dist.rev_json+"/img/"));
});


/**
 * Copy task
 */
gulp.task('copyFonts', function () {
	return gulp.src(sourcePath+'/public/fonts/**/*.{svg,ttf,woff,eot}')
		.pipe(rev())
        .pipe(gulp.dest(config.dist.font))
		.pipe(rev.manifest({
                merge: true   // 设置为true
            }))
		.pipe(gulp.dest(config.dist.rev_json+"/fonts/"));	
});
gulp.task('copyPlugins', function () {
	   gulp.src(config.assets.plugins)
		//.pipe(revAll.revision({ hashLength: 10}))
		//.pipe(gulp.dest(config.dist.plugins))
		.pipe(rev())
		.pipe(gulp.dest(config.dist.plugins))
		.pipe(rev.manifest({
                merge: true   // 设置为true
            }))
		//.pipe(gulp.dest(config.dist.rev_json+"/plugins/"))
		//.pipe(revAll.manifestFile())
		.pipe(gulp.dest(config.dist.rev_json+"/plugin/"));
});


gulp.task('copyPluginsRev',function () {
	 return  gulp.src([config.dist.rev_json + '/**/*.json',config.dist.rev_json+'/plugin/rev-manifest.json',config.dist.plugins])
		 .pipe( revCollector({
            replaceReved: true
        }) )
		.pipe(notify({ message: '自动化构建已完成，按 Ctrl + C 结束构建命令' }))
		.pipe(gulp.dest(config.dist.plugins));
		
});

gulp.task('copy2', ['copyPlugins','copyPluginsRev']);


gulp.task('copy', function (cp) {
    sequence(['copyPlugins'],['copyPluginsRev'],cp);
});

gulp.task('cssmin', function () {
    return gulp.src([config.dist.rev_json+'/**/rev-manifest.json',config.assets.css,config.assets.css_files])
		.pipe(revCollector({
			replaceReved: true
		}))
		//.pipe(autoprefixer())
		.pipe(rev())
		//.pipe(cssnano())
        .pipe(gulp.dest(config.dist.css))
		.pipe(rev.manifest({
                merge: true   // 设置为true
            }))
		.pipe(gulp.dest(config.dist.rev_json+"/css/"));
        //.pipe(browserSync.stream());
});
gulp.task('jsmin', function () {
    return gulp.src([config.dist.rev_json+'/**/rev-manifest.json',config.assets.js, config.assets.js_files])
		.pipe(revCollector({
			replaceReved: true
		}))
		.pipe(uglify().on('error', function(e){
            console.log(e);
         }))
		.pipe(rev())
        .pipe(gulp.dest(config.dist.js))
		.pipe(rev.manifest({
                merge: true   // 设置为true
            }))
		.pipe(gulp.dest(config.dist.rev_json+"/js/"))
		.pipe(notify({ message: '自动化构建已完成，按 Ctrl + C 结束构建命令' }));
});

//.pipe(gReplace("${base.contextPath}/public", "${base.contextPath}/_public"))
gulp.task('htmlRep', function () { 
    return  gulp.src([config.dist.rev_json+'/**/rev-manifest.json',config.dist.rev_json+'/plugins/rev-manifest.json',config.assets.html,config.assets.html2])
		.pipe(revCollector({
			replaceReved: true
		}))
        .pipe(gulp.dest(config.dist.html));	
});

gulp.task('serve', function () {
    browserSync.init({
        files: "**", //监听整个项目
        server: {
            baseDir: [config.assets.global,config.dist.html,config.dist.global,config.dist.html],
            index: "index.html"
        },
        port: 9090,
        ghostMode: {
            clicks: true,
            forms: true,
            scroll: false
        },
        logConnections: true,
        // Open the site in Chrome
        browser: "chrome",
        // don't auto-reload all browsers following a Browsersync reload
        reloadOnRestart: true,
        reloadDelay: 0
    });
});
//监控改动并自动刷新任务;

//命令行使用gulp auto启动;

gulp.task('auto', function () {
	
	gulp.watch([config.assets.html, config.assets.html2], ['htmlRep']);
    
	gulp.watch([config.assets.js, config.assets.js_files], ['jsmin']);

    gulp.watch([config.assets.css, config.assets.css_files], ['cssmin']);
    
	gulp.watch(config.assets.img, ['imgmin']);
   // gulp.watch('dist/**/*').on('change', browserSync.reload);
   
});
// 说明
 
gulp.task('help',function () {
	console.log('	gulp				文件打包');
	
	console.log('	gulp build			文件打包');
 
	console.log('	gulp watch			文件监控打包');
 
	console.log('	gulp serve			测试server');
});
// 发布
gulp.task('build', function(done) {
  sequence(['clean'],['lint'],['imgmin'],['copy'],['cssmin'],['jsmin'],['htmlRep'],'help',done);
});
/**
 * default task
 */
gulp.task('default', function (done) {
    sequence(['clean'],['lint'],['imgmin'],['cssmin'],['jsmin'],['copy'],['htmlRep'],'help',done);
	
});
gulp.task('watch', function (done) {
    sequence(['auto'],done);
});
/**
 * default task
 */
gulp.task('debug', function (done) {
    sequence(['clean'],['imgmin'],['copy'],['htmlRep'],['copyPluginsRev'],done);
	
});
