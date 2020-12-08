const express = require('express')
var router = require('express').Router();
const {check} = require('express-validator');
const {signup,signin,login} = require('../controllers/auth');


// const redis_ware = (req,res,next) =>{
//     client.get('UserData',(err,redis_data)=>{
//         if(err){
//             throw err;
//         }else if(redis_data){
//             res.send(JSON.parse(redis_data))
//         }else{
//             next()
//         }
//     })
// }

router.post('/signup',[
    check('name','Name must be atleast 3 characters.').isLength({min:3}),
    check('email','Email required').isEmail(),
    check('password','Password must be atleast 3 char.').isLength({min:3})
],signup);

router.post('/signin',[
    check('email','Email Required').isEmail(),
    check('password','Password must be atleast 3 char.').isLength({min:3})
],signin);


router.get('/login',login);

module.exports = router;