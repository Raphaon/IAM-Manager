"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const client_1 = require("./database/client");
const app_config_1 = require("./config/app.config");
const start = async () => {
    await (0, client_1.connectDB)();
    app_1.default.listen(app_config_1.appConfig.port, () => {
        console.log(` 🚀 Server running on port ${app_config_1.appConfig.port}`);
    });
};
start();
