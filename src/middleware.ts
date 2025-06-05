import {state} from "./db.js";
import {Request, Response, NextFunction} from 'express';
import { statusCode } from "./statusCodes.js";


export function checkDb(req: Request, res: Response, next: NextFunction): void {
    if (!state.db) {
        res.status(statusCode.internalServerError).send('Database is not connected');
        return;
    }
    next();
}