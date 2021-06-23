'use strict'

var mongoose = require('mongoose');
const { Team } = require('../Schema/Teams')
const { Week } = require('../Schema/Weeks')
const { Prediction } = require('../Schema/Predictions')
const { ErrorHandler } = require('../utils/ErrorHandler');
const { Response } = require('../utils/Response');
const config = require('./../config')

class DashboardController {
    static async getWeeklyWinner(req, res) {
        try {
            let week = await Week.find({ status: 'completed' }).sort({ createdAt: -1 }).limit(1)
            let Winners = await Prediction.aggregate([
                {
                    $match: { weekId: mongoose.Types.ObjectId(week[0]._id) }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                {
                    $group: {
                        _id: '$userId',
                        total: { $sum: '$points' },
                        matchId: { "$first": "$matchId" },
                        firstname: { "$first": "$user.firstname" },
                        lastname: { "$first": "$user.lastname" },
                    }
                },

                { $sort: { total: -1 } },
                { $limit: 3 }
            ])
            return new Response(res, Winners)
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async getYearlyWinner(req, res) {
        try {
            console.log(req.query)
            let Winners = await Prediction.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                {
                    $group: {
                        _id: '$userId',
                        total: { $sum: '$points' },
                        matchId: { "$first": "$matchId" },
                        firstname: { "$first": "$user.firstname" },
                        lastname: { "$first": "$user.lastname" },
                    }
                },

                { $sort: { total: -1 } },
                { $limit: 5 }
            ])
            return new Response(res, Winners)
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async getUserWidgetsPoints(req, res) {
        try {
            console.log(req.query.userId)
            let week = await Week.find({ status: 'completed' }).sort({ createdAt: -1 }).limit(1)
            let UserYearlyPoints = await Prediction.aggregate([
                {
                    $match: { userId: mongoose.Types.ObjectId(req.query.userId) }
                }, {
                    $group: {
                        _id: '$userId',
                        total: { $sum: '$points' },
                    }
                },
            ])

            let UserWeeklyPoints = await Prediction.aggregate([
                {
                    $match: { userId: mongoose.Types.ObjectId(req.query.userId), weekId: mongoose.Types.ObjectId(week[0]._id) }
                }, {
                    $group: {
                        _id: '$userId',
                        total: { $sum: '$points' },
                    }
                },
            ])
            console.log(UserWeeklyPoints)
            let obj = {
                yearly: UserYearlyPoints.length > 0 ? UserYearlyPoints[0].total : 0,
                weekly: UserWeeklyPoints.length > 0 ? UserWeeklyPoints[0].total : 0,
            }
            return new Response(res, obj)
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }
}

module.exports = { DashboardController }



