const Fuel = require('../../services/fuel');
const express = require('express');

const { allowRoles, checkToken, isHasToken} = require("../../middlewares");

const router = express.Router();

router.post('/recordFuelData', (req, res, next) => {
    Fuel.recordFuelData(req.body || {}, req.headers || {})
        .then(data => res.status(200).json({ message: 'Success', data }))
        .catch(err => next(err));
});

router.post('/getFuelRecords', (req, res, next) => {
    Fuel.getFuelRecords(req.body || {}, req.headers || {})
        .then(data => res.status(200).json({ message: 'Success', data }))
        .catch(err => next(err));
});

module.exports = router;