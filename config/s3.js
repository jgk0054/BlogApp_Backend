const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'YOUR_S3_BUCKET_REGION'  // e.g., 'us-west-1'
});

const s3 = new AWS.S3();
module.exports = s3;
