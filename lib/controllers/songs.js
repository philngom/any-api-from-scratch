const { Router } = require('express');
const Song = require('../models/Song');

module.exports = Router()
.post('/', async (req, res) => {
  console.log(req);
  const song = await Song.insert(req.body);

  res.json(song);
})