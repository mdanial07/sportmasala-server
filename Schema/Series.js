'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var series = new Schema({
    leagueId: {
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
let Series = mongoose.model('series', series);
module.exports = { Series }