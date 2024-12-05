const { Sequelize } = require('sequelize');

// Sequelize ile SQLite bağlantısı
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './stok_yonetim.db'
});

// Bağlantıyı kontrol et
sequelize.authenticate()
  .then(() => {
    console.log('Connected to the SQLite database.');
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
  });

module.exports = sequelize;
