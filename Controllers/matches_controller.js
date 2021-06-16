'use strict'

var mongoose = require('mongoose');
const { Match } = require('../Schema/Matches')
const { ErrorHandler } = require('../utils/ErrorHandler');
const { Response } = require('../utils/Response');
const config = require('./../config')

class MatchesController {
    static async getMatches(req, res) {
        try {
            let match = await Match.aggregate([
                {
                    $lookup: {
                        from: 'teams',
                        localField: 'team1Id',
                        foreignField: '_id',
                        as: 'team1'
                    }
                }, {
                    $lookup: {
                        from: 'teams',
                        localField: 'team2Id',
                        foreignField: '_id',
                        as: 'team2'
                    }
                },
                { $unwind: { path: "$team1", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$team2", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: '$_id',
                        name: '$name',
                        date: '$date',
                        time: '$time',
                        status: '$status',
                        createdAt: '$createdAt',
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
                        }
                    }
                },
            ])
            return new Response(res, match)
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async addMatch(req, res) {
        try {
            let match = new Match({
                ...req.body,
                date: new Date(req.body.date),
            })
            await match.save()
            return new Response(res, { success: true }, `Added Successfully`)
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async editMatch(req, res) {
        try {
            let matchExist = await Match.findOne({ _id: req.body._id })
            console.log(matchExist)
            await Match.findOneAndUpdate({ _id: matchExist._id }, { $set: req.body })
            return new Response(res, { success: true }, 'Update Successfully')
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }
    static async deleteMatch(req, res) {
        try {
            let matchExist = await Match.findOne({ _id: req.query._id })
            console.log(matchExist)
            await Match.findOneAndUpdate({ _id: matchExist._id }, { $set: { isActive: false } })
            return new Response(res, { success: true }, 'Delete Successfully')
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }
}

module.exports = { MatchesController }
