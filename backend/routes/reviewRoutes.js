const express = require('express');
const reviewController = require('../controllers/reviewController');
const requireUser = require('../middleware/requireUser');
const router = express.Router();
router.post('/phones/:id/reviews', requireUser, reviewController.addReview);

router.post('/phones/:phoneId/reviews/:reviewId/toggle',requireUser, reviewController.toggleReviewHidden);


module.exports = router;