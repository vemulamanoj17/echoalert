const User=require('../models/User');
const bcrypt=require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt=require('jsonwebtoken');

exports.registerUser=async (req,res)=>{
    const errors=validationResult(req);
          if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
          }
    const {name,email,password}=req.body;

    try{
          const existingUser=await User.findOne({email});
          if(existingUser)
            return res.status(400).json({message:'User already exists'});
          
          const hashedPassword=await bcrypt.hash(password,10);

          const newUser=new User({name,email,password:hashedPassword,role:'citizen'})
          await newUser.save();

          const token=jwt.sign(
            {userId:newUser._id,role:newUser.role},
            process.env.JWT_SECRET,
            {expiresIn:'1d'}
          )

          res.status(201).json({
            token,
            user:{
                id:newUser._id,
                name:newUser.name,
                role:newUser.role
            }
          })

          
    }
    catch(err){
        res.status(500).json({message:`server error ${err}`});
    }
}

exports.loginUser=async (req,res)=>{
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
    const {email,password}=req.body;
    try{
        const user=await User.findOne({email});
        if(!user)
            return res.status(400).json({message:'Invalid Credentials'});
        const isMatch =await bcrypt.compare(password,user.password);
        if(!isMatch)
            return res.status(400).json({message:'Invalid Credentials'});
        const token=jwt.sign(
            {userId:user._id,role:user.role},
            process.env.JWT_SECRET,
            {expiresIn:'1d'}
        );

        res.json({token,user:{id:user._id,name:user.name,role:user.role}});

    }
    catch(err){
      console.log(err);
        res.status(500).json({message:'Server Error'});
    }
}

