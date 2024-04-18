import path from 'path';
import fs from 'fs';
import { Command } from 'commander';
import ProxyServer from './index';

import findFreePort from './check-freeport';

import type { Options } from './index'


// 读取并解析配置文件
const configPath = path.join(process.cwd(), '.proxyrc.js');
let config = {};
if (fs.existsSync(configPath)) {
    config = require(configPath);
}

// 使用commander.js处理命令行参数
const program = new Command();
program
    .option('--target <type>', 'target server url')
    .option('--port <type>', 'port number')
    .option('--hostname <type>', 'hostname')
    .option('--https <type>', 'https option')
    .option('--key <type>', 'key file path for https')
    .option('--cert <type>', 'cert file path for https')
    .parse(process.argv);
(async () => {
    const options: Options & { key: string, cert: string } = { ...config, ...program.opts() };
    // port 有可能被占用，找一个闲置的端口
    const port = await findFreePort(options.port);
    
    // 如果https选项是字符串，尝试将其转换为对象
    if (typeof options.https === 'string') {
        options.https = { key: options.https, cert: options.cert };
    }
    console.log(options, 'options');
    const server = new ProxyServer({...options, port});
    server.startServer();
})();
