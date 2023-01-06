const mongoose = require('mongoose');


const signupuser = new mongoose.Schema({
    username:{
        type: String,
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
    }
},{
    timestamps:true,
})
module.exports = mongoose.model('signupuser', signupuser)