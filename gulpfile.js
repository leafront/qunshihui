// 引入 gulp
var gulp = require('gulp');

// 引入组件
var htmlmin = require('gulp-htmlmin'), //html压缩
    imagemin = require('gulp-imagemin'),//图片压缩
    pngcrush = require('imagemin-pngcrush'),
    less=require('gulp-less'),//less编译
    minifycss = require('gulp-minify-css'),//css压缩
    amdOptimize = require("amd-optimize"),          //require优化
    jshint = require('gulp-jshint'),//js检测
    uglify = require('gulp-uglify'),//js压缩
    concat = require('gulp-concat'),//文件合并
    rename = require('gulp-rename'),//文件更名
    notify = require('gulp-notify'),//提示信息
    replace = require('gulp-replace'),//替换内容
    header = require('gulp-header'),//添加文件头部内容
    sourcemaps=require('gulp-sourcemaps'),//添加文件映射
    livereload = require('gulp-livereload'),
    clean=require('gulp-clean'),
    useref = require('gulp-useref');
    var date=new Date();
    var year=date.getFullYear();
    var month=date.getMonth()+1;
    var theDate=date.getDate();
    var hours=date.getHours();
    var minutes=date.getMinutes();
    var seconds=date.getSeconds();
    var notes=
    '/*!' + '\n' +
    ' * LastModifyTime: '+date.toLocaleString()+'\n'+
    ' * Copyright(c) 2016 QSH'+'\n'+
    '*/\n';
var dataString=[
    year,
    month>10 ? month :'0'+month,
    theDate>10 ? theDate :'0'+theDate,
    hours>10 ? hours : '0'+hours,
    minutes>10 ? minutes : '0'+minutes,
    seconds>10 ? seconds : '0'+seconds
].join('');

// 压缩html
gulp.task('html',function() {
    return gulp.src(['./**/*.html','./index.html'])
        .pipe(useref())
        .pipe(htmlmin(
            {
                collapseWhitespace: true,
                minifyJS: true
            }
        ))
        .pipe(replace(/\.css\b/g, '.css?v=' + dataString))
        .pipe(replace(/\.js\b/g, '.js?v=' + dataString))
        .pipe(gulp.dest('./dist'))
        .pipe(notify({ message: 'html task ' }));

});

// 压缩图片
gulp.task('img',function() {
    return gulp.src('./images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngcrush()]
        }))
        .pipe(gulp.dest('./dist/images/'))
        .pipe(notify({ message: 'img task ok' }));
});

// 合并、压缩、重命名css
gulp.task('less',function() {
    return gulp.src(['styles/*.less','styles/rest.less'])
        .pipe(less())
        .pipe(minifycss())
        .pipe(header(notes))
        .pipe(gulp.dest('dist/styles'))
        .pipe(notify({ message: 'css task ok' }));
});
/*
 // 检查js
 gulp.task('lint', function() {
 return gulp.src('scripts/!**!/!*.js')
 .pipe(jshint())
 .pipe(jshint.reporter('defauipe(sourcemaps.write())lt'))
 .pipe(notify({ message: 'lint task ok' }));
 });*/

// 清理
gulp.task('clean', function() {
    return gulp.src(['dist/styles', 'dist/scripts', 'dist/images','dist/*.html'], {read: false})
        .pipe(clean());
});

// 合并、压缩js文件
gulp.task('js',function() {
    return gulp.src('scripts/**/*.js')
        //.pipe(concat('main.js'))
        //.pipe(gulp.dest('dist/scripts'))
        //.pipe(rename({ suffix: '.min' }))
        .pipe(replace(/\${\s*version\s*}/gi, dataString))
        .pipe(uglify({
            mangle: {
                except: ['$super', '$', 'exports', 'require', 'module']
            }
        }))
        .pipe(header(notes))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(notify({ message: 'js task ok' }));
});
// 默认任务
gulp.task('default',['clean','less','js','html','img'],function(){
    // 监听html文件变化
    gulp.watch('./*.html', function(){
        gulp.run('html');
    });
    // Watch .css files
    gulp.watch('styles/main.less', ['less'])

    // Watch .js files
    gulp.watch('scripts/**/*.js', ['js']);

    // Watch image files
    gulp.watch('images/*', ['img']);

    var server = livereload();
    gulp.watch('dist/**',function(file){
        livereload.changed(file.path);
    });
});