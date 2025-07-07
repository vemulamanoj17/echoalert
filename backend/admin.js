const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const dotenv=require('dotenv');
const User=require('./models/User');

dotenv.config();



mongoose.connect(process.env.MONGO_URI).then(async()=>{
    const exist=await User.findOne({role:'admin'});
    if(exist){
        console.log('exists')
        return process.exit();
    }
    const hashedPassword=await bcrypt.hash(process.env.ADMIN_PASSWORD,10);
    const newAdmin=new User({
        name:'Admin',
        email:'admin@email.com',
        password:hashedPassword,
        role:'admin'
    })
    await newAdmin.save();
    process.exit();
    
}).catch(err=>{
    console.error("Error",err);
    process.exit(1);
})
