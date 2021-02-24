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
  const latest = arg === '--latest';
  const files = ['loader.js'];
  const { GOOGLE_PRIVATE_KEY, GOOGLE_CLIENT_EMAIL } = process.env;

  if (!GOOGLE_PRIVATE_KEY) {
    throw new Error('GOOGLE_PRIVATE_KEY missing');
  }

  if (!GOOGLE_CLIENT_EMAIL) {
    throw new Error('GOOGLE_CLIENT_EMAIL missing');
  }

  if (!latest) {
    files.push('bundle.js', 'bundle.js.map');
  }

  // https://googleapis.dev/nodejs/storage/latest/global.html#StorageOptions
  const storage = new Storage({ credentials: { client_email: GOOGLE_CLIENT_EMAIL, private_key: GOOGLE_PRIVATE_KEY } });

  async function uploadFile(file) {
    const name = path.basename(file);
    const isLoader = name === 'loader.js';

    await storage.bucket(bucketName).upload(path.resolve(__dirname, file), {
      destination: `embed/${isLoader && latest ? semver.major(version) : version}/${name}`,
      gzip: true,
      metadata: {
        cacheControl: isLoader ? 'no-cache' : 'public, max-age=31536000',
      },
    });

    log(`${ansi.green.bold(name)} uploaded to ${ansi.cyan(bucketName)}...`);
  }

  files
    .map((f) => `${dirs.build}/${f}`)
    .forEach((file) =>
      uploadFile(file).catch((error) => log(`${ansi.red.bold(`${path.basename(file)} failed!`)} ${error.message}`)),
    );
}

main(...process.argv.slice(2));
