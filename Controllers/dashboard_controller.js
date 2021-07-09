'use strict'

var mongoose = require('mongoose');
const { Team } = require('../Schema/Teams')
const { Series } = require('../Schema/Series')
const { Week } = require('../Schema/Weeks')
const { Season } = require('../Schema/Seasons')
const { Prediction } = require('../Schema/Predictions')
const { CricketPrediction } = require('../Schema/CricketPrediction')
const { ErrorHandler } = require('../utils/ErrorHandler');
const { Response } = require('../utils/Response');
const config = require('./../config')

class DashboardController {
    static async getWeeklyWinner(req, res) {
        try {
            let week = await Week.findOne({ status: 'completed' }).sort({ createdAt: -1 }).limit(1)
            let activeSeason = await Season.findOne({ leagueId: mongoose.Types.ObjectId(req.query.leagueId), status: 'active' })

            if (week && activeSeason) {
                let Winners = await Prediction.aggregate([
                    {
                        $match: { weekId: mongoose.Types.ObjectId(week._id), seasonId: mongoose.Types.ObjectId(activeSeason._id), }
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
            } else {
                return new Response(res, [])
            }
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async getSeriesWinner(req, res) {
        try {

            let series = await Series.findOne({ status: 'active' }).sort({ createdAt: -1 }).limit(1)
            console.log(series)

            if (series) {
                let Winners = await CricketPrediction.aggregate([
                    {
                        $match: { seriesId: mongoose.Types.ObjectId(series._id) }
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
                            updatedAt: { "$first": "$updatedAt" },
                        }
                    },

                    { $sort: { total: -1, updatedAt: 1 } },
                    { $limit: 3 }
                ])
                return new Response(res, Winners)
            } else {
                return new Response(res, [])
            }
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
            let week = await Week.findOne({ status: 'completed' }).sort({ createdAt: -1 }).limit(1)
            let activeSeason = await Season.findOne({ leagueId: mongoose.Types.ObjectId(req.query.leagueId), status: 'active' })
            console.log(week)
            console.log(activeSeason)
            let UserYearlyPoints = []
            if (activeSeason) {
                UserYearlyPoints = await Prediction.aggregate([
                    {
                        $match: { userId: mongoose.Types.ObjectId(req.query.userId), seasonId: mongoose.Types.ObjectId(activeSeason._id) }
                    }, {
                        $group: {
                            _id: '$userId',
                            total: { $sum: '$points' },
                        }
                    },
                ])
            }
            let UserWeeklyPoints = [];
            if (week && activeSeason) {
                UserWeeklyPoints = await Prediction.aggregate([
                    {
                        $match: {
                            userId: mongoose.Types.ObjectId(req.query.userId), seasonId: mongoose.Types.ObjectId(activeSeason._id), weekId: mongoose.Types.ObjectId(week._id)
                        }
                    },
                    {
                        $group: {
                            _id: '$userId',
                            total: { $sum: '$points' },
                        }
                    },
                ])
            }
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



