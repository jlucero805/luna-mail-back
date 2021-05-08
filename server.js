require('dotenv').config()
const express = require('express');
const app = express()
const cors = require('cors')
const mongoose = require('mongoose');
//routers
const authRouter = require('./src/routes/auth')
const userRouter = require('./src/routes/userRouter')
const mailRouter = require('./src/routes/mailRouter')

app.use(cors())
app.use(express.json())

// const url = 'mongodb://localhost:27017/luna-mail'
const DJANGO_PASS = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development' ? process.env.TEST_DB : process.env.DJANGO_PASS
mongoose.connect(DJANGO_PASS, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true})
    .then(() => {console.log('connected to mongo!')})
    .catch((err) => { console.log('mongo connection failed!') })

app.use((req, res, next) => { console.log(req.method, req.originalUrl); next(); })


//routes
app.use('/api/users', userRouter)
app.use('/api/mail', mailRouter)
app.use('/api/auth', authRouter)

const PORT = process.env.PORT || 8080
// const PORT = 8080
app.listen(PORT, () => { console.log(`running on port ${PORT}`) })

module.exports = app