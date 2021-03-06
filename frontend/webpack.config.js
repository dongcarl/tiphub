require('dotenv').config();
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const src = path.join(__dirname, 'src');
const dist = path.join(__dirname, 'dist');

const isDev = process.env.NODE_ENV !== 'production';
const publicPath =  isDev ? '/' : `${process.env.PUBLIC_PATH || ''}/static`;

const typescriptLoader = {
  test: /\.tsx?$/,
  use: [
    {
      loader: 'ts-loader',
      options: { transpileOnly: isDev },
    },
  ],
};
const cssLoader = {
  test: /\.css$/,
  use: [
    isDev && 'style-loader',
    !isDev && MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
      },
    },
  ].filter(Boolean),
};
const lessLoader = {
  test: /\.less$/,
  use: [
    ...cssLoader.use,
    {
      loader: 'less-loader',
      options: {
        sourceMap: true,
      },
    },
  ],
};
const fileLoader = {
  test: /\.(png|jpg|woff|woff2|eot|ttf|svg)$/,
  use: [{
    loader: 'file-loader',
    options: {
      publicPath,
      name: '[folder]/[name].[ext]',
    },
  }],
}

module.exports = {
  mode: isDev ? 'development' : 'production',
  name: 'main',
  target: 'web',
  devtool: isDev ? 'cheap-module-inline-source-map' : 'source-map',
  entry: path.join(src, 'index.tsx'),
  output: {
    path: dist,
    publicPath,
    filename: isDev ? 'script.js' : 'script.[hash:8].js',
    chunkFilename: isDev ? '[name].chunk.js' : '[name].[chunkhash:8].chunk.js',
  },
  module: {
    rules: [
      typescriptLoader,
      lessLoader,
      cssLoader,
      fileLoader,
    ].filter(r => !!r),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.mjs', '.json'],
    modules: [src, path.join(__dirname, 'node_modules')],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: isDev ? '[name].css' : '[name].[hash:8].css',
    }),
    new FaviconsWebpackPlugin({
      logo: path.join(src, 'images/favicon.png'),
      inject: true,
    }),
    new WebpackPwaManifest({
      name: 'TipHub',
      fingerprints: false,
      description: 'Send sats to your favorite open source contributors!',
      background_color: '#333',
      crossorigin: 'use-credentials',
      icons: [{
        src: path.join(src, 'images/favicon.png'),
        sizes: [96, 128, 192, 256, 384, 512],
      }],
    }),
    new HtmlWebpackPlugin({
      template: `${src}/index.html`,
      inject: true,
    }),
    new DotenvPlugin({ systemvars: true }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    isDev && new webpack.HotModuleReplacementPlugin(),
  ].filter(p => !!p),
  optimization: {
    minimizer: isDev ? [] : [
      new TerserJSPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          map: {
            inline: false,
            annotation: true,
          },
        },
      }),
    ],
  },
  devServer: {
    hot: true,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};
