'use strict'

var mongoose = require('mongoose');
const { CricketPrediction } = require('../Schema/CricketPrediction')
const { CricketMatch } = require('../Schema/CricketMatches')
const { ErrorHandler } = require('../utils/ErrorHandler');
const { Response } = require('../utils/Response');

class CricketPredictionsController {
    static async getCricketPredictions(req, res) {
        try {
            let cricketPrediction = await CricketPrediction.aggregate([
                {
                    $project: {
                        _id: '$_id',
                        seriesId: '$seriesId',
                        matchId: '$matchId',
                        userId: '$userId',
                        user_firstinningscore: '$user_firstinningscore',
                        user_manofthematch: '$user_manofthematch',
                        user_mostwickets: '$user_mostwickets',
                        user_mostruns: '$user_mostruns',
                        user_result: '$user_result',
                        points: '$points',
                        status: '$status',
                        createdAt: '$createdAt',
                    }
                },
            ])
            return new Response(res, cricketPrediction)
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async addCricketPrediction(req, res) {
        try {

            let matchExist = await CricketMatch.findOne({ _id: req.body.matchId })
            if (matchExist.status != 'pending') { throw { code: 400, message: 'Prediction time is over becuase match has been started' } } else {
                let predictionsExist = await CricketPrediction.findOne({ matchId: req.body.matchId, userId: req.body.userId })
                if (predictionsExist) {
                    await CricketPrediction.findOneAndUpdate({ _id: predictionsExist._id }, { $set: req.body })
                    return new Response(res, { success: true }, `Update Successfully`)
                } else {
                    let cricketPrediction = new CricketPrediction({
                        ...req.body,
                        leagueId: matchExist.leagueId,
                        seriesId: matchExist.seriesId,
                    })
                    await cricketPrediction.save()
                    return new Response(res, { success: true }, `Added Successfully`)
                }
            }
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async editCricketPrediction(req, res) {
        try {
            let predictionsExist = await CricketPrediction.findOne({ _id: req.body._id })
            console.log(predictionsExist)
            await CricketPrediction.findOneAndUpdate({ _id: predictionsExist._id }, { $set: req.body })
            return new Response(res, { success: true }, 'Update Successfully')
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }
    static async deleteCricketPrediction(req, res) {
        try {
            let predictionsExist = await CricketPrediction.findOne({ _id: req.query._id })
            console.log(predictionsExist)
            await CricketPrediction.findOneAndUpdate({ _id: predictionsExist._id }, { $set: { isActive: false } })
            return new Response(res, { success: true }, 'Delete Successfully')
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }
}

module.exports = { CricketPredictionsController }
