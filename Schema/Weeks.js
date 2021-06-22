'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var weeks = new Schema({
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
        unique: true,
    },
    startDate: {
        type: String,
        required: true,
    },
    endDate: {
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
let Week = mongoose.model('weeks', weeks);
module.exports = { Week }