import pkg from './package.json';
import {resolve} from 'path';
import CompressionPlugin from 'compression-webpack-plugin';
import ClosureCompilerPlugin from 'webpack-closure-compiler';
import {optimize, BannerPlugin} from 'webpack';
const PRODUCTION = process.argv.includes('-p');

const bannerTemplate = [
  `${pkg.name} - ${pkg.homepage}`,
  `Version: ${pkg.version}`,
  `Author: ${pkg.author}`
].join('\n');

let plugins = [
  new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js)$/,
      threshold: 10240,
      minRatio: 0.8
    }),
  new optimize.UglifyJsPlugin({
    compress: {warnings: false},
    comments: false
  }),
  new ClosureCompilerPlugin({
    compiler: {
      language_in: 'ECMASCRIPT6',
      language_out: 'ECMASCRIPT5',
      compilation_level: 'ADVANCED'
    },
    concurrency: 3,
  }),
  new BannerPlugin(bannerTemplate)
];

const devtool = PRODUCTION ? false : 'source-map';

const webpackConfig = {
  context: resolve(__dirname, 'dist'),
  entry: [
    'babel-regenerator-runtime',
    resolve(__dirname, 'src/mi18n.js')
  ],
  output: {
    path: resolve(__dirname, 'dist'),
    publicPath: 'dist/',
    library: 'mi18n',
    libraryTarget: 'commonjs2',
    filename: 'mi18n.min.js'
  },
  module: {
    rules: [
    {
      enforce: 'pre',
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  devtool,
  plugins,
  resolve: {
    modules: [
      resolve(__dirname, 'src'),
      'node_modules'
    ],
    extensions: ['.js', '.scss']
  },
  devServer: {
    inline: true,
    contentBase: 'demo/',
    noInfo: true
  }
};

module.exports = webpackConfig;
