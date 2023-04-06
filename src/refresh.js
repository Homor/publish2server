const http = require("http");

function refresh(api_config, config) {

    const data = JSON.stringify(config);

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

        const req = http.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                const data = typeof chunk =="string"?JSON.parse(chunk):chunk;
                if (data.code == 10000) {
                    resolve(data);
                } else {
                    reject(data);
                }
            });
        });

        req.on('error', (e) => {
            reject(e)
        });

        req.write(data);
        req.end();
    });
}

module.exports = refresh;