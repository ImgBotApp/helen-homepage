var gulp = require('gulp'),
		sass = require('gulp-sass'),
		browserSync = require('browser-sync'),
		concat = require('gulp-concat'),
		uglify = require('gulp-uglify'),
		del = require('del'),
		imagemin = require('gulp-imagemin'),
		cache = require('gulp-cache'),
		autoprefixer = require('gulp-autoprefixer'),
		notify = require('gulp-notify');

gulp.task('sass', function() {
	return gulp.src('app/sass/**/*.sass')
		.pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
		.pipe(autoprefixer('last 15 versions'))
		.pipe(gulp.dest('app/css/'))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js'
		])
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'));
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

gulp.task('removedist', function() {
	return del.sync('dist');
});

gulp.task('clearcache', function () { 
	return cache.clearAll(); 
});

gulp.task('watch', ['browser-sync', 'sass', 'scripts'], function() {
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('imagemin', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin()))
	.pipe(gulp.dest('dist/img')); 
});

gulp.task('build', ['removedist', 'imagemin', 'sass', 'scripts'], function() {

	var buildCss = gulp.src('app/css/main.css')
		.pipe(gulp.dest('dist/css'));

	var buildFonts = gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'));

	var buildJs = gulp.src('app/js/**/*')
		.pipe(gulp.dest('dist/js'));

	var buildHtml = gulp.src('app/*.html')
		.pipe(gulp.dest('dist'));

});

gulp.task('default', ['watch']);