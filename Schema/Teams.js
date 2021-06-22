'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teams = new Schema({
    leagueId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    seasonId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
    },
    shortname: {
        type: String,
        required: true,
    },
    stadium: {
        type: String,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true
})
let Team = mongoose.model('teams', teams);
module.exports = { Team }