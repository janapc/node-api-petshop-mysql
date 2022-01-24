const express = require('express');
const Controller = require('./Controller');
const formatedResponse = require('../../utils/formatedResponse');

const router = express.Router();

const tags = {
  plural: 'providers',
  singular: 'provider',
};

router.options('/', (req, res) => {
  res.set('Access-Control-Allow-Methods', 'GET');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  res.status(204).end();
});

router.get('/', async (req, res) => {
  const response = await Controller.findAll();

  res.send(formatedResponse(res.getHeader('Content-Type'), response, tags));
});

module.exports = router;
