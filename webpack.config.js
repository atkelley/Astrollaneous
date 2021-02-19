const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');
const dotenv = require('dotenv');

require('dotenv').config();

module.exports = {
  watch: false,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
          loader: "babel-loader"
      },
      {
        test: /\.css$/,
        use: [ "style-loader", "css-loader" ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: "url-loader"
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NASA_API_KEY': JSON.stringify(process.env.NASA_API_KEY),
      }
    })
  ]
};