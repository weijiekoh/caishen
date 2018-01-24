/**
 * Function that mutates original webpack config.
 * Supports asynchronous changes when promise is returned. 
 * 
 * @param {object} config - original webpack config.
 * @param {object} env - options passed to CLI.
 * @param {WebpackConfigHelpers} helpers - object with useful helpers when
 * working with config.
 **/

export default function (config, env, helpers) {
  // Make style.css an external file
  let extractPlugin = helpers.getPluginsByName(
    config, "ExtractTextPlugin")[0];

  extractPlugin.plugin.options.disable = false;
  console.log(config);

  if (process.env.PREACT_PROD === "true"){
    // Mutate config if in production 
    config.output.publicPath = "/static/";

    // Disable sourcemaps
    let uglifyPlugins = helpers.getPluginsByName(config, "UglifyJsPlugin");
    if (uglifyPlugins.length > 0){
      uglifyPlugins[0].plugin.options.sourceMap = false;
    }
  }
}

