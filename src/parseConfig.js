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

// 配置校验
const configLabel = ['name', 'host', 'port', 'username', 'password_dangerous', 'path', 'origin'];

const defaultRefreshConfig =
{
    "api": {
        "api_host": "",
        "api_port": "",
        "api_path": "",
        "type": "",
        "path": ""
    },
    "hook": {}
};

// js字符串
let jsString = "";

function head() {
    jsString = `
                (async () => {
                     try {
                `;
}

function footer() {
    // console.log(chalk.green("部署完成"));
    // console.log(chalk.red(info));
    jsString += `
                console.log("部署完成");
                } catch (error) {
                    const info = typeof error=="string"?error:error.msg ||error.message ||"";
                    console.log("部署出错了, msg: "+ info);
                }
                await sleep(1000);
                process.exit(1);
                })();
                `;
}

function parseHook(config) {
    const { log, open, qrcode } = config || {};
    let text = "";
    if (log && log.text) {
        // text += `console.log(chalk.${log.color || 'green'}("${log.text}"));`;
        text += `console.log("${log.text}");`;

    }
    // if (qrcode && qrcode.text) {
    //     text += `qrcode.generate('${qrcode.text}',{small: true});`;
    // }
    if (open && open.url) {
        // text += `console.log(chalk.yellow("即将打开：${open.url}"));
        text += `console.log("即将打开：${open.url}");
                 await sleep(${open.delay || 1000});
                 await opn('${open.url}');`;
    }
    return text;
}

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

let beforeInputSecretAnchor = "/* beforeInputSecret */";

function setAnchor(index) {
    beforeInputSecretAnchor = `/* beforeInputSecret${index} */`;
}

function inputHandle(config, type) {
    let str = `var config = ${JSON.stringify(config)};`;
    const mi = mastInput[type];
    const keys = Object.keys(config);
    keys.forEach(key => {

        if (mi[key] && !config[key]) {
            if (key == 'password_dangerous') {
                    // 密码值不存在
                    str += beforeInputSecretAnchor;
                    str += `config.${key} = await input('请输入服务器登录密码('+config.host+'): '); `
            }else{
                // 输入值
                str += `config.${key} = await input('${mi[key]}: '); `
            }
        }
    });

    return str;
}

function pushHandle() {
    return `if(!config.password_dangerous){throw 'password is invalid!!';return; };
            config.password=config.password_dangerous;
            delete config.password_dangerous;
            await push(config);`;
}

function refreshHandle() {
    return `await refresh(config,{path:config.path,type:config.type});`;
}

function hookHandle(config, hook, type) {
    const {
        beforePush,
        beforeInputSecret,
        afterPush,
        afterRefresh,
    } = hook;

    if (type == 'server') {
        // 1. 执行前
        jsString += parseHook(beforePush);
        // 2. 输入值
        jsString += inputHandle(config, type);
        // 3. 输入密码前
        jsString = jsString.replace(beforeInputSecretAnchor, parseHook(beforeInputSecret))
        // 4. 执行中
        jsString += pushHandle();
        // 5. 执行完成后
        jsString += parseHook(afterPush);
    } else {
        // 6. 输入值
        jsString += inputHandle(config, type);
        // 7.执行CDN的输入命令
        jsString += refreshHandle();
        // 8. 执行刷新CDN之后
        jsString += parseHook(afterRefresh);
    }
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

function parseConfig(config) {
    let { push, refresh } = config || defaultConfig;

    head();

    push.forEach((item, index) => {
        // 解析函数
        let { server, hook } = item;

        server = checkLabel(server);
        server = { ...defaultConfig.push[0].server, ...server };
        // 设置标识
        setAnchor(index);
        // 解析函数 
        hookHandle(server, hook, "server");
    });

    refresh.forEach(item => {
        let { api, hook } = item;
        api = { ...defaultRefreshConfig.api, ...api };
        // 解析函数
        hookHandle(api, hook, "api");
    });

    footer();

    return jsString;
}

module.exports = parseConfig;
