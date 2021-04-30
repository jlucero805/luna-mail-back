const mongoose = require('mongoose')

const mailSchema = new mongoose.Schema({
    //username that sent the mail
    from: String,
    //username that the mail was meant for
    to: String,
    title: String,
    content: String,
    dateSent: Date
})

const Mail = mongoose.model('mail', mailSchema)

module.exports = Mail