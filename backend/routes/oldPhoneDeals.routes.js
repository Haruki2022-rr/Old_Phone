const router = require("express").Router();
const express = require("express");
// use require to get controller here
const { signup, emailVerification, login} = require("../controllers/authController");

// add method to use controller function here
// example: 
// GET    /api/oldPhoneDeals/auth

//signup : /api/oldPhoneDeals/auth/signup
router.post("/auth/signup", signup);

//email verification : /api/oldPhoneDeals/auth/verifyemail/:token
router.get("/auth/verifyemail/:token", emailVerification);

//signup: /api/oldPhoneDeals/auth/login
router.post("/auth/login", login);





module.exports = router;
