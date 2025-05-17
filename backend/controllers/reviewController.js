const Phone = require('../models/Phone');
exports.addReview = async (req, res) => {
    try {
        console.log("Request received at addReview endpoint"); // Debug log
        console.log("Request body:", req.body); // Log request body
        console.log("Request params:", req.params); // Log request params



        const { rating, comment } = req.body;
        const phone = await Phone.findById(req.params.id);

        if (!phone) return res.status(404).json({ error: 'Phone not found '});

        const newReview = {
            reviewer: req.user._id,
            rating,
            comment,
            hidden: false
        };

        phone.reviews.push(newReview);
        await phone.save();

        res.status(201).json({ message: 'Review added successfully', review: newReview });
    } catch (err) {
        console.log("Error in making the review");
         console.error('addReview error →', err);
        res.status(400).json({ error: 'Failed to add review' });
    }
};

// Toggle review hidden (seller or reviewer only)
exports.toggleReviewHidden = async (req, res) => {
    try {
        console.log("toggleReviewHidden called with phoneId:", req.params.phoneId, "reviewId:", req.params.reviewId);
        console.log("Current user:", req.user?._id);
        
        const phone = await Phone.findById(req.params.phoneId);
        
        if(!phone) return res.status(404).json({ error: 'Phone not found'});
        console.log("Found phone:", phone._id);
        
        // First try to find by MongoDB ObjectId
        let review = phone.reviews.id(req.params.reviewId);
        
        // If not found, try to find by our custom ID format
        if (!review) {
            console.log("Review not found by ID, trying custom format");
            // Parse custom ID format: reviewerId_commentLength_index
            const customId = req.params.reviewId;
            const parts = customId.split('_');
            
            if (parts.length >= 1) {
                const reviewerId = parts[0];
                console.log("Looking for review with reviewer:", reviewerId);
                
                // Find the review by reviewer ID (and possibly other parts if needed)
                review = phone.reviews.find(r => 
                    String(r.reviewer) === reviewerId || 
                    (r.reviewer && r.reviewer.toString() === reviewerId)
                );
            }
        }

        if (!review) {
            console.log("Review not found in phone reviews");
            return res.status(404).json({ error: 'Review not found' });
        }
        
        console.log("Found review:", review);

        // Safe way to compare IDs - handle both ObjectId and string comparisons
        const isReviewer = String(review.reviewer) === String(req.user._id);
        const isSeller = String(phone.seller) === String(req.user._id);
        
        console.log("isReviewer:", isReviewer, "isSeller:", isSeller);

        if(!isReviewer && !isSeller) {
            return res.status(403).json({ error: 'Not authorized to change review visibility'});
        }
        
        review.hidden = !review.hidden;
        await phone.save();

        console.log("Review visibility toggled:", review.hidden);
        res.json({ message: 'Review visibility changed', hidden: review.hidden });
    } catch(err){
        console.error('Review toggle error:', err);
        res.status(500).json({ error: 'Failed to change review visibility'});
    }
};