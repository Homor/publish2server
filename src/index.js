const opn = require('opn');
// const chalk = require('chalk');
const push = require("./push");
const { getConfig } = require("./file");
const input = require("./input");
const { sleep } = require('./utils');
const refresh = require('./refresh');
// const qrcode = require('qrcode-terminal');
const parseConfig = require('./parseConfig');

function start() {
    var argv = process.argv;
    let fileName = "publish.config.js";
    if (argv.length > 2) {
        let arr = argv[2].match(/--config=(.*)/);
        if (arr) {
            fileName = arr[1];
        }
    }
    let config = getConfig(fileName);

    eval(parseConfig(config));

}

start() 