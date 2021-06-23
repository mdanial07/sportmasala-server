'use strict'

var mongoose = require('mongoose');
const { Match } = require('../Schema/Matches')
const { TeamStats } = require('../Schema/TeamStats')
const { Prediction } = require('../Schema/Predictions')
const { ErrorHandler } = require('../utils/ErrorHandler');
const { Response } = require('../utils/Response');
const config = require('./../config')

class SeedsController {
    static async clearTeamStats(req, res) {
        try {
            let Stats = await TeamStats.find({})
            console.log(Stats)

            await Stats.map(async sts => {
                let obj = { points: 0, played: 0, won: 0, lost: 0, draw: 0 }
                await TeamStats.findOneAndUpdate({ _id: sts._id }, { $set: { ...obj } })
            })

            return new Response(res, Stats)
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async clearMatchesScore(req, res) {
        try {
            let Matches = await Match.find({})
            console.log(Matches)

            await Matches.map(async sts => {
                let obj = { team1result: null, team2result: null, status: 'pending' }
                await Match.findOneAndUpdate({ _id: sts._id }, { $set: { ...obj } })
            })

            return new Response(res, Matches)
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async clearPredictionsPoints(req, res) {
        try {
            let Predictions = await Prediction.find({})
            console.log(Predictions)

            await Predictions.map(async sts => {
                let obj = { points: 0, status: 'pending' }
                await Prediction.findOneAndUpdate({ _id: sts._id }, { $set: { ...obj } })
            })

            return new Response(res, Predictions)
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

}

module.exports = { SeedsController }



