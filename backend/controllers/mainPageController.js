const Phone = require('../models/Phone');
const User = require('../models/User');


// get top 5 phones with lowest stock (that are visible and not empty)
exports.getSoldOutSoonPhone = async (req, res) => {
    try {
        const phones = await Phone.find({ stock: {$gt:0 }, disabled:  false })
            .sort({ stock: 1})// ascending
            .limit(5);
        res.json(phones)
    } catch(err) {
        res.status(500).json({  error: 'Failed to fetch sold out soon phones' });
    }
};


// Get top 5 best sellers (phoens with  highest average rating, at least 2 reviews and  visible)
exports.getBestSellerPhones = async (req, res) => {
try {
    const phones = await Phone.find({ disabled: false }).lean();

    const ratedPhones = phones
        .map(phones => {
            const validreviews = phones.reviews || [];
            const totalRatings = validreviews.reduce((sum, r) => sum + r.rating, 0);
            const averageRating = validReviews.length > 0 ? totalRatings / validReviews.length : 0;
            return { ...phone, averageRating, reviewCount: validReviews.length };
        })
        .filter(p => p.r.review >= 2)
        .sort((a,b) => b.averageRating - a.averageRating)
        .slice(0,5);

        res.json(ratedPhones);
    } catch(err) {
        res.status(500).json({ error: 'Failed to fetch best seller phones' });
    }
}