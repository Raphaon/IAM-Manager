"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const app_config_1 = require("../config/app.config");
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(app_config_1.appConfig.mongoUri);
        console.log('✅ MongoDB connected');
    }
    catch (error) {
        console.error(' MongoDB error:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
