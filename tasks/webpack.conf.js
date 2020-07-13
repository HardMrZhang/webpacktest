const {
    resolve
} = require('path')
const r = url => resolve(__dirname, url)
//对文本进行词法分析，将匹配到的内容摘离出来
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const {
    flatMap
} = require('lodash')
const {
    isPattern
} = require('babel-types')

const extractSass = new ExtractTextPlugin({
    filename: '[name].wxss'
})
module.exports = {
    devtool: false,
    output: {
        path: r('./mina'),
        filename: '[name].js'
    },
    resolve: {
        alias: {
            utils: r('../utils/util')
        }
    },
    module: {
        rules: [{
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: [
                        ['env', {
                            modules: false
                        }]
                    ]
                }

            }, {
                test: /\.sass$/,
                use: extractSass.extract({
                    use: [{
                        loader: 'css-loader'
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            plugins: (loader) => {
                                require('autoprefixer')({
                                    browsers: [
                                        'last 2 version'
                                    ]
                                })
                            }
                        }
                    }, {
                        loader: 'sass-loader',
                        options: {
                            indentedSyntax: true
                        }
                    }],
                    fallback: 'style-loader'
                })
            }, {
                test: /\.mina$/,
                loader: 'wechat-mina-loader',
                options: {
                    path: r("../"),
                    dist: './mina'
                }
            }

        ]
    },
    plugins: [
        extractSass,
        new CopyWebpackPlugin(
            [{
                from: {
                    glob: 'pages/**/*.json',
                },
                to: '',
            }, {
                from: 'static',
                to: 'static',
            }],
        ),
        new webpack.optimize.ModuleConcatenationPlugin(),
        // new webpack.optimize.UglifyJsPlugin({
        //     sourceMap:false
        // }),
        new ProgressBarPlugin()
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    output: {
                        comments: false
                    },
                    compress: {
                        warnings: false,
                        drop_debugger: true,
                        drop_console: true
                    },
                }
            }),
        ]
    },

}