const mailRouter = require('express').Router()
//Mongo
const Mail = require('../models/mail')

mailRouter.get('/', async (req, res) => {
    const mail = await Mail.find({})
    res.status(200).json(mail)
})

mailRouter.post('/', async (req, res) => {
    const body = req.body
    const newMail = new Mail({
        from: body.from,
        to: body.to,
        title: body.title,
        content: body.content,
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

module.exports = mailRouter