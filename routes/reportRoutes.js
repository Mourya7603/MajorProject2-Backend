const express = require('express');
const Lead = require('../models/Lead');
const router = express.Router();

// Leads closed in last week
router.get('/last-week', async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const leads = await Lead.find({
      status: 'Closed',
      updatedAt: { $gte: oneWeekAgo },
    }).populate('salesAgent', 'name');

    res.json(leads);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Leads in pipeline (grouped by status)
router.get('/pipeline', async (req, res) => {
  try {
    const pipeline = await Lead.aggregate([
      { $match: { status: { $ne: 'Closed' } } },
      { $group: { _id: '$status', total: { $sum: 1 } } },
    ]);
    res.json(pipeline);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Leads closed by each sales agent
router.get('/closed-by-agent', async (req, res) => {
  try {
    const report = await Lead.aggregate([
      { $match: { status: 'Closed' } },
      { $group: { _id: '$salesAgent', totalClosed: { $sum: 1 } } },
    ]);

    res.json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
