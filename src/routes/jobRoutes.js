const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

// Získání všech pracovních nabídek
router.get('/', jobController.getAllJobs);

// Získání detailu jedné pracovní nabídky
router.get('/:id', jobController.getJobById);

module.exports = router;