import express from "express";
import { uptime } from "node:process";
import UploadRoute from "./routes/upload"
import DownloadRoute from "./routes/download";
import { requireAuth } from "./middleware/auth";
import cors from "cors";
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cors())
app.use(requireAuth);

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        uptime: uptime().toLocaleString(),
        msg: "Hello world",
    });
});

app.use("/api", UploadRoute);
app.use("/api", DownloadRoute);



app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
