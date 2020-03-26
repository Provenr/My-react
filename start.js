var express = require('express');
var path = require('path');
var fs = require('fs')
var app = express();
// var webpackDevMiddleWare = require('webpack-dev-middleware')
var webpackConfig = require('./build/webpack.config');
var webpack = require('webpack');

var compiler = webpack(webpackConfig, function (err) {
    console.log(err)
});
// app.use(webpackDevMiddleWare(compiler, {
//     noInfo: true,
//     stats: {
//         colors: true
//     },
//     quiet: true,
//     lazy: true
// }))
app.all('/', function (req, res) {
    res.send(fs.readFileSync(path.resolve(__dirname, 'index.html')).toString())
})
app.use('/dist', express.static(path.resolve(__dirname, 'dist')))

app.listen(3000, function () {
    
});

