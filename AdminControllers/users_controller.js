'use strict'

var mongoose = require('mongoose');
const { User } = require('../Schema/Users')
const { ErrorHandler } = require('../utils/ErrorHandler');
const { Response } = require('../utils/Response');

class UsersController {
    static async getUsers(req, res) {
        try {
            let user = await User.aggregate([
                {
                    $project: {
                        _id: '$_id',
                        firstname: '$firstname',
                        lastname: '$lastname',
                        mobileno: '$mobileno',
                        email: '$email',
                        gender: '$gender',
                        status: '$isEmailVerified',
                        createdAt: '$createdAt',
                    }
                },
            ])
            return new Response(res, user)
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }
}

module.exports = { UsersController }
