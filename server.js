const express = require('express');
const app = express()
const cors = require('cors')
//MongoDB
const User = require('./src/models/user')
const Mail = require('./src/models/mail');
const mongoose = require('mongoose');
//routers
const userRouter = require('./src/routes/userRouter')
const mailRouter = require('./src/routes/mailRouter')


const url = 'mongodb://localhost:27017/luna-mail'
const onlineUrl = 'mongodb+srv://jlucero:<password>@cluster0.v3aqi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(process.env.DJANGO_PASS, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true})
    .then(() => {console.log('connected to mongo!')})
    .catch((err) => { console.log('mongo connection failed!') })

app.use((req, res, next) => { console.log(req.method, req.originalUrl); next(); })

app.use(cors())
app.use(express.json())
//routes
app.use('/api/users', userRouter)
app.use('/api/mail', mailRouter)


const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`running on port ${PORT}`)
})


module.exports = app