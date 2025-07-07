const express=require('express');
const router=express.Router();
const {registerUser,loginUser}=require('../controllers/authController');
const {body}=require('express-validator')

router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], registerUser);
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is empty'),
  ],
  loginUser
);

module.exports=router;