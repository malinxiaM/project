const gulp = require("gulp");
const connect = require("gulp-connect");
const proxy = require("http-proxy-middleware");
//压缩插件
const uglify = require('gulp-uglify');
const pump = require('pump');
//代码es6 转码 => es5, 压缩
const babel = require('gulp-babel');
//css压缩
const cleanCSS = require('gulp-clean-css');

//路径列表
const srclist = {
    "scripts" :{
        "src" :'./src/scripts/*.js',
        "dest" : "./dist/scripts" 
    },
    "css" : {
        "src" : './src/styles/*.css',
        "dest" : "./dist/styles"
    }
}

gulp.task('minify-css', () => {
    return gulp.src(srclist.css.src)
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(srclist.css.dest));
});

//代码压缩，
gulp.task('compress', function (cb) {
    pump([
          gulp.src(srclist.scripts.src),
          //进行ES6的编译
          babel({
                presets: ['@babel/env']
          }),
          uglify(),
          gulp.dest(srclist.scripts.dest)
      ],
      cb
    );
  });

  //打包
  gulp.task("build",["compress"])
//方便维护的代理表格
const proxyList = [
    // /proxydouban => web 端发起请求时带油的一个小标记，这个标记是自定义的
    proxy("/proxydouban",{
        //由服务器发起请求的目标
        target : "https://api.douban.com:443",
        //是否重定向源,默认一定为true;
        changeOrigin:true,
        //表示路径中的某些标记要清除掉。
        pathRewrite:{
            "/proxydouban" : ""
        }
    })
]
gulp .task("connect",()=>{
    connect.server({
        port:8888,
        root:"./dist",
        livereload:true,
        middleware: function(connect, opt) {
            return proxyList
      }
    });
})

gulp.task("html",()=>{
    return gulp.src("./src/html/*.html")
        .pipe(gulp.dest("./dist/"))
        .pipe(connect.reload());
})


//开发时
gulp.task("js",()=>{
    return gulp.src("./src/scripts/*.js")
        .pipe(gulp.dest(srclist.scripts.dest))
        .pipe(connect.reload());
})
gulp.task("watch",()=>{
    gulp.watch("./src/html/*.html",["html"]);
    gulp.watch("./src/scripts/*.js",["js"]);
})
//调试环境;
//配置环境开启的指令；
gulp.task("default",["watch","connect"]);