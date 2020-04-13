'use strict'

const glob = require('glob')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');

// autoprefixer 样式生成好 之后 后置处理添加 浏览器前缀
// 与postcss-loader 一起使用

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
          chunks: ['', pageName],
          inject: true,
          minify: {
            html5: true,
            collapseWhitespace: true,
            preserveLineBreaks: false,
            minifyCSS: true,
            minifyJS: true,
            removeComments: false
          }
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
  mode: 'production',

  entry: entry,
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: '[name]_[chunkhash:8].js',
  },

  module: {
    rules: [
      {
        test: /.html$/,
        use: 'raw-loader'
      },
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          'eslint-loader'
        ]
      },
      {
        test: /.css$/,
        // 链式调用 从右到左解析 ，先执行css-loader解析css，再执行style-loader
        // css-loader 用于加载.css 文件 并转化为commonjs 对象
        // style-loader 将样式插入到head 中
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /.less$/,
        use: [
          // style-loader 与 MiniCssExtractPlugin 提取文件互斥
          // {
          //   loader: 'style-loader',
          //   options: {
          //     inserAt: 'top', // 样式插入到 <head>
          //     singleton: true // 将所有的style标签合并成一个
          //   }
          // },
          MiniCssExtractPlugin.loader, // html-inline-css-webpack-plugin 资源内联
          'css-loader',
          'less-loader',
          // 官方推荐 将poscssloader 放在预处理器（stylus|less|sass）之前
          // 最新autoprefixer版本 建议 browserlist 写在package.json 文件中 或者.browserlistrc里面
          // 直接使用 将 browserlist => overrideBrowserslist
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')({
                  overrideBrowserslist: ['last 2 version', '>1%', 'ios 7']
                })
              ]
            }
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75, // 750px 设计稿 => 10rem
              remPrecision: 8 // 转换后的小数点精度
            }
          },
        ]
      },
      // url-loader 可以处理字体和图片
      // 可以设置较小的资源 自动base64
      // 资源内联 减少Http请求
      {
        test: /\.(svg|png|jpg|jpeg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10240,
            name: '[name]_[hash:8].[ext]'
          }
        }]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [{
          loader: 'file-loader',
          options: {
            limit: 10240,
            name: '[name]_[hash:8].[ext]'
          }
        }]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css'
    }),
    // OptimizeCSS优化css文件的输出，默认使用cssnano
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessorOptions: {
        safe: true,
        autoprefixer: { disable: true }, // 这里是个大坑，禁用掉cssnano对于浏览器前缀的处理
        mergeLonghand: false,
        discardComments: {
          removeAll: true // 移除注释
        }
      },
      canPrint: true
    }),
    // new HtmlWebpackPlugin({
    //   template: path.join(__dirname, '..', 'src/template/search.html'),
    //   filename: 'search.html',
    //   chunks: ['search'],
    //   inlineSource: '.(js|css)$', // embed all javascript and css inline
    //   inject: true, // chunk js/css  自动注入到html
    //   // minify: {
    //   //   html5: true,
    //   //   collapseWhitespace: true,
    //   //   preserveLineBreaks: false,
    //   //   minifyCSS: true,
    //   //   minifyJS: true,
    //   //   removeComments: false
    //   // }
    // }),
    // new HtmlWebpackPlugin({
    //   template: path.join(__dirname, '..', 'src/template/index.html'),
    //   filename: 'index.html',
    //   chunks: ['index'],
    //   inlineSource: '.(js|css)$',
    //   inject: true, // chunk js/css  自动注入到html
    //   // minify: {
    //   //   html5: true,
    //   //   collapseWhitespace: true,
    //   //   preserveLineBreaks: false,
    //   //   minifyCSS: true,
    //   //   minifyJS: true,
    //   //   removeComments: false
    //   // }
    // }),
    // new HtmlWebpackExternalsPlugin({
    //   externals: [
    //     {
    //       module: 'react',
    //       entry: 'https://11.url.cn/now/lib/16.2.0/react.min.js',
    //       global: 'React',
    //     },
    //     {
    //       module: 'react-dom',
    //       entry: 'https://11.url.cn/now/lib/16.2.0/react-dom.min.js',
    //       global: 'ReactDOM',
    //     },
    //   ]
    // }),
    new CleanWebpackPlugin(),
    // new HtmlInlineCSSWebpackPlugin()
  ].concat(htmlWebpackPlugins).concat(new HtmlInlineCSSWebpackPlugin()),
  optimization: {
      splitChunks: {
          minSize: 0,
          cacheGroups: {
              commons: {
                test: /(react|react-dom)/,
                name: 'vendors',
                chunks: 'all',
                minChunks: 2
              }
          }
      }
  }
}
