'use strict'

var mongoose = require('mongoose');
const { Prediction } = require('../Schema/Predictions')
const { Match } = require('../Schema/Matches')
const { Week } = require('../Schema/Weeks')
const { ErrorHandler } = require('../utils/ErrorHandler');
const { Response } = require('../utils/Response');

class PredictionsController {
    static async getPredictions(req, res) {
        try {
            let prediction = await Prediction.aggregate([
                {
                    $project: {
                        _id: '$_id',
                        weekId: '$weekId',
                        matchId: '$matchId',
                        userId: '$userId',
                        team1score: '$team1score',
                        team2score: '$team2score',
                        points: '$points',
                        status: '$status',
                        createdAt: '$createdAt',
                    }
                },
            ])
            return new Response(res, prediction)
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async addPrediction(req, res) {
        try {

            let weekExist = await Week.findOne({ _id: req.body.weekId })

            let matchExist = await Match.findOne({ _id: req.body.matchId })
            if (matchExist.status != 'pending') { throw { code: 400, message: 'Prediction time is over becuase match has been started' } } else {
                let predictionExist = await Prediction.findOne({ matchId: req.body.matchId, userId: req.body.userId })
                if (predictionExist) {
                    await Prediction.findOneAndUpdate({ _id: predictionExist._id }, { $set: req.body })
                    return new Response(res, { success: true }, `Update Successfully`)
                } else {
                    let prediction = new Prediction({
                        ...req.body,
                        leagueId: weekExist.leagueId,
                        seasonId: weekExist.seasonId,
                    })
                    await prediction.save()
                    return new Response(res, { success: true }, `Added Successfully`)
                }
            }
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async editPrediction(req, res) {
        try {
            let predictionExist = await Prediction.findOne({ _id: req.body._id })
            console.log(predictionExist)
            await Prediction.findOneAndUpdate({ _id: predictionExist._id }, { $set: req.body })
            return new Response(res, { success: true }, 'Update Successfully')
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }
    static async deletePrediction(req, res) {
        try {
            let predictionExist = await Prediction.findOne({ _id: req.query._id })
            console.log(predictionExist)
            await Prediction.findOneAndUpdate({ _id: predictionExist._id }, { $set: { isActive: false } })
            return new Response(res, { success: true }, 'Delete Successfully')
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }
}

module.exports = { PredictionsController }
