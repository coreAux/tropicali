const { series, parallel, watch, src, dest, task } = require("gulp")

// CSS
//const sass = require('gulp-sass')
const postCSS = require('gulp-postcss')
const cleanCSS = require('gulp-clean-css')
const sourcemaps = require('gulp-sourcemaps')
const concat = require('gulp-concat')

// Browser refresh
const browserSync = require('browser-sync').create()

// Images
const imagemin = require('gulp-imagemin')

// Github
const ghpages = require('gh-pages')

//sass.compiler = require('node-sass')

function myCssFunction() {
    // we want to run "sass css/app.scss app.css --watch"
    return src([
        "src/css/reset.css",
        "src/css/typography.css",
        "src/css/app.css"
    ])
        .pipe(sourcemaps.init())
        .pipe(
            postCSS([
                require('postcss-preset-env')({
                    stage: 1,
                    browsers: ['IE 11', 'last 2 versions']
                }),
                require('autoprefixer')
            ])
        )
//        .pipe(sass())
        .pipe(concat('app.css'))
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
    watch("src/css/*", series(myCssFunction))
    watch("src/fonts/*", series(fonts))
    watch("src/img/*", series(images))
}

function gitDeploy(cb) {
    ghpages.publish("dist", cb())
}

exports.build = series(html, myCssFunction, fonts, images, watchSass)
exports.default = series(html, myCssFunction, fonts, images, watchSass)
exports.deploy = series(gitDeploy)
