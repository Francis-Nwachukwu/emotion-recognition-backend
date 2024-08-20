"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtSecret = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = __importDefault(require("./routes/index"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/school";
app.use((0, cors_1.default)());
app.use(express_1.default.static("uploads"));
app.use(express_1.default.json());
exports.jwtSecret = process.env.SESSION_SECRET || "3y6T$#r9D@2sP!zW";
const uploadsDir = process.env.UPLOADS_DIR || "uploads";
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Server is up and running",
        timestamp: new Date().toISOString(),
    });
});
mongoose_1.default.connect(dbUrl).then(() => console.log("Connected!"));
app.use("/", index_1.default);
console.log("=====>Current working directory:", process.cwd());
const files = fs_1.default.readdirSync(process.cwd());
console.log("Files and folders in current working directory:", files);
const srcDir = path_1.default.join(process.cwd(), "src");
const srcFiles = fs_1.default.readdirSync(srcDir);
console.log('Files and folders in "src" directory:', srcFiles);
if (!uploadsDir) {
    console.error("UPLOADS_DIR is not set in environment variables");
}
if (!fs_1.default.existsSync(uploadsDir)) {
    console.log(`Creating upload directory: ${uploadsDir}`);
    try {
        fs_1.default.mkdirSync(uploadsDir, { recursive: true });
        console.log("Upload directory created successfully");
    }
    catch (err) {
        console.error(`Failed to create upload directory: ${err}`);
        process.exit(1);
    }
}
console.log("Using uploads directory:", uploadsDir);
// Serve static files from the uploads directory
app.use("/uploads", express_1.default.static(uploadsDir));
// Log the contents of the uploads directory
fs_1.default.readdir(uploadsDir, (err, files) => {
    if (err) {
        console.error("Error reading uploads directory:", err);
    }
    else {
        console.log("Files in uploads directory:", files);
    }
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
