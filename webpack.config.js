module.exports = {
  entry: "./lib/pacman.js",
  output: {
    filename: "./bundle.js"
  },
  devtool: 'source-map',
  resolve: {
    extensions: ["", ".js"]
  }
};
