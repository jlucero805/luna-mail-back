const userRouter = require('express').Router()
const bcrypt = require('bcrypt')
//Mongo
const User = require('../models/user')
const Mail = require('../models/mail')

userRouter.get('/', async (req, res) => {
    const all = await User.find({})
    res.status(200).json(all)
})

userRouter.get('/:username', async (req, res) => {
    const one = await User.findOne({ username: req.params.username })
    res.status(200).json(one)
})

userRouter.get('/allmail/:username', async (req, res) => {
    const allUserMail = await Mail.find({ to: req.params.username })
    return res.status(200).json(allUserMail.reverse())
})

userRouter.post('/', async (req, res) => {
    const body = req.body
    try {
        const hashedPassword = await bcrypt.hash(body.passHash, 10)
        const newUser = new User({
            username: body.username,
            passHash: hashedPassword,
            contacts: [],
            dateCreated: new Date()
        })
        await newUser.save()
        res.status(201).json({ success: "created" })
        const firstMail = new Mail({
            from: "lunamail",
            to: body.username,
            title: "Welcome!",
            content: `Hey ${body.username}! Welcome to Luna Mail! Try sending a message!`
        })
        await firstMail.save()
    } catch (err) {
        res.status(500)
    }
})

userRouter.post('/login', async (req, res) => {
    const body = req.body
    const user = await User.findOne({ username: body.username })
    if (user === null) {
        return res.json({ error: "error" })
    }
    try {
        if (await bcrypt.compare(body.passHash, user.passHash)) {
            const allUserMail = await Mail.find({ to: body.username })
            return res.status(200).json(allUserMail.reverse())
        } else {
            return res.json({ error: "error" })
        }
    } catch {
        return res.json({ error: "error" })
    }
})

userRouter.put('/:username', async (req, res) => {
    const body = req.body
    const newUser = {
        contacts: body.contacts
    }
    await User.updateOne({ username: req.params.username }, newUser)
    res.status(201).json({ user: "updated" })
})

//delete all, Dont use!
userRouter.delete('/', async (req, res) => {
    await User.deleteMany({})
    res.status(204).json({ all: "deleted" })
})

module.exports = userRouter