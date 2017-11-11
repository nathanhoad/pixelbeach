const Path = require("path");
const Config = require("./config");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/game/index.js",
  output: {
    path: Path.resolve(__dirname, "dist", "bundle"),
    publicPath: "/bundle/",
    filename: "game.js"
  },
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "../index.html"
    })
  ]
};
