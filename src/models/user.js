const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    passHash: String,
    contacts: [],
    //date user created
    dateCreated: Date
})

const User = mongoose.model('user', userSchema)

module.exports = User