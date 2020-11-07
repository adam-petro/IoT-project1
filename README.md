# Building the IoT with P2P and Cloud computing, Milestone 3
![](https://upload.wikimedia.org/wikipedia/commons/1/10/Raspberry-Pi-3.gif)

This repo contains the solution of the third milestone by team Electric Sky: Olivier Smet, Adam Petro, Jakub Krzyzynski. The following features have been implemented:

- Structured REST API with custom-built middleware that builds HTML website based on the API
- Abstract implementation of plugins that allows to add more sensors/actuators by just modifying the resource file
- CPU temperature readout
- LED state toggle/readout
- DHT11 temperature and humidity readout
- HC-SR04 Ultrasonic Sensor readout
- Front-end dashboard with dynamic structure based on the resource file and updates of displayed state in via websocket

<br>

The app is built using:

- [Azure IOT Hub](https://azure.microsoft.com/en-us/services/iot-hub/) used to implement sensor information storage and communication with devices.
- [Node.js](https://nodejs.org/en/) used to implement the front end/API
- [Express js](https://expressjs.com/) as a middleware to implement REST API resolvers
- [systeminformation](https://github.com/sebhildebrandt/systeminformation) used to read RPi CPU temperature
- [pigpio](https://github.com/fivdi/pigpio) as a JS wrapper for C pigpio library to enable gpio communication
- [node-dht-sensor](https://github.com/momenso/node-dht-sensor) used to read DHT11 temperature and humidity
- Pure HTML/JS/CSS for frontend
- [Docker](https://www.docker.com/) - It works on my machine `¯\_(ツ)_/¯ `

---

To launch the **client** app, follow these instructions:

1. Pull our thing image: `docker pull au679612/au-electric-sky:ms3-thing`
2. Run using `docker run -ti --privileged --env DEVICE_CONNECTION_STRING="insert device string" au679612/au-electric-sky:ms3-thing` (Do include the quotation marks!).
3. Browse the website on https://au-electric-sky-ms3.azurewebsites.net

The device connection strings are as follows:
- For the raspberry pi of the group: `HostName=milestone3Hub.azure-devices.net;DeviceId=electric-sky-pi;SharedAccessKey=CJwUF4BoVBoz+calYVqJKd79VqtGwpmS4KuNehCrTjs=`
- For the raspberry pi of the course staff: `HostName=milestone3Hub.azure-devices.net;DeviceId=grader-pi;SharedAccessKey=8CPwx2o5jXu+NgpaxAKj8sphcRhzzDnsnUYWKzU4nLU=`

---

Our RESTful API supports the following endpoints:
```
|-- /				                Interface 												                                                                        [GET]
  |-- /{deviceId}           Get an overview of the properties of the device, including sensors and actuators. deviceId is either electric-sky-pi or grader-pi [GET]
     |-- /sensors		        Get a list of all sensors with their properties, including their current value				                    [GET]
       |-- /dhtTemperature	Get the properties of the dht temperature sensor (e.g. the unit), along with its current value		      [GET]
       |-- /dhtHumidity		  Get the properties of the dht humidity sensor (e.g. the unit), along with its current value		          [GET]
       |-- /distance		    Get the properties of the ultrasonic distance sensor (e.g. the unit) along with its current value	        [GET]
       |-- /cpuTemperature	Get the properties of the CPU temperature sensor (e.g. the unit) along with its current value		      [GET]
     |-- /actuators		      Get a list of all actuators along with their properties							                                    [GET]
       |-- /leds		        Get the container of all LED actuators along with the nested leds' properties and current values	        [GET]
         |-- /led{1,2,3}	  Get the properties of led {1, 2, 3} along with its current value					                              [GET]
         |-- /led{1,2,3}	  Specifiy a new value for led {1, 2, 3} by sending a request with body {"value": [boolean of new state]}	[PUT]
         |-- /led{1,2,3}	  Toggle the state of led {1, 2, 3} by sending a request with an empty body				                        [PUT]
```
For all of the GET endpoints of the API, except the root path "/", the response can be either in JSON or HTML. HTML is rendered if the request's accept header is "text/html", and JSON is returned in other cases.