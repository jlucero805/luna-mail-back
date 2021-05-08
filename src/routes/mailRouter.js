const mailRouter = require('express').Router()
const jwt = require('jsonwebtoken')
//Mongo
const Mail = require('../models/mail')


const authToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, username) => {
        if (err) return res.sendStatus(403)
        req.username = username
        next()
    })
}

mailRouter.get('/', authToken, async (req, res) => {
    try {
        const allMail = await Mail.find({ username: req.username })
        res.status(200).json(allMail)
    } catch (e) {
        res.status(400)
    }
})

module.exports = mailRouter