// test if the email will be sent
require('dotenv').config({ path: '../.env' });
const sendVerificationEmail = require('../utils/email.js');

const testUser = {
  name: "Haruki",
  email: "harukihamachan0529@gmail.com" // Use your email to test
};

const verificationUrl = `https://www.jams.tv/`;

sendVerificationEmail(testUser, verificationUrl);
