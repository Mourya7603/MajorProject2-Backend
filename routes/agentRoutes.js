const express = require('express');
const SalesAgent = require('../models/SalesAgent');
const router = express.Router();

// CREATE Sales Agent
router.post('/', async (req, res) => {
  try {
    const agent = new SalesAgent(req.body);
    await agent.save();
    res.status(201).json(agent);
  } catch (err) {
    if (err.code === 11000) {
      res.status(409).json({ error: `Sales agent with email '${req.body.email}' already exists.` });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
});

// GET All Sales Agents
router.get('/', async (req, res) => {
  try {
    const agents = await SalesAgent.find();
    res.json(agents);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
