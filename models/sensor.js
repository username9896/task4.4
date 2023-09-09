const mongoose = require('mongoose');

module.exports = mongoose.model('SensorValues', new mongoose.Schema({
    xdata: String,
    ydata: String,
    zdata: String
}, { collection: 'sensor-data' }));