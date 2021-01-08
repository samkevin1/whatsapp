const express = require('express');
const message = require('../models/message');

const router = express.Router();

router.post('/new', (req, res) => {
  const _message = req.body;
  message.create(_message, (err, data) => {
    if(err){
      res.status(500).send(err);
    }else{
      res.status(200).send(data);
    }
  });
});

router.get('/sync', (req, res) => {
  message.find((err, data) => {
    if(err){
      res.status(500).send(err);
    }else{
      res.status(200).send(data);
    }
  });
});

module.exports = router;