'use strict'
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

let userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    mobileno: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    address: String,
    platform: String,
    type: String,
    passwordResetToken: String,
    emailVerificationToken: String,
    authToken: String,
    token: String,
},
    {
        timestamps: true
    })

userSchema.pre('save', function modifyPassword(next) {
    const user = this;
    if (!user.isModified('password')) {
        next();
    } else {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                next(err);
            } else {
                bcrypt.hash(user.password, salt, undefined, (e, hash) => {
                    if (e) {
                        next(e);
                    } else {
                        user.password = hash;
                        next();
                    }
                });
            }
        });
    }
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, (err, isCorrect) => {
        callback(err, isCorrect);
    });
};
userSchema.index({ email: 1 }, { unique: true })

let User = mongoose.model('User', userSchema)
module.exports = { User }
