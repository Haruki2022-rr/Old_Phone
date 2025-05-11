const Phone = require('../models/Phone');
const User = require('../models/User');


//Get all phone listings
exports.getAllPhones = async (req, res) => {
    try {
        const phones = await Phone.find().populate('seller', 'firstname lastname email');
        res.json(phones);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch phone listings'});
    }
};

// Get one phone listing by ID
exports.getPhonebyId = async (req, res) => {
    try { 
        const phone = await Phone.findById(req.params.id).populate('seller', 'firstname lastame email')
        if (!phone) return res.status(404).json({ error: 'Phone not found' });
        res.json(phone);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch phone details' });
    }
};

// POST create ew phone listing (user use)
exports.createPhone = async (req, res) => {
    try{ 
        const phoneData = {
            title: req.body.title,
            brand: req.body.brand,
            image: req.body.image,
            stock: req.body.stock,
            seller: req.user._id,
            price: req.body.price
        };
        const phone = await Phone.create(phoneData);
        res.status(201).json(phone);
    } catch(err) {
        res.status(400).json({ error: 'Failed to create phone listing'});
    }
};


// PUT update phone listing (user/admin)
exports.updatePhone = async (req, res) => { 
    try {
        const phone = await Phone.findbyIdAndUpdate(req.params.id, req.body, { new: true });
        if (!phone) return res.status(404).json({error: 'Phone not found'});
        res.json(phone);
    } catch (err) {
        res.status(500).json({error: 'Failed to update phone'});
    }
};

// Delete phone listig (user/admin)

exports.deletePhone = async (req, res) => {
    try {
        const phone = await Phone.findByIdAndDelete(req.params.id);
        if (!phone) return res.status(404).json({error: 'Phone not found'});
        res.json({ message: 'Phone deleted successfully'});
    } catch(err){
        res.status(500).json({ error: 'Failed to delete phone listing'});
    }
};

// PATCH disable a phone listing
exports.disbalePhone = async (req, res) => {
    try {
        const phone = await Phone.findByIdAndUpdate(req.params.id, { disbaled: ""}, { new: true });
        res.json(phone);
    } catch (err) {
        res.status(500).json({ error: 'Failed to disable phone Listing' });
    }
};

// Patch enable a phone listing
exports.enablePhone = async (req, res) => {
    try {
        const phone = await Phone.findByIdAndUpdate(req.params.id, {$unset: { disabled: ""}}, {new: true});
        res.json(phone);
    } catch(err) {
        res.status(500).json({ error: 'Failed to enable phone listing' });
    }
}

exports.getPhonesByUser = async (req, res) => {
    try {
      const phones = await Phone.find({ seller: req.params.userId });
      res.json(phones);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch user phone listings' });
    }
  };