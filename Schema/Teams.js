'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teams = new Schema({
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
    status: {
        type: String,
        default: 'active'
    },
}, {
    timestamps: true
})
let Team = mongoose.model('teams', teams);
module.exports = { Team }