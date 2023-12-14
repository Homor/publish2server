const http = require('http');
function get(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                const result = "Not Found" == data ? {} : JSON.parse(data);
                resolve(result);
            });

        }).on('error', (error) => {
            console.error(error);
            reject(error);
        });
    })
}

function post(options) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                const data = typeof chunk == "string" ? JSON.parse(chunk) : chunk;
                resolve(data);
            });
        });

        req.on('error', (e) => {
            reject(e)
        });

        req.write(data);
        req.end();
    });

}
module.exports = { get, post };
