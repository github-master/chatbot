'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
app.set('port', (process.env.PORT || 5000));

//alows us o process the data
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//ROUTE
app.get('/', function(req, res) {
	res.send("Hi I am a chatbot");
})
let token = "EAAbvKiX5gJIBAOfxKIodFXsZAOZAU2HzQZBdZCuWS5ZAUQZA9gKhl791CkxU9cYZBByD09mtJaixmqvCxMIIfiMFvEbqaZCn4UTY4nQU2V7OXpz1hX8aqjUHJ46AgpyHEyJl9S9dgUMZCWFuos8qhjSF2alPxy7aMsn2huN8blJcupAZDZD"
//Facebook
app.get('/webhook', function(req, res) {
	if(req.query['hub.verify_token'] == "blondiebytes") {
		res.send(req.query['hub.challenge']);
	} else {
		res.send('Worng token')
	}
})

app.post('/webhook', function(req, res) {
	console.log("request body" + JSON.stringify(req.body));

	//let messaging_event = req.body.entry[0].messaging;
	let messaging_events = req.body.messaging;
	var text = ""
	for(let i = 0; i < messaging_events.length; i++) {
		let entry = messaging_events[i];
		event = JSON.parse(entry);
		console.log("request body" + JSON.stringify(event.text));
		let sender = event.id;
		if(event.text) {
			text = event.text;
			sendText(sender, "text echo: " + text.substring(0, 100));
			console.log("res body" + "text echo: " + text);
		}
		
	}
	console.log("res body" + "text echo: " + text);
	res.status(200).send("text echo: " + text.substring(0, 100))
	//res.sendStatus(200);
})
function sendText(senderId, text) {
	let messageData = {text: text};
	request({
		url: "http://graph.facebook.com/v2.6/me/messages",
		qs: {access_token: token},
		method: "POST", 
		json: {
			recipient: {id: senderId},
			message: messageData
		}
	}, function(error, response, body) {
		if(error) {
			console.log("sending error");
		} else if(response.body.error) {
			console.log("response body error");
		}
	})
}

app.listen(app.get('port'), function() {
	console.log("running port")
})

//app.get('')