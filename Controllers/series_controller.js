'use strict'

var mongoose = require('mongoose');
const { Series } = require('../Schema/Series')
const { Season } = require('../Schema/Seasons')
const { ErrorHandler } = require('../utils/ErrorHandler');
const { Response } = require('../utils/Response');
const config = require('./../config')

class SeriesController {
    static async getSeries(req, res) {
        try {
            let series = await Series.aggregate([
                {
                    $match: { leagueId: mongoose.Types.ObjectId(req.query.leagueId), status: 'active' }
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
            return new Response(res, series)
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async getSerieswithMatches(req, res) {
        try {
            console.log('req.query.leagueId', req.query)

            let series = await Series.aggregate([
                {
                    $match: { leagueId: mongoose.Types.ObjectId(req.query.leagueId), status: { $in: ['active', 'completed'] } }
                },
                {
                    $lookup: {
                        from: 'cricketmatches',
                        localField: '_id',
                        foreignField: 'seriesId',
                        as: 'match'
                    }
                },
                { $unwind: { path: "$match", preserveNullAndEmptyArrays: false } },

                {
                    $lookup: {
                        from: 'players',
                        localField: '_id',
                        foreignField: 'match.team1Id',
                        as: 'team1players'
                    }
                }, {
                    $lookup: {
                        from: 'players',
                        localField: 'match.team2Id',
                        foreignField: '_id',
                        as: 'team2players'
                    }
                },
                { $unwind: { path: "$team1players", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$team2players", preserveNullAndEmptyArrays: true } },

                {
                    $lookup: {
                        from: 'cricketteams',
                        localField: 'match.team1Id',
                        foreignField: '_id',
                        as: 'team1'
                    }
                }, {
                    $lookup: {
                        from: 'cricketteams',
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
                        from: "cricketpredictions",
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
                        matches: {
                            $push: {
                                _id: '$match._id',
                                date: '$match.date',
                                time: '$match.time',
                                status: '$match.status',
                                result: '$match.result',
                                points: '$match.points',
                                mostruns: '$match.mostruns',
                                mostwickets: '$match.mostwickets',
                                manofthematch: '$match.manofthematch',
                                firstinningscore: '$match.firstinningscore',
                                team1: {
                                    _id: '$team1._id',
                                    name: '$team1.name',
                                    image: { $concat: [config.LIVE_PATH, '$team1.image'] },
                                    shortname: '$team1.shortname',
                                },
                                team2: {
                                    _id: '$team2._id',
                                    name: '$team2.name',
                                    image: { $concat: [config.LIVE_PATH, '$team2.image'] },
                                    shortname: '$team2.shortname',
                                },
                                prediction: {
                                    points: '$prediction.points',
                                    user_result: '$prediction.user_result',
                                    user_mostruns: '$prediction.user_mostruns',
                                    user_mostwickets: '$prediction.user_mostwickets',
                                    user_manofthematch: '$prediction.user_manofthematch',
                                    user_firstinningscore: '$prediction.user_firstinningscore',
                                }
                            }
                        }
                    }
                },
                { $sort: { name: 1 } }
            ])
            return new Response(res, series)
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async addSeries(req, res) {
        try {
            let series = new Series({
                leagueId: req.body.leagueId,
                seasonId: req.body.seasonId,
                name: req.body.name,
                startDate: new Date(req.body.startDate).getTime(),
                endDate: new Date(req.body.endDate).getTime(),
            })
            await series.save()
            return new Response(res, { success: true }, `Added Successfully`)
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async editSeries(req, res) {
        try {
            let seriesExist = await Series.findOne({ _id: req.body._id })
            console.log(seriesExist)
            await Series.findOneAndUpdate({ _id: seriesExist._id }, { $set: req.body })
            return new Response(res, { success: true }, 'Update Successfully')
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }
    static async deleteSeries(req, res) {
        try {
            let seriesExist = await Series.findOne({ _id: req.query._id })
            console.log(seriesExist)
            await Series.findOneAndUpdate({ _id: seriesExist._id }, { $set: { isActive: false } })
            return new Response(res, { success: true }, 'Delete Successfully')
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }
}

module.exports = { SeriesController }