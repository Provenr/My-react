/*
 * @file: 
 * @author: Provenr
 * @Date: 2020-03-06 01:54:57
 * @LastEditors: Provenr
 * @LastEditTime: 2020-03-06 10:40:52
 * @FilePath: /my-react/build/webpack.config.js
 */
/*
 * @file: Do not edit
 * @author: Provenr
 * @Date: 2020-03-06 01:54:57
 * @LastEditors: Provenr
 * @LastEditTime: 2020-03-06 10:15:53
 * @FilePath: /my-react/build/webpack.config.js
 */

const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    // 文件监听 默认false
    // 轮询的机制 监听 每个文件最后修改时间
    watch: true,
    // 开启监听模式时，才有意义
    watchOptions: {
        ignored: /node_modules/,
        // 监听变化发生之后 300ms 再去执行，默认300ms
        aggregateTimeout: 300,
        // 判断文件发生变化 是轮询文件，默认每秒1000次
        poll: 1000
    },
    entry: {
       index: path.resolve(__dirname, '..', 'src', 'index'),
       search: path.resolve(__dirname, '..', 'src', 'search')
    },
    output: {
        path: path.resolve(__dirname, '..', 'dist'),
        filename: '[name].js',
        publicPath: '../',
    },

    module: {
        rules: [
            {
                test: /.js$/,
                use: 'babel-loader'
            },
            {
                test: /.css$/,
                // 链式调用 从右到左解析 ，先执行css-loader解析css，再执行style-loader
                // css-loader 用于加载.css 文件 并转化为commonjs 对象
                // style-loader 将样式插入到head 中
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            // url-loader 可以处理字体和图片
            // 可以设置较小的资源 自动base64
            {
                test: /\.(svg|png|jpg|jpeg|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 20480
                    }
                }]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        // 核心  HMR server（服务端） + HMMR runtime（浏览器端）通过websocket 通信
        // HMR runtime 注入到bundle.js
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: '../dist',
        hot: true,
        port: 8090
    }
}
