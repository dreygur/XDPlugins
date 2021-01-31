var path = require("path");
// var FixDefaultImportPlugin = require('webpack-fix-default-import-plugin');
module.exports = {
    entry: "./src/index.js",
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
    resolve: {
        extensions: [".js", ".jsx"],
        
    },
    node: {
        fs: 'empty',
        module: 'empty'
    },
   
   
    module: {
        rules: [{
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    plugins: [
                        
                        // "transform-object-rest-spread",
                        // "add-module-exports",
                        "transform-react-jsx",
                        // "transform-class-properties",
                        "transform-object-rest-spread",
                        // "transform-object-assign"
                    ]
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
           
        ]
    }
};