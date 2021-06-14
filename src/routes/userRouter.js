const userRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
//Mongo
const User = require('../models/user')
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

userRouter.get('/detail', authToken, async (req, res) => {
    try {
        const user = await User.find({username: req.username.name});
        res.status(200).json(user);
    } catch (e) {
        res.status(400)
    }
})

userRouter.get('/', authToken, (req, res) => {
    res.json({name: req.username})
})

// create new user
userRouter.post('/', async (req, res) => {
    const body = req.body
    try {
        //check if it exists
        const checker = await User.find({username: body.username})
        if (checker.length >= 1) {
            return res.status(201).json({err: "fail"})
        }
        const hashedPassword = await bcrypt.hash(body.passHash, 10)
        const newUser = new User({
            username: body.username,
            passHash: hashedPassword,
            contacts: [],
            dateCreated: new Date()
        })
        await newUser.save()
        const firstMail = new Mail({
            from: "lunamail",
            to: body.username,
            title: "Welcome!",
            content: `Hey ${body.username}! Welcome to Luna Mail! Try sending a message!`,
            dateSent: new Date()
        })
        await firstMail.save()
        res.status(201).json({ success: "created" })
    } catch (err) {
        res.status(500)
    }
})

userRouter.put('/', authToken, async (req, res) => {
    const body = req.body;
    try {
        await User.updateOne({username: req.username.name}, { contacts: body.contacts});
        const oneUser = User.find({username: req.username.name});
        res.status(200).json(oneUser);
    } catch (e) {
        res.status(400);
    }
})

userRouter.get('/contacts', authToken, async (req, res) => {
    try {
        const contacts = await User.find({username: req.username.name})
        res.status(200).json({contacts: contacts.contacts});
    }  catch (e) {
        res.status(400);
    }
})

userRouter.put('/contacts', authToken, async (req, res) => {
    const body = req.body;
    try {
        const results = await User.findOneAndUpdate({username: req.username.name}, { $set: {contacts: body.contacts}});
        console.log(body.contacts)
        res.status(200).json(results);
    }  catch (e) {
        res.status(400);
    }
})

module.exports = userRouter