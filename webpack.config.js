const pkg = require('./package.json')
const { resolve } = require('path')
const { BannerPlugin } = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')
const MinifyPlugin = require('babel-minify-webpack-plugin')

const PRODUCTION = process.argv.includes('production')

const bannerTemplate = [`${pkg.name} - ${pkg.homepage}`, `Version: ${pkg.version}`, `Author: ${pkg.author}`].join('\n')

const plugins = [
  new MinifyPlugin(
    {
      removeDebugger: true,
    },
    {
      comments: false,
    }
  ),
  new BannerPlugin(bannerTemplate),
  new CompressionPlugin({
    asset: '[path].gz[query]',
    algorithm: 'gzip',
    test: /\.(js)$/,
    threshold: 10240,
    minRatio: 0.8,
  }),
]

const devtool = PRODUCTION ? false : 'inline-source-map'

const webpackConfig = {
  mode: PRODUCTION ? 'production' : 'development',
  context: resolve(__dirname),
  entry: {
    mi18n: './src/mi18n.js',
  },
  output: {
    path: resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
    filename: '[name].min.js',
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
        loader: 'babel-loader',
      },
    ],
  },
  devtool,
  plugins,
  resolve: {
    modules: [resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.js', '.json'],
  },
  devServer: {
    inline: true,
    contentBase: 'demo/',
    noInfo: true,
  },
}

module.exports = webpackConfig