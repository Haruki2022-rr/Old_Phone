const express = require('express');
const router = express.Router();
const phoneController = require('../controllers/phoneController');

// CREATE a new phone listing (e.g., from profile page)
router.post('/phones', phoneController.createPhone);

// UPDATE an existing phone listing by ID
router.put('/phones/:id',phoneController.updatePhone);

// DELETE a phone listing by ID
router.delete('/phones/:id', phoneController.deletePhone);

// OPTIONAL: get phones for a specific user (e.g., for profile page)
router.get('/phones/user/:userId', phoneController.getPhonesByUser);

module.exports = router;
