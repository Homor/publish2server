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
            // 非必须
            "hook": {
                beforePush: {
                    // 可以将服务器信息放到文档里
                    log: {
                        text: "开始推送到服务器!",
                    },
                    open:{

                    }
                },
                afterPush: {
                    log: {
                        text: "推送到服务器成功！！",
                    },
                    qrcode: {
                        // 在终端生成二维码，可以是项目的链接
                        value: "https://account.aliyun.com/login/login.html"
                    }
                }
            }
        }
    ],
    "refresh": []
}

module.exports = publishConfig;
