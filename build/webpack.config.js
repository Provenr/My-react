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
module.exports = {
    mode: 'development',
    entry: {
       index: path.resolve(__dirname, '..', 'src', 'index'),
       search: path.resolve(__dirname, '..', 'src', 'search')
    },
    output: {
        path: path.resolve(__dirname, '..', 'dist'),
        filename: '[name].js'
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
            {
                test: /\.(svg|png|jpg|jpeg|gif)$/,
                use: 'file-loader'
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: 'file-loader'
            }
        ]
    }
}
