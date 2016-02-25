//To start this server, run node app.js under the "server" directory
var express = require('express');
var app = express();
var Pusher = require('pusher');
app.get('/', function (req, res) {
  res.send('Hello World!');
});

// setup Pusher. This wraps WebSocket and publishes messages to the intented subscribers.
var pusher = new Pusher({
  appId: '182705',
key: 'ddb3f1693ed424d352cd',
secret:'d7e111a0c84fa2eef610'
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
var Firebase = require('firebase');
//Need to add a query to get the BG Geo Locations too. The below was written only for Test purposes.
var ref = new Firebase("https://thevibe.firebaseio.com/Landmarks");
ref.on('value', function(snap){
	//Write Logic here to compare the lat longs of the Landmarks with that of the users.Probably two for loops?
	// If within the radius, then trigger push notification to the respective users
	pusher.trigger( 'items', 'updated', snap.val() );
});


