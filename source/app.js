var express = require('express'),
    app = express(),
    twilio = require('twilio');

var port = (process.env.VCAP_APP_PORT || 3000);

// Pull in Twilio config from the BlueMix environment
// The VCAP_SERVICES environment variable contains a JSON string with all your
// Bluemix environment data
var config = JSON.parse(process.env.VCAP_SERVICES || "{}");

// Loop through user-provided config info and pull out our Twilio credentials
var twilioSid, twilioToken;
config['user-provided'].forEach(function(service) {
    if (service.name == 'Twilio-qh') {
        twilioSid = service.credentials.accountSID;
        twilioToken = service.credentials.authToken;
    }
});

app.get('/message', function (req, res) {
    var client = new twilio.RestClient(twilioSid, twilioToken);
 
    client.sendMessage({
        to:'your cell number',
        from:'a twilio number you own',
        body:'Brooooooklllllynnnn!'
    }, function(err, message) {
        res.send('Message sent! ID: '+message.sid);
    });
});

var server = app.listen(port, function () {
  console.log('Example app started')
});
