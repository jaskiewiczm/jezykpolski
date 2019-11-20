const webpack = require("webpack");
const path = require("path");
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { LoaderOptionsPlugin, ContextReplacementPlugin, DefinePlugin } = webpack;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


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
          test: /\.jsx?/,
          exclude: /node_modules/,
          use: 'babel-loader'
        },
        {
          test: /\.(css|sass|scss)$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'sass-loader',
          ],
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
        ignoreOrder: false, // Enable to remove warnings about conflicting order
      }),
      new BundleAnalyzerPlugin()
    ]
  };

  return webpackConfig;
};
