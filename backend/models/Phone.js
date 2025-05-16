const mongoose = require('mongoose');

// no id required
const ReviewSchema = new mongoose.Schema({
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating:   { type: Number },
  comment:  { type: String },
  hidden:   { type: Boolean, default: false }
}, { _id: false } );

const PhoneSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  brand:    { type: String, required: true},
  image:    { type: String, required: true },       
  stock:    { type: Number, default: 0 },
//   ObjectId refers to a document in the User model’s collection
  seller:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  price:    { type: Number, required: true },
  disabled: { type: Boolean, default: false },
  reviews:  [ReviewSchema],
});

module.exports = mongoose.model('Phone', PhoneSchema, 'phones');
