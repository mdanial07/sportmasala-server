'use strict'

var mongoose = require('mongoose');
const multer = require('multer')
const { CricketTeam } = require('../Schema/CricketTeams')
const { ErrorHandler } = require('../utils/ErrorHandler');
const { Response } = require('../utils/Response');
const config = require('./../config')

class CricketTeamsController {
    static async getCricketTeams(req, res) {
        try {
            let cricketteams = await CricketTeam.aggregate([
                {
                    $project: {
                        _id: '$_id',
                        name: '$name',
                        image: { $concat: [config.LIVE_PATH, '$image'] },
                        shortname: '$shortname',
                        createdAt: '$createdAt',
                    }
                },
            ])
            return new Response(res, cricketteams)
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async addCricketTeam(req, res) {
        try {
            let date = Date.now();
            let url;
            let storage = multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, 'storage/cricketteams')
                },
                filename: (req, file, cb) => {
                    url = '/cricketteams/' + date + '-' + file.originalname.split(' ').join('-')
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
                        let cricketTeam = new CricketTeam({
                            ...data,
                            image: url,
                        })
                        await cricketTeam.save()
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
                    cb(null, 'storage/cricketteams')
                },
                filename: (req, file, cb) => {
                    url = '/cricketteams/' + date + '-' + file.originalname.split(' ').join('-')
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
                        let teamExist = await CricketTeam.findOne({ _id: data._id })
                        console.log(teamExist)
                        let obj = {
                            shortname: data.shortname ? data.shortname : teamExist.shortname,
                            image: url == '' ? teamExist.image : url,
                        }
                        if (teamExist) {
                            await CricketTeam.findOneAndUpdate({ _id: teamExist._id }, { $set: obj })
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
            let teamExist = await CricketTeam.findOne({ _id: req.query._id })
            console.log(teamExist)
            await CricketTeam.findByIdAndRemove({ _id: teamExist._id })
            return new Response(res, { success: true }, 'Delete Successfully')
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }
}

module.exports = { CricketTeamsController }



