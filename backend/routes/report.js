const express=require('express');
const router=express.Router();
const {createReport,getAllReports, updateReportStatus,getUserReports}=require('../controllers/reportController');
const authMiddleWare =require('../middleware/auth');
const multer=require('multer');
const path=require('path');

const {body}=require('express-validator')


const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+path.extname(file.originalname));

    }
    
})
const upload=multer({storage});
router.post('/',authMiddleWare,upload.single('image'),
[
    body('title').notEmpty().withMessage('Title is required'),
    body('description').isLength({min:10}).withMessage('Description must be at least 10 characters'),
    
  
],createReport);

router.get('/all',authMiddleWare,getAllReports);

router.patch('/status/:id',authMiddleWare,updateReportStatus);

router.get('/my',authMiddleWare,getUserReports);

module.exports=router;