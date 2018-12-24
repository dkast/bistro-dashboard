require("dotenv").config();
const webpack = require("webpack");
const withCSS = require("@zeit/next-css");
const withSASS = require("@zeit/next-sass");

module.exports = withCSS(
  withSASS({
    webpack: config => {
      // Fixes npm packages that depend on `fs` module
      config.node = {
        fs: "empty"
      };

      // Fixes url import on SASS module
      config.module.rules.push({
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 100000,
            name: "[name].[ext]"
          }
        }
      });

      config.plugins.push(new webpack.EnvironmentPlugin(process.env));

      return config;
    }
  })
);
