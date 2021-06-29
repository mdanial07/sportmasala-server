'use strict'

var mongoose = require('mongoose');
const { Series } = require('../Schema/Series')
const { CricketMatch } = require('../Schema/CricketMatches')
const { ErrorHandler } = require('../utils/ErrorHandler');
const { Response } = require('../utils/Response');
const config = require('./../config')

class CricketMatchsController {
    static async getCricketMatches(req, res) {
        try {
            console.log(req.query)
            let activeSeries = await Series.findOne({ leagueId: mongoose.Types.ObjectId(req.query.leagueId), status: 'active' })
            console.log(activeSeries)


            let cricketMatch = await CricketMatch.aggregate([
                {
                    $match: { seriesId: activeSeries._id }
                }, {
                    $lookup: {
                        from: 'cricketteams',
                        localField: 'team1Id',
                        foreignField: '_id',
                        as: 'team1'
                    }
                }, {
                    $lookup: {
                        from: 'cricketteams',
                        localField: 'team2Id',
                        foreignField: '_id',
                        as: 'team2'
                    }
                },
                { $unwind: { path: "$team1", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$team2", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'series',
                        localField: 'seriesId',
                        foreignField: '_id',
                        as: 'series'
                    }
                },
                { $unwind: { path: "$series", preserveNullAndEmptyArrays: true } },

                {
                    $group: {
                        _id: {
                            month: { $month: "$date" },
                            day: { $dayOfMonth: "$date" },
                            year: { $year: "$date" }
                        },
                        date: { $first: "$date" },
                        matches: {
                            $push: {
                                _id: '$_id',
                                date: '$date',
                                time: '$time',
                                ground: '$ground',
                                status: '$status',
                                series: '$series.name',
                                createdAt: '$createdAt',
                                team1: {
                                    _id: '$team1._id',
                                    name: '$team1.name',
                                    image: { $concat: [config.LIVE_PATH, '$team1.image'] },
                                    shortname: '$team1.shortname',
                                    stadium: '$team1.stadium',
                                },
                                team2: {
                                    _id: '$team2._id',
                                    name: '$team2.name',
                                    image: { $concat: [config.LIVE_PATH, '$team2.image'] },
                                    shortname: '$team2.shortname',
                                    stadium: '$team2.stadium',
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        date: {
                            $dateToString: { format: "%Y-%m-%d", date: "$date" }
                        },
                        matches: '$matches',
                    }
                },
                { $sort: { date: 1 } }
            ])
            return new Response(res, cricketMatch)
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async addCricketMatch(req, res) {
        try {
            let cricketMatch = await CricketMatch({
                ...req.body,
                date: new Date(req.body.date),
            })
            await cricketMatch.save()
            return new Response(res, { success: true }, 'Added Successfully')
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async editCricketMatch(req, res) {
        try {
            let cricketMatchExist = await CricketMatch.findOne({ _id: req.body._id })
            console.log(cricketMatchExist)
            await CricketMatch.findOneAndUpdate({ _id: cricketMatchExist._id }, { $set: req.body })
            return new Response(res, { success: true }, 'Update Successfully')
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async deleteCricketMatch(req, res) {
        try {
            let cricketMatchExist = await CricketMatch.findOne({ _id: req.query._id })
            console.log(cricketMatchExist)
            await CricketMatch.findOneAndUpdate({ _id: cricketMatchExist._id }, { $set: { isActive: false } })
            return new Response(res, { success: true }, 'Delete Successfully')
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }
}

module.exports = { CricketMatchsController }
