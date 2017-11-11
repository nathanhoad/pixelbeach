const Path = require("path");
const Config = require("./config");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/game/index.js",
  output: {
    path: Path.join(Config.paths.dist, "bundle"),
    publicPath: "/bundle/",
    filename: "game.js"
  },
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.ico$|\.eot$|\.ttf$|\.woff$|\.mp3$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "assets/[name]-[hash:base32:12].[ext]"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "../index.html",
      template: Path.join(Config.paths.game.assets, "index.html.ejs")
    })
  ]
};
