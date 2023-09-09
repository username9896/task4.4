const express = require('express');
const mongoose = require('mongoose')
const mqtt = require('mqtt');
const bodyParser = require('body-parser');
const Sensordata = require('./models/sensor');

mongoose.connect(
    "mongodb+srv://Vicky1234:Vicky12345@cluster0.6vg99a2.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const plotly = require("plotly")("mathanswers222", "4IhLHqeYSHXe6R5JqAik");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const port = 5003;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const URL = 'mqtt://localhost:1884';
const xValue = 'xvalue: '
const yValue = 'yvalue: '
const zValue = 'zvalue: '

const client = mqtt.connect(URL);

client.on('connect', function () {
    console.log('Connected to MQTT broker');

    client.subscribe(xValue, function (err) {
        if (err) {
            console.error('Failed: ', err);
        } else {
            console.log('Subscribed: ', xValue);
        }
    });

    client.subscribe(yValue, function (err) {
        if (err) {
            console.error('Failed: ', err);
        } else {
            console.log('Subscribed: ', yValue);
        }
    });

    client.subscribe(zValue, function (err) {
        if (err) {
            console.error('Failed: ', err);
        } else {
            console.log('Subscribed: ', zValue);
        }
    });
});

a = 0;
b = 0;
c = 0;

const data = [{
    x: [],
    y: [],
    z: [],
    mode: 'lines', // Specify the mode as 'lines' for a line chart
    type: "scatter3d" // Set the type to "scatter3d" for a 3D scatter plot
}];

client.on('message', function (topic, message) {
    // console.log(topic, ' ', message.toString());

    if (topic === 'xvalue: ') {
        a = message;

    } else if (topic === 'yvalue: ') {
        b = message;
    }
    else if (topic == 'zvalue: ') {
        c = message;
    }

    if (c && a && b) {
        const NewDevice = new Sensordata({
            xdata: a,
            ydata: b,
            zdata: c
        })

        NewDevice.save().then(doc => {
            data[0].x.push(a.toString()); // Corrected data structure and array indexing
            data[0].y.push(b.toString()); // Corrected data structure and array indexing
            data[0].z.push(c.toString()); // Corrected data structure and array indexing

            var option = {
                filename: "SensorValues", fileopt:
                    "overwrite"
            };

            plotly.plot(data, option, function (err) {
                if (err) {
                    console.error("Error:", err);
                }
                else {
                    console.log("Data Stored at plotly!");
                }
            });
        })
    }
})

app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
});