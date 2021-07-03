'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var player = new Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        unique: true,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'pending'
    },
}, {
    timestamps: true
})
let CricketPlayer = mongoose.model('players', player);
module.exports = { CricketPlayer }