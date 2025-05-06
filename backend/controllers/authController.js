// reference: https://www.freecodecamp.org/news/how-to-secure-your-mern-stack-application/
// reference: https://rajat-m.medium.com/how-to-set-up-email-verification-using-node-js-and-react-js-376e09b371e2
const User = require("../models/User");
const sendVerificationEmail = require('../utils/email');
const crypto = require("crypto")

async function signup(req, res) {
    try {
      const { firstname, lastname, email, password } = req.body;
      // if the user already exist, immidiatly return with a JSON response (status: 200)
      if (await User.exists({ email })) {
        return res
            .status(409) //conflict
            .json({ message: "Acount already exists" });
      }
      // if the user is not exist -> create account
      // create document and insert into the User collection. user have a document that has been inserted.
      const newUser = await User.create({ firstname, lastname, email, password, isVerified: false });

      if (newUser) {
        // call method in User model
        const verificationToken = newUser.getVerificationToken();
      
        // Save the user with token and expire
        await newUser.save();
      
        // Build a verification URL. example:"https://your-domain.com/api/auth/verifyemail/abcdef123456"
        const verificationUrl = 
          `${req.protocol}://${req.get("host")}` +
          `/api/oldPhoneDeals/auth/verifyemail/${verificationToken}`;   
          //router.get("/auth/verifyemail/:token", verifyEmail);
      
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


//When the user clicks the verification link, validates the token
//router.get("/auth/verifyemail/:token", verifyEmail);
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
    newUser.isVerified              = true;
    newUser.emailVerificationToken       = undefined;
    newUser.emailVerificationTokenExpires = undefined;
    await newUser.save();
  
    // Store the user’s ID in the session
    req.session.userId = newUser._id;
    res.status(201).json({
      success: true,
      message: "User authenticated and session initialized successfully",
      user: {
        id: newUser._id,
        email: newUser.email
        }
    });
    
  
  } catch (error) {
    console.error("verifyEmail error:", error);
    return res
      .status(500)
      .json({ message: "Server error during email verification" });
  }
}



  module.exports = {
    signup, emailVerification
  };