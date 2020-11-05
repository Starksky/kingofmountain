var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var clients = [];

class Client
{
	constructor(info, player = null){
		this.address = info.address;
		this.port = info.port;

		this.last_time = Date.now();
		this.leave = false;

		if(player != null)
		{
			this.name = player.name;
			this.position = player.position;			
		}

		console.log(`add client: ${this.address}:${this.port}`);
	}

	send(msg){ server.send(msg, this.port, this.address); }
}

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  	//console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
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
						item.send(JSON.stringify({msgid:10002, id_player:id, player:client}))
				});

				clients.push(client)
			}
			break;
			case 10002:{
				var client = new Client(info, object_json.player)
				clients[object_json.id_player] = client
				
				clients.forEach(function(item, index){
					if(!item.leave && object_json.id_player != index)
						item.send(JSON.stringify({msgid:10002, id_player:object_json.id_player, player:client}))
				});
			}
			break;
			case 10003:{
				clients[object_json.id_player].last_time = Date.now()
			}
			break;
		}
	}
	catch(err){}
}

setInterval(function(){
	clients.forEach(function(item, index){
		if(!item.leave)
		if(Date.now() - item.last_time > 3000)
		{
			item.leave = true
			clients.forEach(function(item1, index1){
				if(index1 != index)
					item1.send(JSON.stringify({msgid:10002, id_player:index, player:item}))
			});
		}
	});
},5000);