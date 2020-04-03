const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleWare = require('webpack-dev-middleware');
const path = require('path');
const fs = require('fs')

const app = express();
const webpackConfig = require('./build/webpack.config');
const compiler = webpack(webpackConfig);

app.use(webpackDevMiddleWare(compiler, {
    publicPath: webpackConfig.output.publicPath
}))
// app.all('/', function (req, res) {
//     res.send(fs.readFileSync(path.resolve(__dirname, 'index.html')).toString())
// })
// app.use('/dist', express.static(path.resolve(__dirname, 'dist')))

app.listen(3000, function () {
    console.log("Example app is listening on port 3000")
});

