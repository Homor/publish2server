const scpClient = require('scp2');
// const ora = require('ora');
// const chalk = require('chalk');

module.exports = function push(config) {
    return new Promise(function (resolve,reject) {
        // const spinner = ora('正在发布到' + config.name||'' + '服务器...');
        // spinner.start();
        scpClient.scp(
            config.origin, config,
            function (err) {
                // spinner.stop();
                if (err) {
                    console.log('发布失败.\n');
                    reject(err);
                } else {
                    resolve();
                }
            }
        );
    })
}

