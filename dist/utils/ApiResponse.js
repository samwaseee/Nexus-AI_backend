"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPaginationMeta = exports.sendNoContent = exports.sendCreated = exports.sendSuccess = exports.ApiResponse = void 0;
class ApiResponse {
    constructor(statusCode, message, data = null, meta) {
        this.success = statusCode < 400;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        if (meta)
            this.meta = meta;
    }
}
exports.ApiResponse = ApiResponse;
const sendSuccess = (res, data, message = "Success", statusCode = 200, meta) => {
    return res
        .status(statusCode)
        .json(new ApiResponse(statusCode, message, data, meta));
};
exports.sendSuccess = sendSuccess;
const sendCreated = (res, data, message = "Created successfully") => {
    return res.status(201).json(new ApiResponse(201, message, data));
};
exports.sendCreated = sendCreated;
const sendNoContent = (res) => {
    return res.status(204).send();
};
exports.sendNoContent = sendNoContent;
const buildPaginationMeta = (page, limit, total) => {
    const totalPages = Math.ceil(total / limit);
    return {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
    };
};
exports.buildPaginationMeta = buildPaginationMeta;
//# sourceMappingURL=ApiResponse.js.map