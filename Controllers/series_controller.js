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