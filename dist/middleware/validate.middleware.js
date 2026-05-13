"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const ApiError_1 = require("../utils/ApiError");
const validate = (schema, target = "body") => (req, _res, next) => {
    try {
        const parsed = schema.parse(req[target]);
        req[target] = parsed;
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const errors = error.errors.map((e) => ({
                field: e.path.join("."),
                message: e.message,
            }));
            return next(new ApiError_1.ApiError(422, "Validation failed", errors));
        }
        next(error);
    }
};
exports.validate = validate;
//# sourceMappingURL=validate.middleware.js.map