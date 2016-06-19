import pkg from './package.json';
import path from 'path';
import { optimize, BannerPlugin, DefinePlugin } from 'webpack';

const bannerTemplate = [
  `${pkg.name} - ${pkg.homepage}`,
  `Version: ${pkg.version}`,
  `Author: ${pkg.author}`
].join('\n');

var production = (process.argv.indexOf('-p') !== -1),
  plugins = [
    new optimize.DedupePlugin(),
    new BannerPlugin(bannerTemplate)
  ],
  entry = [path.join(__dirname, 'src/mi18n.js')];

if (production) {
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
} else {
  entry.unshift('webpack/hot/dev-server', 'webpack-dev-server/client?http://localhost:6060');
}

var webpackConfig = {
  entry: entry,
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: 'dist/',
    filename: 'mi18n.js',
    library: 'mi18n',
    libraryTarget: 'umd',
    umdNamedDefine: true
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
