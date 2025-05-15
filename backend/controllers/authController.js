// reference: https://www.freecodecamp.org/news/how-to-secure-your-mern-stack-application/
// reference: https://rajat-m.medium.com/how-to-set-up-email-verification-using-node-js-and-react-js-376e09b371e2
// reference: chatGPT -> ask for help for small functinality and bug fix.
const User = require("../models/User");
const {sendVerificationEmail, sendResetPasswordEmail, sendConfirmationEmail} = require('../utils/email');
const crypto = require("crypto")
const bcrypt = require("bcryptjs");
const Phone = require("../models/Phone");


async function signup(req, res) {
    try {
      const { firstname, lastname, email, password, from } = req.body;
      if(!firstname|| !lastname|| !email || !password ){
        return res.json({message:'All fields are required'})
      }
      // if the user already exist, immidiatly return with a JSON response (status: 200)
      if (await User.exists({ email })) {
        return res
            .status(409) //conflict
            .json({ message: "Account already exists" });
      }
      // if the user is not exist -> create account
      // create document and insert into the User collection. user have a document that has been inserted.
      const newUser = await User.create({ firstname, lastname, email, password, isVerified: false });

      if (newUser) {
        // call method in User model
        const verificationToken = newUser.getVerificationToken();
      
        // Save the user with token and expire
        await newUser.save();
      
        // Build a verification URL. 
        const verificationUrl = 
          `http://localhost:3000/verifyemail/${verificationToken}` +
          `?from=${encodeURIComponent(from)}`;   
      
        // send the mail
        const fullName = `${newUser.firstname} ${newUser.lastname}`;
        await sendVerificationEmail({ name: fullName, email: newUser.email }, verificationUrl);
      
        // Respond to the client
        res.status(201).json({
          success: true,
          message: "Verification email sent",
        });
      
      } else {
        res.status(400).json({ message: "Invalid user data" });
      }
    } catch (error) {
      console.error(error);
    }
  };


//When the user clicks the verification link, validates the token <- come form front end
async function emailVerification(req, res) {
  try {
    // get token from the URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token) //:token from URL 
      .digest("hex");
  
    // find user with the token
    const newUser = await User.findOne({ emailVerificationToken: hashedToken });
    if (!newUser) {
      // No user had that token
      return res
        .status(400)
        .json({ message: "Invalid verification link" });
    }
      
    // Check whether the user's token is expired
    if (newUser.emailVerificationTokenExpires < Date.now()) {
      return res
        .status(400)
        .json({ message: "Verification link has expired" });
    }
  
    // the user is verified
    // Mark as verified & clear token fields
    newUser.lastLogin = new Date();
    newUser.isVerified = true;
    newUser.emailVerificationToken = undefined;
    newUser.emailVerificationTokenExpires = undefined;
    await newUser.save();
  
    // Store the user’s ID in the session
    req.session.userId = newUser._id;
    res.json({
      success: true,
    });
    
  
  } catch (error) {
    console.error("verifyEmail error:", error);
    return res
      .status(500)
      .json({ message: "Server error during email verification" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if(!email || !password ){
      return res
      .status(400) 
      .json({message:'All fields are required'})
    }
    const user = await User.findOne({ email });
    if(!user){
      return res
      .status(401)
      .json({message:'Incorrect email or password' }) 
    }
    if (!user.isVerified) {
      return res
      .status(401)
      .json({ message: "Please verify your email before logging in" });
    }
    const auth = await bcrypt.compare(password,user.password)
    if (!auth) {
      return res
      .status(403)
      .json({message:'Incorrect email or password' }) 
    }
    
    // update login time in db
    user.lastLogin = new Date();
    // persist only that change 
    await user.save();

    // Store the user’s ID in the session
    req.session.userId = user._id;
    res.status(200).json({
      success: true,
      message: "User logged in and session initialized successfully",
      user: {
        id: user._id,
        email: user.email
        }
    });
  } catch (error) {
    console.error(error);
  }
}


async function logout(req, res) {
  req.session.destroy(err => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ success: false, message: "Could not log out" });
    }   
    // The default cookie name is “connect.sid”
    res.clearCookie("connect.sid");
    res.json({ success: true, message: "Logged out successfully" });
  });
}

