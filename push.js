//Lets require/import the HTTP module
var http = require('http');
var request = require('request');

//Lets define a port we want to listen to
const PORT = 8080;

//We need a function which handles requests and send response
function handleRequest(request, response) {
    response.end('It Works!! Path Hit: ' + request.url);
}

//Create a server
var server = http.createServer(handleRequest);
var post_data = {
        "tokens": [
            "f9b63e6bf372cde3cea7070fc115141ec4d8e52e5bd154fe4a38920c5227a475"
        ],
        "notification": {
            "alert": "It worked"
        }
    }
var private_key = "6fc2a474fa7d5572a9228c7a507e9718760efd75fcbefba9";

var auth = 'Basic ' + new Buffer(private_key).toString('base64');

    //Lets start our server
server.listen(PORT, function() {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
    request({
        url: "https://push.ionic.io/api/v1/push",
        method: "POST",
        json: true, // <--Very important!!!
        headers: { //We can define headers too
            'Content-Type': 'application/json',
            'X-Ionic-Application-Id': 'e2c37079',
            'Authorization': auth
        },
        body: post_data
    }, function(error, response, body) {
        console.log(response);
    });

});