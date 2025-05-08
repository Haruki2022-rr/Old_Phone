const router = require("express").Router();
const express = require("express");
// use require to get controller here
const User = require('../models/User');
const Phone = require('../models/Phone');
const { signup, emailVerification, login, logout, resetPassword, forgetPassword } = require("../controllers/authController");
const requireAuth = require("../middleware/requireAuth"); // to check if a user has logged in 

// Order Controller
const { createOrder } = require("../controllers/orderController");
const Order = require("../models/Order");

// add method to use controller function here
// example: 
// GET    /api/oldPhoneDeals/auth

//signup : /api/oldPhoneDeals/auth/signup
router.post("/auth/signup", signup);

//email verification : /api/oldPhoneDeals/auth/verifyemail/:token
router.get("/auth/verifyemail/:token", emailVerification);

//signup: /api/oldPhoneDeals/auth/login
router.post("/auth/login", login);

//logout: /api/oldPhoneDeals/auth/logout
router.post("/auth/logout", logout);

//reset password: /api/oldPhoneDeals/auth/reserPassword
router.post("/auth/forgetPassword", forgetPassword);

//resert password link: /api/oldPhoneDeals/auth/resetPasswordLink/:token
router.post("/auth/resetPassword/:token", resetPassword);

//get current use via cookie session /api/oldPhoneDeals/auth/getCurrentUser
router.get("/auth/currentUser", getCurrentUser);

router.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

router.get('/phones', async (req, res) => {
    const phones = await Phone.find();
    res.json(phones);
});

router.post('/orders', createOrder);



module.exports = router;
