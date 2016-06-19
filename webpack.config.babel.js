import pkg from './package.json';
import path from 'path';
import { optimize, BannerPlugin, DefinePlugin } from 'webpack';

const bannerTemplate = [
  `${pkg.name} - ${pkg.homepage}`,
  `Version: ${pkg.version}`,
  `Author: ${pkg.author}`
].join('\n');

var production = (process.argv.indexOf('-p') !== -1);
var plugins = [
  new optimize.DedupePlugin(),
  new BannerPlugin(bannerTemplate)
];

if (production) {
  plugins
} else {
  plugins.push(
    new DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new optimize.OccurenceOrderPlugin(),
    new optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  );
}

var webpackConfig = {
  entry: [
    // For hot style updates
    'webpack/hot/dev-server',

    // The script refreshing the browser on none hot updates
    'webpack-dev-server/client?http://localhost:8080',
    path.join(__dirname, 'src/mi18n.js')
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: 'dist/',
    filename: 'index.js'
  },
  module: {
    preLoaders: [{
      test: /\.js?$/,
      loaders: ['eslint'],
      include: 'src/'
    }],
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015'],
        plugins: ['transform-runtime']
      }
    }]
  },
  // devtool: 'source-map',
  plugins: plugins,
  resolve: {
    root: path.join(__dirname, 'src'),
    extensions: ['', '.js'],
    modulesDirectories: ['src', 'node_modules']
  }
};

module.exports = webpackConfig;
