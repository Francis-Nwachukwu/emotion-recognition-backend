"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.models = void 0;
const mongoose_1 = require("mongoose");
const userModel_1 = require("./userModel");
const allSchemas_1 = require("./allSchemas");
exports.models = {
    User: (0, mongoose_1.model)("User", userModel_1.UserSchema),
    Event: (0, mongoose_1.model)("Events", allSchemas_1.EventSchema),
};
