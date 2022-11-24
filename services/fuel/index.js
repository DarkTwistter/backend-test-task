const Validator = require('../../helpers/validator');
const db = require('../../database');
const { UserNotOwnsThisCar } = require('../../Errors');
const { v4: uuidv4 } = require('uuid');
const CONSTANTS = require('../../Constants');

class Fuel {

    async recordFuelData(data, headers, user){
        let validator = new Validator();

        // Авторизации для демонстрации не требуется, просто передаем userId (uuidV4) в body запроса
        validator.setRule('userId', Validator.TYPES.string().guid({version: 'uuidv4'}).required());
        validator.setRule('carId', Validator.TYPES.string().guid({version: 'uuidv4'}).required());
        validator.setRule('fuelQuantity', Validator.TYPES.number().required());

        validator.validate(data);

        let userOwnsThisCar = await db('cars').where({
            user_id: data.userId,
            car_id: data.carId,
            active: CONSTANTS.CAR.STATUSES.ACTIVE
        });

        if(!userOwnsThisCar.length){
            throw new UserNotOwnsThisCar();
        }


        let uuid = uuidv4();

        await db('fuel_records').insert({
            car_id: data.carId,
            fuel_quantity: data.fuelQuantity,
            created_at: Date.now(),
            record_id: uuid
        })

        return uuid;
    }

    async getFuelRecords(data, headers, user){

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

        let records = await db('fuel_records').where({
            car_id: data.carId
        }).orderBy('created_at', 'desc').limit(10);

        return records;
    }

}

module.exports = new Fuel();