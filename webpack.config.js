var webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CleanWebpackPlugin = require('clean-webpack-plugin');
// const ASSET_PATH = process.env.ASSET_PATH || '/pms-console/assets/build/';
module.exports = {
    // context: path.resolve(__dirname, 'assets/js/'),
    devtool: "source-map",
    entry: {
        init: './assets/js/init.js', //'./assets/js/init.js'
    },
    output: {
        filename: '[name].js',
        publicPath: '/pms-console/',
        path: path.resolve(__dirname, './')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: '/node_modules/',
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env'],
                        plugins: ["syntax-dynamic-import", "dynamic-import-webpack"]
                    }
                }
            },
            /*{
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            }*/
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'init.html'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            children: true,
            async: true,
            minChunks: 2,
        }),
        /*new webpack.DefinePlugin({
            'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH)
        }),*/
        //new CleanWebpackPlugin(['docs'])
    ]
};
