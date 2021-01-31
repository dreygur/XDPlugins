module.exports = {
    entry: "./src/main.jsx",
    output: {
        path: __dirname,
        filename: 'main.js',
        libraryTarget: "commonjs2"
    },
    devtool: "none", // prevent webpack from using eval() on my module
    externals: {
        application: 'application',
        uxp: 'uxp',
        scenegraph: 'scenegraph',
        // pretier: 'pretier'

    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    plugins: [
                        "transform-react-jsx"
                    ]
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
              //to load images within react
              test: /\.(png|jpg|gif)$/,
              use: [
                {
                  loader: 'file-loader',
                  options: {}
                }
              ]
            }
        ]
    }
};
