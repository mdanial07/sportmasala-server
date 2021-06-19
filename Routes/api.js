'use strict'

const { Router } = require('express')
const { AuthenticationController } = require('../Controllers/authentication_controller');
const { TeamsController } = require('../Controllers/teams_controller');
const { WeeksController } = require('../Controllers/weeks_controller');
const { MatchesController } = require('../Controllers/matches_controller');
const { PredictionsController } = require('../Controllers/predictions_controller');
const { DashboardController } = require('../Controllers/dashboard_controller');

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

//Weeks
router.get('/weeks', WeeksController.getWeeks)
router.get('/weekbydate', WeeksController.getWeekbyCurrentDate)
router.get('/weekswithmatches', WeeksController.getWeekswithMatches)
router.post('/week', WeeksController.addWeek)
router.put('/week', WeeksController.editWeek)
router.delete('/week', WeeksController.deleteWeek)

//Matches
router.get('/matches', MatchesController.getMatches)
router.post('/match', MatchesController.addMatch)
router.put('/matchresult', MatchesController.updateMatchwithResult)
router.put('/match', MatchesController.editMatch)
router.delete('/match', MatchesController.deleteMatch)

//Predictions
router.get('/predictions', PredictionsController.getPredictions)
router.post('/prediction', PredictionsController.addPrediction)
router.put('/prediction', PredictionsController.editPrediction)
router.delete('/prediction', PredictionsController.deletePrediction)

//Dashboard
router.get('/weeklywinner', DashboardController.getWeeklyWinner)




module.exports = router
