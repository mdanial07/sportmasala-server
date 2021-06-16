'use strict'

var mongoose = require('mongoose');
const { Week } = require('../Schema/Weeks')
const { ErrorHandler } = require('../utils/ErrorHandler');
const { Response } = require('../utils/Response');

class WeeksController {
    static async getWeeks(req, res) {
        try {
            let week = await Week.aggregate([
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
            ])
            return new Response(res, week)
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async addWeek(req, res) {
        try {
            let week = new Week({
                name: req.body.name,
                startDate: new Date(req.body.startDate),
                endDate: new Date(req.body.endDate),
            })
            await week.save()
            return new Response(res, { success: true }, `Added Successfully`)
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async editWeek(req, res) {
        try {
            let weekExist = await Week.findOne({ _id: req.body._id })
            console.log(weekExist)
            await Week.findOneAndUpdate({ _id: weekExist._id }, { $set: req.body })
            return new Response(res, { success: true }, 'Update Successfully')
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }
    static async deleteWeek(req, res) {
        try {
            let weekExist = await Week.findOne({ _id: req.query._id })
            console.log(weekExist)
            await Week.findOneAndUpdate({ _id: weekExist._id }, { $set: { isActive: false } })
            return new Response(res, { success: true }, 'Delete Successfully')
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }
}

module.exports = { WeeksController }
