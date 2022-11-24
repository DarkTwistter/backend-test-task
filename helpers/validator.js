const Joi = require('joi');
const { ValidationError } = require("../Errors");

class Validator {

    _schema = {};

    static TYPES = Joi;

    setRule(field, rule){
        this._schema[field] = rule;
    }

    validate(data){
        let schema = Joi.object(this._schema);

        try {
            Joi.assert(data, schema, {abortEarly: false});
        }
        catch(error){
            const message = error.details.map(detail => detail.message);
            throw new ValidationError(message);
        }
    }
}

module.exports = Validator;