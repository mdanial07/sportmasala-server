'use strict'

var mongoose = require('mongoose');
const multer = require('multer')
const { Team } = require('../Schema/Teams')
const { Season } = require('../Schema/Seasons')
const { TeamStats } = require('../Schema/TeamStats')
const { ErrorHandler } = require('../utils/ErrorHandler');
const { Response } = require('../utils/Response');
const config = require('./../config')

class TeamsController {
    static async getTeams(req, res) {
        try {
            console.log('req.query', req.query)
            let activeSeason = await Season.findOne({ leagueId: mongoose.Types.ObjectId(req.query.leagueId), status: 'active' })
            let Teams = []
            if (activeSeason) {
                Teams = await Team.aggregate([
                    {
                        $match: { seasonId: mongoose.Types.ObjectId(activeSeason._id) }
                    }, {
                        $lookup: {
                            from: 'seasons',
                            localField: 'seasonId',
                            foreignField: '_id',
                            as: 'season'
                        }
                    },
                    {
                        $lookup: {
                            from: 'teamstats',
                            localField: '_id',
                            foreignField: 'teamId',
                            as: 'stats'
                        }
                    },
                    { $unwind: { path: "$season", preserveNullAndEmptyArrays: true } },
                    { $unwind: { path: "$stats", preserveNullAndEmptyArrays: true } },
                    {
                        $project: {
                            _id: '$_id',
                            name: '$name',
                            image: { $concat: [config.LIVE_PATH, '$image'] },
                            shortname: '$shortname',
                            stadium: '$stadium',
                            capacity: '$capacity',
                            status: '$status',
                            createdAt: '$createdAt',
                            stats: {
                                points: '$stats.points',
                                played: '$stats.played',
                                won: '$stats.won',
                                lost: '$stats.lost',
                                draw: '$stats.draw',
                            },
                            season: {
                                name: '$season.name',
                                startDate: '$season.startDate',
                                endDate: '$season.endDate',
                            }
                        }
                    },
                    { $sort: { "stats.points": -1 } },
                    { $limit: 20 }
                ])
            }
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

                        let stats = new TeamStats({
                            teamId: category._id,
                        })
                        await stats.save()
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

    static async addTeamStats(req, res) {
        try {
            let teamStatsExist = await TeamStats.findOne({ teamId: req.body.teamId })
            console.log(teamStatsExist)
            if (teamStatsExist) { throw { code: 401, message: 'Stats already exist' } } else {
                let stats = new TeamStats({
                    teamId: req.body.teamId
                })
                await stats.save()
                return new Response(res, { success: true }, `Added Successfully`)
            }
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



