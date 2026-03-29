"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPositiveInt = exports.isNonEmptyString = exports.isStrongEnoughPassword = exports.isValidEmail = void 0;
const isValidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};
exports.isValidEmail = isValidEmail;
const isStrongEnoughPassword = (value) => {
    return typeof value === 'string' && value.length >= 6;
};
exports.isStrongEnoughPassword = isStrongEnoughPassword;
const isNonEmptyString = (value) => {
    return typeof value === 'string' && value.trim().length > 0;
};
exports.isNonEmptyString = isNonEmptyString;
const toPositiveInt = (value, defaultValue) => {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : defaultValue;
};
exports.toPositiveInt = toPositiveInt;
