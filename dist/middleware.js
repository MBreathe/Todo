import { state } from "./db.js";
import { statusCode } from "./statusCodes.js";
function errorHandler(status, err, res) {
    res.status(status).send(err);
}
export function checkDb(req, res, next) {
    if (!state.db) {
        errorHandler(statusCode.internalServerError, 'Database is not connected', res);
        return;
    }
    next();
}
export function checkPostRequest(req, res, next) {
    if (!req.body.title)
        errorHandler(statusCode.badRequest, 'Invalid request', res);
    const input = req.body;
    const trimmedTitle = input.title.trim();
    if (trimmedTitle.length > 50)
        errorHandler(statusCode.badRequest, 'Title shouldn\'t be longer than 50 characters', res);
    if (trimmedTitle.length === 0)
        errorHandler(statusCode.badRequest, 'TODO has to have a title', res);
    if ('completed' in req.body && typeof input.completed != 'boolean')
        errorHandler(statusCode.badRequest, 'completed has to be either true or false', res);
    req.body.title = trimmedTitle;
    next();
}
export function checkID(req, res, next) {
    if (!req.params.id)
        errorHandler(statusCode.badRequest, 'Invalid request', res);
    next();
}
