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
  output: {
    filename: 'dist/bundle.js',
    path: path.resolve(__dirname, '.'),
    library: {
      type: 'window',
    },
  },
};
