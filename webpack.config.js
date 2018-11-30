module.exports = {
  entry: "./lib/game.js",
  output: {
    filename: "./bundle.js"
  },
  devtool: 'source-map',
  resolve: {
    extensions: ["", ".js"]
  }
};
