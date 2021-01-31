const { VueLoaderPlugin } = require('vue-loader');
const WebpackShellPlugin = require('webpack-shell-plugin');
const Dotenv = require('dotenv-webpack');


module.exports = {
    entry: "./src/main.js",
    output: {
        path: __dirname,
        filename: 'main.js',
        libraryTarget: "commonjs2"
    },
    devtool: "none", // prevent webpack from using eval() on my module
    externals: {
        uxp: "uxp",
        application: 'application',
        scenegraph: "scenegraph",
        commands: "commands"
    },
    resolve: {
        alias: {
            '@': (__dirname + '/src'),
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new WebpackShellPlugin({
            onBuildStart: ['echo "Build Starts"'],
            onBuildEnd: ['node ./src/script/reload-xd-plugin.js']
        }),
        new Dotenv({
            path: process.env.NODE_ENV === 'development' ? './development.env' : './production.env'
        })
    ]
};