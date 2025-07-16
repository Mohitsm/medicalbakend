import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import {connectDb} from "./config/db.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import authRoutes from "./routes/auth.js"; // Ensure this is the correct path
import brandRoutes from "./routes/brandRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import subCategoryRoutes from "./routes/subCategoryRoutes.js";
import healthTipRoutes from "./routes/healthTipsRoutes.js";

import { fileURLToPath } from 'url';
import { dirname } from 'path';
// import authRoutes from "./routes/auth.js";

const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const port =5001;
connectDb();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use('/api/banners', bannerRoutes);
app.use('/api/auth', authRoutes); // Uncomment if auth routes are needed
app.use("/api/brands", brandRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use('/api/health-tips', healthTipRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
