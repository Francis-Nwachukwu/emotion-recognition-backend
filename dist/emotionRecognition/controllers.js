"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recognizeEmotionController = recognizeEmotionController;
exports.getEmotionHistoryController = getEmotionHistoryController;
const path_1 = __importDefault(require("path"));
const service_1 = require("./service");
async function recognizeEmotionController(req, res) {
    try {
        console.log("Emotion recog file", req.file);
        if (!req.file) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }
        const filePath = path_1.default.join(req.file.destination, req.file.filename);
        console.log("File path:", filePath);
        const result = await (0, service_1.recognizeEmotion)(filePath, req.file.filename);
        res.json(result);
    }
    catch (error) {
        console.error('Error in emotion recognition:', error);
        res.status(500).json({ error: error.message });
    }
}
async function getEmotionHistoryController(req, res) {
    try {
        const history = await (0, service_1.getEmotionHistory)();
        res.json(history);
    }
    catch (error) {
        console.error('Error fetching emotion history:', error);
        res.status(500).json({ error: error.message });
    }
}
