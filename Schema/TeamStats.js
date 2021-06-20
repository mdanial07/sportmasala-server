'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teamstats = new Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    points: {
        type: Number,
        required: false,
        default: 0
    },
    played: {
        type: Number,
        required: false,
        default: 0
    },
    won: {
        type: Number,
        required: false,
        default: 0
    },
    lost: {
        type: Number,
        required: false,
        default: 0
    },
    draw: {
        type: Number,
        required: false,
        default: 0
    },
    status: {
        type: String,
        default: 'active'
    },
}, {
    timestamps: true
})
let TeamStats = mongoose.model('teamstats', teamstats);
module.exports = { TeamStats }