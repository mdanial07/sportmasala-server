'use strict'

var mongoose = require('mongoose');
const { Match } = require('../Schema/Matches')
const { Team } = require('../Schema/Teams')
const { TeamStats } = require('../Schema/TeamStats')
const { Prediction } = require('../Schema/Predictions')
const { ErrorHandler } = require('../utils/ErrorHandler');
const { Response } = require('../utils/Response');
const config = require('./../config')

class MatchesController {
    static async getMatches(req, res) {
        try {
            console.log(req.query)
            let obj = req.query.weekId ? { weekId: mongoose.Types.ObjectId(req.query.weekId) } : { status: 'pending' }
            console.log(obj)

            let match = await Match.aggregate([
                {
                    $match: { ...obj }
                }, {
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
                                status: '$status',
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

    /*
    Correct Results 40 points
    Correct Goals 20  points
    1st team correct goals 20 points
    2nd team correct goals 20 points
    */

    static async updateMatchwithResult(req, res) {
        console.log(req.body)
        try {
            let correctResultTeam1 = req.body.team1result
            let correctResultTeam2 = req.body.team2result

            let matchExist = await Match.findOne({ _id: mongoose.Types.ObjectId(req.body._id) })
            if (matchExist) {
                let predictionExist = await Prediction.find({ matchId: mongoose.Types.ObjectId(req.body._id) })
                console.log(predictionExist)
                if (predictionExist) {
                    predictionExist.map(async predic => {
                        let Score = 0

                        //Correct Result
                        if (predic.team1score > predic.team2score && correctResultTeam1 > correctResultTeam2) {
                            Score += 40
                        } else if (predic.team1score < predic.team2score && correctResultTeam1 < correctResultTeam2) {
                            Score += 40
                        } else if (correctResultTeam1 == correctResultTeam2) {
                            if (predic.team1score == predic.team2score) {
                                Score += 40
                            }
                        }

                        //Correct Total Goals
                        if ((Number(predic.team1score) + Number(predic.team2score)) == (Number(correctResultTeam1) + Number(correctResultTeam2))) {
                            Score += 20
                        }

                        //Correct Team Goals
                        if (predic.team1score == correctResultTeam1 && predic.team2score == correctResultTeam2) {
                            Score += 40
                        } else if (predic.team1score == correctResultTeam1 && predic.team2score != correctResultTeam2) {
                            Score += 20
                        } else if (predic.team1score != correctResultTeam1 && predic.team2score == correctResultTeam2) {
                            Score += 20
                        }
                        console.log('Score', Score)
                        await Prediction.findOneAndUpdate({ _id: predic._id }, { $set: { points: Score, status: 'completed' } })

                    })
                }
                await Match.findOneAndUpdate({ _id: matchExist._id }, { $set: { team1result: Number(req.body.team1result), team2result: Number(req.body.team2result), status: 'completed' } })
                let team1StatsExist = await TeamStats.findOne({ teamId: mongoose.Types.ObjectId(matchExist.team1Id) })
                let team2StatsExist = await TeamStats.findOne({ teamId: mongoose.Types.ObjectId(matchExist.team2Id) })

                if (correctResultTeam1 == correctResultTeam2) {
                    await TeamStats.findOneAndUpdate({ _id: team1StatsExist._id }, { $set: { points: Number(team1StatsExist.points) + 1, draw: Number(team1StatsExist.draw) + 1, played: Number(team1StatsExist.played) + 1 } })
                    await TeamStats.findOneAndUpdate({ _id: team2StatsExist._id }, { $set: { points: Number(team2StatsExist.points) + 1, draw: Number(team2StatsExist.draw) + 1, played: Number(team1StatsExist.played) + 1 } })
                } else if (correctResultTeam1 > correctResultTeam2) {
                    await TeamStats.findOneAndUpdate({ _id: team1StatsExist._id }, { $set: { points: Number(team1StatsExist.points) + 3, won: Number(team1StatsExist.won) + 1, played: Number(team1StatsExist.played) + 1 } })
                    await TeamStats.findOneAndUpdate({ _id: team2StatsExist._id }, { $set: { lost: Number(team2StatsExist.lost) + 1, played: Number(team1StatsExist.played) + 1 } })
                } else if (correctResultTeam1 < correctResultTeam2) {
                    await TeamStats.findOneAndUpdate({ _id: team1StatsExist._id }, { $set: { lost: Number(team1StatsExist.lost) + 1, played: Number(team1StatsExist.played) + 1 } })
                    await TeamStats.findOneAndUpdate({ _id: team2StatsExist._id }, { $set: { points: Number(team2StatsExist.points) + 3, won: Number(team2StatsExist.won) + 1, played: Number(team1StatsExist.played) + 1 } })
                }
            }

            return new Response(res, { success: true }, 'Update Successfully')
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
