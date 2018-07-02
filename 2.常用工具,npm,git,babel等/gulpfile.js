const gulp = require("gulp");
const babel = require("gulp-babel");
gulp.task("watch", function () {
    console.log("hello world ,hello gulp");
    //gulp.src("es6/**/*.js").pipe(babel()).pipe(gulp.dest("dist"));
    gulp.src("public/es6/**/*.js").pipe(babel()).pipe(gulp.dest("public/dist"));
});

gulp.task("default", function () {
    gulp.watch("public/es6/**/*.js", ["watch"]);
});