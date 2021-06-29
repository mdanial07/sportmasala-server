'use strict'

var mongoose = require('mongoose');
const { Week } = require('../Schema/Weeks')
const { Season } = require('../Schema/Seasons')
const { ErrorHandler } = require('../utils/ErrorHandler');
const { Response } = require('../utils/Response');
const config = require('./../config')

class WeeksController {
    static async getWeeks(req, res) {
        try {
            let activeSeason = await Season.findOne({ leagueId: mongoose.Types.ObjectId(req.query.leagueId), status: 'active' })
            console.log(activeSeason)

            let week = []
            if (activeSeason) {
                week = await Week.aggregate([
                    {
                        $match: { seasonId: mongoose.Types.ObjectId(activeSeason._id), status: 'active' }
                    },
                    {
                        $project: {
                            _id: '$_id',
                            name: '$name',
                            endDate: '$endDate',
                            startDate: '$startDate',
                            status: '$status',
                            createdAt: '$createdAt',
                        }
                    },
                    { $sort: { name: 1 } }
                ])
            }
            return new Response(res, week)
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async getWeekswithMatches(req, res) {
        try {
            let activeSeason = await Season.findOne({ leagueId: mongoose.Types.ObjectId(req.query.leagueId), status: 'active' })
            console.log(activeSeason)

            let week = []
            if (activeSeason) {
                week = await Week.aggregate([
                    {
                        $match: { seasonId: mongoose.Types.ObjectId(activeSeason._id), status: { $in: ['active', 'completed'] } }
                    },
                    {
                        $lookup: {
                            from: 'matches',
                            localField: '_id',
                            foreignField: 'weekId',
                            as: 'match'
                        }
                    },
                    { $unwind: { path: "$match", preserveNullAndEmptyArrays: false } },

                    {
                        $lookup: {
                            from: 'teams',
                            localField: 'match.team1Id',
                            foreignField: '_id',
                            as: 'team1'
                        }
                    }, {
                        $lookup: {
                            from: 'teams',
                            localField: 'match.team2Id',
                            foreignField: '_id',
                            as: 'team2'
                        }
                    },
                    { $unwind: { path: "$team1", preserveNullAndEmptyArrays: true } },
                    { $unwind: { path: "$team2", preserveNullAndEmptyArrays: true } },
                    {
                        $lookup:
                        {
                            from: "predictions",
                            let: { matchId: "$match._id", userId: mongoose.Types.ObjectId(req.query.userId) },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ["$matchId", "$$matchId"] },
                                                { $eq: ["$userId", "$$userId"] }
                                            ]
                                        }
                                    }
                                },
                            ],
                            as: "prediction"
                        }
                    },
                    { $unwind: { path: "$prediction", preserveNullAndEmptyArrays: true } },

                    {
                        $group: {
                            _id: '$_id',
                            name: { "$first": "$name" },
                            endDate: { "$first": "$endDate" },
                            startDate: { "$first": "$startDate" },
                            status: { "$first": "$status" },
                            createdAt: { "$first": "$createdAt" },
                            checkweekstatus: { "$first": "noncurrent" },
                            matches: {
                                $push: {
                                    _id: '$match._id',
                                    date: '$match.date',
                                    time: '$match.time',
                                    team1result: '$match.team1result',
                                    team2result: '$match.team2result',
                                    status: '$match.status',
                                    points: '$prediction.points',
                                    team1: {
                                        _id: '$team1._id',
                                        name: '$team1.name',
                                        image: { $concat: [config.LIVE_PATH, '$team1.image'] },
                                        shortname: '$team1.shortname',
                                        stadium: '$team1.stadium',
                                        score: '$prediction.team1score',
                                    },
                                    team2: {
                                        _id: '$team2._id',
                                        name: '$team2.name',
                                        image: { $concat: [config.LIVE_PATH, '$team2.image'] },
                                        shortname: '$team2.shortname',
                                        stadium: '$team2.stadium',
                                        score: '$prediction.team2score',
                                    }
                                }
                            }
                        }
                    },
                    { $sort: { name: 1 } }
                ])
            }
            return new Response(res, week)
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async getWeekbyCurrentDate(req, res) {
        try {
            console.log(req.query.leagueId)
            let activeSeason = await Season.findOne({ leagueId: mongoose.Types.ObjectId(req.query.leagueId), status: 'active' })
            console.log(activeSeason)

            let week = []
            if (activeSeason) {
                week = await Week.aggregate([
                    {
                        $match: { startDate: { $lt: req.query.date }, endDate: { $gt: req.query.date }, seasonId: mongoose.Types.ObjectId(activeSeason._id), status: 'active' }
                    },
                    {
                        $project: {
                            _id: '$_id',
                            name: '$name',
                            endDate: '$endDate',
                            startDate: '$startDate',
                            status: '$status',
                            createdAt: '$createdAt',
                        }
                    },
                ])
            }
            return new Response(res, week)
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async addWeek(req, res) {
        try {
            let week = new Week({
                leagueId: req.body.leagueId,
                seasonId: req.body.seasonId,
                name: req.body.name,
                startDate: new Date(req.body.startDate).getTime(),
                endDate: new Date(req.body.endDate).getTime(),
            })
            await week.save()
            return new Response(res, { success: true }, `Added Successfully`)
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async editWeek(req, res) {
        try {
            let weekExist = await Week.findOne({ _id: req.body._id })
            console.log(weekExist)
            await Week.findOneAndUpdate({ _id: weekExist._id }, { $set: req.body })
            return new Response(res, { success: true }, 'Update Successfully')
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }
    static async deleteWeek(req, res) {
        try {
            let weekExist = await Week.findOne({ _id: req.query._id })
            console.log(weekExist)
            await Week.findOneAndUpdate({ _id: weekExist._id }, { $set: { isActive: false } })
            return new Response(res, { success: true }, 'Delete Successfully')
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }
}

module.exports = { WeeksController }
