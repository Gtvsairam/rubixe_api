const mongoose = require('mongoose');
// const nodemailer = require('nodemailer')

const User = new mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    mobile:{
        type: Number,
        require: true
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    password:{
        type: String,
        require: true
    },
    state:{
        type: String,
        require: true
    },
    city:{
        type: String,
        require: true
    },
    image:{
        type: String,
    }
},{
    timestamps:true,
})
module.exports = mongoose.model('User', User)