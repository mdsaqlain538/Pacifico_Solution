const express = require('express')
var router = require('express').Router();
const {check} = require('express-validator');
const {signup,signin} = require('../controllers/auth');


router.post('/signup',[
    check('name','Name must be atleast 3 characters.').isLength({min:3}),
    check('email','Email required').isEmail(),
    check('password','Password must be atleast 3 char.').isLength({min:3})
],signup);

router.post('/signin',[
    check('email','Email Required').isEmail(),
    check('password','Password must be atleast 3 char.').isLength({min:3})
],signin);

module.exports = router;