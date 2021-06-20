'use strict'

const bcrypt = require('bcryptjs')
const { PromiseEjs } = require('../utils/PromiseEjs')
const { mailSender } = require('./../utils/MailSender')
const { ErrorHandler } = require('../utils/ErrorHandler')
const { Response } = require('../utils/Response')
const { User } = require('../Schema/Users')
const { v4: uuidv4 } = require('uuid')
const config = require('./../config')
const { AuthMiddleware } = require('../Middlerware/authmiddleware')

class AuthenticationController {
    static async signUpWithCredentials(req, res) {
        console.log(req.body)
        try {
            let user = await User.findOne({ email: req.body.email })
            if (user) { throw { code: 400, message: 'User already exist with same email' } } else {
                let usermobile = await User.findOne({ mobileno: req.body.mobileno })
                if (usermobile) { throw { code: 400, message: 'User already exist with same mobile' } } else {
                    let emailVerificationToken = uuidv4()
                    user = await new User({
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        mobileno: req.body.mobileno,
                        gender: req.body.gender,
                        platform: req.body.platform,
                        password: bcrypt.hashSync(req.body.password, 10)
                    })
                    await user.save()
                    // try {
                    //     let emailVerificationLink = `${config.LIVE_PATH}verify?token=${emailVerificationToken}&user=${user._id}`
                    //     let html = await PromiseEjs.renderFile('./Email/signup.ejs', { user: user, emailVerificationLink: emailVerificationLink, token: emailVerificationToken })
                    //     await mailSender.sendMail(user.email, 'Welcome!!!!', html)
                    // } catch (error) {
                    //     console.log(error)
                    // }
                    let authToken = AuthMiddleware.createJWT(user, config.SECRET_TOKEN)
                    await User.findOneAndUpdate({ _id: user._id }, { $set: { authToken: authToken, password: bcrypt.hashSync(req.body.password, 10), token: emailVerificationToken } })
                    return new Response(res, { authToken: authToken })
                }
            }
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async loginWithCredentials(req, res) {
        try {
            let email = req.body.email
            let password = req.body.password
            let user = await User.findOne({ email: email })
            if (!user) { throw { code: 401, message: 'User does not exist' } } else {
                if (!user.isEmailVerified) { throw { code: 401, message: 'Please check your email and verify your account' } } else {
                    if (!bcrypt.compareSync(password, user.password)) { throw { code: 401, message: 'Password is incorrect' } } else {
                        let authToken = AuthMiddleware.createJWT(user, config.SECRET_TOKEN)
                        await User.findOneAndUpdate({ email: email }, { $set: { authToken: authToken } })
                        let obj = {
                            _id: user._id,
                            authToken: authToken,
                            email: user.email,
                            firstname: user.firstname,
                            lastname: user.lastname,
                        }
                        return new Response(res, obj)
                    }
                }
            }
        } catch (error) {
            console.log(error)
            ErrorHandler.sendError(res, error)
        }
    }

    static async checkLogin(req, res) {
        try {
            let token = req.query.token
            console.log('req.query', req.query)
            let decodedToken = AuthMiddleware.decodeJWT(token, config.SECRET_TOKEN)
            let user = await User.findOne({ _id: decodedToken.sub, authToken: token })
            console.log(user)
            if (user == null) { throw { code: 401, message: 'Unauthorized' } } else return new Response(res, { authenticated: true })
        } catch (error) {
            return new Response(res, { authenticated: false })
        }
    }

    static async profileVerification(req, res) {
        try {
            let obj = req.body;
            console.log(req.body)
            let usertoken = await User.findOne({ token: obj.token })
            if (!usertoken) { throw { code: 401, message: 'Token Not Found' } } else {
                let user = await User.findOne({ _id: obj._id })
                if (user) {
                    if (!user.isEmailVerified) {
                        let emailVerificationToken = uuidv4()
                        await User.findOneAndUpdate({ _id: user._id }, { $set: { isEmailVerified: true, token: emailVerificationToken } })
                        return new Response(res, { message: 'Email Verified' })
                    } else {
                        return new Response(res, { message: 'Token Expired' })
                    }
                } else throw { code: 400, message: 'User not Found' }
            }
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }

    static async resetPassword(req, res) {
        console.log(req.body)
        console.log(req.headers)
        try {
            let user = await User.findOne({ authToken: req.headers.authorization })
            if (user) {
                await User.findOneAndUpdate({ authToken: req.headers.authorization }, { $set: { password: bcrypt.hashSync(req.body.password, 10) } })
                return new Response(res, { success: true })
            } else throw { code: 401, message: 'Invalid token' }
        } catch (error) {
            ErrorHandler.sendError(res, error)
        }
    }
}

module.exports = { AuthenticationController }
