const express = require('express');
const Comment = require('../models/Comment');
const Lead = require('../models/Lead');
const SalesAgent = require('../models/SalesAgent');
const router = express.Router();

// ADD Comment to a Lead
router.post('/:leadId/comments', async (req, res) => {
  try {
    const { commentText, author } = req.body;
    const { leadId } = req.params;

    const lead = await Lead.findById(leadId);
    if (!lead) return res.status(404).json({ error: `Lead with ID '${leadId}' not found.` });

    const agent = await SalesAgent.findById(author);
    if (!agent) return res.status(404).json({ error: `Sales agent with ID '${author}' not found.` });

    const comment = new Comment({ lead: leadId, author, commentText });
    await comment.save();

    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET Comments for a Lead
router.get('/:leadId/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ lead: req.params.leadId }).populate('author', 'name email');
    res.json(comments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
