// testCloudinary.js
const cloudinary = require('cloudinary');
cloudinary.v2.config({
  cloud_name: 'dvk6jzqhr',
  api_key: '858793232973584',
  api_secret: 'aSGrptehdi4imjtBTNXBlYKSPjQ'
});
cloudinary.v2.uploader.upload('https://res.cloudinary.com/demo/image/upload/sample.jpg')
  .then(res => console.log('Success:', res.url))
  .catch(err => console.error('Error:', err));