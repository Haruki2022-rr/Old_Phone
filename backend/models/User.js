const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname:  { type: String, required: true },
  email:     { type: String, required: true, unique: true},
  password:  { type: String, required: true }, 
  isVerified: { type: Boolean, default: false }, //for email verification
  verifyToken:          { type: String }, // hashed verification token
  verifyTokenExpires:   { type: Date }, // when token becomes invalid
});

// before document.save(), hash the password
UserSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 10);
  });

module.exports = mongoose.model('User', UserSchema, 'users');
