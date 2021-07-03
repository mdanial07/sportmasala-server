'use strict'

const { Router } = require('express')
const { AuthenticationController } = require('../Controllers/authentication_controller');
const { ActiveLeagueToursController } = require('../Controllers/active_tours_leagues_controller');
const { LeaguesController } = require('../Controllers/league_controller');
const { CricketTeamsController } = require('../Controllers/cricketteams_controller');
const { SeasonsController } = require('../Controllers/seasons_controller');
const { TeamsController } = require('../Controllers/teams_controller');
const { WeeksController } = require('../Controllers/weeks_controller');
const { MatchesController } = require('../Controllers/matches_controller');
const { CricketMatchsController } = require('../Controllers/cricketmatches_controller');
const { SeriesController } = require('../Controllers/series_controller');
const { PredictionsController } = require('../Controllers/predictions_controller');
const { DashboardController } = require('../Controllers/dashboard_controller');
const { SeedsController } = require('../Controllers/seeds_controller');
const { CricketPlayersController } = require('../Controllers/players_controller');

const { requireAuth } = require('../Passport/passport');

const router = new Router()

// Authentication
router.post('/authentication/signup', AuthenticationController.signUpWithCredentials)
router.post('/authentication/login', AuthenticationController.loginWithCredentials)
router.get('/authentication/auth', AuthenticationController.checkLogin)
router.post('/authentication/verify', AuthenticationController.profileVerification)
router.post('/authentication/resetpassword', requireAuth, AuthenticationController.resetPassword)

//Active Leagues & Tours
router.get('/active-leagues-tours', ActiveLeagueToursController.getLeagueTours)

//Leagues
router.get('/leagues', LeaguesController.getLeagues)
router.post('/league', LeaguesController.addLeague)
router.put('/league', requireAuth, LeaguesController.editLeague)
router.delete('/league', requireAuth, LeaguesController.deleteLeague)

//Cricket Teams
router.get('/cricket-teams', CricketTeamsController.getCricketTeams)
router.post('/cricket-team', CricketTeamsController.addCricketTeam)
router.put('/cricket-team', requireAuth, CricketTeamsController.editTeam)
router.delete('/cricket-team', requireAuth, CricketTeamsController.deleteTeam)

//Cricket Players
router.get('/players', CricketPlayersController.getCricketPlayers)
router.post('/player', CricketPlayersController.addCricketPlayer)

//Seasons
router.get('/seasons', SeasonsController.getSeasons)
router.post('/season', SeasonsController.addSeason)
router.put('/season', requireAuth, SeasonsController.editSeason)
router.delete('/season', requireAuth, SeasonsController.deleteSeason)

//Teams
router.get('/teams', TeamsController.getTeams)
router.post('/team', TeamsController.addTeam)
router.post('/teamstats', TeamsController.addTeamStats)
router.put('/team', requireAuth, TeamsController.editTeam)
router.delete('/team', requireAuth, TeamsController.deleteTeam)

//Matches
router.get('/matches', requireAuth, MatchesController.getMatches)
router.post('/match', requireAuth, MatchesController.addMatch)
router.put('/matchresult', MatchesController.updateMatchwithResult)
router.put('/match', requireAuth, MatchesController.editMatch)
router.delete('/match', requireAuth, MatchesController.deleteMatch)

//Series
router.get('/series', requireAuth, SeriesController.getSeries)
router.get('/serieswithmatches', requireAuth, SeriesController.getSerieswithMatches)
router.post('/series', SeriesController.addSeries)
router.put('/series', requireAuth, SeriesController.editSeries)
router.delete('/series', requireAuth, SeriesController.deleteSeries)

//Cricket Matches
router.get('/cricketmatches', requireAuth, CricketMatchsController.getCricketMatches)
router.post('/cricketmatch', CricketMatchsController.addCricketMatch)
router.put('/cricketmatch', requireAuth, CricketMatchsController.editCricketMatch)
router.delete('/cricketmatch', requireAuth, CricketMatchsController.deleteCricketMatch)

// Weeks
router.get('/weeks', requireAuth, WeeksController.getWeeks)
router.get('/weekbydate', requireAuth, WeeksController.getWeekbyCurrentDate)
router.get('/weekswithmatches', requireAuth, WeeksController.getWeekswithMatches)
router.post('/week', requireAuth, WeeksController.addWeek)
router.put('/week', requireAuth, WeeksController.editWeek)
router.delete('/week', requireAuth, WeeksController.deleteWeek)

//Predictions
router.get('/predictions', requireAuth, PredictionsController.getPredictions)
router.post('/prediction', requireAuth, PredictionsController.addPrediction)
router.put('/prediction', requireAuth, PredictionsController.editPrediction)
router.delete('/prediction', requireAuth, PredictionsController.deletePrediction)

//Dashboard
router.get('/weeklywinner', requireAuth, DashboardController.getWeeklyWinner)
router.get('/yearlywinner', requireAuth, DashboardController.getYearlyWinner)
router.get('/user-widgets', requireAuth, DashboardController.getUserWidgetsPoints)

//Seeds Clean Data
router.get('/clear-team-stats', SeedsController.clearTeamStats)
router.get('/clear-matches-score', SeedsController.clearMatchesScore)
router.get('/clear-prediction-points', SeedsController.clearPredictionsPoints)
router.get('/add-seasonId-to-teams', SeedsController.addSeasonIdTeams)



module.exports = router
