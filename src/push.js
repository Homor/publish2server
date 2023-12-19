const scpClient = require('scp2');
const ora = require('ora');

module.exports = function push(config) {
    return new Promise(function (resolve,reject) {
        const spinner = ora(`正在推送到${config.name||config.host}`);
        spinner.start();
        scpClient.scp(
            config.origin, config,
            function (err) {
                spinner.stop();
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }
        );
    })
}

