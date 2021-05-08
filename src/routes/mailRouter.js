const mailRouter = require('express').Router()
const jwt = require('jsonwebtoken')
//Mongo
const Mail = require('../models/mail')
const User = require('../models/user')


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
        const allMail = await Mail.find({ to: req.username.name })
        res.status(200).json(allMail.reverse())
    } catch (e) {
        res.status(400)
    }
})

mailRouter.get('/sent', authToken, async (req, res) => {
    try {
        const allSent = await Mail.find({from: req.username.name})
        res.status(200).json(allSent.reverse())
    } catch (e) {
        res.status(400)
    }
})

mailRouter.post('/', authToken, async (req, res) => {
    try {
        const body = req.body
        const checkUser = User.findOne({username: body.to})
        if (checkUser === null || checkUser === undefined) {
            return res.status(400).json({err: "none"})
        }
        const newMail = new Mail({
            from: req.username.name,
            to: body.to,
            title: body.title,
            content: body.content,
            dateSent: new Date()
        })
        await newMail.save()
        res.json({created: "success"})
    } catch (e) {
        res.status(400)
    }
})

mailRouter.delete('/:id', authToken, async (req, res) => {
    try {
        await Mail.deleteOne({_id: req.params.id})
        res.status(201)
    } catch (e) {
        res.status(400)
    }
})

module.exports = mailRouter