import { Storage } from '@google-cloud/storage';
import ansi from 'ansi-colors';
import log from 'fancy-log';
import fs from 'fs';
import path from 'path';
import semver from 'semver';
import { minify } from 'terser';

import { version } from '../package.json';

const dirs = {
  upload: 'embed',
  build: '../build',
};
const bucketName = 'sajari-public-assets';

class FileUpload {
  constructor(name, latest = false) {
    this.name = name;
    this.isLatest = latest;
  }

  get isLoader() {
    return this.name === 'loader.js';
  }

  get fullPath() {
    return path.resolve(__dirname, `${dirs.build}/${this.name}`);
  }

  get destination() {
    return `embed/${this.isLoader && this.isLatest ? semver.major(version) : version}/${this.name}`;
  }

  get cacheControl() {
    return this.isLoader ? 'no-cache' : 'public, max-age=31536000';
  }
}

const buildLoader = async () =>
  new Promise((resolve, reject) =>
    fs.readFile(path.resolve(__dirname, '../src/loader.js'), 'utf-8', (readError, data) => {
      if (readError) {
        reject(readError);
        return;
      }

      const code = data.replace('{url}', `https://cdn.sajari.com/${dirs.upload}/${version}/bundle.js`);

      minify(code).then((result) => {
        fs.writeFile(path.resolve(__dirname, `${dirs.build}/loader.js`), result.code, (writeError) => {
          if (writeError) {
            reject(writeError);
            return;
          }

          resolve();
        });
      });
    }),
  );

async function main(...args) {
  await buildLoader();

  const [arg] = args;
  const full = arg === '--full';
  const loaderOnly = arg === '--loader-only';
  const files = !loaderOnly
    ? [new FileUpload('loader.js'), new FileUpload('bundle.js'), new FileUpload('bundle.js.map')]
    : [];
  const { GOOGLE_PRIVATE_KEY, GOOGLE_CLIENT_EMAIL } = process.env;

  if (!GOOGLE_PRIVATE_KEY) {
    throw new Error('GOOGLE_PRIVATE_KEY missing');
  }
  if (!GOOGLE_CLIENT_EMAIL) {
    throw new Error('GOOGLE_CLIENT_EMAIL missing');
  }

  if (loaderOnly || full) {
    files.push(new FileUpload('loader.js', true));
  }

  // https://googleapis.dev/nodejs/storage/latest/global.html#StorageOptions
  const storage = new Storage({ credentials: { client_email: GOOGLE_CLIENT_EMAIL, private_key: GOOGLE_PRIVATE_KEY } });

  async function uploadFile(file) {
    const { name, destination, cacheControl, fullPath, isLatest } = file;

    await storage.bucket(bucketName).upload(fullPath, {
      destination,
      gzip: true,
      metadata: {
        cacheControl,
      },
    });

    log(`${ansi.green.bold(isLatest ? `${name} (latest)` : name)} uploaded to ${ansi.cyan(bucketName)}...`);
  }

  files.forEach((file) =>
    uploadFile(file).catch((error) => log(`${ansi.red.bold(`${file.name} failed!`)} ${error.message}`)),
  );
}

main(...process.argv.slice(2));
