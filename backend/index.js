const express = require('express');
const productController = require('./controllers/productController');
const productSalesController = require('./controllers/productSalesController');
const sequelize = require('./config/db'); // Sequelize bağlantısı
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());


app.use(cors());

// Sequelize ile veritabanı tablolarını oluştur
sequelize.sync({ force: false }) // force: false, tablolar zaten varsa tekrar oluşturmaz
  .then(() => {
    console.log('Veritabanı senkronize edildi.');
  })
  .catch((err) => {
    console.error('Veritabanı senkronizasyon hatası:', err.message);
  });

// Routes
app.get('/allProducts', productController.getAllProducts);
app.post('/products', productController.addProduct);
app.delete('/products/:urunKodu', productController.deleteProduct);
app.get('/findProducts', productController.getAllProductsSalesFind);
app.get('/products/:urunKodu', productController.getProductByCode);

app.get('/product-sales', productSalesController.getAllProductSales);
app.post('/product-sales', productSalesController.addProductSale);

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
