
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const multipart = require('connect-multiparty')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')

require('./server2')

const app = express()
const ejs = require('ejs')
const router = require('./router')
const compiler = webpack(WebpackConfig)

const { EXAMPLES_PATH, UPLOAD_FILE_PATH, OUTPUT_PATH } = require('./const')

app.use(webpackDevMiddleware(compiler, {
    publicPath: `/${OUTPUT_PATH}/`,
    stats: {
        colors: true,
        chunks: false
    }
}))

app.use(webpackHotMiddleware(compiler))

app.use(express.static(EXAMPLES_PATH, {
    setHeaders(res) {
        res.cookie('XSRF-TOKEN-D', '1234abc')
    }
}))

// 把./views目录设置为模板文件的根，ejs、html文件模板放在view目录中
app.set('views', __dirname + '/views');
// 设置模板引擎为ejs
app.set('view engine', 'ejs');
// 为html扩展名注册ejs
app.engine('html', ejs.renderFile);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(multipart({
    uploadDir: UPLOAD_FILE_PATH
}))
app.use(router)

const port = process.env.PORT || 8080
module.exports = app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})