import { Router } from "express";
import { prisma } from "../utils/db";
import path from "path";
import { GetUrl } from "../utils/aws";

const router = Router();
router.get("/download", async (req, res) => {
    try {
        const short_id = req.query.short_id as string;
        if (!short_id) {
            return res.status(400).json({
                error: "Invalid inputs",
            });
        }
        const record = await prisma.asset.findFirst({
            where: {
                short_url: short_id,
            },
            select: {
                key: true,
                timeStamp: true,
                downloads: true,
            },
        });
        if (!record || !record.key) {
            return res.status(404).json({
                error: "assest doesn't exist",
            });
        }
        const StorageURl = await GetUrl(record.key);
        console.log(StorageURl, "URL");
        const cloudResponse = await fetch(StorageURl);
        if (!cloudResponse.ok || !cloudResponse.body) {
            return res.status(500).json({ error: "Failed to fetch the asset" });
        }
        const filename = path.basename(record?.key);

        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader(
            "Content-Type",
            cloudResponse.headers.get("content-type") ||
            "application/octet-stream",
        );

        await prisma.asset.updateMany({
            where: { short_url: short_id },
            data: { downloads: { increment: 1 } },
        });
        const { Readable } = await import("stream");
        Readable.fromWeb(cloudResponse.body as any).pipe(res);
    } catch (error) {
        return res.status(500).json({
            error: "Interal server error" + error,
        });
    }
});

export default router;