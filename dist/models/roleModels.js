"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSchema = exports.PrincipalSchema = exports.TeacherSchema = exports.StudentScema = void 0;
const mongoose_1 = require("mongoose");
const userModel_1 = require("./userModel");
const extendSchema = require("mongoose-extend-schema");
exports.StudentScema = extendSchema(userModel_1.UserSchema, {
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    studentClass: { type: String },
    dateOfBirth: { type: String },
});
exports.TeacherSchema = extendSchema(userModel_1.UserSchema, {
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
});
exports.PrincipalSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
});
exports.AdminSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
});
