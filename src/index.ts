import fs from 'fs';
import http from 'http';
import https from 'https';
import httpProxy from 'http-proxy';

import Server from 'http-proxy';


export type Options = {
    target: string;
    port: number;
    hostname: string;
    https?: { key: string; cert: string };
    headers?: Record<string, string>;
    secure?: boolean;
}

class ProxyServer {
    private options: Options;
    private proxy: Server;

    constructor(options: Options) {
        this.options = options;
        this.proxy = httpProxy.createProxyServer({});
    }

    startServer(): void {
        const serverCallback = (req: http.IncomingMessage, res: http.ServerResponse): void => {
            const { headers = {}, secure = false } = this.options;

            res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', '*');
            res.setHeader('Access-Control-Allow-Credentials', 'true');

            Object.keys(headers).forEach((headerKey) => {
                res.setHeader(headerKey, headers[headerKey]);
            });

            this.proxy.web(req, res, {
                target: this.options.target,
                changeOrigin: true,
                secure,
            });
        };

        let server: http.Server | https.Server;
        if (this.options.https) {
            const httpsOptions = {
                key: fs.readFileSync(this.options.https.key),
                cert: fs.readFileSync(this.options.https.cert),
            };
            server = https.createServer(httpsOptions, serverCallback);
        } else {
            server = http.createServer(serverCallback);
        }

        server.listen(this.options.port, this.options.hostname, () => {
            console.log(`Proxy server listening on ${(this.options.https ? 'https' : 'http')}://${this.options.hostname}:${this.options.port}`);
        });
    }
}

export default ProxyServer

