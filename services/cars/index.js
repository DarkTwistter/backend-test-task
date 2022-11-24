const Validator = require('../../helpers/validator');
const db = require('../../database');
const { CarsLimitExceeded, UserNotFound, UserNotOwnsThisCar} = require('../../Errors');
const { v4: uuidv4 } = require('uuid');
const CONSTANTS = require('../../Constants');

class Car {

    async createCar(data, headers, user){
        let validator = new Validator();

        // Авторизации для демонстрации не требуется, просто передаем userId (uuidV4) в body запроса
        validator.setRule('userId', Validator.TYPES.string().guid({version: 'uuidv4'}).required());
        validator.setRule('carName', Validator.TYPES.string().max(40).required());
        validator.setRule('carPlateNumber', Validator.TYPES.string().max(40).required());


        validator.validate(data);

        let userExists = await db('users').where({
            user_id: data.userId,
        })

        if(!userExists.length){
            throw new UserNotFound();
        }

        let userCars = await db('cars').where({
            user_id: data.userId,
            active: CONSTANTS.CAR.STATUSES.ACTIVE
        })

        if(userCars.length >= 5){
            throw new CarsLimitExceeded();
        }

        let uuid = uuidv4();

        await db('cars').insert({
            user_id: data.userId,
            car_id: uuid,
            car_name: data.carName,
            car_plate_number: data.carPlateNumber,
            created_at: Date.now(),
            updated_at: Date.now(),
            active: CONSTANTS.CAR.STATUSES.ACTIVE
        })

        return uuid;
    }

    async getCars(data, headers, user){

        let validator = new Validator();

        // Авторизации для демонстрации не требуется, просто передаем userId (uuidV4) в body запроса
        validator.setRule('userId', Validator.TYPES.string().guid({version: 'uuidv4'}).required());

        validator.validate(data);

        let carsList = await db('cars').where({
            user_id: data.userId,
            active: CONSTANTS.CAR.STATUSES.ACTIVE
        });

        return carsList;
    }

    async deleteCar(data, headers, user){

        let validator = new Validator();

        // Авторизации для демонстрации не требуется, просто передаем userId (uuidV4) в body запроса
        validator.setRule('userId', Validator.TYPES.string().guid({version: 'uuidv4'}).required());
        validator.setRule('carId', Validator.TYPES.string().guid({version: 'uuidv4'}).required());

        validator.validate(data);

        let userOwnsThisCar = await db('cars').where({
            user_id: data.userId,
            car_id: data.carId,
            active: CONSTANTS.CAR.STATUSES.ACTIVE
        });

        if(!userOwnsThisCar.length){
            throw new UserNotOwnsThisCar();
        }

        await db('cars').update({
            active: CONSTANTS.CAR.STATUSES.DELETED,
        }).where({
            car_id: data.carId
        });

        return {
            deleted: true
        };
    }


}

module.exports = new Car();