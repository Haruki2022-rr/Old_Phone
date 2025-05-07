const Phone = require('../models/Phone');
exports.addReview = async (req, res) => {
    try {
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

        res.status(201).json({ message: 'Review added successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Failed to add review' });
    }
};

// Toggle review hidden (seller or reviewer only)
exports.toggleReviewHidden = async (req, res) => {
    try {
        const phone = await Phone.findById(req.params.phoneId);
        
        if(!phone) return res.status(404).json({ error: 'Phone ot found'});
        
        const review = phone.reviews.id(req.params.reviewId);

        if (!review) return res.status(404).json({ error: 'review not found' });

        const isReviewer = review.reviewer.equals(req.user._id);
        const isSeller = phone.seller.equals(req.user._id);

        if(!isReviewer && !isSeller) {
            return res.status(403).json({ error: 'Not authorised to change review visibility'});
        }
        review.hidden = !review.hidden;
        await phone.save();

        res.jsoN({ message: 'Review visibility changed', hidden: review.hidden });
    } catch(err){
        res.status(500).json({ error: 'Failed to change review vissibility'});
    }
};