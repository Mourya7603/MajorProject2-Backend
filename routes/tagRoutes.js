const express = require('express');
const Tag = require('../models/Tag');
const router = express.Router();

// CREATE Tag
router.post('/', async (req, res) => {
  try {
    const tag = new Tag(req.body);
    await tag.save();
    res.status(201).json(tag);
  } catch (err) {
    if (err.code === 11000) {
      res.status(409).json({ error: `Tag '${req.body.name}' already exists.` });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
});

// GET All Tags
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
