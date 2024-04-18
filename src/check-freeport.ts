import * as net from 'net';

function verifyPort(port: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.once('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false);
      } else {
        reject(err);
      }
    });

    server.once('listening', () => {
      server.close();
      resolve(true);
    });

    server.listen(port);
  });
}

async function findFreePort(port: number): Promise<number> {
  while (true) {
    const isFree = await verifyPort(port);

    if (isFree) {
      return port;
    } else {
      // eslint-disable-next-line no-param-reassign
      port++;
    }
  }
}

export default findFreePort;
