const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('../src/models/Job');

// Načtení proměnných prostředí
dotenv.config();

// Mock data pro pracovní nabídky
const jobsData = [
  {
    title: 'Senior Frontend Developer',
    company: 'Sociální Síť s.r.o.',
    location: 'Praha',
    salary: '80 000 - 120 000 CZK',
    tags: ['React', 'TypeScript', 'Frontend'],
    industry: 'IT',
    description: 'Hledáme zkušeného Frontend vývojáře pro náš dynamický tým.',
    featured: true,
    matched: true,
    hotness: 95,
    companyRating: 4.8
  },
  {
    title: 'Finanční Analytik',
    company: 'Banka Nova a.s.',
    location: 'Praha',
    salary: '70 000 - 100 000 CZK',
    tags: ['Finance', 'Excel', 'Analýza'],
    industry: 'Finance',
    description: 'Připojte se k našemu finančnímu týmu a podílejte se na strategických rozhodnutích.',
    featured: false,
    matched: false,
    hotness: 75,
    companyRating: 4.5
  }
];

// Funkce pro seed databáze
async function seedDatabase() {
  try {
    // Připojení k MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Smazání stávajících záznamů
    await Job.deleteMany({});

    // Vložení mock dat
    await Job.insertMany(jobsData);

    console.log('Databáze úspěšně naplněna');
    
    // Uzavření spojení
    await mongoose.connection.close();
  } catch (error) {
    console.error('Chyba při naplňování databáze:', error);
    process.exit(1);
  }
}

// Spuštění seed skriptu
seedDatabase();