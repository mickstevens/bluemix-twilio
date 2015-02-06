# Getting Started with Twilio on IBM Bluemix

By using IBM Bluemix and Twilio together you can quickly build and deploy applications with voice, messaging and VoIP functionality. Today I’m going to take you on a wonderful journey of code as we use these tools build a Node.js app that sends a text message. Our application will take about 15 minutes to build so if you’ve got some free time over lunch, or you want to wait a hair longer before you watch the newest episode of House of Cards, you should be able to knock this out. If you have any issues along the way you can reference the final product on [GitHub](https://github.com/rickyrobinett/bluemix-twilio).

## Our Bluemix Foundation
Before you begin, you'll need to [sign up for a free IBM Bluemix account](https://console.ng.bluemix.net/). Once you've signed up, you'll want to create a new application using the Node.js web application template. Want some screenshots to guide you through that process? I've got you covered!

![Create a new application](https://raw.githubusercontent.com/rickyrobinett/bluemix-twilio/master/images/createnewapp.png)
Create a new application

![Choose "Web" for application type](https://raw.githubusercontent.com/rickyrobinett/bluemix-twilio/master/images/webapp.png)
Choose "Web" for application type

![Use the Node.js Starter template](https://raw.githubusercontent.com/rickyrobinett/bluemix-twilio/master/images/starterkit.png)
Use the Node.js Starter template

Name your application something unique. Now that your application is created, let’s add the Twilio service. [Twilio](http://twilio.com) enables phones, VoIP and messaging to be embedded into web, desktop, and mobile software. We’ll be using Twilio to send our text message later on. Select “Add Service” and pick Twilio. Not sure how to do this? Let’s take a look at some more screenshots:

![Click "Add a Service"](https://raw.githubusercontent.com/rickyrobinett/bluemix-twilio/master/images/addservice.png)
Click "Add a Service"

![Choose Twilio from the list of services under the "mobile" heading](https://raw.githubusercontent.com/rickyrobinett/bluemix-twilio/master/images/twilioservice.png)
Choose Twilio from the list of services under the "mobile" heading

![Enter your account SID and auth token](https://raw.githubusercontent.com/rickyrobinett/bluemix-twilio/master/images/twilioconfig.png)
Enter your account SID and auth token [from your dashboard](https://www.twilio.com/user/account) - make su
re to note what you've called the service! It's called "Twilio-qh" in this example.

If you don’t already have a Twilio account you can [sign up for free](https://www.twilio.com/try-twilio).

In order to interact with Bluemix and deploy our application, we'll need to download and install the [Cloud Foundry command line interface](https://www.ng.bluemix.net/docs/#starters/install_cli.html).After we install it we can use the `cf login` command to connect to the Bluemix environment: 

```sh
cf login -a https://api.ng.bluemix.net  -o you@example.com -s dev
```

## Building our Node.js Application
Now that we’ve got our Bluemix foundation in place we can get started writing our Node.js application. First, make sure you have [Node.js installed on your local machine](http://nodejs.org/download/). Once you’ve installed Node.js create a new folder called twilio-bluemix: 

```sh
mkdir twilio-bluemix
```

Within that folder, initialize your Node.js application by running:

```sh
npm init
```

`npm init` will ask you a few questions - nothing too personal. You can accept the default responses for most of them by pressing enter. Now we can install our dependencies. We’ll be using the [Express](http://expressjs.com/) framework and [Twilio helper library](http://twilio.github.io/twilio-node/) in this app: 

```sh
npm install --save express twilio
```

We also want to create a manifest.yml file. This configuration file will let Bluemix know what app we’re deploying and how to run it. Make sure to update the app name to match what you used when you created your application in Bluemix:

```yaml
applications:
- services:
  - Twilio-qh
  name: [your app name]
  command: node app.js
```

Create a new file called `app.js`. This is where our application will live:

```sh
touch app.js
```

Open `app.js` in your favorite text editor or IDE. We’re going to build a basic Express app with one route (`GET /message`):

```javascript
var express = require('express'),
    app = express(),
    twilio = require(‘twilio’);

var port = (process.env.VCAP_APP_PORT || 3000);

app.get('/message', function (req, res) {
  
});

var server = app.listen(port, function () {
  console.log('Example app started')
});
```

You’ll notice right now nothing happens within our `/message` route. This is where we’ll be writing the code that sends the text message with Twilio. Let’s get our Twilio Account ID and Auth Token so we can use them to initialize our Twilio library. Bluemix handles storing all our service credentials, so we can access these within the VCAP_SERVICES environment variable:

```javascript
var express = require('express'),
    app = express(),
    twilio = require(‘twilio’);

var port = (process.env.VCAP_APP_PORT || 3000);

// Pull in Twilio config from the BlueMix environment
// The VCAP_SERVICES environment variable contains a JSON string with all your
// Bluemix environment data
var config = JSON.parse(process.env.VCAP_SERVICES);

// Loop through user-provided config info and pull out our Twilio credentials
var twilioSid, twilioToken;
config['user-provided'].forEach(function(service) {
    if (service.name == 'Twilio-qh') {
        twilioSid = service.credentials.accountSID;
        twilioToken = service.credentials.authToken;
    }
});

app.get('/message', function (req, res) {
  
});

var server = app.listen(port, function () {
  console.log('Example app started')
});
```

Now that we have our Twilio credentials, we can use the `sendMessage` function to send a text message. We’ll do this from within our `/message` route. We’ll supply a `from` number from [our Twilio account](https://www.twilio.com/user/account/phone-numbers/incoming), a `to` number for the person we want to text, and a `body` containing the message. Be sure you replace the placeholder text with your real data:

```javascript
app.get('/message', function (req, res) {
    var client = new twilio.RestClient(twilioSid, twilioToken);

    client.sendMessage({
        to:'your phone number',
        from:'a twilio number you own',
        body:'Brooooooklllllynnnn!'
    }, function(err, message) {
        res.send('Message sent! ID: '+message.sid);
    });
});
```

Now that our code is complete, we can deploy it in the terminal with:
```sh
cf push
```

Once our application is deployed (which should take about 30 seconds), we can send a text message by going visiting our `/message` route from within our browser. Give it a go and be prepared to [do your happy dance](http://giphy.com/gifs/dance-cartoon-EbaEWv3icphQI)!

## What's Next?

Combining Bluemix and Twilio is a great way to add communications to an existing application or to build a completely new application from the ground up. Now that you have the basics you can try even more ideas. Looking for inspiration? Check out the [Twilio developer blog](https://www.twilio.com/blog). Have any questions? Reach out to me: [@rickyrobinett](https://twitter.com/rickyrobinett) or [ricky@twilio.com](mailto:ricky@twilio.com).

