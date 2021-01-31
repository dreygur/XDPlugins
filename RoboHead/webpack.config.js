const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  entry: "./src/main.jsx",
  output: {
    path: __dirname,
    filename: "main.js",
    libraryTarget: "commonjs2",
  },
  devtool: "none", // prevent webpack from using eval() on my module
  externals: {
    scenegraph: "scenegraph",
    application: "application",
    uxp: "uxp",
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          plugins: ["transform-react-jsx", "transform-object-rest-spread"],
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        exclude: /node_modules/,
        loader: "file-loader",
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: "style-loader",
            options: {
              hmr: true,
            },
          },
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
          },
          "sass-loader",
        ],
      },
      /* {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },*/
    ],
  },
};
