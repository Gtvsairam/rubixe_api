const express = require('express');
const jwt = require('jsonwebtoken');
const jwtKey = "rubixe";
const mongoose = require('mongoose');
const cors = require('cors');
const model = require('./model')
const bcrypt = require('bcrypt')
const app = express();
const port = process.env.Port || 5001;
const users = require('./user');

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://gtvsairam26:e5LWRZj4XmRB3e3a@cluster0.iiacnaa.mongodb.net/RUBIXE-BLOGDashboard",{
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=>{
    console.log("mongoose connection established...");
}).catch(err=> console.log(err));
///////////////Signup Authentication//////////////////
app.post('/api/register',async (req, res)=>{
    let user = new users(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;

    jwt.sign({result}, jwtKey, {expiresIn:"1h"}, (err, token) => {
        if (err) {
            res.send({result: "something went wrong"});
        }
        res.send({result, auth: token})
    })
})
///////////////////////////login////////////////////
app.post("/login", async (req, res) => {
    console.log(req.body);
    if (req.body.password && req.body.email) {
      let user = await users.findOne(req.body).select("-password");
      if (user) {
        jwt.sign({ user }, jwtKey, { expiresIn: "1h" }, (err, token) => {
          if (err) {
            res.send({ result: "something went wrong " });
          }
          res.send({ user, auth: token });
        });
      } else {
        res.send({ result: "no user found" });
      }
    } else {
      res.send({ result: "no user found email and password" });
    }
  });


app.post('/api/registrations',async (req, res)=>{
    let product = new model(req.body)
    let result = await product.save();
    res.send(result);
});

app.get('/api/getuser', async (req, res) =>{
    let getusers = await model.find();
    if(getusers.length > 0){
        res.send(getusers);
    }
    else{
        res.send({result: "no user found"})
    }
})
app.delete('/api/deleteuser/:id',async (req,res)=>{
    let result = await model.deleteOne({_id: req.params.id});
    res.send(result)
})
app.get('/api/updateuser/:id', async (req, res) => {
    let result = await model.findOne({ _id: req.params.id });
    if (result) {
      res.send(result);
    } else {
      res.send({ result: "no user found" });
    }
  });
  app.put('/api/updateuser/:id', async (req,res)=>{
    let result = await model.updateOne(
        {_id: req.params.id},
        {
            $set:req.body,
        }
    )
    res.send(result);
  });

////////////////////login Authentication//////////////////////
const SECRET_KEY = 'sdf34jsd9264hlgf'
// app.post('/login',async (req,res)=>{

//     const {email,password} = req.body
//     console.log(email,password);
//     try {
// 		const user = await model.findOne({email});
// 		if (!user)
// 			return res.status(401).send({ message: "Invalid Email or Password" });

// 		const validPassword = bcrypt.compare(password, user.password);
//         if(!validPassword){
//             return  res.status(401).send({ message: "Invalid Email or Password" });
           
//         }
        
// 		else{
//             const token = jwt.sign({},SECRET_KEY,{expiresIn:'1h'});
//             console.log(user,'helloo');           
//              return   res.status(201).send({ status:"ok", data: token, message: "logged in successfully" });
//             }
//         }
        
        
// 	catch (error) {
// 		res.status(500).send({ message: "Internal Server Error" });
// 	}
// })

  

app.get('/',(req,res)=>{
    res.send('hello world...!')
})
app.listen(port,()=>{
    console.log('port is running...');
})
