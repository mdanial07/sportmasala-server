'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cricketpredictions = new Schema({
    leagueId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    seriesId: {
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
    user_firstinningscore: {
        type: Number,
        default: null,
    },
    user_manofthematch: {
        type: String,
        default: null,
    },
    user_mostwickets: {
        type: String,
        default: null,
    },
    user_mostruns: {
        type: String,
        default: null,
    },
    user_result: {
        type: String,
        default: null,
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
let CricketPrediction = mongoose.model('cricketpredictions', cricketpredictions);
module.exports = { CricketPrediction }