// when user click reset in auth page
async function forgetPassword(req, res) {
  try {
    const {email} = req.body;
    if(!email){
      return res.json({message:'Email are required'})
    }
    // if the user is not exist, immidiatly return with a JSON response (status: 200)
    const user = await User.findOne({ email })
    if (!user) {
      return res
          .status(409) //conflict
          .json({ message: "Acount does not exists" });
    }
  
    // if use exist -> send reset email
    if (user) {
      // call method in User model
      const token = user.getPasswordResetToken();
    
      // Save the user with token and expire
      await user.save();
    
      // url to front end: reset-password page
      const resetPasswordUrl = 
        `${req.protocol}://localhost:3000` +
        `/reset-password/${token}`;   

      
      // send the mail
      const fullName = `${user.firstname} ${user.lastname}`;
      await sendResetPasswordEmail({ name: fullName, email: user.email }, resetPasswordUrl);
    
      // Respond to the client
      res.status(201).json({
        success: true,
        message: "Reset password email sent",
      });
    
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error(error);
  }
};

// similar logic to verify email
async function resetPassword(req, res) {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res
      .status(400)
      .json({ message: "Reset token is expired" });
  }

  // set the new password (pre-save hook will hash it)
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();

  res.status(200).json({ success: true, message: "Password reset successful" });
}

async function updatePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    // Get the current user from session
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Compare provided current password with the stored hash
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(403).json({ message: "Current password is incorrect" });
    }

    // Set the new password (pre-save hook will hash it) and save
    user.password = newPassword;
    await user.save();

    const fullName = `${user.firstname} ${user.lastname}`;
    await sendConfirmationEmail({ name: fullName, email: user.email });

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("updatePassword error:", error);
    res.status(500).json({ message: "Server error while updating password" });
  }
}

async function getCurrentUser(req, res) {
  const id = req.session.userId;
  if (!id) return res.status(401).json({ message: "Not authenticated" });

  // get user info except for password
  const user = await User.findById(id).select("-password");
  res.json({ user });
}



async function updateProfile(req, res) {

  const { userDetails, hiddenPassword } = req.body;
  const { firstname, lastname, email } = userDetails;
  const { password } = hiddenPassword;
  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findById(req.session.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({ message: "Current password is incorrect" });
    }
  if (!isMatch) {
    return res.status(403).json({ message: "Entered password is incorrect" });
  }

  // find user and update
  
  user.firstname = firstname;
  user.lastname = lastname;
  user.email = email;
  await user.save();

  res.status(200).json({ message: "User updated successfully" });

}

async function addListing(req, res) {
  const { title, brand, image, stock, price } = req.body;
  const user = await User.findById(req.session.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const newListing = new Phone({
    title,
    brand,
    image,
    stock,
    price,
    seller: user._id,
    reviews: []
  });
  await newListing.save();
  res.status(200).json({ 
    message: "Listing added successfully", 
    listing: newListing 
  });
}

async function removeListing(req, res) {
  const { listingId } = req.body;
  
  const user = await User.findById(req.session.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const listing = await Phone.findById(listingId);
  console.log("listing removed: \n", listing);
  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  // Remove the listing from the database
  await Phone.findByIdAndDelete(listingId);

  res.status(200).json({ message: "Listing removed successfully" });
}

async function updateListing(req, res) {
  const { listingId } = req.body;
  
  const user = await User.findById(req.session.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const listing = await Phone.findById(listingId);
  console.log("listing updated: \n", listing);
  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  listing.disabled = !listing.disabled;
  await listing.save();

  res.status(200).json({ message: "Listing updated successfully" });
}

async function hideComment(req, res) {
  const { comment, commentDetails } = req.body; // comment is the reviewer id, commentDetails is the phone document
  const user = await User.findById(req.session.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  
  // Find the phone document by its _id from commentDetails
  const phone = await Phone.findById(commentDetails._id);
  if (!phone) {
    return res.status(404).json({ message: "Phone not found" });
  }
  
  // Locate the review with reviewer id matching comment and mark it as hidden
  let reviewFound = false;
  phone.reviews.forEach(review => {
    if (review.reviewer.toString() === comment) {
      review.hidden = !review.hidden; // Toggle the hidden status
      reviewFound = true;
    }
  });
  
  if (!reviewFound) {
    return res.status(404).json({ message: "Review not found" });
  }
  
  await phone.save();
  res.status(200).json({ message: "Review updated successfully" });
}


  module.exports = {
    signup, emailVerification, login, logout, forgetPassword, resetPassword, getCurrentUser, updatePassword, updateProfile, removeListing, updateListing, hideComment, addListing
  };