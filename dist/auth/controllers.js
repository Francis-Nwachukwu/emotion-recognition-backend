"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = exports.registerUser = void 0;
const service_1 = require("./service");
const utils_1 = require("../utils");
const registerUser = async (req, res) => {
    const { firstName, email, password } = req.body;
    if (!firstName || !email || !password) {
        return res.status(400).json({ message: "Please enter all fields" });
    }
    try {
        const response = await (0, service_1.registerUserService)({ firstName, email, password });
        if (response.success) {
            res.status(201).json({
                message: response.message,
                data: response.data,
                success: response.success,
            });
        }
        else {
            res.status(400).json({ message: response.message, error: response.error });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};
exports.registerUser = registerUser;
const loginController = async (req, res) => {
    const { email, password } = req.body;
    try {
        const response = await (0, service_1.loginService)(email, password);
        (0, utils_1.logger)(response);
        if (response.success) {
            res.status(200).json(response);
        }
        else {
            res.status(401).json(response);
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};
exports.loginController = loginController;
