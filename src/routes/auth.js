const authRouter = require('express').Router()
const jwt = require('jsonwebtoken')

userRouter.post('/login', async (req, res) => {
    const body = req.body
    const user = await User.findOne({ username: body.username })
    if (user === null) {
        return res.json({ error: "error" })
    }
    try {
        if (await bcrypt.compare(body.passHash, user.passHash)) {
            const jwtUser = { name: body.username }
            const token = jwt.sign(jwtUser, process.env.ACCESS_TOKEN_SECRET)
            return res.status(201).json({accessToken: token})
        } else {
            return res.json({ error: "error" })
        }
    } catch {
        return res.json({ error: "error" })
    }
})

module.exports = authRouter