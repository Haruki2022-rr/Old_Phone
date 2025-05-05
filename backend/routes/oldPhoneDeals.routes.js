const router = require("express").Router();
// use require to get controller here
const User = require('../models/User');
const Phone = require('../models/Phone');
// add method to use controller function here
// example: 
// GET    /api/phoneDeals/auth
// router.get("/auth", sighup);

router.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

router.get('/phones', async (req, res) => {
    const phones = await Phone.find();
    res.json(phones);
});

module.exports = router;
