// External
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "src/uploads"),
  filename: (req, file, cb) =>
    cb(
      null,
      new Date().toISOString().replace(/[\.\-\:]+/g, "") + file.originalname
    )
});

export default multer({ storage });
