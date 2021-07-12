'use strict'

const { Router } = require('express')
const { UsersController } = require('../AdminControllers/users_controller');
const { LeaguesController } = require('../AdminControllers/league_controller');

const { requireAuth } = require('../Passport/passport');

const admin = new Router()

//Users
admin.get('/users', UsersController.getUsers)

//Leagues
admin.get('/leagues', LeaguesController.getLeagues)
admin.post('/league', LeaguesController.addLeague)
admin.put('/league', requireAuth, LeaguesController.editLeague)
admin.delete('/league', requireAuth, LeaguesController.deleteLeague)

module.exports = admin
