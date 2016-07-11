var http = require('http');

module.exports = function(robot) {

	var TOKEN = "";	
	var requestData = function(method, path, env, callback) {
		
		var uri = (env) ? 
				'auditoria.nappsolutions.com' : 
				'auditoria.sandbox.nappsolutions.com';
		
		var options = {
			'host': uri,
		    'path': path,
		    'method': method,
		    'headers': {
		    	'Authorization': 'Bearer ' + TOKEN
		    }
		};
		
		http.get(options, function(response) {
			var body = "";
			
			response.on('data', function(d){
				body+= d;
			});
			
			response.on('end', function(){
				var data = JSON.parse(body);
				callback(data);
			});
		});
	};

	robot.respond(/lojas\s+([a-z]{2})\s+(.*)?/i, function(msg, done) {
		
		args = msg;
		var path = "/maintenance/stores?term=" + encodeURI(args.match[2]) + "&shopping_code=" + args.match[1];
		
		requestData("GET", path, false, function(json) {
			msg.reply("Status: " + json.status);
			
			if(!json.status) {
				msg.reply("Erro! " + json.error, done);
			}
			
			for(var i = 0; i < json.data.length; i++){
				var store = json.data[i];
				msg.reply("Store ID: " + store.store_id);
				msg.reply("Description: " + store.store + "\n");
			}
			
			msg.reply("Data: " + json.data, done);
		});
	});
	
	robot.respond(/lojas\s+(.*)?/i, function(msg, done) {
		args = msg;
		
		requestData("GET", "/maintenance/stores?term=" + encodeURI(args.match[1]), false, function(json) {
			msg.reply("Status: " + json.status);
			
			if(!json.status) {
				msg.reply("Erro! " + json.error, done);
			}
			
			for(var i = 0; i < json.data.length; i++){
				var store = json.data[i];
				msg.reply("Store ID: " + store.store_id);
				msg.reply("Description: " + store.store + "\n");
			}
			
			msg.reply("Data: " + json.data, done);
		});
	});
	
	robot.respond(/loja\s+([0-9]+)?/i, function(msg, done) {
		args = msg;
		
		requestData("GET", "/maintenance/store?store_id=" + args.match[1], false, function(json) {
			msg.reply("Status: " + json.status);
			
			if(!json.status) {
				msg.reply("Erro! " + json.error, done);
			}
			
			var store = json.data;
			msg.reply("Store ID: " + store.store_id);
			msg.reply("Login: " + store.login + "\n");
			msg.reply("Data: " + json.data, done);
		});
	});
};
