'use strict'

const { Router } = require('express')
const user = require('../Controllers/user_controller');

const router = new Router()

//User
router.get('/users', user.getUsers)

module.exports = router
