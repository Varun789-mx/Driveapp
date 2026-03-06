import multer from "multer";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split(".").pop();
        const nameWithoutExt = file.originalname.replace(/\.[^/.]+$/, ""); // strip extension
        const filename = `${nameWithoutExt}_${Math.round(Math.random() * 1E9)}.${ext}`;
        cb(null, filename);
    }
})

export const upload = multer({
    storage,
})