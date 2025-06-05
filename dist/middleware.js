import { state } from "./db.js";
import { statusCode } from "./statusCodes.js";
export function checkDb(req, res, next) {
    if (!state.db) {
        res.status(statusCode.internalServerError).send('Database is not connected');
        return;
    }
    next();
}
