"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueSlug = exports.slugify = void 0;
const slugify_1 = __importDefault(require("slugify"));
const slugify = (text) => {
    return (0, slugify_1.default)(text, {
        lower: true,
        strict: true,
        trim: true,
    });
};
exports.slugify = slugify;
const uniqueSlug = (text) => {
    const base = (0, exports.slugify)(text);
    const suffix = Math.random().toString(36).substring(2, 7);
    return `${base}-${suffix}`;
};
exports.uniqueSlug = uniqueSlug;
//# sourceMappingURL=slugify.js.map