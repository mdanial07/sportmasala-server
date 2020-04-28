'use strict'

const { ErrorHandler } = require('../utils/ErrorHandler')
const { Response } = require('../utils/Response')
const { User } = require('../Schemas/Users');

module.exports = {
    async getUsers(req, res) {
        try {
            let users = await User.find({})
            return new Response(res, users)
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    },
}