'use strict'

var mongoose = require('mongoose');
const multer = require('multer')
const { Team } = require('../Schema/Teams')
const { ErrorHandler } = require('../utils/ErrorHandler');
const { Response } = require('../utils/Response');
const config = require('./../config')

class TeamsController {
    static async getTeams(req, res) {
        try {
            console.log(req.query.name)
            let obj = req.query.name != 'all' ? { categoryId: mongoose.Types.ObjectId(req.query.categoryId), status: 'active' } : { status: 'active' }
            let Teams = await Team.aggregate([
                {
                    $match: { status: 'active' }
                }, {
                    $project: {
                        _id: '$_id',
                        name: '$name',
                        image: { $concat: [config.LIVE_PATH, '$image'] },
                        shortname: '$shortname',
                        stadium: '$stadium',
                        capacity: '$capacity',
                        status: '$status',
                        createdAt: '$createdAt',
                    }
                },
                { $sort: { name: 1 } }
            ])
            return new Response(res, Teams)
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async addTeam(req, res) {
        try {
            let date = Date.now();
            let url;
            let storage = multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, 'storage/teams')
                },
                filename: (req, file, cb) => {
                    url = '/teams/' + date + '-' + file.originalname.split(' ').join('-')
                    cb(null, date + '-' + file.originalname.split(' ').join('-'))
                }
            })
            const fileFilter = (req, file, cb) => {
                if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
                    cb(null, true);
                } else {
                    cb(null, false);
                }
            }
            const upload = multer({ storage: storage, fileFilter: fileFilter });
            new Promise((myResolve, myReject) => {
                upload.single('image')(req, res, next => {
                    try {
                        myResolve(req)
                    } catch {
                        myReject()
                    }
                })
            }).then(async (resolve, reject) => {
                try {
                    console.log('resolve.body', resolve.body)
                    console.log('url' + url)

                    let data = resolve.body
                    try {
                        let category = new Team({
                            ...data,
                            image: url,
                        })
                        await category.save()
                        return new Response(res, { success: true }, `Added Successfully`)
                    } catch (error) {
                        ErrorHandler.sendError(res, error)
                    }
                }
                catch (reject) {
                    ErrorHandler.sendError(res, reject)
                }
            })
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async editTeam(req, res) {
        try {
            console.log('ddddddd')
            let date = Date.now();
            let url = '';
            let storage = multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, 'storage/teams')
                },
                filename: (req, file, cb) => {
                    url = '/teams/' + date + '-' + file.originalname.split(' ').join('-')
                    cb(null, date + '-' + file.originalname.split(' ').join('-'))
                }
            })
            const fileFilter = (req, file, cb) => {
                if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
                    cb(null, true);
                } else {
                    cb(null, false);
                }
            }
            const upload = multer({ storage: storage, fileFilter: fileFilter });
            new Promise((myResolve, myReject) => {
                upload.single('image')(req, res, next => {
                    try {
                        myResolve(req)
                    } catch {
                        myReject()
                    }
                })
            }).then(async (resolve, reject) => {
                try {
                    console.log('resolve.body', resolve.body)
                    console.log('url' + url)
                    let data = resolve.body
                    try {
                        let teamExist = await Team.findOne({ _id: data._id })
                        console.log(teamExist)
                        let obj = {
                            shortname: data.shortname ? data.shortname : teamExist.shortname,
                            stadium: data.stadium ? data.stadium : teamExist.stadium,
                            image: url == '' ? teamExist.image : url,
                        }
                        if (teamExist) {
                            await Team.findOneAndUpdate({ _id: teamExist._id }, { $set: obj })
                            return new Response(res, { success: true }, 'Update Successfully')
                        } else throw { code: 404, message: "Team does not exist" }

                    } catch (error) {
                        ErrorHandler.sendError(res, error)
                    }
                }
                catch (reject) {
                    ErrorHandler.sendError(res, reject)
                }
            })
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async deleteTeam(req, res) {
        try {
            let teamExist = await Team.findOne({ _id: req.query._id })
            console.log(teamExist)
            await Team.findByIdAndRemove({ _id: teamExist._id })
            return new Response(res, { success: true }, 'Delete Successfully')
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }
}

module.exports = { TeamsController }



