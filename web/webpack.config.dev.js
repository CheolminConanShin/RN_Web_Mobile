const path = require('path')
const webpack = require('webpack')

module.exports = {
    devServer: {
        contentBase: path.join(__dirname, 'src')
    },
    entry: [
        path.join(__dirname, '../index.web.js')
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {cacheDirectory: true}
            },
            {
                test: /\.(gif|jpe?g|png|svg)$/,
                loader: 'url-loader',
                query: {name: '[name].[hash:16].[ext]'}
            }
        ]
    },
    output: {
        filename: 'bundle.js'
    },
    plugins: [
    ],
    resolve: {
        alias: {
            'react-native': 'react-native-web',
            'webworkify$': 'webworkify-webpack-dropin',
        }
    }
}

