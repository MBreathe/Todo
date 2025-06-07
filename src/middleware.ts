import { state } from "./db.js";
import { Request, Response, NextFunction } from 'express';
import { statusCode } from "./statusCodes.js";

function errorHandler(status: number, err: string, res: Response): void {
    res.status(status).send(err);
}

export function checkDb(req: Request, res: Response, next: NextFunction): void {
    if (!state.db) {
        errorHandler(statusCode.internalServerError, 'Database is not connected', res);
        return;
    }
    next();
}
export function checkPostRequest(req: Request, res: Response, next: NextFunction): void {
    if (!req.body.title) errorHandler(statusCode.badRequest, 'Invalid request', res);
    const input: { title: string; completed?: boolean } = req.body;
    const trimmedTitle: string = input.title.trim();
    if (trimmedTitle.length > 50) errorHandler(statusCode.badRequest, 'Title shouldn\'t be longer than 50 characters', res);
    if (trimmedTitle.length === 0) errorHandler(statusCode.badRequest, 'TODO has to have a title', res);
    if ('completed' in req.body && typeof input.completed != 'boolean') errorHandler(statusCode.badRequest, 'completed has to be either true or false', res);
    req.body.title = trimmedTitle;
    next();
}
export function checkID(req: Request, res: Response, next: NextFunction): void {
    if (!req.params.id) errorHandler(statusCode.badRequest, 'Invalid request', res);
    next();
}