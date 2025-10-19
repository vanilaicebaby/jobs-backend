const Job = require('../models/Job');

exports.getAllJobs = async (req, res) => {
  try {
    const result = await Job.findAll(req.query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      message: 'Chyba při načítání pracovních nabídek', 
      error: error.message 
    });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Pracovní nabídka nenalezena' });
    }
    
    res.json(job);
  } catch (error) {
    res.status(500).json({ 
      message: 'Chyba při načítání detailu pracovní nabídky', 
      error: error.message 
    });
  }
};