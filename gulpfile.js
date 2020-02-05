const { series, watch, src, dest, task } = require("gulp")

const gulp = require('gulp')
const sass = require('gulp-sass')
const cleanCSS = require('gulp-clean-css')
const sourcemaps = require('gulp-sourcemaps')

const browserSync = require('browser-sync').create()

const imagemin = require('gulp-imagemin')

const ghpages = require('gh-pages')

sass.compiler = require('node-sass')

function mySassFunction() {
    // we want to run "sass css/app.scss app.css --watch"
    return src("src/css/app.scss")
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(
            cleanCSS({
                compatibility: 'ie8'
            })
        )
        .pipe(sourcemaps.write())
        .pipe(dest("dist"))
        .pipe(browserSync.stream())
}

function html(){
    return src("src/*.html")
        .pipe(dest("dist"))
}

function fonts(){
    return src("src/fonts/*")
        .pipe(dest("dist/fonts"))
}

function images(){
    return src("src/img/*")
        .pipe(imagemin())
        .pipe(dest("dist/img"))
}

function watchSass() {
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    })
    watch("src/*.html", series(html)).on("change", browserSync.reload)
    watch("src/css/app.scss", series(mySassFunction))
    watch("src/fonts/*", series(fonts))
    watch("src/img/*", series(images))
}

function gitDeploy(cb) {
    ghpages.publish('dist', cb())
}

exports.build = series(html, mySassFunction, fonts, images, watchSass)
exports.default = series(html, mySassFunction, fonts, images, watchSass)
exports.deploy = series(gitDeploy)
task(html)
task(mySassFunction)
task(fonts)
task(images)
task(watchSass)
task(gitDeploy)
