const publishConfig = {
    "push": [
        {
            "server":
            {
                //服务器名称 (非必填)
                "name": '正式环境',
                //地址 （必填）
                "host": '120.0.0.1',
                //端口 （非必填，默认22）
                "port": 22,
                // 服务器登录账号
                "username": 'root',
                // ！！！谨慎使用！！！
                "password_dangerous": '',
                // 服务器部署路径
                "path": '/var/www/html/',
                // 源文件夹
                "origin": "./dist/"
            },
            "hook": {
                beforePush: {
                    log: {
                        text: "开始推送到服务器",
                        color: "red"
                    }
                },
                afterPush: {
                    log: {
                        color: "green",
                        // 此处可以放一个线上的文档，方便用户查看相关参数
                        text: "推送到服务器成功！！",
                    },
                    qrcode: {
                        // 在终端生成二维码
                        text: "https://account.aliyun.com/login/login.html"
                    },
                    open: {
                        delay: 2000,
                        // 打开网页
                        url: "https://account.aliyun.com/login/login.html"
                    }
                }
            }
        }
    ],
    "refresh": [
        // {
        //     "api": {
        // // 刷新CDN的接口
        // "api_host": "127.0.0.1",
        // "api_port": 22,
        // "api_path": "/refreshCdn",
        // // 刷新类型
        // "type": "Directory",
        // // 刷新目录
        // "path": "https://www.baidu.com/resource/"
        //     },
        //     "hook": {
        //         "afterRefresh": {
        //             qrcode: {
        //                 // 在终端生成二维码
        //                 text: "https://account.aliyun.com/login/login.html"
        //             },
        //             open: {
        //                 delay: 2000,
        //                 // 打开网页
        //                 url: "https://account.aliyun.com/login/login.html"
        //             }
        //         }
        //     }
        // }
    ]
}

module.exports = publishConfig;