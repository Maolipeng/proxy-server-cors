# proxy-server-cors

## 背景

有这样一些场景（主要是处理Chrome开发环境报跨域问题）：

1. 前端开发环境的服务器，需要代理测试环境接口，但测试环境部署的后端接口并没有配置cors,但项目中有些接口是重定向的，重定向的location会被浏览器默认返回服务器的真实地址，导致跨域问题，浏览器请求不同
2. 前端请求直接不同域的接口，chrome浏览器也会报跨域问题

解决方式：
一般需要后端去配置cors一些配置，但为了保证安全性，同时再不改变后端的前提下，前端通过一个中转服务器去代理客户端接口，然后请求目标服务器，同时将这个服务器的cors配置好，相当于对此代理服务器进行了绝对的放行，但并不影响真实的服务器的配置。这个服务器就是这个原理

## Install

```bash
pnpm i -D proxy-server-cors
```

## Usage

可以在命令行中使用proxy-server-cors命令来启动这个服务器。需要提供一些选项，如目标服务器的URL、监听的端口和主机名等。以下是一个示例：

```bash
proxy-server-cors --target http://example.com --port 8000 --hostname localhost

```

这将会启动一个监听localhost的8000端口的HTTP代理服务器，所有的请求都会被代理到<http://example.com。>

### https

如果你需要HTTPS，你可以提供--https、--key和--cert选项，如下所示：

```bash
proxy-server-cors --target http://example.com --port 8000 --hostname localhost --https ./key.pem --cert ./cert.pem

```

这将会启动一个监听localhost的8000端口的HTTPS代理服务器，所有的请求都会被代理到<http://example.com。请注意，你需要将./key.pem和./cert.pem替换为你的HTTPS证书的实际路径。>

### 配置文件

你也可以使用一个.proxyrc.js文件来配置你的服务器。这个文件应该导出一个对象，这个对象包含了你的配置选项。例如：

```js
module.exports = {
    target: 'http://example.com',
    port: 8000,
    hostname: 'localhost',
    https: false,
};

```

然后，你可以使用以下命令来启动你的服务器：

```bash
proxy-server-cors
```

这将会使用.proxyrc.js文件中的配置选项来启动你的服务器。如果你想覆盖配置文件中的某些选项，你可以提供命令行参数。

## 项目中使用

例如proxy-sever启动的接口是<http://127.0.0.1:3000>

### 重定向的问题

针对于重定向的跨域，可以配置proxy的时候将proxy-server-cors作为target,因为它代理了目标服务器的接口

```js
module.exports = {
    '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
    }
}
```

### 直接访问跨域服务器的问题

设置特定的环境变量，将开发环境下的接口全部代理到

```js
let API_PREFIX = ''
switch (process.env.NODE_ENV) {
 case 'dev':
  API_PREFIX = 'http://127.0.0.1:3000'
  break;
}
```

## LICENSE

MIT