const fetch = require("./fetch");

function refresh(api_config) {
    return new Promise((resolve, reject) => {
        const options = {
            host: api_config.api_host,
            port: api_config.api_port,
            path: api_config.api_path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        fetch.post(options).then(data => {
            if (data.code == 10000) {
                resolve(data);
            } else {
                reject(data);
            }
        }).catch(err => { reject(err) })
    });
}

module.exports = refresh;