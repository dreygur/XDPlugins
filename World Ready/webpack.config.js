var path = require('path');
var SRC = path.resolve(__dirname, 'src/main/js');
module.exports = {
    entry: "./src/main.jsx",
    output: {
        path: __dirname,
        filename: 'main.js',
        libraryTarget: "commonjs2"
    },
    devtool: "none", // prevent webpack from using eval() on my module
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    plugins: [
                        "transform-react-jsx",
                        "transform-object-rest-spread",
                    ]
                }
            },
            {
                test: /\.s?css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.png$/,
                exclude: /node_modules/,
                loader: 'file-loader'
            }
        ]
    },
    resolve: {
        extensions: [".js", ".jsx"]
    },
    externals: {
        uxp: 'uxp',
        scenegraph: "scenegraph",
        commands: "commands",
        application: "application"
    }
};