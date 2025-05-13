const router = require("express").Router();
const express = require("express");
// use require to get controller here
const User = require('../models/User');
const Phone = require('../models/Phone');
const { signup, emailVerification, login, logout, resetPassword, forgetPassword, getCurrentUser, updatePassword, updateProfile, removeListing, updateListing, hideComment, addListing } = require("../controllers/authController");
const { adminAuthentication, adminUpdateUser, adminDeleteUser, adminEditListing, adminDeleteListing } = require("../controllers/adminController")
const requireAuth = require('../middleware/requireAuth.js');

const {getAdminLogs, createAdminLog} = require("../controllers/adminLogController");

// Order Controller
const { createOrder,
        getAllOrders,
        getOrderById,
        getOrdersByUser} = require("../controllers/OrderController");
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

//updating password: /api/oldPhoneDeals/auth/updatePassword
router.post("/auth/updatePassword", updatePassword);

//updating profile: /api/oldPhoneDeals/auth/updateProfile
router.post("/auth/updateProfile", updateProfile);

//removing listing: /api/oldPhoneDeals/auth/removeListing
router.post("/auth/removeListing", removeListing);

//updating listing: /api/oldPhoneDeals/auth/updateListing
router.post("/auth/updateListing", updateListing);

router.post("/auth/hideComment", hideComment);

router.post("/auth/addListing", addListing);

//get current use via cookie session /api/oldPhoneDeals/auth/getCurrentUser
router.get("/auth/currentUser", getCurrentUser);

// admin authentication
router.post("/admin/authentication", adminAuthentication);


router.post('/admin/adminUpdateUser', requireAuth, adminUpdateUser);

router.post('/admin/adminDeleteUser', requireAuth, adminDeleteUser);

router.post('/admin/adminEditListing', requireAuth, adminEditListing);

router.post('/admin/adminDeleteListing', requireAuth, adminDeleteListing);

// to access session date from frontend
router.get('/admin/me', requireAuth, (req, res) => {
    res.json({
      adminId: req.session.adminId,
      isAdmin: req.session.isAdmin
    });
  });







router.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

router.get('/phones', async (req, res) => {
    const phones = await Phone.find();
    res.json(phones);
});

// create new order from cart: /api/oldPhoneDeals/orders
router.post('/orders', createOrder);

// get all orders (admin only): /api/oldPhoneDeals/orders
router.get('/orders', getAllOrders);

// get order by ID (admin only): /api/oldPhoneDeals/orders/:id
router.get('/orders/:id', getOrderById);

// get all orders of a specific user: /api/oldPhoneDeals/orders/by-user/:userId
router.get('/orders/by-user/:userId', getOrdersByUser);

// get all admin logs: /api/oldPhoneDeals/admin/logs
router.get('/admin/adminLogs', getAdminLogs);

// create a new admin log entry: /api/oldPhoneDeals/admin/logs
router.post('/admin/logs', createAdminLog);



module.exports = router;
