'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var predictions = new Schema({
    weekId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    matchId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    team1score: {
        type: Number,
        required: true,
    },
    team2score: {
        type: Number,
        required: true,
    },
    points: {
        type: Number,
        required: false,
        default: 0,
    },
    status: {
        type: String,
        default: 'pending'
    },
}, {
    timestamps: true
})
let Prediction = mongoose.model('predictions', predictions);
module.exports = { Prediction }