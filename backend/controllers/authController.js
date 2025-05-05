// reference: https://www.freecodecamp.org/news/how-to-secure-your-mern-stack-application/
// reference: https://rajat-m.medium.com/how-to-set-up-email-verification-using-node-js-and-react-js-376e09b371e2
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { createSecretToken } = require('../utils/createSecretToken'); 
const sendVerificationEmail = require('./utils/sendVerificationEmail');

module.exports.Signup = async (req, res, next) => {
    try {
      const { firstname, lastname, email, password } = req.body;
      const existingUser = await User.findOne({ email });
      // if the user already exist, immidiatly return with a JSON response (status: 200)
      if (existingUser) {
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
        await user.save();
      
        // Build a verification URL. example:"https://your-domain.com/api/auth/verifyemail/abcdef123456"
        const verificationUrl = 
          `${req.protocol}://${req.get("host")}` +
          `/api/oldPhoneDeals/auth/verifyemail/${verificationToken}`;   
      
        // send the mail
        await sendVerificationEmail({ name: user.name, email: user.email }, verificationUrl);
      
        // Respond to the client
        res.status(201).json({
          success: true,
          message: "Verification email sent",
        });
      
      } else {
        res.status(400).json({ message: "Invalid user data" });
      }








      const token = createSecretToken(newUser._id);
      // setting coockie -> Set-Cookie header to the frontend with name "token" and the JWT
      res.cookie("token", token, {
        withCredentials: true, //for cross origin request(different port from backend and frontend)
        httpOnly: true, // client JS can't read this for security reason
      });
      res
        .status(201)
        // response with JSON body with success message, success:true flag, and user(a document)
        .json({ message: "Successfully signed in", success: true, nweUser });
      next();
    } catch (error) {
      console.error(error);
    }
  };
