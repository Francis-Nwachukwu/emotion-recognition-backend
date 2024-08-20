"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSingleImage = exports.uploadSuspectImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Use fs.promises for async operations
const fsPromises = fs_1.default.promises;
// Get uploads directory from environment variable
const uploadDir = process.env.UPLOADS_DIR || path_1.default.join(__dirname, '..', 'uploads');
console.log('Upload directory path:', uploadDir);
// Ensure upload directory exists
if (!fs_1.default.existsSync(uploadDir)) {
    console.log(`Creating upload directory: ${uploadDir}`);
    try {
        fs_1.default.mkdirSync(uploadDir, { recursive: true });
        console.log('Upload directory created successfully');
    }
    catch (err) {
        console.error(`Failed to create upload directory: ${err}`);
        throw err; // This will crash the app if we can't create the directory
    }
}
function generateUniqueFilename(originalname) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const extension = path_1.default.extname(originalname);
    return `suspect-${timestamp}-${random}${extension}`;
}
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, generateUniqueFilename(file.originalname));
    }
});
const fileFilter = function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb(new Error('Error: Images Only!'));
    }
};
const uploadSuspectImage = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter
}).fields([
    { name: 'image0', maxCount: 1 },
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]);
exports.uploadSuspectImage = uploadSuspectImage;
const uploadSingleImage = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter
}).single('image');
exports.uploadSingleImage = uploadSingleImage;
