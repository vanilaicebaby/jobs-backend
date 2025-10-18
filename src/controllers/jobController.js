const Job = require('../models/Job');

// Získání všech pracovních nabídek
exports.getAllJobs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      industry 
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    if (industry) {
      query.industry = industry;
    }

    const jobs = await Job.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ postedDate: -1 });

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      totalJobs: total
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Chyba při načítání pracovních nabídek', 
      error: error.message 
    });
  }
};

// Získání detailu jedné pracovní nabídky
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