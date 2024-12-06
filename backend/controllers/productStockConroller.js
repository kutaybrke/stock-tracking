const Product = require('../models/Product');

const productStockController = {
    // urun stok kontrol
    allProductStock: async (req, res) => {
        try {
            const productStock = await Product.findAll();

            // urunlerin stok sayilari 1 ya da 0 olanlari gonder
            const lowStockProducts = productStock.filter(product => product.urunAdeti <= 1);

            res.json(lowStockProducts);


        } catch (err) {
            res.status(500).json({ error: 'Ürün stokları getirilemedi.' });
        }
    },
}

module.exports = productStockController;