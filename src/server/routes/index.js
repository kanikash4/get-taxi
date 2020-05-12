'use strict';
const express = require('express');
const router = express.Router();
const cabs = require('../controllers/cabBooking');
const home = require('../controllers/home');
const allCabs = require('../data/cab');

router.get('/_status', function (req, res, next) { res.sendStatus(200);});

router.get('/', home.index);

router.get('/showall', function(req, res, next) {
  res.json({
    cabs: allCabs
  });
});

router.get('/getCab', cabs.getCabs);

router.get('/completeRide', cabs.completeRide);

module.exports = router;