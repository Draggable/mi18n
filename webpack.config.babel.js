const pkg = require('./package.json');
const {resolve} = require('path');
const {BannerPlugin} = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');

const PRODUCTION = process.argv.includes('-p');

const bannerTemplate = [
  `${pkg.name} - ${pkg.homepage}`,
  `Version: ${pkg.version}`,
  `Author: ${pkg.author}`
].join('\n');

let plugins = [
  new BabiliPlugin({
    removeDebugger: true
  }, {
    comments: false
  }),
  new BannerPlugin(bannerTemplate),
  new CompressionPlugin({
    asset: '[path].gz[query]',
    algorithm: 'gzip',
    test: /\.(js)$/,
    threshold: 10240,
    minRatio: 0.8
  })
];

const devtool = PRODUCTION ? false : 'source-map';

const webpackConfig = {
  context: resolve(__dirname, 'dist'),
  entry: {
    mi18n: resolve(__dirname, 'src/mi18n.js')
  },
  output: {
    path: resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
    filename: '[name].min.js'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  devtool,
  plugins,
  resolve: {
    modules: [
      resolve(__dirname, 'src'),
      'node_modules'
    ],
    extensions: ['.js', '.json']
  },
  devServer: {
    inline: true,
    contentBase: 'demo/',
    noInfo: true
  }
};

module.exports = webpackConfig;
