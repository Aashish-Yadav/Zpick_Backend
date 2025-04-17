const cloudinary = require('cloudinary').v2;
const fs = require('fs');


const localFilePath = 'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg';

(async function() {

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.API_KEY, 
        api_secret: process.env.API_SECRET
    });
    
    // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(localFilePath, {
               resource_type:'image',
               type:'fetch'
           })
       .catch((error) => {
           console.log(error);
       });
    
    console.log("Uploaded result on Cloudinary", uploadResult);
    
    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url('shoes', {
        fetch_format: 'auto',
        quality: 'auto'
    });
    
    console.log(optimizeUrl);
    
    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url('shoes', {
        crop: 'auto',
        gravity: 'auto',
        width: 500,
        height: 500,
    });
    
    console.log(autoCropUrl);    
})();