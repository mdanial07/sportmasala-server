'use strict'

const { Router } = require('express')
const { AuthenticationController } = require('../Controllers/authentication_controller');
const { TeamsController } = require('../Controllers/teams_controller');

const { requireAuth } = require('../Passport/passport');

const router = new Router()

// Authentication
router.post('/authentication/signup', AuthenticationController.signUpWithCredentials)
router.post('/authentication/login', AuthenticationController.loginWithCredentials)
router.get('/authentication/auth', AuthenticationController.checkLogin)
router.post('/authentication/verify', AuthenticationController.profileVerification)
router.post('/authentication/resetpassword', requireAuth, AuthenticationController.resetPassword)


//Teams
router.get('/teams', TeamsController.getTeams)
router.post('/team', TeamsController.addTeam)
router.put('/team', TeamsController.editTeam)
router.delete('/team', TeamsController.deleteTeam)


module.exports = router
