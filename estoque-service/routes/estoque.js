const express = require('express');
const router = express.Router();
const { estoque } = require('../data/estoque');

router.get('/', (_req, res) => {
  try {
    res.json(estoque);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
