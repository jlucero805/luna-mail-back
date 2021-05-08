const authRouter = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

authRouter.post('/login', async (req, res) => {
    const body = req.body
    const user = await User.findOne({ username: body.username })
    console.log(user)
    if (user === null) {
        return res.json({ error: "error1" }).end()
    }
    try {
        if (await bcrypt.compare(body.passHash, user.passHash)) {
            console.log("1")
            const jwtUser = { name: body.username }
            console.log("2")
            const token = jwt.sign(jwtUser, process.env.ACCESS_TOKEN_SECRET)
            console.log("3")
            return res.status(201).json({accessToken: token})
        } else {
            return res.json({ error: "error2" })
        }
    } catch (e) {
        res.json({error: "error3"})
    }
})

module.exports = authRouter