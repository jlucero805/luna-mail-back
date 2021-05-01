const mailRouter = require('express').Router()
const jwt = require('jsonwebtoken')
//Mongo
const Mail = require('../models/mail')

mailRouter.get('/', async (req, res) => {
    const mail = await Mail.find({})
    res.status(200).json(mail)
})

mailRouter.get('/:username', async (req, res) => {
    const token = authenticateToken(req)
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    if (!token || !decoded.name || req.params.username !== decoded.name) {
        return response.status(401).json({error: 'missing token'})
    }
    const user = await Mail.find({to: decoded.name})
    res.status(200).json(user)
})

mailRouter.get('/test', async (req, res) => {
    res.status(200).json({test: "works fine!"})
})

mailRouter.post('/', async (req, res) => {
    const body = req.body
    const newMail = new Mail({
        from: body.from,
        to: body.to,
        title: body.title,
        content: body.content,
        hashKey: body.hashKey,
        dateSent: new Date()
    })
    await newMail.save()
    res.status(201).json({mail: "sent"})
})

mailRouter.delete('/', async (req, res) => {
    await Mail.deleteMany({})
    res.status(204).json({deleted: "all"})
})

mailRouter.delete('/:id', async (req, res) => {
    await Mail.deleteOne({_id: req.params.id})
    res.status(204).json({deleted: "mail"})
})

const authenticateToken = (req) => {
    const authHeader = request.get('authorization')
    if (!authHeader) return null
    const token = authHeader.split(' ')[1]
    return token
}

module.exports = mailRouter