'use strict'

var mongoose = require('mongoose');
const { Team } = require('../Schema/Teams')
const { Prediction } = require('../Schema/Predictions')
const { ErrorHandler } = require('../utils/ErrorHandler');
const { Response } = require('../utils/Response');
const config = require('./../config')

class DashboardController {
    static async getWeeklyWinner(req, res) {
        try {
            console.log(req.query)
            let Teams = await Prediction.aggregate([
                {
                    $match: { weekId: mongoose.Types.ObjectId(req.query.weekId) }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: 'userId',
                        as: 'user'
                    }
                },
                { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                {
                    $group: {
                        _id: '$userId',
                        total: { $sum: '$points' },
                    }
                },

                { $sort: { total: -1 } },
                { $limit: 5 }
            ])
            return new Response(res, Teams)
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }
}

module.exports = { DashboardController }



