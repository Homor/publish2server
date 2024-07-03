const opn = require('opn');
const push = require("./push");
const { getConfig } = require("./file");
const { input, closeInput } = require("./input");
const { sleep } = require('./utils');
const refresh = require('./refresh');
const fetch = require('./fetch');
const qrcode = require('qrcode-terminal');

const defaultConfig = {
    "push": [
        {
            "server":
            {
                "name": '',
                "host": '',
                "port": '',
                "username": '',
                "password_dangerous": "",
                "path": '',
                "origin": ""
            },
            "hook": {}
        }
    ]
    ,
    "refresh": []
}

const defaultRequest = {
    hostname: 'http://localhost',
    port: "8848",
    path: 'api/secret',
    key: "key",
};

const mastInput = {
    server: {
        "host": "请输入服务器ip地址",
        "username": "请输入服务器登录账号",
        "password_dangerous": "请输入服务器登录密码",
        "path": "请输入服务器部署路径",
        "origin": "请输入源文件夹路径"
    },
    api: {
        "api_host": "请输入刷新CDN接口地址",
        // "api_port": "请输入刷新CDN接口端口号",
        "api_path": "请输入刷新CDN接口路径",
        "type": "请输入刷新CDN类型",
        "path": "请输入刷新CDN目录"
    }
}

const configLabel = ['name', 'host', 'port', 'username', 'password_dangerous', 'path', 'origin'];

function main() {
    var argv = process.argv;
    let fileName = "publish.config.js";
    if (argv.length > 2) {
        let arr = argv[2].match(/--config=(.*)/);
        if (arr) {
            fileName = arr[1];
        }
    }
    let config = getConfig(fileName);
    run(config);
}

function checkLabel(config) {
    const keys = Object.keys(config);
    keys.map(key => {
        if (!configLabel.includes(key)) {
            delete config[key]
        }
    })
    return config;
};

function parseHook(config) {
    if (!config) {
        return Promise.resolve(null);
    }
    const { log, open, request } = config || {};
    return new Promise(async (resolve) => {
        if (log && log.text) {
            console.log(log.text);
        }
        if (open && open.url) {
            console.log((`即将打开：${open.url}`));
            await sleep(open.delay || 1000);
            await opn(open.url);
        }
        if (config && config.qrcode && config.qrcode.value) {
            qrcode.generate(config.qrcode.value, { small: true });
        }
        if (request && request.appkey) {
            const options = Object.assign(defaultRequest, request);
            const {
                hostname,
                port,
                path,
                key,
                appkey
            } = options;
            const url = `${hostname.match(/^http/)?hostname:'http://'+hostname}:${port}/${path}?${key}=${appkey}`;
            try {
                const fetchResult = await fetch.get(url);
                if (fetchResult.code == 1000) {
                    return resolve(fetchResult.data || {});
                } else {
                    console.log((`请求接口失败!! ${options.hostname}:${options.port}/${options.path}?${options.key}=${options.appkey}`));
                }
            } catch (error) {
                console.log(error);
                console.log((`请求接口失败!!! ${options.hostname}:${options.port}/${options.path}?${options.key}=${options.appkey}`));
            }
        }
        resolve(null);
    });
}

function inputHandle(config, type) {
    return new Promise(async (resolve) => {
        const mi = mastInput[type];
        const keys = Object.keys(config);
        for (let index = 0; index < keys.length; index++) {
            const key = keys[index];

            if (mi[key] && !config[key]) {
                if (key == 'password_dangerous') {
                    config[key] = await input('请输入服务器登录密码(' + config.host + '): ');
                } else {
                    // 输入值
                    config[key] = await input(`${mi[key]}: `);
                }
            }
        }
        resolve(config);
    });
}

function pushHandle(data) {
    return new Promise(async (resolve, reject) => {
        if (!data.password_dangerous) {
            return reject('password is invalid!!');
        };
        data.password = data.password_dangerous;
        delete data.password_dangerous;
        try {
            await push(data);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
}

function refreshHandle(config) {
    return refresh(config);
}

async function run(config) {
    let { push, refresh } = config || defaultConfig;
    let currentData = null;
    try {
        for (let index = 0; index < push.length; index++) {
            const onePush = push[index];
            // 解析函数
            let { server, hook } = onePush;
            currentData = checkLabel(server);
            currentData = { ...defaultConfig.push[0].currentData, ...currentData };
            const {
                beforePush,
                afterPush,
            } = hook;

            // 1. 执行前
            let updateData = await parseHook(beforePush, currentData);
            if (updateData) {
                configLabel.forEach(key => {
                    currentData[key] = updateData[key] || currentData[key]
                })
            }

            // 2. 输入值
            updateData = await inputHandle(currentData, "server");
            currentData = { ...currentData, ...updateData }

            // 3. 执行
            await pushHandle(currentData);
            // 4. 执行完成后
            await parseHook(afterPush);
        }
    } catch (error) {
        console.log((`${currentData.name}(${currentData.host}),发布失败`));
        if (error.level=="client-timeout") {
            console.log("服务超时了");
        }
        return closeInput();
    }

    try {
        for (let index = 0; index < refresh.length; index++) {
            let { api, hook } = item;
            currentData = { ...defaultRefreshConfig.api, ...api };
            const { afterRefresh } = hook || {};
            // 1. 输入值
            let updateData = await inputHandle(currentData, "refresh");
            currentData = { ...currentData, ...updateData }
            // 2.执行CDN的输入命令
            await refreshHandle(currentData);
            // 3. 执行刷新CDN之后
            parseHook(afterRefresh);
        }
    } catch (error) {
        console.log((`${currentData.api_host}/${currentData.api_path},刷新CDN失败`));
        if (error.level) {
            console.log((error.level));
        }
    }
    closeInput();
}

main() 