const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const watch = require('gulp-watch');
const browserSync = require('browser-sync').create();
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const csso = require('gulp-csso'); 
const rename = require("gulp-rename");

const jsDefault = () => {
    return gulp.src([
        './src/js/scene.js',
        './src/js/function.js',
        './src/js/PickHelper.js'
    ])
        .pipe(gulp.dest('./build/js'));
};

const cssDefault = () => {
    return gulp.src([
        './src/assets/css/style.css'
    ])
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(csso())
        .pipe(rename("style.min.css"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/assets/styles/'));
};

gulp.task('clean', () => {
    return del('./build');
});

gulp.task('move', () => {
    return gulp.src([
        './src/*.html',
    ])
        .pipe(gulp.dest('./build'));
});

gulp.task('moveFBX', () => {
    return gulp.src([
        './src/assets/fbx/*.fbx',
    ])
        .pipe(gulp.dest('./build/assets/fbx'));
});

gulp.task('images', () => {
    return gulp.src('./src/assets/img/**/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('./build/assets/img'));
});

gulp.task('compile', gulp.series(cssDefault, 'moveFBX', 'images', jsDefault, 'move'));


gulp.task('server', () => {
    browserSync.init({
        server: {
            baseDir: "./build",
            routes: {
                "/node_modules": "node_modules"
            }
        },
        watch: true
    });
    watch(['./src/index.html'], gulp.series('move'));
    watch(['./src/assets/fbx/*.fbx'], gulp.series('moveFBX'));
    watch('./src/assets/styles/css/*.css', gulp.series(cssDefault));
    watch('./src/js/**/*.js', jsDefault);
    watch('./src/img/**/*.*', 'images');
});

gulp.task('start', gulp.series('clean', 'compile', 'server'));