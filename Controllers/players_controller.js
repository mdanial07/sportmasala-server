'use strict'

var mongoose = require('mongoose');
const { CricketPlayer } = require('../Schema/CricketPlayers')
const { ErrorHandler } = require('../utils/ErrorHandler');
const { Response } = require('../utils/Response');
const config = require('./../config')

class CricketPlayersController {
    static async getCricketPlayers(req, res) {
        try {
            console.log(req.query)
            let query = JSON.parse(req.query.type).length > 0
                ? { type: { $in: JSON.parse(req.query.type) }, teamId: { $in: [mongoose.Types.ObjectId(req.query.team1Id), mongoose.Types.ObjectId(req.query.team2Id)] } }
                : { teamId: { $in: [mongoose.Types.ObjectId(req.query.team1Id), mongoose.Types.ObjectId(req.query.team2Id)] } }

            let player = await CricketPlayer.aggregate([
                {
                    $match: { ...query, status: 'active' }
                }, {
                    $lookup: {
                        from: 'cricketteams',
                        localField: 'teamId',
                        foreignField: '_id',
                        as: 'team'
                    }
                },
                { $unwind: { path: "$team", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: '$_id',
                        name: '$name',
                        type: '$type',
                        status: '$status',
                        teamId: '$teamId',
                        team: {
                            _id: '$team._id',
                            name: '$team.name',
                            image: { $concat: [config.LIVE_PATH, '$team.image'] },
                            shortname: '$team.shortname',
                            stadium: '$team.stadium',
                        },
                    }
                },
                { $sort: { name: 1 } }
            ])
            return new Response(res, player)
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async addCricketPlayer(req, res) {
        try {
            let player = await CricketPlayer.findOne({ name: req.body.name, teamId: mongoose.Types.ObjectId(req.body.teamId) })
            if (player) { throw { code: 400, message: 'Player already exist with same nane' } } else {
                let player = await CricketPlayer({
                    ...req.body
                })
                await player.save()
                return new Response(res, { success: true }, 'Added Successfully')
            }
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async editCricketPlayer(req, res) {
        try {
            let playerExist = await CricketPlayer.findOne({ _id: req.body._id })
            console.log(playerExist)
            await CricketPlayer.findOneAndUpdate({ _id: playerExist._id }, { $set: req.body })
            return new Response(res, { success: true }, 'Update Successfully')
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async editCricketPlayer(req, res) {
        try {
            let playerExist = await CricketPlayer.findOne({ _id: req.body._id })
            console.log(playerExist)
            await CricketPlayer.findOneAndUpdate({ _id: playerExist._id }, { $set: req.body })
            return new Response(res, { success: true }, 'Update Successfully')
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async deleteCricketPlayer(req, res) {
        try {
            let playerExist = await CricketPlayer.findOne({ _id: req.query._id })
            console.log(playerExist)
            await CricketPlayer.findOneAndUpdate({ _id: playerExist._id }, { $set: { isActive: false } })
            return new Response(res, { success: true }, 'Delete Successfully')
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }
}

module.exports = { CricketPlayersController }
