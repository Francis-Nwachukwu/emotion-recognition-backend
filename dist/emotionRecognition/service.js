"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recognizeEmotion = recognizeEmotion;
exports.getEmotionHistory = getEmotionHistory;
const faceapi = __importStar(require("face-api.js"));
const canvas_1 = require("canvas");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const EmotionRecognition_1 = __importDefault(require("../models/EmotionRecognition"));
const uploadDir = process.env.UPLOADS_DIR || path_1.default.join(__dirname, '..', 'uploads');
const weightsPath = process.env.WEIGHTS_DIR || path_1.default.join(__dirname, '..', 'utils', 'weights');
// Monkey patch the environment
faceapi.env.monkeyPatch({ Canvas: canvas_1.Canvas, Image: canvas_1.Image });
if (!uploadDir || !weightsPath) {
    console.error('UPLOADS_DIR or WEIGHTS_DIR not set in environment variables');
    //   process.exit(1);
}
async function recognizeEmotion(imagePath, imageFilename) {
    console.log('UPLOADS_DIR: in recog service', uploadDir);
    console.log('WEIGHTS_DIR:', weightsPath);
    try {
        // Load the face-api.js models
        await faceapi.nets.faceExpressionNet.loadFromDisk(`${weightsPath}`);
        await faceapi.nets.ssdMobilenetv1.loadFromDisk(`${weightsPath}`);
        // Read the image file
        const imageBuffer = await promises_1.default.readFile(imagePath);
        console.log('Image buffer:', imageBuffer);
        // Create a canvas from the image buffer
        const img = new canvas_1.Image();
        img.src = imageBuffer;
        const canvas = new canvas_1.Canvas(img.width, img.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const detections = await faceapi.detectAllFaces(canvas).withFaceExpressions();
        console.log('Detections:', detections);
        if (detections.length === 0) {
            throw new Error('No faces detected in the image');
        }
        const emotions = detections[0].expressions;
        const dominantEmotion = Object.entries(emotions).reduce((a, b) => a[1] > b[1] ? a : b)[0];
        const emotionRecognition = new EmotionRecognition_1.default({
            imageFilename,
            emotions,
            dominantEmotion,
            createdAt: new Date()
        });
        await emotionRecognition.save();
        return {
            emotions,
            dominantEmotion
        };
    }
    catch (error) {
        console.error('Error in recognizeEmotion:', error);
        throw error;
    }
}
async function getEmotionHistory() {
    const history = await EmotionRecognition_1.default.find().sort({ createdAt: -1 });
    return history.map(entry => ({
        ...entry.toObject(),
        imageUrl: `/uploads/${entry.imageFilename}`
    }));
}
