'use strict'

var mongoose = require('mongoose');
const { Tour } = require('../Schema/Tours')
const { League } = require('../Schema/League')
const { ErrorHandler } = require('../utils/ErrorHandler');
const { Response } = require('../utils/Response');

class ActiveLeagueToursController {
    static async getLeagueTours(req, res) {
        try {
            let tour = await Tour.aggregate([
                {
                    $match: { status: 'active' }
                }, {
                    $project: {
                        _id: '$_id',
                        name: '$name',
                        status: '$status',
                        type: 'tour',
                    }
                },
            ])
            let league = await League.aggregate([
                {
                    $match: { status: 'active' }
                }, {
                    $project: {
                        _id: '$_id',
                        name: '$name',
                        status: '$status',
                        type: 'league'
                    }
                },
            ])
            let tournleague = await tour.concat(league)

            return new Response(res, tournleague)
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }
}

module.exports = { ActiveLeagueToursController }
