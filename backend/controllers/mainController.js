const Phone = require('../models/Phone');
const User = require('../models/User');


// get top 5 phones with lowest stock (that are visible and not empty)
exports.getSoldOutSoonPhones = async (req, res) => {
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
        .map(phone => {
            const validReviews = phones.reviews || [];
            const totalRatings = validReviews.reduce((sum, r) => sum + r.rating, 0);
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
};

// Search phones by title (with optional brand and maxPrice filters)
exports.searchPhones = async (req, res) => {
    try {
        const { title, brand, maxPrice} = req.query;

        const query = { disabled: false};

        if (title) {
            query.title = { $regex: title, $options: 'i'};
        }
        if (brand) {
            query.brand = brand;
        }
        if (maxPrice) {
            query.price = { $lte: Number(maxPrice)};
        }

        const phones = await Phone.find(query);
        res.json(phones);
    } catch (err) {
        console.error('Error seraching phoenes:', err);
        res.status(500).json({error: 'Search failed'});
    }
};

exports.getPhoneDetails = async (req, res) => {
    try {
        const phone = await Phone.findById(req.params.id)
        .populate('seller','firstname lastname')
        .lean();
        if (!phone) {
            return res.status(404).json({error: 'Phone not found'});
        }
        res.json(phone);
    } catch(err) {
        console.error('Error getting phone  details', err);
        res.status(500).json({ error: 'Failed to get phone details'});
    }
};