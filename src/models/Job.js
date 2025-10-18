const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Název pozice je povinný'],
    trim: true,
    maxlength: [100, 'Název pozice nesmí být delší než 100 znaků']
  },
  company: {
    type: String,
    required: [true, 'Název společnosti je povinný'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Lokace je povinná'],
    trim: true
  },
  salary: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  industry: {
    type: String,
    trim: true,
    enum: [
      'IT', 
      'Finance', 
      'Zdravotnictví', 
      'Marketing', 
      'Strojírenství', 
      'Obchod', 
      'Administrativa', 
      'Logistika'
    ]
  },
  description: {
    type: String,
    required: [true, 'Popis pozice je povinný'],
    minlength: [20, 'Popis musí být alespoň 20 znaků dlouhý']
  },
  postedDate: {
    type: Date,
    default: Date.now
  },
  featured: {
    type: Boolean,
    default: false
  },
  matched: {
    type: Boolean,
    default: false
  },
  hotness: {
    type: Number,
    min: [0, 'Hotness nemůže být menší než 0'],
    max: [100, 'Hotness nemůže být větší než 100'],
    default: 50
  },
  companyRating: {
    type: Number,
    min: [0, 'Hodnocení společnosti nemůže být menší než 0'],
    max: [5, 'Hodnocení společnosti nemůže být větší než 5'],
    default: 4.0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexy pro lepší vyhledávání
JobSchema.index({ title: 'text', company: 'text', tags: 'text' });

module.exports = mongoose.model('Job', JobSchema);