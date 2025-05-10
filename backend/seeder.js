require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User  = require('./models/User');
const Phone = require('./models/Phone');

async function seed() {
    // MongoDB Connection
    const uri = process.env.MONGO_URI;
    await mongoose
    .connect(uri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

    // User collection data
    // delete all documents if any exists
    await User.deleteMany({});
    const defaultUsers = JSON.parse(
        fs.readFileSync(path.join(__dirname,'data','userlist.json'), 'utf-8')
    );
    // ensure all passwords use the same strong hash
    const defaultHashPassword = bcrypt.hashSync('Password@1', 10);
    const users = defaultUsers.map(u => ({
        firstname: u.firstname,
        lastname: u.lastname,
        email: u.email,
        password: defaultHashPassword,
        lastLogin: new Date(),
        isVerified: true,
        _id: new mongoose.Types.ObjectId(u._id.$oid),
    }));
    await User.insertMany(users);

    // Phones collection data
    await Phone.deleteMany({});
    const defaultPhones = JSON.parse(
        fs.readFileSync(path.join(__dirname,'data','phonelisting.json'), 'utf-8')
    );
    const phones = defaultPhones.map(p => {
        // if disabled: ""  exist → true , if not exits -> undefined -> false
        const disabled = p.disabled !== undefined;
        // if p.reviews is undefined or Null -> empty array []
        const reviews = (p.reviews || []).map(r => ({
        reviewer: new mongoose.Types.ObjectId(r.reviewer),
        rating:   r.rating,
        comment:  r.comment,
        // if hidden: "" exist -> true, if not exits -> undefined -> false
        hidden:   r.hidden !== undefined,
        }));
        // replace imageurl with proper URL under /data/phone_default_images
        const imageFile = `${p.brand}.jpeg`;

        return {
        title: p.title,
        brand: p.brand,
        // set  the URL path to /images in index.js with app.use()
        image: `/images/${imageFile}`,
        stock: p.stock,
        seller: new mongoose.Types.ObjectId(p.seller),
        price: p.price,
        disabled,
        reviews,
        };
    });
    await Phone.insertMany(phones);

    await mongoose.disconnect()
    console.log('Data has been successfully imported')
}

// call the seed function and catch if error happens at any point
seed().catch(err => {
  console.error('Seeding failed:', err);
//  tell node that error occured
  process.exit(1);
});
