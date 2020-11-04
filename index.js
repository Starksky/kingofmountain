var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var clients = []

class Client
{
	constructor(info){
		this.isOpen = true;
		this.address = info.address;
		this.port = info.port;
	}

	send(msg)
	{
		server.send(msg, this.port, this.address, (err) => {
		  this.isOpen = false
		});
	}
}

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  	console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
	OnMessage(msg, rinfo)
});

server.on('listening', () => {
  var address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind({address:"78.24.222.166",port:22023});

function OnMessage(msg, info)
{
	try
	{
		var object_json = JSON.parse(msg)
		switch(object_json.msgid)
		{
			case 10001:{
				clients.push(new Client(info))
			}
			break;
			case 10002:{
				var client = new Client(info)
				client.send("it's work!")
				client.send(`count users: ${clients.length}`)
			}
			break;
		}
	}
	catch(err){}
}