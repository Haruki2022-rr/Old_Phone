const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Phone = require("../models/Phone");

const admin = {
    email: "admin@gmail.com",
    password: bcrypt.hashSync('0000', 10)
};

async function adminUpdateUser(req, res) {
    try {
        const { userID, userFirst, userLast, userEmail } = req.body;
        
        if(!userID || !userFirst || !userLast || !userEmail ){
            return res
            .status(400) 
            .json({message:'All fields are required'})
        }
        const user = await User.findById(userID);
        
        if (!user) {
            return res
                .status(404)
                .json({ message: "User not found" });
        }
        user.firstname = userFirst;
        user.lastname = userLast;
        user.email = userEmail;
        await user.save();

        console.log("Updated user: ", user);

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
        });

    } catch (error) {
        console.error(error);
    }

}


async function adminDeleteUser(req, res) {
    console.log("Here");
    try {
        const { userID } = req.body;
        if(!userID){
            return res
            .status(400) 
            .json({message:'Could not find user ID'})
        }
        const user = await User.findById(userID);
        
        if (!user) {
            return res
                .status(404)
                .json({ message: "User not found in database" });
        }
        await User.findByIdAndDelete(userID);

        console.log("Deleted user: ", user);

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });

    } catch (error) {
        console.error(error);
    }

}
async function adminEditListing(req, res) {
    try {
        const { listingID, listingTitle, listingBrand, listingImage, listingStock, listingPrice, listingDisabled, listingReview} = req.body;
        
        if(!listingID || !listingTitle || !listingBrand || !listingImage || !listingStock || !listingPrice ){
            return res
            .status(400) 
            .json({message:'All fields are required'})
        }
        const listing = await Phone.findById(listingID);
        if (!listing) {
            return res
                .status(404)
                .json({ message: "Listing not found" });
        }
        if (typeof listingDisabled !== 'undefined') {
            listing.disabled = !listingDisabled;
        }

        if (listingReview) {
            listing.reviews.forEach((review) => {
                if (review.reviewer.toString() === listingReview.reviewer.toString()) {
                    review.hidden = !review.hidden;
                }
            })
        }

        listing.title = listingTitle;
        listing.brand = listingBrand;
        listing.image = listingImage;
        listing.stock = listingStock;
        listing.price = listingPrice;
        await listing.save();
        console.log("Updated listing: ", listing);

        res.status(200).json({
            success: true,
            message: "Listing updated successfully",
            listing: {
                id: listing._id,
                title: listing.title,
                brand: listing.brand,
                image: listing.image,
                stock: listing.stock,
                price: listing.price,
                disabled: listing.disabled,
                reviews: listing.reviews.map((review) => ({
                    reviewer: review.reviewer,
                    rating: review.rating,
                    comment: review.comment,
                    hidden: review.hidden,
                })),
            },
        });

    } catch (error) {
        console.error(error);
    }
}

async function adminDeleteListing(req, res) {
    try {
        const { listingID } = req.body;
        if(!listingID){
            return res
            .status(400) 
            .json({message:'Could not find listing ID'})
        }
        const listing = await Phone.findById(listingID);
        
        if (!listing) {
            return res
                .status(404)
                .json({ message: "Listing not found in database" });
        }
        await Phone.findByIdAndDelete(listingID);

        console.log("Deleted listing: ", listing);

        res.status(200).json({
            success: true,
            message: "Listing deleted successfully",
        });

    } catch (error) {
        console.error(error);
    }

}

async function adminAuthentication(req, res) {
    try {
        const { email, password } = req.body;
        if(!email || !password ){
        return res
        .status(400) 
        .json({message:'All fields are required'})
        }

        if(admin.email != email){
        return res
        .status(401)
        .json({message:'Incorrect email or password' }) 
        }
        const auth = await bcrypt.compare(password, admin.password)
        if (!auth) {
        return res
        .status(403)
        .json({message:'Incorrect email or password' }) 
        }

        // session
        req.session.adminId = 'admin0000' 
        req.session.isAdmin = true;
        // to override default maxAge in index.js 
        req.session.cookie.maxAge = 30 * 100000;  
        res.status(200).json({
        success: true,
        message: "Admin logged in and session initialized successfully",
        });
    } catch (error) {
        console.error(error);
    }
}

module.exports = { adminAuthentication, adminUpdateUser, adminDeleteUser, adminEditListing, adminDeleteListing };