const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');
const model = require('./model')
const bcrypt = require('bcrypt')
const app = express();
const port = process.env.Port || 5001

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://gtvsairam26:e5LWRZj4XmRB3e3a@cluster0.iiacnaa.mongodb.net/RUBIXE-BLOG",{
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=>{
    console.log("mongoose connection established...");
})
///////////////Signup Authentication//////////////////
app.post('/signup',async (req, res)=>{
    try {
       const {username, email, password} = req.body;
       console.log(username,email,password);
       const hashPass = await bcrypt.hash(password,10)
       let exist = await model.findOne({email})
        if(exist) {
            return res.status(400).send('User Already Exit');
        }
        const user = new model({username,email,password:hashPass})
        await user.save();
        const result = await model.insertMany(user);
        res.send({status:"ok"})
       console.log(result);
        res.status(200).send('Registered Successfully');

    } catch (error) {
        console.log(error);
        return res.status(500).send('Internel Server Error')
    }
})

////////////////////login Authentication//////////////////////
const SECRET_KEY = 'sdf34jsd9264hlgf'
app.post('/login',async (req,res)=>{

    const {email,password} = req.body
    console.log(email,password);
    try{
        const user = await model.findOne({email})
    if(!user){
        return res.json({error:"User not found"})
    }
    if(bcrypt.compare(password,user.password)){
        const token = jwt.sign({},SECRET_KEY);
        console.log(user,"hello.......");
        if(res.status(201)){
            return res.json({status:"ok",token:token,data:user})
        }else{
            return res.json({ status:"error",error:"Invalid Password"})
        }
    }
    
    }
    catch(err){
        res.send({status:"error"})
        console.log(err);
    }
})

  

app.get('/',(req,res)=>{
    res.send('hello world...!')
})
app.listen(port,()=>{
    console.log('port is running...');
})
