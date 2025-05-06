const express = require('express');
const router = express.Router();
const User = require('../model/Users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



const secretKey= "HGVFCTXCTRC^^%&T&^RDRCTRFC&^T*&YIUGU*F&F%^D%^RDCTDC%E%"


//register

router.post('/register', async (req, res)=>{
    try {
        console.log(req.body);
        const {name , email, password} = req.body.payload;

            if(!name ||  !email || !password) return res.status(400).json({status:false , message:"all fields are required"})    
            
            const existingUser = await User.findOne({email})
            if(existingUser) return res.status(400).json({status:false, message:"user already exist"})

            const hashPassword = await bcrypt.hash(password, 10)

            const newUser = new User({name , email, password:hashPassword});
            await newUser.save();

        return res.status(201).json({status:true, message:"register successfully"})

        } catch (error) {
            console.log(error)
            return res.status(400).json({status:false , message:"something went wronggggg",error: error.message})
        }
})


//login
router.post('/login', async (req, res)=>{
    try {
        const {email, password} = req.body;

            if(!email || !password) return res.status(400).json({status:false , message:"all fields are required"})    
            
            const user = await User.findOne({email});
            // console.log(user)

            if(!user || !(await bcrypt.compare(password , user.password))){
                return res.status(400).json({status:false, message:"Invalid credentails"});
            }
            // console.log()

            const token = jwt.sign({id:user._id, email:user.email}, secretKey)

        return res.status(201).json({status:true, message:"login successfully", user, token})

        } catch (error) {
            return res.status(400).json({status:false , meaasge:"something went wrong",error: error.message})
        }
}) 



//profile

router.post('/profile', async(req, res)=>{
    try {
        const token = req.headers?.authorization.split(" ")[1];

        if(!token) return res.status(400).json({status:false, message:"something went wrong", error :error.message})
           jwt.verify(token, secretKey, async(err , decode)=>{
           const user = await User.findById(decode?.id) 
           const userData = {
            name : user?.name,
            id : user?.id,
            email: user?.email,
            password: user?.password,
            profileImage: user?.profileImage,
            profileImagePublicId: user?.profileImagePublicId,
            role: user?.role,
            
           }
           return res.status(201).json({status:true,message:"Profile Data", data: userData})
    })

    } catch (error) {
        return res.status(400).json({status:false, message:"something went wrong", error :error.message})
    }
})


module.exports = router;