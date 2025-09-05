const express = require('express');
const Lead = require('../models/Lead');
const SalesAgent = require('../models/SalesAgent');
const router = express.Router();

// CREATE Lead
router.post('/', async (req, res) => {
  try {
    const { salesAgent } = req.body;
    const agent = await SalesAgent.findById(salesAgent);
    if (!agent) return res.status(404).json({ error: `Sales agent with ID '${salesAgent}' not found.` });

    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json(lead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET Leads with Filters
router.get('/', async (req, res) => {
  try {
    const filters = {};
    if (req.query.salesAgent) filters.salesAgent = req.query.salesAgent;
    if (req.query.status) filters.status = req.query.status;
    if (req.query.source) filters.source = req.query.source;
    if (req.query.tags) filters.tags = { $in: req.query.tags.split(',') };
    if (req.query.priority) filters.priority = req.query.priority;

    const leads = await Lead.find(filters).populate('salesAgent', 'name email');
    res.json(leads);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET Lead by ID
router.get('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('salesAgent', 'name email');
    if (!lead) return res.status(404).json({ error: `Lead with ID '${req.params.id}' not found.` });
    res.json(lead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH (Update) Lead
router.patch('/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('salesAgent', 'name email');

    if (!lead) return res.status(404).json({ error: `Lead with ID '${req.params.id}' not found.` });

    res.json(lead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE Lead
router.delete('/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ error: `Lead with ID '${req.params.id}' not found.` });

    res.json({ message: 'Lead deleted successfully.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
