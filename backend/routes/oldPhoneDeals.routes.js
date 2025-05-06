const router = require("express").Router();
const express = require("express");
// use require to get controller here
const { signup, emailVerification } = require("../controllers/auth");

// add method to use controller function here
// example: 
// GET    /api/oldPhoneDeals/auth

//signup : /api/oldPhoneDeals/auth/signup
router.post("/auth/signup", signup);

//email verification : /api/oldPhoneDeals/auth/verifyemail/:token
router.get("/auth/verifyemail/:token", emailVerification);





module.exports = router;
