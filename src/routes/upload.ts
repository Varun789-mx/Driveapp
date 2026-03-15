import { Router } from "express";
import { UploadFile } from "../utils/aws";
import { upload } from "../middleware/multer";
import path from "node:path";
import { nanoid } from "nanoid";
import { prisma } from "../utils/db";
import fs from "fs"

const router = Router()

router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const userId = req.userId!;
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                error: "file not found in request",
            });
        }
        let cloudinaryurl = await UploadFile(file.path);
        if (!cloudinaryurl) {
            return res.status(500).json({ error: "File upload failed" });
        }
        const addToDb = await prisma.asset.create({
            data: {
                key: path.basename(file.path),
                short_url: nanoid(6),
                authorId: userId
            },
            select: {
                key: true,
                short_url: true,
            }
        });
        if (!addToDb) {
            return res.status(500).json({
                error: "Failed to add asset to db",
            })
        }
        fs.unlinkSync(file.path);
        return res.status(200).json({
            success: true,
            short_url: `${process.env.BACKEND_URL}/api/download/?short_id=${addToDb.short_url}`,
        });
    } catch (error) {
        return res.status(500).json({
            error: "Internal server error" + error,
        });
    }
});

export default router;