const Path = require('path');
const Config = require('./config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: Config.env.development ? './src/game/index.js' : './src/game/preview.js',
  output: {
    path: Path.join(Config.paths.dist, 'bundle'),
    publicPath: '/bundle/',
    filename: 'game.js'
  },
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              require('babel-preset-env'),
              {
                targets: {
                  browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']
                }
              }
            ]
          ]
        }
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.ico$|\.eot$|\.ttf$|\.woff$|\.json$|\.mp3$|\.wav$/,
        exclude: /spine\//,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/[name]-[hash:base32:12].[ext]'
            }
          }
        ]
      },
      {
        test: /\.jpe?g$|\.png$|\.json$|\.atlas$/,
        include: [Path.join(Config.paths.game.assets, 'spine')],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: Path.join(Config.paths.game.assets, 'index.html.ejs')
    }),
    new UglifyJSPlugin({
      parallel: true
    })
  ]
};
