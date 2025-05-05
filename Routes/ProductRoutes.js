const express = require('express')
const router = express.Router();
const Product = require('../model/Product'); // Make sure this is capitalized
const upload = require('../middleware/multer')
const { uploadOnCloudinary } = require('../Utils/Cloudinary');
const fs = require('fs'); // Add this import

router.post('/product', upload.single('image'), async(req, res) => {
    try {
        // First check if we have the required data
        if (!req.body.name || !req.body.price) {
            return res.status(400).json({
                status: 400,
                message: "Product name and price are required"
            });
        }

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                status: 400,
                message: "Product image is required"
            });
        }

        // Upload to Cloudinary first
        const cloudinaryResult = await uploadOnCloudinary(req.file.path);
        
        if (!cloudinaryResult || !cloudinaryResult.url) {
            return res.status(500).json({
                status: 500,
                message: "Failed to upload image to Cloudinary"
            });
        }

        // Create a new product with the Cloudinary URL
        const newProduct = new Product({
            name: req.body.name,
            price: req.body.price,
            image: cloudinaryResult.url, // Use the Cloudinary URL
            cloudinary_id: cloudinaryResult.public_id // Store this to enable deletion later
        });
        
        // Save the product to the database
        const savedProduct = await newProduct.save();

        // Clean up the temporary file
        try {
            fs.unlinkSync(req.file.path);
        } catch (err) {
            console.warn('Failed to delete temp file:', err);
            // Continue even if file deletion fails
        }

        // Return success response with the saved product
        return res.status(200).json({
            status: 200,
            message: "Product uploaded successfully",
            product: savedProduct
        });
    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({
            status: 500,
            message: "Server error",
            error: error.message
        });
    }
});

router.get('/product', async (req, res) => {
    try {
      const products = await Product.find(); // Fetch all products
  
      res.status(200).json({
        status: 200,
        message: "Products fetched successfully",
        data: products
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({
        status: 500,
        message: "Server error",
        error: error.message
      });
    }
  });


  router.get('/product/details/:id', async (req, res) => {
    try {
        console.log(req.params)
      const products = await Product.find(); // Fetch all products
  
      res.status(200).json({
        status: 200,
        message: "Products fetched successfully",
        data: products
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({
        status: 500,
        message: "Server error",
        error: error.message
      });
    }
  });

  router.post('/product/details/:id/review', async (req, res) => {
    try {
      const { rating, review, userName } = req.body;
      const productId = req.params.id;
      
      // Validation
      if (!rating || !review || !userName) {
        return res.status(400).json({ 
          status: 400, 
          message: "Rating, review text, and user name are required" 
        });
      }
      
      // Find the product
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({ 
          status: 404, 
          message: "Product not found" 
        });
      }
      
      // Create new review
      const newReview = {
        userName,
        rating: Number(rating),
        review,
        // userId: req.user._id  // Uncomment if you have authentication implemented
      };
      
      // Add review to product
      product.reviews.push(newReview);
      
      // Recalculate average rating
      product.calculateAverageRating();
      
      // Save the product with new review
      await product.save();
      
      return res.status(200).json({
        status: 200, 
        message: "Review added successfully",
        data: {
          productId,
          reviewId: product.reviews[product.reviews.length - 1]._id,
          avgRating: product.avgRating
        }
      });
      
    } catch (error) {
      console.error("Error while adding review:", error);
      return res.status(500).json({
        status: 500,
        message: "Server error while adding review"
      });
    }
  });
  

module.exports = router;