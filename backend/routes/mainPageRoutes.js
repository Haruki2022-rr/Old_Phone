const express = require('express');
const router = express.Router();

const mainPageController = require('../controllers/mainPageController');

// Route to get phones with the least stock (sold out soon)

router.get('/phones/soldoutsoon', mainPageController.getSoldOutSoonPhone);

// Route to get best seller phones (higher rated)
router.get('/phones/bestsellers', mainPageController.getBestSellerPhones);

//Route to serach for phones (title + filters)
router.get('/phones/search', mainPageController.searchPhones);

// Route to get detailed phone info by ID
router.get('/phones/:id', mainPageController.getPhoneDetails);

mdoule.exports = router;
