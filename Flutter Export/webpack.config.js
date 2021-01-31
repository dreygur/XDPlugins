module.exports = {
  entry: "./src/main.jsx",
  output: {
    path: __dirname,
    filename: "main.js",
    libraryTarget: "commonjs2"
  },
  devtool: "none",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          plugins: ["transform-react-jsx", "transform-object-rest-spread"]
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  externals: {
    application: "application",
    uxp: "uxp",
  }
};
