const Report=require('../models/Report');
const { validationResult } = require('express-validator');


const createReport=async (req,res)=>{
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
    try{
        const {title,description,location}=req.body;
        const image=req.file?.filename||null;

        const newReport=new Report({
            user:req.user.userId,
            title,description,location,image
        })
        await newReport.save();
        res.status(201).json({message:'Report submitted successfully',report:{
        ...newReport._doc,
        image: image ? `http://localhost:5000/uploads/${image}` : null,
      },});

    }
    catch(err){
        console.error(err);
        res.status(500).json({message:'Error submitting report'});
    }
}
const getAllReports = async (req, res) => {
  try {
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
const updateReportStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can update status' });
    }

    const updated = await Report.findByIdAndUpdate(id, { status }, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
const getUserReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
module.exports={createReport,getAllReports,updateReportStatus,getUserReports};