

const path = require('path')

const EXAMPLES_PATH = path.resolve(__dirname, '../')

const UPLOAD_FILE_PATH = path.resolve(__dirname, './upload-file/')

const ROUTER_PATH = path.resolve(__dirname, './router/')

const OUTPUT_PATH = '__build__'

const MAIN_TS_NAME = 'app.ts'

module.exports = {
    EXAMPLES_PATH,
    UPLOAD_FILE_PATH,
    ROUTER_PATH,
    OUTPUT_PATH,
    MAIN_TS_NAME
}