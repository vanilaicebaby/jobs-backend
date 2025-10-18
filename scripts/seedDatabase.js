const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('../src/models/Job');

dotenv.config();

const jobsData = [
  {
    title: 'Senior Frontend Developer',
    company: 'Sociální Síť s.r.o.',
    location: 'Praha',
    salary: '80 000 - 120 000 CZK',
    tags: ['React', 'TypeScript', 'Frontend'],
    industry: 'IT',
    description: 'Hledáme zkušeného Frontend vývojáře pro náš dynamický tým.'
  },
  {
    title: 'Finanční Analytik',
    company: 'Banka Nova a.s.',
    location: 'Praha',
    salary: '70 000 - 100 000 CZK',
    tags: ['Finance', 'Excel', 'Analýza'],
    industry: 'Finance',
    description: 'Připojte se k našemu finančnímu týmu a podílejte se na strategických rozhodnutích.'
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Job.deleteMany({});
    await Job.insertMany(jobsData);
    console.log('Databáze úspěšně naplněna');
    await mongoose.connection.close();
  } catch (error) {
    console.error('Chyba při naplňování databáze:', error);
    process.exit(1);
  }
}

seedDatabase();