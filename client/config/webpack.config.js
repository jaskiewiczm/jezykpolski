const webpack = require("webpack");
const path = require("path");
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const { LoaderOptionsPlugin, ContextReplacementPlugin, DefinePlugin } = webpack;

const projectRoot = path.resolve(__dirname, '..', '..');

const environments = [
  'development',
  'production'
];

const loaderBuilders = {
  postcssLoader: (env) => {
    return {
      loader: "postcss-loader",
      options: {
        sourceMap: true,
        plugins: function () {
          return [
            autoprefixer()
          ];
        }
      }
    };
  },
  cssLoader: (env, enableModules) => {
    let localIdentName = "[name]__[local]___[hash:base64:5]";
    if (env === 'production') {
      localIdentName = "[hash:base64]";
    }
    const cssLoaderOptions = {
      importLoaders: 1,
      sourceMap: true,
      minimize: env === 'production',
      modules: enableModules
    };
    if (enableModules) {
      cssLoaderOptions.camelCase = true;
      cssLoaderOptions.localIdentName = localIdentName;
    }
    return {
      loader: "css-loader",
      options: cssLoaderOptions
    };
  },
  sassLoader: (env) => {
    return {
      loader: "sass-loader",
      options: {
        sourceMap: true,
        includePaths: [
          path.join(projectRoot, "client", "scss"),
          path.join(projectRoot, "node_modules")
        ]
      }
    };
  }
};

function getCssLoader(env, enableModules) {
  const extractTextConfig = {
    fallback: 'style-loader',
    use: [
      loaderBuilders.cssLoader(env, enableModules),
      loaderBuilders.postcssLoader(env),
      loaderBuilders.sassLoader(env)
    ]
  };

  return ExtractTextPlugin.extract(extractTextConfig);
}

module.exports = function(env = 'development') {
  if (!environments.includes(env)) {
    throw new Error(`Environment ${env} is not supported.`);
  }

  const webpackConfig = {
    target: 'web',
    entry: {
      bundle: [
        "./client/js/application.js"
      ]
    },
    output: {
      libraryTarget: 'umd',
      path: path.join(projectRoot, "public", "jezykpolski", "dist"),
      filename: "[name].js"
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
      modules: [
        path.join(projectRoot, "client", "js"),
        path.join(projectRoot, "client", "scss"),
        path.join(projectRoot, "node_modules")
      ]
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: 'babel-loader'
        },
        {
          test: /(\.global)?\.s?css/,
          include: /(node_modules\/)|(scss\/)/,
          exclude: /js\//,
          use: getCssLoader(env, false)
        },
        {
          test: /\.s?css$/, /* idea is to only use scoped css for the components */
          exclude: /node_modules/,
          include: /js\//,
          loader: getCssLoader(env, true)
        },
        { // for bootstrap-loader
          test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/,
          use: 'imports-loader?jQuery=jquery'
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          use: [
            'file-loader',
            {
              loader: 'image-webpack-loader',
              options: {
                bypassOnDebug: true, // webpack@1.x
                disable: true, // webpack@2.x and newer
              },
            },
          ],
        }
      ]
    },
    plugins: [
      // new ContextReplacementPlugin(/moment[\/\\]locale/, /en$/), // only include the english locale of momentjs https://github.com/webpack/webpack/issues/59#issuecomment-158029777
      // new DefinePlugin({
      //   'process.env': {
      //     'NODE_ENV': JSON.stringify(env)
      //   }
      // }),
      new ExtractTextPlugin("[name].css")
      // new webpack.ProvidePlugin({
      //     $: "jquery",
      //     jQuery: "jquery"
      // })
    ]
  };

  return webpackConfig;
};
