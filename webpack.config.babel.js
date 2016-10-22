import pkg from './package.json';
import path from 'path';
import {optimize, BannerPlugin, DefinePlugin} from 'webpack';

const bannerTemplate = [
  `${pkg.name} - ${pkg.homepage}`,
  `Version: ${pkg.version}`,
  `Author: ${pkg.author}`
].join('\n');

const development = (process.argv.indexOf('-d') !== -1);
let plugins = [
  new optimize.DedupePlugin(),
  new optimize.OccurenceOrderPlugin(),
  new optimize.UglifyJsPlugin({
    compress: {warnings: false}
  }),
  new BannerPlugin(bannerTemplate)
];

if (!development) {
 plugins.push(
    new DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  );
}

const webpackConfig = {
  context: path.join(__dirname, 'dist'),
  entry: {
    mi18n: path.join(__dirname, 'src/mi18n.js')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: 'dist/',
    library: 'mi18n',
    libraryTarget: 'commonjs2',
    filename: '[name].min.js'
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
        presets: ['es2015', 'stage-3'],
        plugins: ['transform-runtime']
      }
    }]
  },
  plugins,
  resolve: {
    root: path.join(__dirname, 'src'),
    extensions: ['', '.js'],
    modulesDirectories: ['src', 'node_modules']
  },
  devServer: {
    hot: true,
    contentBase: 'demo/',
    progress: true,
    colors: true,
    noInfo: true,
    outputPath: path.join(__dirname, './dist')
  }
};

module.exports = webpackConfig;
