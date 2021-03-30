/* eslint-disable no-param-reassign */
// Override webpack config defaults
export default {
  /**
   * Function that mutates the original webpack config.
   * Supports asynchronous changes when a promise is returned (or it's an async function).
   *
   * @param {object} config - original webpack config.
   * @param {object} env - options passed to the CLI.
   * @param {WebpackConfigHelpers} helpers - object with useful helpers for working with the webpack config.
   * @param {object} options - this is mainly relevant for plugins (will always be empty in the config), default to an empty object
   * */
  webpack(config, env, helpers) {
    const { DEPLOY_SCRIPT } = process.env;
    const { plugin } = helpers.getPluginsByName(config, 'DefinePlugin')[0];
    Object.assign(plugin.definitions, { 'process.env.DEPLOY_SCRIPT': JSON.stringify(DEPLOY_SCRIPT) });

    config.node.process = true;

    // Remove the hash on output files
    config.output.filename = '[name].js';

    // Use UMD for production build
    if (env.production) {
      config.output.libraryTarget = 'umd';
    }

    // Increase budget slightly
    config.performance = {
      maxEntrypointSize: 300000,
      maxAssetSize: 300000,
    };

    // Use only required polyfills
    // babelConfig.presets[1][1].useBuiltIns = 'entry';
    // babelConfig.presets[1][1].corejs = 3;

    // Use any `index` file, not just index.js
    // config.resolve.alias['preact-cli-entrypoint'] = resolve(process.cwd(), 'src', 'index');
  },
};
