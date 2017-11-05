var webpack = require('webpack');
const path = require('path');
const ASSET_PATH = process.env.ASSET_PATH || '/assets/build/';
module.exports = {
    context: path.resolve(__dirname, 'assets/js/'),
    devtool: "source-map",
    entry: './init.js', //'./assets/js/init.js',
    output: {
        filename: 'init.js',
        publicPath: ASSET_PATH,
        path: path.resolve(__dirname, 'assets/build/')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env'],
                        plugins: ["syntax-dynamic-import","dynamic-import-webpack"]
                    }
                }
            },
            {
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
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            children: true,
            async: true,
            minChunks: 2,
        }),
        new webpack.DefinePlugin({
            'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH)
        })
    ]
};