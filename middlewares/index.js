const httpError = require('http-errors');
const {log} = require("debug");

// обработчик URL не найден
function notFound (req, res, next) {
    res.status(404);
    const err = new Error(`Not Found ${req.url}`);
    next(err);
}

function protectSQL() {
    const keywords = [
        'UNION', 'ALTER', 'CREATE', 'DELETE', 'DROP', 'EXEC',
        'EXECUTE', 'INSERT', 'INSERT INTO', 'MERGE', 'SELECT',
        'UPDATE', 'UNION UNION ALL', 'FROM'
    ];

    return (req, res, next) => {
        if (!req.originalUrl) next();
        const result = hasInjections(req.originalUrl, req.body, keywords)
        if (result) {
            next();
        } else {
            next(httpError(403,'Detected injection'));
        }
    };
}

function hasInjections(url, body, keywords) {
    const result = keywords.filter(keyword => {
        const urlHaveInjectin = url.includes(keyword);
        const bodyHaveInjection = new RegExp(`(\\s|")+${keyword}(\\s|")+`).test(JSON.stringify(body));
        return urlHaveInjectin || bodyHaveInjection;
    });
    if (result.length === 0) return true;
    return false;
}

function hideKnexErrors(err, _req, _res, next) {
    if (err) {
        if (err.sqlMessage) next(httpError(500, 'Ошибка сервера'));
        next(err);
    } else {
        next();
    }
}

module.exports = { notFound, protectSQL, hideKnexErrors};