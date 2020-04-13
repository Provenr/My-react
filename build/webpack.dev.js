'use strict'

const glob = require('glob')
const path = require('path');
const webpack = require('webpack');
const HtmlInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const setMPA = () => {
    const entry = {};
    const htmlWebpackPlugins = [];
    const entryFiles = glob.sync(path.join(__dirname, '..', '/src/*/index.js'));


    Object.keys(entryFiles)
      .map((index) => {
          const entryFile = entryFiles[index];
          const match = entryFile.match(/src\/(.*)\/index\.js/);
          const pageName = match && match[1];
          entry[pageName] = entryFile;
          htmlWebpackPlugins.push(
            new HtmlWebpackPlugin({
                inlineSource: '.css$',
                template: path.join(__dirname, '..', `src/${pageName}/index.html`),
                filename: `${pageName}.html`,
                chunks: [pageName],
                inject: true,
                // minify: {
                //   html5: true,
                //   collapseWhitespace: true,
                //   preserveLineBreaks: false,
                //   minifyCSS: true,
                //   minifyJS: true,
                //   removeComments: false
                // }
            })
          );
      })

    return {
        entry,
        htmlWebpackPlugins
    }
}
const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
    mode: 'development',
    // 文件监听 默认false
    // 轮询的机制 监听 每个文件最后修改时间
    // watch: true,
    // 开启监听模式时，才有意义
    // watchOptions: {
    //     ignored: /node_modules/,
    //     // 监听变化发生之后 300ms 再去执行，默认300ms
    //     aggregateTimeout: 300,
    //     // 判断文件发生变化 是轮询文件，默认每秒1000次
    //     poll: 1000
    // },
    entry: entry,
    output: {
        path: path.resolve(__dirname, '..', 'dist'),
        filename: '[name][hash:8].js',
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
                        limit: 20480,
                        // 这里的hash 采用md5 生成
                        name: 'img/[name][hash:8].[ext]'
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
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin()
    ].concat(htmlWebpackPlugins).concat(new HtmlInlineCSSWebpackPlugin()),
    devServer: {
        contentBase: path.join(__dirname, '..', 'dist'),
        hot: true,
        port: 8090,
        // open: true    //  启动DevServer  时使用浏览器（每次启动都会自动打开新页面）
    },
    devtool: "source-map"
}
