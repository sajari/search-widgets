// ==========================================================================
// Gulp deployment script
// Deploys the built files from /build to S3
// ==========================================================================

const gulp = require('gulp');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const babel = require('gulp-babel');
const publish = require('gulp-awspublish');
const aws = require('aws-sdk');
const semver = require('semver');
const terser = require('gulp-terser');
const log = require('fancy-log');
const ansi = require('ansi-colors');
const pkg = require('./package.json');

// Get AWS config
const publisher = publish.create({
  region: 'us-east-1',
  params: {
    Bucket: 'cdn.potts.es',
  },
  credentials: new aws.SharedIniFileCredentials(),
});

const domain = 'cdn.potts.es';
const directory = '/shopify/';
const { version } = pkg;

const src = {
  bundle: './build/bundle.*',
  loader: './src/loader.js',
};

// Upload options
const cacheTime = 31536000; // 1 year
const getHeaders = (cached = true) => ({
  'Cache-Control': cached ? `max-age=${cacheTime}` : 'no-cache',
});

// URL regex
// const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

// Babel v7
const transpile = babel({
  sourceType: 'script',
  babelrc: false,
  presets: ['@babel/env'],
});

const terserOptions = {
  ecma: 8,
  safari10: true,
};

const getBundleUrl = (type = 'js') => `https://${domain}${directory}${pkg.version}/bundle.${type}`;

// Publish version to CDN bucket
gulp.task('deploy:bundle', () => {
  if (!publisher) {
    throw new Error('No publisher instance. Check AWS configuration.');
  }

  log(`Uploading ${ansi.green.bold(pkg.version)} to ${ansi.cyan(domain)}...`);

  // Upload to CDN
  return gulp
    .src(src.bundle)
    .on('error', log)
    .pipe(
      rename((p) => {
        p.dirname = `${directory}${p.dirname.replace('.', pkg.version)}`;
      }),
    )
    .pipe(publisher.publish(getHeaders()))
    .pipe(publish.reporter());
});

// Update loader.js
gulp.task('deploy:loader', () => {
  if (!publisher) {
    throw new Error('No publisher instance. Check AWS configuration.');
  }

  log(`Building 'loader.js' to point to ${ansi.green.bold(pkg.version)}...`);

  // Upload to CDN
  return gulp
    .src(src.loader)
    .on('error', log)
    .pipe(replace('{js-url}', getBundleUrl('js')))
    .pipe(replace('{css-url}', getBundleUrl('css')))
    .pipe(transpile)
    .pipe(terser(terserOptions))
    .pipe(
      rename((p) => {
        p.dirname = `${directory}${p.dirname.replace('.', version)}`;
      }),
    )
    .pipe(publisher.publish(getHeaders()))
    .pipe(publish.reporter());
});

gulp.task('deploy:latest', () => {
  if (!publisher) {
    throw new Error('No publisher instance. Check AWS configuration.');
  }

  const headers = getHeaders(false);

  log(`Updating major version 'loader.js' to point to ${ansi.green.bold(pkg.version)}...`);

  // Upload to CDN
  return gulp
    .src(src.loader)
    .on('error', log)
    .pipe(replace('{js-url}', getBundleUrl('js')))
    .pipe(replace('{css-url}', getBundleUrl('css')))
    .pipe(transpile)
    .pipe(terser(terserOptions))
    .pipe(
      rename((p) => {
        p.dirname = `${directory}${semver.major(version)}`;
      }),
    )
    .pipe(publisher.publish(headers, { force: true }))
    .pipe(publish.reporter());
});

// Deploy everything
gulp.task('deploy', gulp.parallel('deploy:bundle', 'deploy:loader'));
