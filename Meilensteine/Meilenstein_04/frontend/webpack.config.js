const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/entry.js',
  devtool: 'inline-source-map',
  devServer: {
    static: './src',
    proxy: [
      {
        context: ['/api'],
        target: 'https://swp.dczlabs.xyz:3130',
        logLevel: 'debug', /*optional*/
        changeOrigin: true
      }
    ]
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
