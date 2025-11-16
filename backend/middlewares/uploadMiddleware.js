import multer from "multer";

const storage = multer.memoryStorage(); // store file in memory
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const isValidExt = allowedTypes.test(file.originalname.toLowerCase());
  const isValidMime = allowedTypes.test(file.mimetype);
  if (isValidExt && isValidMime) cb(null, true);
  else cb(new Error("Only image files are allowed"));
};

export const multerUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});








// import multer from "multer";
// import path from "path";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) =>
//     cb(null, `${Date.now()}-${file.fieldname}-${file.originalname.replace(/\s+/g, "")}`)
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|gif|webp/;
//   const isValidExt = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const isValidMime = allowedTypes.test(file.mimetype);
//   if (isValidExt && isValidMime) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed (jpeg, png, gif, webp)"));
//   }
// };

// export const multerUpload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
// });
