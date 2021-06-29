'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tours = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    type: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'active'
    },
}, {
    timestamps: true
})
let Tour = mongoose.model('tours', tours);
module.exports = { Tour }