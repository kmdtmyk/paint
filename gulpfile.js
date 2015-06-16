var gulp = require("gulp");
var coffee = require("gulp-coffee");
var babel = require("gulp-babel");
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var plumber = require("gulp-plumber");
// var header = require("gulp-header");

var webserver = require("gulp-webserver");

var pkg = require("./package.json");
// var imagemin = require("gulp-imagemin");

gulp.task("html", function(){
	gulp.src("./src/**/*.html")
		.pipe(gulp.dest("./dist"));
});

gulp.task("coffee", function(){
	gulp.src("./src/**/*.coffee")
		.pipe(plumber())
		.pipe(coffee())
		.pipe(gulp.dest("./dist"));
});

gulp.task("es6", function(){
	gulp.src("./src/**/*.es6")
		.pipe(plumber())
		.pipe(babel())
		.pipe(gulp.dest("./dist"));
});

gulp.task("css", function(){
	gulp.src("./src/**/*.css")
		.pipe(gulp.dest("./dist"));
});

gulp.task("scss", function(){
	gulp.src("./src/**/*.scss")
		.pipe(plumber())
		.pipe(sass())
		.pipe(gulp.dest("./dist"));
});

gulp.task("webserver", function(){
	gulp.src("./dist")
		.pipe(
			webserver({
				host: "0.0.0.0",
				livereload: true
			})
		);
});

gulp.task("watch", function(){
	gulp.watch("./src/**/*.html", ["html"]);
	gulp.watch("./src/**/*.coffee", ["coffee"]);
	gulp.watch("./src/**/*.es6", ["es6"]);
	gulp.watch("./src/**/*.css", ["css"]);
	gulp.watch("./src/**/*.scss", ["scss"]);
});


gulp.task("default", ["html", "coffee"]);
gulp.task("start", ["watch", "webserver"]);

