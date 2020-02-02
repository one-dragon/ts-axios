

const path = require('path')

const EXAMPLES_PATH = path.resolve(__dirname, '../')

const ROUTER_PATH = path.resolve(__dirname, './router/')

const OUTPUT_PATH = '__build__'

const MAIN_TS_NAME = 'app.ts'

module.exports = {
    EXAMPLES_PATH,
    ROUTER_PATH,
    OUTPUT_PATH,
    MAIN_TS_NAME
}