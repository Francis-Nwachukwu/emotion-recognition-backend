"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginService = exports.registerUserService = void 0;
const models_1 = require("../models");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = require("../app");
const utils_1 = require("../utils");
const registerUserService = async (userData) => {
    userData?.email?.toLowerCase();
    try {
        const existingUser = await models_1.models.User.findOne({
            email: userData.email,
        });
        if (existingUser) {
            return { error: true, message: "Email already exists" };
        }
        const encryptedPassword = await bcrypt_1.default.hash(userData.password, 10);
        userData.password = encryptedPassword;
        const newUser = new models_1.models.User(userData);
        await newUser.save();
        const userId = newUser._id;
        return {
            success: true,
            message: `${userData.firstName} created successfully`,
            data: newUser,
        };
    }
    catch (error) {
        console.error(error);
        return { error: true, message: error };
    }
};
exports.registerUserService = registerUserService;
const loginService = async (email, password) => {
    try {
        const userDetails = { email };
        email.toLowerCase();
        const existingUser = await models_1.models.User.findOne(userDetails);
        if (existingUser) {
            const decodedPassword = await bcrypt_1.default.compare(password, existingUser.password);
            if (decodedPassword) {
                const userId = existingUser._id;
                const token = await jsonwebtoken_1.default.sign({ userId }, app_1.jwtSecret, {
                    expiresIn: "12h",
                });
                existingUser.token = token;
                return {
                    success: true,
                    message: `Welcome back ${existingUser.firstName}`,
                    data: existingUser,
                };
            }
            else {
                return {
                    success: false,
                    message: "Invalid Email or Password",
                };
            }
        }
        else {
            return {
                success: false,
                message: "Invalid Email or Password",
            };
        }
    }
    catch (error) {
        (0, utils_1.logger)(error);
        return { error: true, message: error };
    }
};
exports.loginService = loginService;
