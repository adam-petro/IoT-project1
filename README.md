# IoT-project1

Repository containing first project for the subject Building the IoT with P2P and Cloud Computing at Aarhus University.

---

This assignment was a simple 3 week project consisting of 3 milestones, each for one week. The project was done in a group of 3 people.
My teammates:
[Olivier Smet](https://github.com/omsmet)
[Jakub Krzyzynski](https://github.com/j-krzyz)

## [First Milestone](https://github.com/adik6555/IoT-project1/tree/milestone1)
_Note: The code quality in this milestone is not the best one and while lots code parts here are nicely done, you should reconsider copying entire chunks of code from this milestone. The reason for that was, that our deadline was approaching faster than anticipated and we simply did not have enough time._

The purpose of this milestone is to get started with the Raspberry Pi, as well as your Docker (and Node.js or Python) skills, if you are a little rusty.

(Note that the WoT book is fairly old fashioned, when it comes to JavaScript, and I would suggest using a more modern style).

You should wire your components as shown on one of the last slides from the Friday lecture, so we can run your code without rewiring.

The correct wiring of components

![Connection schema](https://github.com/adik6555/IoT-project1/blob/master/Pi4_bb.svg?raw=true)

Write a Node.js or Python server that through a Web page reports on the state of the sensors on your RPi.

Your system should ideally contain a Dockerfile that can be built and started on a (sensor connected) RPi, exposing a port so that a Web browser can inspect the state of the sensors.

You should deliver either a zip-file, or, better, a file consisting of the necessary git command to clone your repository.

There should be a `README.md` file in the root with instructions.

## [Second milestone](https://github.com/adik6555/IoT-project1/tree/milestone2)

The purpose of this milestone is realise the Web of Things model, as described in Chapter 6-7, in a model-driven REST API.

You should add two (differently coloured) additional LEDs to your system: make these controllable over GPIO 2 and 22.

You should provide a properly structured REST API for the sensors (and LEDs) attached to your RPi, following the design guidelines from the WoT book.

You should create a Web page that dynamically, through your REST API, retrieves the state of all sensors and LEDs as well as enables the control of the LEDs.

Your system should ideally contain a Dockerfile that can be built and started on a (sensor connected) RPi, exposing a port so that a Web browser can inspect the state of the sensors.

You should deliver either a zip-file, or, better, a file consisting of the necessary git command to clone your repository.

There should be a `README.md` file in the root with instructions, as well as documentation of the REST endpoints and the possible HTTP they can support. Swagger can serve as an inspiration, when it comes to documenting your API.

## [Third milestone](https://github.com/adik6555/IoT-project1/tree/milestone1)
_Note: The code quality in this milestone also has some flaws, mainly due to configuration of azure that took us a bit more time. Same thing as milestone1, think twice before copying._

The purpose of this milestone is to hook up your system, through MQTT, to cloud storage.

Create a storage component, hosted on a public accessible cloud server that can retrieve sensor data from your RPi over MQTT. If you choose, you may also try using EVRYTHNG or roll your own solution (using, e.g., Mosquitto) in order to get a handle on the practicalities of building your own cloud backed solution.

Your Docker image on the RPi should, upon start, connect to a MQTT broker running on your cloud server.

Your cloud instance should also host a Web page that retrieves and displays the collected data, as well as enabling control of LEDs on the RPi.

See the Resources page for information on getting started with MQTT and cloud services.

You should keep your own RPi running, so that we, by running your code on our RPis, can see several RPis in action. If you are using Azure IoTHub, you will have to register two devices: your own RPi, and one that can be used for our testing purposes. Be sure to include the correct Primary Connection String.

You should build your Docker image(s), and upload them to Docker Hub—these should be able to run out of the box. Your source must contain a Dockerfile that can be built and started on a (sensor connected) RPi, as well as Dockerfiles for your cloud side components. You should provide a link to your cloud-hosted Web component.

It is your responsibility that your cloud components are running.

You should deliver either a zip-file, or, better, a file consisting of the necessary git command to clone your repository.

There should be a `README.md` file in the root with instructions, as well as documentation of the REST endpoints and the possible HTTP they can support.
