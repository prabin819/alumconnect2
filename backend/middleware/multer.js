const multer = require('multer');
const path = require('path');

// Set up storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

// Optional: file filter to allow only images
const imageFileFilter = (req, file, cb) => {
  const allowedExtensions = /^(jpeg|jpg|png|gif)$/i;

  // Check extension
  const extName = path.extname(file.originalname).toLowerCase().replace('.', ''); // remove the leading dot
  const isExtValid = allowedExtensions.test(extName);

  // Check mimetype
  const mimeType = file.mimetype.split('/')[1]; // e.g., 'image/jpeg' => 'jpeg'
  const isMimeValid = allowedExtensions.test(mimeType);

  if (isExtValid && isMimeValid) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif) are allowed!'), false);
  }
};

const cvCoverLetterFileFilter = (req, file, cb) => {
  const allowedExtensions = /^(pdf|doc|docx)$/i;

  // Validate extension
  const extName = path.extname(file.originalname).toLowerCase().replace('.', '');
  const isExtValid = allowedExtensions.test(extName);

  // Validate mimetype
  const mimeType = file.mimetype.split('/')[1]; // e.g., 'application/pdf' => 'pdf'
  const isMimeValid = allowedExtensions.test(mimeType);

  if (isExtValid && isMimeValid) {
    cb(null, true);
  } else {
    cb(new Error('Only CV or Cover Letter files (pdf) are allowed!'), false);
  }
};

const imageUpload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}); // 5MB limit
const resumeandcvUpload = multer({
  storage,
  fileFilter: cvCoverLetterFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = { imageUpload, resumeandcvUpload };
