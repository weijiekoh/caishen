const gulp = require('gulp');
const shell = require('gulp-shell');

// The default task is to deploy
// build-prod and exists.
gulp.task('default', ['build-prod']);

gulp.task('static', shell.task([
  'rm -rf ./project/static/',
  'mkdir -p ./project/static/',
  'mkdir -p ./app/frontend/images ./app/frontend/favicons',
  'cp -r ./app/frontend/images ./project/static/images',
  'cp -r ./app/frontend/favicons ./project/static/favicons',
  'cp -r ./app/frontend/fonts ./project/static/fonts',
]));

// Run preact build in production mode, and delete JS sourcemaps
gulp.task('build-prod', shell.task([
    'cd app/frontend && nwb build --no-vendor --no-html --config nwb.config.js',
    'echo "Deleting sourcemaps..."',
    'rm -rf ./app/frontend/dist/*.map',
    'echo "Renaming output files..."',
    'rm -rf ./project/static/',
    'mkdir -p ./project/static/',
    'rm -rf ./project/static/index.html',
    'mv ./app/frontend/dist/* ./project/static/',
    'rm -rf ./app/frontend/dist/',
    'mv ./project/static/app.*.js ./project/static/app.js',
    'echo "Copying images..."',
    'mkdir -p ./app/frontend/images ./app/frontend/favicons',
    'cp -r ./app/frontend/images ./project/static/images',
    'cp -r ./app/frontend/favicons ./project/static/favicons',
    'cp -r ./app/frontend/fonts ./project/static/fonts',
],
  {
    env: {
      NODE_ENV: "production",
    }
  }
));

