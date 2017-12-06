'use strict';
//需要导入的文件
var gulp = require('gulp'),
	del = require('del'),
	watch = require('gulp-watch'), //监听文件变化
    browserSync = require('browser-sync').create(),
    rev = require('gulp-rev'),
//  revAll = require('gulp-rev-all'),
    revCollector = require('gulp-rev-collector'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
//    useref = require('gulp-useref'),
//    htmlmin = require('gulp-htmlmin');
    cssnano = require('gulp-cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	csslint = require('gulp-csslint'),//检查css有无报错或警告
	csslintstylish = require('csslint-stylish'),//
    uglify = require('gulp-uglify'),
// 	rename = require('gulp-rename');//重命名
    sequence = require('run-sequence'),
 	gReplace=require('gulp-replace'),
	notify = require('gulp-notify'),//加控制台文字描述用的
	gutil = require("gulp-util"), // 一个工具库
	plumber = require("gulp-plumber"), // 自动处理全部错误信息防止因为错误而导致 watch 不正常工作
    imagemin = require('gulp-imagemin'),
	spriter = require('gulp-css-spriter'),
	sftpConfig= require('./sftp-config'), 
	sftp    = require('gulp-sftp'),
	gtar = require('gulp-tar'),
	gzip =require('gulp-gzip'),//压缩,打包
 	pngquant = require('imagemin-pngquant'); //png图片压缩插件
	
// 管理资源文件路径集合
var config = {},
	sourcePath="D:/2016.09.18/xxxx/src/main/webapp/WEB-INF",
	compilePath="D:/2016.09.18/xxxx/src/main/webapp/WEB-INF/";


// 源资源文件路径
config.assets = {
    global: sourcePath+'/*.*',
    static: sourcePath+'/public',
    sass: sourcePath+'/public/sass/**.*',
    css: sourcePath+'/public/css/*.*',
    css_files: sourcePath+'/public/css/**/*',
    font: sourcePath+'/public/fonts/*.*',
    img: sourcePath+'/public/img/*.*',
    _img:sourcePath+'/public/img/**',
    js: sourcePath+'/public/js/*.*',
    js_files: sourcePath+'/public/js/**',
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
    rev_json: compilePath+'_rev'
};
// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.Format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
};


var remoteServer = {
    host: sftpConfig.sftp.host,
	port:sftpConfig.sftp.port,
    user: sftpConfig.sftp.user,
	remotePlatform:'unix',
	remotePath: sftpConfig.sftp.remotePath+"/"+new Date().Format("yyyy-MM-dd-hh:mm:ss"),
    pass: sftpConfig.sftp.pass
};


// 编译sass
/**gulp.task('sass', function () {
    return sass([sourcePath+'/public/sass/common.scss',sourcePath+'/public/sass/user/*.scss'])
        .on('error', sass.logError)
        .pipe(gulp.dest(compilePath+'/public/css'));
});*/

/**
 * Clean task 清空编译后的文件
 */
gulp.task('clean', function () {
   return  del([compilePath+'_public/',compilePath+'_templates/',compilePath+'_rev/',compilePath+'dist',compilePath+'export']);
});

gulp.task('lastRemoveRev', function () {
	   return  del(compilePath+'_rev/');
});

/**
 * Lint task js语法检查
 */
gulp.task('jslint', function () {
    return  gulp.src([config.assets.js, config.assets.js_files + '/*.js', 'gulpfile.js'])
        //检测JS风格
		.pipe(plumber())
		.on('error', gutil.log)
		.pipe(jshint({
			"undef": true,
			"unused": true
		}))
		.pipe(jshint()).pipe(notify(function (file) {
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
    }))
	.pipe(jshint.reporter(stylish));   //高亮提示;
});
// 检查css
gulp.task('csslint', function() {
    return gulp.src([config.assets.css, config.assets.css_files + '**/*.css'])
			.pipe(plumber())
			.on('error', gutil.log)
			.pipe(csslint({
			    'shorthand': false
			}))
			.on('error', gutil.log)
			.pipe(plumber.stop())
			.pipe(csslint.formatter(csslintstylish));
});


//gulp.task('lint', ['jslint','csslint']);
gulp.task('lint', ['jslint']);

gulp.task('imgmin', function () {
    return gulp.src(config.assets._img)
		.pipe(plumber())
		.on('error', gutil.log)
		.pipe(imagemin({
			optimizationLevel: 7, //类型：Number  默认：3  取值范围：0-7（优化等级）
			progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
			interlaced: false, //类型：Boolean 默认：false 隔行扫描gif进行渲染
			multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
			use: [pngquant()] //使用pngquant来压缩png图片
        }))
		.pipe(rev())
        .pipe(gulp.dest(config.dist.img))
		.pipe(rev.manifest())
		 .pipe(gulp.dest(config.dist.rev_json+"/img/"));
});


/**
 * Copy task
 */
gulp.task('copyFonts', function () {
	return gulp.src(sourcePath+'/public/fonts/**')
		.pipe(plumber())
		.on('error', gutil.log)
		.pipe(rev())
        .pipe(gulp.dest(config.dist.font))
		.pipe(rev.manifest())
		.pipe(gulp.dest(config.dist.rev_json+"/fonts/"));	
});

gulp.task('copyPlugins', function () {
	  return gulp.src([config.dist.rev_json+'/**/rev-manifest.json','!'+config.assets.plugins+'/**/.css','!'+config.assets.plugins+'/**/.js','!'+config.assets.plugins+'/laydate/**','!'+config.assets.plugins+'/layer-v3.0.1/**','!'+config.assets.plugins+'/**/*.{svg,ttf,woff,eot,otf}','!'+ config.assets.plugins+'/**/*.{png,gif,jpg}','!'+config.assets.plugins+'/**/**/*.js',config.assets.plugins])
		 .pipe(plumber())
		 .on('error', gutil.log)
		 .pipe(revCollector({
            replaceReved: true
        }))	
		.pipe(rev())
		.pipe(gulp.dest(config.dist.plugins))
		.pipe(rev.manifest())
		.pipe(gulp.dest(config.dist.rev_json+"/plugins/"));
});
gulp.task('copyPluginsRevOther',function () {
	 return  gulp.src([config.assets.plugins+'/**/*.{svg,ttf,woff,eot,otf}',config.assets.plugins+'/**/*.{png,gif,jpg}',config.assets.plugins+'/laydate/**',config.assets.plugins+'/layer-v3.0.1/**'])
		.pipe(plumber())
		.on('error', gutil.log)	
		.pipe(gulp.dest(config.dist.plugins));
		
});
gulp.task('copyPluginsRevCss',function () {
	 return  gulp.src([config.dist.rev_json+'/plugins/rev-manifest.json',config.assets.plugins+'/**/*.css',config.assets.plugins+'/**/**/*.css','!'+config.assets.plugins+'/laydate/**','!'+config.assets.plugins+'/layer-v3.0.1/**'])
		.pipe(plumber())
		.on('error', gutil.log)	
		.pipe(revCollector({
            replaceReved: true
        }))
		//.pipe(cssClean({compatibility: 'ie9'}))
		//.pipe(sourcemaps.init())
		//.pipe(cssnano({safe: true}))
       // .pipe(sourcemaps.write('.'))
		.pipe(rev())
		.pipe(gulp.dest(config.dist.plugins))
		.pipe(rev.manifest())
		.pipe(gulp.dest(config.dist.rev_json+"/revPluginsCss/"));
		
});
gulp.task('copyPluginsRevJs',function () {
	 return  gulp.src([config.dist.rev_json+'/**/rev-manifest.json',config.assets.plugins+'/**/*.js',config.assets.plugins+'/**/**/*.js'])
		 .pipe(plumber())
		 .on('error', gutil.log)
		 .pipe(revCollector({
            replaceReved: true
        }))
		.pipe(uglify().on('error', function(e){
            console.log(e);
         }))
		.pipe(rev())
		.pipe(gulp.dest(config.dist.plugins))
		.pipe(rev.manifest())
		.pipe(gulp.dest(config.dist.rev_json+"/revPluginsJs/"));
		
});

//gulp.task('copy',['copyFonts','copyPlugins','copyPluginsRevCss']);

gulp.task('copy', function (cp) {
    sequence(['copyPlugins'],['copyPluginsRevOther'],['copyPluginsRevCss'],['copyPluginsRevJs'],cp);
});

gulp.task('cssmin', function () {
    return gulp.src([config.dist.rev_json+'/**/rev-manifest.json',config.assets.css,config.assets.css_files])
		.pipe(plumber())
		.on('error', gutil.log)
		.pipe(revCollector({
			replaceReved: true
		}))
		.pipe(autoprefixer({
			browsers: [
				'ie >= 9',
			 ],
			 cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true  
		}))
		//.pipe(plumber(errrHandler))
		.pipe(cssnano({safe: true}))
		//.pipe(cssClean({compatibility: 'ie9'}))
		.pipe(rev())
        .pipe(gulp.dest(config.dist.css))
		.pipe(rev.manifest())
		.pipe(gulp.dest(config.dist.rev_json+"/css/"))
		.pipe(notify({ message: 'css压缩构建已完成' }));
        //.pipe(browserSync.stream());
});
gulp.task('jsmin', function () {
    return gulp.src([config.dist.rev_json+'/**/rev-manifest.json',config.assets.js, config.assets.js_files])
		.pipe(plumber())
		.on('error', gutil.log)
		.pipe(revCollector({
			replaceReved: true
		}))
		//.pipe(plumber(errrHandler))
		.pipe(uglify().on('error', function(e){
            console.log(e);
         }))
		.pipe(rev())
        .pipe(gulp.dest(config.dist.js))
		.pipe(rev.manifest())
		.pipe(gulp.dest(config.dist.rev_json+"/js/"))
		//.pipe(notify({ message: 'js压缩构建已完成' }))
		.pipe(notify({ message: '自动化构建已完成，按 Ctrl + C 结束构建命令' }));
});

//.pipe(gReplace("${base.contextPath}/public", "${base.contextPath}/_public"))
gulp.task('htmlRep', function () { 
    return  gulp.src([config.dist.rev_json+'/**/rev-manifest.json',config.assets.html,config.assets.html2])
		.pipe(plumber())
		.on('error', gutil.log)
		.pipe(revCollector({
			replaceReved: true
		}))
		//.pipe(gReplace("${base.contextPath}/public", "../public"))
		//.pipe(htmlmin())
		//.pipe(gReplace("../_public", "${base.contextPath}/public"))
        .pipe(gulp.dest(config.dist.html));
});

gulp.task('serve', function () {
    browserSync.init({
        files: "**", //监听整个项目
        server: {
            baseDir: [config.assets.global,config.assets.html,config.dist.global,config.assets.html2,config.assets.static+"/**"],
            index: config.assets.html+"/index.html"
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

//命令行使用gulp watch启动;

gulp.task('watch', function () {
	
	gulp.watch([config.assets.html, config.assets.html2], ['htmlRep']);
    
	gulp.watch([config.assets.js, config.assets.js_files],['jsmin'],['htmlRep']);

    gulp.watch([config.assets.css, config.assets.css_files], ['cssmin'],['htmlRep']);
    
	gulp.watch(config.assets.img, ['imgmin'],['htmlRep']);
   // gulp.watch('dist/**/*').on('change', browserSync.reload);
   
});
/**
 * Clean dist文件 清空编译后的文件
 */
gulp.task('clsOnlyDist', function () {
   return  del([compilePath+'dist']);
});
gulp.task('copyPublicToDist', function () {
   return  gulp.src(compilePath+'_public/**')
		   .pipe(plumber())
		   .on('error', gutil.log)
		   .pipe(gulp.dest(compilePath+'dist/_public'));
});
gulp.task('copyTemplatesToDist', function () {
   return  gulp.src(compilePath+'_templates/**')
		   .pipe(plumber())
		   .on('error', gutil.log)
		   .pipe(gulp.dest(compilePath+'dist/_templates'));
});
gulp.task('exportTarGz', function() {
    return gulp.src(compilePath+'dist/**')
         .pipe(plumber())
		 .on('error', gutil.log)
		 .pipe(gtar('export.tar'))
         .pipe(gzip())
        .pipe(gulp.dest(compilePath+'export'));
});
//上传到219服务器
gulp.task('upload219', function () {
    return gulp.src(compilePath+'export/**')
        .pipe(plumber())
		.on('error', gutil.log)
		.pipe(sftp(remoteServer))
		.pipe(notify({ message: '上传已完成！！！！！' }));
});
//重新打包压缩构建后的代码，压缩成tar.gz包
gulp.task('newExportPackage', function (done) {
    sequence(['clsOnlyDist'],['copyPublicToDist'],['copyTemplatesToDist'],['exportTarGz'],['clsOnlyDist'],done);
	
});
//重新打包并上传
gulp.task('copyUpload', function (done) {
    sequence(['newExportPackage'],['upload219'],done);
	
});
// 说明
gulp.task('help',function () {
	console.log('******************************************************');
	console.log('*   # 开发监控，不监听改动                           *');
    console.log('*     - gulp                                         *');
    console.log('*                                                    *');
    console.log('*   # 开发监控，监听css,js.html改动                  *');
    console.log('*     - gulp watch                                   *');
    console.log('*                                                    *');
    console.log('*   # 开发监控，浏览器自动刷新，不监听js改动         *');
    console.log('*     - gulp serve                                   *');
    console.log('*                                                    *');
    console.log('*   # 构建开发代码，启动开发模式                     *');
    console.log('*     - gulp build                                   *');
	console.log('*                                                    *');
	console.log('*   # 重新打包压缩构建后的代码，压缩成tar.gz包       *');
    console.log('*     - gulp       newExportPackage                  *');
	console.log('*                                                    *');
	console.log('*   # 上传到xxx服务器                                *');
    console.log('*     - gulp       uploadxxx                        *');
	console.log('*                                                    *');
	console.log('*   # 自动化构建已完成，按 Ctrl + C 结束构建命令     *');
    console.log('*     - Ctrl + C                                     *');
    console.log('******************************************************');
});
/**
 * Clean _rev文件 清空编译后的文件
 */
gulp.task('clsOnly_Rev', function () {
   return  del([compilePath+'_rev']);
});
// 发布
gulp.task('build', function(done) {
  sequence(['clean'],['lint'],['imgmin'],['copy'],['cssmin'],['jsmin'],['htmlRep'],'help',['watch'],'serve',done);
});
/**
 * default task
 */
gulp.task('default', function (done) {
    sequence(['clean'],['imgmin'],['copy'],['cssmin'],['jsmin'],['htmlRep'],'help',['clsOnly_Rev'],done);
	
});
