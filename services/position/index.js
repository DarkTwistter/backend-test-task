const Validator = require('../../helpers/validator');
const db = require('../../database');
const { UserNotOwnsThisCar } = require('../../Errors');
const { v4: uuidv4 } = require('uuid');
const CONSTANTS = require('../../Constants');

class Position {

    async recordPositionData(data, headers, user){
        let validator = new Validator();

        // Авторизации для демонстрации не требуется, просто передаем userId (uuidV4) в body запроса
        validator.setRule('userId', Validator.TYPES.string().guid({version: 'uuidv4'}).required());
        validator.setRule('carId', Validator.TYPES.string().guid({version: 'uuidv4'}).required());
        validator.setRule('position', Validator.TYPES.array().items(
            Validator.TYPES.number().required(),
            Validator.TYPES.number().required())
        .required());

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

        await db('position_records').insert({
            record_id: uuid,
            car_id: data.carId,
            position: db.raw(`point(${data.position[0]}, ${data.position[1]})`),
            created_at: Date.now(),
        })

        return uuid;
    }

    async getPositionRecords(data, headers, user){

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

        let records = await db('position_records').where({
            car_id: data.carId
        }).orderBy('created_at', 'desc').limit(20);

        return records;
    }

}

module.exports = new Position();