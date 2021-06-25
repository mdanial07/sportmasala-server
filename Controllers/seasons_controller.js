'use strict'

var mongoose = require('mongoose');
const { Season } = require('../Schema/Seasons')
const { ErrorHandler } = require('../utils/ErrorHandler');
const { Response } = require('../utils/Response');

class SeasonsController {
    static async getSeasons(req, res) {
        try {
            let season = await Season.aggregate([
                {
                    $project: {
                        _id: '$_id',
                        name: '$name',
                        status: '$status',
                        createdAt: '$createdAt',
                    }
                },
            ])
            return new Response(res, season)
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async addSeason(req, res) {
        try {
            let season = await Season({
                leagueId: req.body.leagueId,
                name: req.body.name,
                startDate: new Date(req.body.startDate),
                endDate: new Date(req.body.endDate),
            })
            await season.save()
            return new Response(res, { success: true }, 'Added Successfully')
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async editSeason(req, res) {
        try {
            let seasonExist = await Season.findOne({ _id: req.body._id })
            console.log(seasonExist)
            await Season.findOneAndUpdate({ _id: seasonExist._id }, { $set: req.body })
            return new Response(res, { success: true }, 'Update Successfully')
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async editSeason(req, res) {
        try {
            let seasonExist = await Season.findOne({ _id: req.body._id })
            console.log(seasonExist)
            await Season.findOneAndUpdate({ _id: seasonExist._id }, { $set: req.body })
            return new Response(res, { success: true }, 'Update Successfully')
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async deleteSeason(req, res) {
        try {
            let seasonExist = await Season.findOne({ _id: req.query._id })
            console.log(seasonExist)
            await Season.findOneAndUpdate({ _id: seasonExist._id }, { $set: { isActive: false } })
            return new Response(res, { success: true }, 'Delete Successfully')
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }
}

module.exports = { SeasonsController }
