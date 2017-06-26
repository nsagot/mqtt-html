const mqtt = require('mqtt');
const express = require('express');

// Configuration
const TO_SUBSCRIBE = ['humidite'];
const MQTT_HOST = '127.0.0.0';
const HTTP_PORT = 3000;
//

const client = mqtt.connect(`mqtt://${MQTT_HOST}`);
const app = express();
const flashMemory = {};
let server;
let httpConnected = false;

const defaultData = { message: null, date: null };
for (let i = 0; i < TO_SUBSCRIBE.length; i += 1) {
  flashMemory[TO_SUBSCRIBE[i]] = defaultData;
}

// Trigger when new message
function newMessage(topic, message) {
  flashMemory[topic.toString()] = {
    message: message.toString(),
    date: new Date().getTime(),
  };
}

// Init when successful connection
function init() {
  server = app.listen(HTTP_PORT, () => {
    httpConnected = true;
  });

  for (let i = 0; i < TO_SUBSCRIBE.length; i += 1) {
    client.subscribe(TO_SUBSCRIBE[i]);
    app.get(`/${TO_SUBSCRIBE[i]}`, (req, res) => {
      if (Object.prototype.hasOwnProperty.call(flashMemory, TO_SUBSCRIBE[i])) {
        res.json(flashMemory[TO_SUBSCRIBE[i]]);
      } else {
        res.json(defaultData);
      }
    });
  }

  // /all get all topic registered
  app.get('/all', (req, res) => {
    res.json(flashMemory);
  });

  // Global redirection if no registered
  app.all('*', (req, res) => {
    res.json(defaultData);
  });

  console.log('* MQTT->HTTP Ready *');
}

client.on('connect', init);
client.on('error', (err) => { console.log(err); });
client.on('message', newMessage);

client.on('close', () => {
  console.log('* Signal close: Shutdown script *');
  if (httpConnected) {
    server.close();
  } else {
    console.error('* Impossible MQTT connection *');
  }
  process.exit(1);
});
