const path = require('path');

module.exports = {
  mode: 'development',
  entry: './ContentOrganizer.js',
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    static: './',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
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
