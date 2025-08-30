import multer from "multer";
import path from "path";
import fs from "fs";
const dir = path.join(process.cwd(), "server", "src", "uploads");
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) =>
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    )
});
export const upload = multer({ storage });
