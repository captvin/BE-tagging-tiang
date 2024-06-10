require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    timezone: '+07:00', // Sesuaikan dengan zona waktu lokal Anda
    dialectOptions: {
      // useUTC: false, // Menggunakan waktu lokal
      timezone: 'local' // Memastikan menggunakan waktu lokal
    }
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    timezone: '+07:00', // Sesuaikan dengan zona waktu lokal Anda
    dialectOptions: {
      // useUTC: false, // Menggunakan waktu lokal
      timezone: 'local' // Memastikan menggunakan waktu lokal
    }
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    timezone: '+07:00', // Sesuaikan dengan zona waktu lokal Anda
    dialectOptions: {
      // useUTC: false, // Menggunakan waktu lokal
      timezone: 'local' // Memastikan menggunakan waktu lokal
    }
  },
}



