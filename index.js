var dgram = require('dgram');
var server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log('server got: ${msg} from ${rinfo.address}:${rinfo.port}');
  var message = new Buffer('привет ANDROID');
  server.send('привет ANDROID',0,14, rinfo.port, rinfo.address, function(){
  	console.log('send message');
  });
});

server.on('listening', () => {
  var address = server.address();
  console.log('server listening ${address.address}:${address.port}');
});

server.bind({address:"78.24.222.166",port:22023});