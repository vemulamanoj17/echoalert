 const express=require('express');
 const cors=require('cors');
 const dotenv=require('dotenv');
 const path=require('path');
const connectDB=require('./db');

dotenv.config();

connectDB();

const app=express();
app.use(cors({origin:'http://localhost:5173',credentials:true}));
app.use(express.json());

app.use('/uploads',express.static(path.join(__dirname,'uploads')));

const authRoutes=require('./routes/auth');
const reportRoutes=require('./routes/report');

app.use('/api/auth',authRoutes);
app.use('/api/reports',reportRoutes);

const PORT=process.env.PORT|| 5000;
app.listen(PORT,'0.0.0.0',()=>{
    console.log(`server is running on port ${PORT}`);
})
