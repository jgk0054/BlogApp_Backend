const { S3 } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');

// Load environment variables
const s3 = new S3({
  credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION
});

// Set up multer to use S3 storage
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'abundance-denton-assets',
        metadata: (req, file, cb) => {
            cb(null, {fieldName: file.fieldname});
        },
        key: (req, file, cb) => {
            cb(null, Date.now().toString() + '-' + file.originalname)
        }
    })
});

exports.uploadImage = (req, res) => {
    const uploadSingle = upload.single('image');  // 'image' is the field name

    uploadSingle(req, res, function(error) {
        if (error) {
            console.info(error)
            return res.status(500).send({ message: "Upload failed", error: error });
        }
        console.info(req.file.location)
        res.status(200).send({ imageUrl: req.file.location });
    });
};
