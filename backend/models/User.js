const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true }, 
  isVerified: { type: Boolean, default: false }, //for email verification
  lastLogin: {type: Date},
  emailVerificationToken: { type: String }, // hashed verification token
  emailVerificationTokenExpires: { type: Date }, // when token becomes invalid
  passwordResetToken: { type: String },
  passwordResetTokenExpires: { type: Date },  
}, {
  timestamps: true
});


// before document.save(), hash the password
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// reference: https://rajat-m.medium.com/how-to-set-up-email-verification-using-node-js-and-react-js-376e09b371e2
UserSchema.methods.getVerificationToken = function () {
    const token = crypto.randomBytes(32).toString('hex');
  
    this.emailVerificationToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
  
    this.emailVerificationTokenExpire = Date.now() + 60 * 60 * 1000; // 60 minutes
  
    return token;
};

UserSchema.methods.getPasswordResetToken = function() {
  const token = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  this.passwordResetTokenExpires = Date.now() + 60 * 60 * 1000; // 60 minutes
  return token;
};

module.exports = mongoose.model('User', UserSchema, 'users');
