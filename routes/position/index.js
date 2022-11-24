const Position = require('../../services/position');
const express = require('express');

const { allowRoles, checkToken, isHasToken} = require("../../middlewares");

const router = express.Router();

router.post('/recordPositionData', (req, res, next) => {
    Position.recordPositionData(req.body || {}, req.headers || {})
        .then(data => res.status(200).json({ message: 'Success', data }))
        .catch(err => next(err));
});

router.post('/getPositionRecords', (req, res, next) => {
    Position.getPositionRecords(req.body || {}, req.headers || {})
        .then(data => res.status(200).json({ message: 'Success', data }))
        .catch(err => next(err));
});

module.exports = router;