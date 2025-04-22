const cloudinary = require('cloudinary').v2;
const fs = require('fs');


const localFilePath = 'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg';



    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.API_KEY, 
        api_secret: process.env.API_SECRET
    });


    const uploadOnCloudinary = async (localFilePath) => {
        try {
            if(!localFilePath) return null;
            const response = await cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto",
            });
            console.log('file is uploaded on cloudinary', response.url)
            return response 
        } catch (error) {
            console.log('error while file subbmission', error);
            fs.unlinkSync(localFilePath)
            return null
        }
    }
    

export {uploadOnCloudinary}
  