'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var predictions = new Schema({
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
        required: null,
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