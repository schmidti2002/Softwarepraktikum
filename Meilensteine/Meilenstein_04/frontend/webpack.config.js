const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/WebApplication.js',
  devtool: 'inline-source-map',
  devServer: {
    static: './src',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'dist/bundle.js',
    path: path.resolve(__dirname, '.'),
    library: {
      type: 'window',
    },
  },
};
