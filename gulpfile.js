var gulp = require('gulp')
var webpack = require('webpack-stream')

gulp.task('default', function(){
  gulp.watch("index.js", ['webpack']);
});

gulp.task('webpack', function() {
  return gulp.src('index.js')
  .pipe(webpack( require('./webpack.config.js') ))
  .pipe(gulp.dest(__dirname));
})
