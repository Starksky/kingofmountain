const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log('server got: ${msg} from ${rinfo.address}:${rinfo.port}');
  server.send("привет android", rinfo.port, rinfo.address);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind({address:"78.24.222.166",port:22023});