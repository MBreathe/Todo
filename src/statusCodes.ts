interface StatusCodes {
    ok: number;
    created: number;
    badRequest: number;
    unauthorized: number;
    forbidden: number;
    notFound: number;
    internalServerError: number;
}
export const statusCode: StatusCodes = {
    ok: 200,
    created: 201,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    internalServerError: 500
}