'use strict'

var mongoose = require('mongoose');
const { League } = require('../Schema/League')
const { ErrorHandler } = require('../utils/ErrorHandler');
const { Response } = require('../utils/Response');

class LeaguesController {
    static async getLeagues(req, res) {
        try {
            let league = await League.aggregate([
                {
                    $match: {}
                }, {
                    $project: {
                        _id: '$_id',
                        name: '$name',
                        status: '$status',
                        // createdAt: '$createdAt',
                    }
                },
            ])
            return new Response(res, league)
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async addLeague(req, res) {
        try {
            let league = await League({
                ...req.body
            })
            await league.save()
            return new Response(res, { success: true }, 'Added Successfully')
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async editLeague(req, res) {
        try {
            let leagueExist = await League.findOne({ _id: req.body._id })
            console.log(leagueExist)
            await League.findOneAndUpdate({ _id: leagueExist._id }, { $set: req.body })
            return new Response(res, { success: true }, 'Update Successfully')
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async editLeague(req, res) {
        try {
            let leagueExist = await League.findOne({ _id: req.body._id })
            console.log(leagueExist)
            await League.findOneAndUpdate({ _id: leagueExist._id }, { $set: req.body })
            return new Response(res, { success: true }, 'Update Successfully')
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async deleteLeague(req, res) {
        try {
            let leagueExist = await League.findOne({ _id: req.query._id })
            console.log(leagueExist)
            await League.findOneAndUpdate({ _id: leagueExist._id }, { $set: { isActive: false } })
            return new Response(res, { success: true }, 'Delete Successfully')
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }
}

module.exports = { LeaguesController }
