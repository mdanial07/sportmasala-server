'use strict'

var mongoose = require('mongoose');
const { Tour } = require('../Schema/Tours')
const { ErrorHandler } = require('../utils/ErrorHandler');
const { Response } = require('../utils/Response');

class ToursController {
    static async getTours(req, res) {
        try {
            let tour = await Tour.aggregate([
                {
                    $match: { status: 'active' }
                }, {
                    $project: {
                        _id: '$_id',
                        name: '$name',
                        status: '$status',
                    }
                },
            ])
            return new Response(res, tour)
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async addTour(req, res) {
        try {
            let tour = await Tour({
                ...req.body
            })
            await tour.save()
            return new Response(res, { success: true }, 'Added Successfully')
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async editTour(req, res) {
        try {
            let tourExist = await Tour.findOne({ _id: req.body._id })
            console.log(tourExist)
            await Tour.findOneAndUpdate({ _id: tourExist._id }, { $set: req.body })
            return new Response(res, { success: true }, 'Update Successfully')
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async editTour(req, res) {
        try {
            let tourExist = await Tour.findOne({ _id: req.body._id })
            console.log(tourExist)
            await Tour.findOneAndUpdate({ _id: tourExist._id }, { $set: req.body })
            return new Response(res, { success: true }, 'Update Successfully')
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async deleteTour(req, res) {
        try {
            let tourExist = await Tour.findOne({ _id: req.query._id })
            console.log(tourExist)
            await Tour.findOneAndUpdate({ _id: tourExist._id }, { $set: { isActive: false } })
            return new Response(res, { success: true }, 'Delete Successfully')
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }
}

module.exports = { ToursController }
