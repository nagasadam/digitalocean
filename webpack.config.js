var HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
var webpack = require('webpack');
var path = require('path');
const { API_URL } = require('./_constants/config.json')

module.exports = {
    entry: [
        './src/index.jsx'
    ], output: {
        path: path.resolve(__dirname, "build"), // change this
        publicPath: '/',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: "./build",
    },
    mode: 'development',
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react']
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
                use: [
                    'file-loader',
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "index.html"),
        }),
        new CopyWebpackPlugin([
            { from: "src/assets/img", to: "src/assets/img" },
            { from: "_redirects", to: "./" }
        ]),
        new webpack.HotModuleReplacementPlugin({
            // Options...
        })
    ],
    devServer: {
        historyApiFallback: true,
        hot: true,
    },
    externals: {
        // global app config object
        config: JSON.stringify({
            apiUrl: API_URL
        })
    }
}