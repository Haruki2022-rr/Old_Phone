const express = require('express');
const router = express.Router();

const mainController = require('../controllers/mainController');

// Route to get phones with the least stock (sold out soon)

router.get('/phones/soldoutsoon', mainController.getSoldOutSoonPhones);

// Route to get best seller phones (higher rated)
router.get('/phones/bestsellers', mainController.getBestSellerPhones);

//Route to serach for phones (title + filters)
router.get('/phones/search', mainController.searchPhones);

// Route to get detailed phone info by ID
router.get('/phones/:id', mainController.getPhoneDetails);

module.exports = router;
