class ServiceError extends Error {
    /**
     * @param {number} _status
     * @param {string} _code
     * @param {?string} _message
     * @param {?Object} _data
     _*/
    constructor(_status, _code, _message, _data = null) {
        super();
        this.status = _status;
        this.code = _code;
        this.message = _message;
        this.data = _data;
    }

    toResponse() {
        const returnData = {
            result: false,
            error: {
                code: this.code,
                message: this.message
            }
        };

        if(this.data){
            returnData.error.data = this.data;
        }

        return returnData;
    }

    toJSON() {
        const response = this.toResponse();

        return JSON.stringify(response);
    }
}

class BadRequestError extends ServiceError {
    static STATUS = 400;
    static STATUS_TEXT = 'Bad Request';
    static CODE = 'BAD_REQUEST';

    /**
     * @param {?Object} _data
     * @param {?string} _code
     * @param {?string} _message
     */
    constructor(_data = null, _code = BadRequestError.CODE, _message = BadRequestError.STATUS_TEXT) {
        super(BadRequestError.STATUS, _code, _message, _data);
    }
}

class UnAuthorized extends ServiceError {
    static STATUS = 401;
    static STATUS_TEXT = 'Unauthorized';
    static CODE = 'UNAUTHORIZED';

    /**
     * @param {?Object} _data
     * @param {?string} _code
     * @param {?string} _message
     */
    constructor(_data = null, _code = UnAuthorized.CODE, _message = UnAuthorized.STATUS_TEXT) {
        super(UnAuthorized.STATUS, _code, _message, _data);
    }
}


class ValidationError extends BadRequestError {
    static STATUS_TEXT = 'Validation error';
    static CODE = 'VALIDATION_ERROR';

    /**
     * @param {?Object} _data
     * @param {?string} _code
     * @param {?string} _message
     */
    constructor(_data = null, _code = BadRequestError.CODE, _message = BadRequestError.STATUS_TEXT) {
        super(_data, ValidationError.CODE, ValidationError.STATUS_TEXT);
    }
}

class CarsLimitExceeded extends BadRequestError {
    static STATUS_TEXT = 'You have already added 5 cars';
    static CODE = 'CARS_LIMIT_EXCEEDED';

    /**
     * @param {?Object} _data
     * @param {?string} _code
     * @param {?string} _message
     */
    constructor(_data = null, _code = BadRequestError.CODE, _message = BadRequestError.STATUS_TEXT) {
        super(_data, CarsLimitExceeded.CODE, CarsLimitExceeded.STATUS_TEXT);
    }
}

class UserNotOwnsThisCar extends UnAuthorized {
    static STATUS_TEXT = 'You do not own provided carId';
    static CODE = 'NO_PERMISSION';

    /**
     * @param {?Object} _data
     * @param {?string} _code
     * @param {?string} _message
     */
    constructor(_data = null, _code = UnAuthorized.CODE, _message = UnAuthorized.STATUS_TEXT) {
        super(_data, UserNotOwnsThisCar.CODE, UserNotOwnsThisCar.STATUS_TEXT);
    }
}

class UserNotFound extends UnAuthorized {
    static STATUS_TEXT = 'User with provided ID not found';
    static CODE = 'USER_NOT_FOUND';

    /**
     * @param {?Object} _data
     * @param {?string} _code
     * @param {?string} _message
     */
    constructor(_data = null, _code = UnAuthorized.CODE, _message = UnAuthorized.STATUS_TEXT) {
        super(_data, UserNotFound.CODE, UserNotFound.STATUS_TEXT);
    }
}



module.exports = {
    BadRequestError, ServiceError, ValidationError,
    CarsLimitExceeded, UserNotOwnsThisCar, UserNotFound
}