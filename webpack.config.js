const Path = require('path');

module.exports = {
  entry: './src/game/index.js',
  output: {
    path: Path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: 'game.js'
  },
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
};
