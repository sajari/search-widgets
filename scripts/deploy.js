import { Storage } from '@google-cloud/storage';
import ansi from 'ansi-colors';
import log from 'fancy-log';
import fs from 'fs';
import path from 'path';
import semver from 'semver';
import { minify } from 'terser';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { version } from '../package.json';

const dirs = {
  upload: 'embed',
  build: '../build',
};
const bucketName = 'sajari-public-assets';

class FileUpload {
  constructor(name, latest = false, loaderVersion) {
    this.name = name;
    this.isLatest = latest;
    this.loaderVersion = loaderVersion;
    this.staging = false;
  }

  setStaging() {
    this.staging = true;
  }

  get isLoader() {
    return this.name === 'loader.js';
  }

  get fullPath() {
    return path.resolve(__dirname, `${dirs.build}/${this.name}`);
  }

  get destination() {
    let targetVersion = this.isLoader && this.isLatest ? semver.major(version) : version;
    if (this.loaderVersion) {
      targetVersion = this.loaderVersion;
    }
    if (this.staging) {
      targetVersion = 'staging';
    }
    return `embed/${targetVersion}/${this.name}`;
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

async function main({ full, loaderOnly, staging }) {
  await buildLoader();
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

  // Edge case: due to an incident from a major bump, we’d want the loader CDN link v1 to point to v2 of the bundle
  // (so that existing users won’t have to update the CDN link)
  // https://cdn.sajari.com/embed/1/loader.js -> https://cdn.sajari.com/embed/2.x.x/bundle.js
  if (semver.major(version) === 2) {
    files.push(new FileUpload('loader.js', true, '1'));
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

    log(
      `${ansi.green.bold(isLatest ? `${name} (latest)` : name)} uploaded to ${ansi.cyan(bucketName)} ${
        staging && ' staging'
      }...`,
    );
  }

  files.forEach((file) => {
    if (staging) {
      file.setStaging();
    }
    uploadFile(file).catch((error) => log(`${ansi.red.bold(`${file.name} failed!`)} ${error.message}`));
  });
}

main(yargs(hideBin(process.argv)).argv);
