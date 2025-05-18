// test if the email will be sent
require('dotenv').config({ path: '../.env' });
const sendVerificationEmail = require('../utils/email.js');

const testUser = {
  name: "Ethan",
  email: "ehun0216@uni.sydney.edu.au" // Use your email to test
};

const verificationUrl = `https://www.jams.tv/`;

sendVerificationEmail(testUser, verificationUrl);
