var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var clients = [];

class Client
{
	constructor(info, player = null){
		this.address = info.address;
		this.port = info.port;
		this.leave = false;
		if(player != null)
		{
			this.fall = player.fall;
			this.idle = player.idle;
			this.kickLeftPressed = player.kickLeftPressed;
			this.kickRightPressed = player.kickRightPressed;
			this.leave = player.leave;
			this.leftPressed = player.leftPressed;
			this.name = player.name;
			this.position = player.position;
			this.rightPressed = player.rightPressed;			
		}

	}

	send(msg)
	{
		
		server.send(msg, this.port, this.address, function(error){
		  if(error){
		    leave = true
		  }
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
				var id = clients.length
				var client = new Client(info, object_json.player)
				client.send(JSON.stringify({msgid:10001, id_player:id, players:clients}))
				clients.forEach(function(item, index){
					if(!item.leave)
						item.send({msgid:10002, id_player:id, player:client})
				});
				clients.push(client)
			}
			break;
			case 10002:{
				var client = new Client(info, object_json.player)
				clients[object_json.id_player] = client
				
				clients.forEach(function(item, index){
					if(!item.leave && object_json.id_player != index)
						item.send({msgid:10002, id_player:object_json.id_player, player:client})
				});
			}
			break;
		}
	}
	catch(err){}
}

setInterval(function(){
	clients.forEach(function(item, index){
		if(!item.leave)
			item.send(JSON.stringify({msgid:10003}))
	});
},3000);