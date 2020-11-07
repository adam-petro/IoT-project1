# Building the IoT with P2P and Cloud computing, Milestone 1

This repo contains the solution of the first milestone by team Electric Sky: Olivier Smet, Adam Petro, Jakub Krzyzynsky. The following features have been implemented:

- CPU temperature readout
- LED state toggle/readout
- DHT11 temperature and humidity readout
- HC-SR04 Ultrasonic Sensor readout
- Dynamic update of state every second or every LED toggle request

<br>

The app is built using:

- [Node.js](https://nodejs.org/en/) used to implement the backend server
- [Express js](https://expressjs.com/) as a middleware to implement REST API resolvers
- [sse-express](https://github.com/likerRr/sse-express) - a middleware to simplify server-sent events in express used to dynamically update the RPi sensor status to the frontend
- [systeminformation](https://github.com/sebhildebrandt/systeminformation) used to read RPi CPU temperature
- [pigpio](https://github.com/fivdi/pigpio) as a JS wrapper for C pigpio library to enable gpio communication
- [pigpio-dht](https://github.com/depuits/pigpio-dht) used to read DHT11 temperature and humidity
- Pure HTML/JS/CSS for frontend
- [Docker](https://www.docker.com/) - It works on my machine `¯\_(ツ)_/¯ `

---

To launch the app, follow these instructions:

1. Clone our repository: `git clone https://gitlab.au.dk/electric-sky/milestone1.git`
2. Build the docker image using `docker build -t ms1 .`
3. Run using `docker run -ti --privileged -p 80:8080 ms1` (Needs to be run in privileged mode in order to access the GPIO of RPi).
4. Browse at http://your-ip-here
