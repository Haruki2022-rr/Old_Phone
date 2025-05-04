const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname:  { type: String, required: true },
  email:     { type: String, required: true, unique: true},
  password:  { type: String, required: true }, 
});

// before document.save(), hash the password
UserSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 10);
  });

module.exports = mongoose.model('User', UserSchema, 'users');
