const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');
const dotenv = require('dotenv');

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
    new Dotenv(),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.config().parsed) 
   })
  ]
};