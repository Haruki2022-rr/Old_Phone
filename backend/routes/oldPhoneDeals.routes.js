const router = require("express").Router();
const express = require("express");
// use require to get controller here
const User = require('../models/User');
const Phone = require('../models/Phone');
const { signup, emailVerification } = require("../controllers/auth");


// add method to use controller function here
// example: 
// GET    /api/oldPhoneDeals/auth

//signup : /api/oldPhoneDeals/auth/signup
router.post("/auth/signup", signup);

//email verification : /api/oldPhoneDeals/auth/verifyemail/:token
router.get("/auth/verifyemail/:token", emailVerification);


router.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

router.get('/phones', async (req, res) => {
    const phones = await Phone.find();
    res.json(phones);
});



module.exports = router;
