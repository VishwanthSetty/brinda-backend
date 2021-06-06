const mongoose = require('mongoose')

const Schema = mongoose.Schema

usersSchema = new Schema({
    email: String,
    schoolName:String,
    username:String,
    phoneNumber:String,
    address:String,
    district:String,
    password: String,
    state:String,
    role:[String],
})

module.exports = mongoose.model('users',usersSchema,'users')