var gulp = require("gulp");
var sass = require("gulp-sass");
var config = {
  SRC: './src/js/**/*.js', // js source files to be compiled (or not)
  TARGET: './extension/', // what's given to chrome
  STATIC: './static/**/*', // static assets images, css, third party js
  SASS: './src/sass/**/*.scss', // styles origin
  CSS: './extension/css'
};


gulp.task("main", ["js", "sass", "static"], function(){

});


gulp.task("static", function(){
  return gulp.src(config.STATIC).pipe(gulp.dest(config.TARGET));
});

gulp.task("js", function(){
  return gulp.src(config.SRC).pipe(gulp.dest(config.TARGET+"src/"));
});

gulp.task("sass", function(){
  return gulp.src(config.SASS)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(config.CSS));
});
