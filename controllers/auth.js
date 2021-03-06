const User = require('../models/user');
const {validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

// Import the installed modules.
const express = require('express');
const responseTime = require('response-time')
const axios = require('axios');
const redis = require('redis');

const app = express();

// create and connect redis client to local instance.
const client = redis.createClient();

//Print redis errors to the console
client.on('error', (err) => {
  console.log("Error " + err);
});

// use response-time as a middleware
app.use(responseTime());


exports.signup = (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(422).json(errors);
    }
   
    const user = new User(req.body);
    user.save((err, user) => {
      if (err) {
        return res.status(400).json({
          err: "NOT able to save user in DB"
        });
      }
      res.json({
        name: user.name,
        email: user.email,
        id: user._id
      });
    });
  };

  exports.signin = (req,res) =>{
    const errors = validationResult(req);
    const {email,password} = req.body;

    if(!errors.isEmpty()){
      return res.status(422).json({
        error:errors.array[0].msg
      });
    }
    User.findOne({email},(err,user)=>{
      if(err|| !user){
        res.status(400).json({
          error:"User email does not exist in database"
        });
      }

      if(!user.autheticate(password)){
        return res.status(401).json({
          error:"Email and password do not match"
        });
      }
      const token = jwt.sign({_id:user._id},process.env.SECRET);
      res.cookie("token",token,{expire:new Date()+9999});
      const {_id,name,email,role } = user;

      return res.json({token,user:{_id,name,email,role}});
    });
  }

exports.login = (req,res) =>{ 
  return client.get('UsersData',(err,result)=>{
    if(result){
      return res.json(result);
    }else{
      User.find({},(err,users)=>{
        const responseJSON = users;
        client.setex('UsersData',60,JSON.stringify({ source: 'Redis Cache', ...responseJSON, }));
        return res.json(users);
      })
    }
  })
}
