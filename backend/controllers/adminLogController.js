const AdminLog = require('../models/AdminLog');

exports.getAdminLogs = async (req, res) => {
    try {
        const logs = await AdminLog.find().sort({ timestamp: -1 });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch log list' });
    }
};

// exports.createAdminLog = async (req, res) => {
//     const { action, details } = req.body;
//
//     try {
//         const newLog = new AdminLog({ action, details });
//         await newLog.save();
//         res.status(201).json({ message: 'Admin Log saved', log: newLog });
//     } catch (err) {
//         res.status(500).json({ message: 'Failed to save new admin log' });
//     }
// };
