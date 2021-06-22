'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var leagues = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        default: 'active'
    },
}, {
    timestamps: true
})
let League = mongoose.model('leagues', leagues);
module.exports = { League }