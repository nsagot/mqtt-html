# Script MQTT -> API RESTful

Script that make an interface between MQTT topics and a HTTP RESTful API

## Configuration

Obviously: **npm install**

Put your topics here

```Javascript
const TO_SUBSCRIBE = ['humidite'];
```

Change the MQTT host (to have encrypted connection please refer you [MQTT.js](https://github.com/mqttjs/MQTT.js) documentation)

```Javascript
const MQTT_HOST = '127.0.0.1';
```

Change the HTTP port

```Javascript
const HTTP_PORT = 3000;
```

## Usage

Every topic that is on *subscribeList* is available with this URL http://HOSTNAME:PORT/TOPIC

### Example

*Example topic temperature*

http://HOSTNAME:PORT/temperature

Response:

```json
{
  "message": "43.22",
  "date": 1498222988924
}
```

- Message : (String) Received message
- Date : Timestamp

### All

Get all registered topics

http://HOSTNAME:PORT/all

Response:

```json
{
	"temperature": {
  		"message": "43.22",
  		"date": 1498222988924
	},
  	"door/opened": {
  		"message": "false",
  		"date": 1498222988924
	}
}
```

### Empty data

http://HOSTNAME:PORT/unknown

Response:

```json
{
  "message": null,
  "date": null
}
```



