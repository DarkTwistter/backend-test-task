const Car = require('../../services/cars');
const express = require('express');

const { allowRoles, checkToken, isHasToken} = require("../../middlewares");

const router = express.Router();

router.post('/createCar', (req, res, next) => {
    Car.createCar(req.body || {}, req.headers || {})
        .then(data => res.status(200).json({ message: 'Success', data }))
        .catch(err => next(err));
});

router.post('/getCars', (req, res, next) => {
    Car.getCars(req.body || {}, req.headers || {})
        .then(data => res.status(200).json({ message: 'Success', data }))
        .catch(err => next(err));
});

router.delete('/deleteCar', (req, res, next) => {
    Car.deleteCar(req.body || {}, req.headers || {})
        .then(data => res.status(200).json({ message: 'Success', data }))
        .catch(err => next(err));
});

module.exports = router;