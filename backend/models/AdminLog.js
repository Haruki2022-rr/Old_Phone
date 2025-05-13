const mongoose = require('mongoose');

const AdminLogSchema = new mongoose.Schema({
    action: { type: String, required: true },
    details: { type: String },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdminLog', AdminLogSchema);

