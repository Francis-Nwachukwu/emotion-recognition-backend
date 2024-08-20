"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const logger = (statement) => {
    return console.log(`---->${statement} <---`, statement);
};
exports.logger = logger;
