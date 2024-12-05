const ProductSale = require('../models/ProductSales');  // Sequelize modellerini dahil et
const Product = require('../models/Product');  // Sequelize modellerini dahil et

const productSalesController = {
    // Ürün satışlarını getir
    getAllProductSales: async (req, res) => {
        try {
            const productSales = await ProductSale.findAll();  // Sequelize ile ürün satışlarını getir
            res.json(productSales);
        } catch (err) {
            res.status(500).json({ error: 'Ürün satışları getirilemedi.' });
        }
    },

    // Yeni ürün satışı ekle
    addProductSale: async (req, res) => {
        console.log(req.body);  // Gelen veriyi kontrol et
    
        const { urunKodu, urunAdi, urunStokAdeti, urunSatisAdeti, satisFiyati, tarih } = req.body;
    
        if (!urunKodu || !urunAdi || !urunStokAdeti || !urunSatisAdeti || !satisFiyati || !tarih) {
            return res.status(400).json({ error: 'Tüm alanlar doldurulmalıdır.' });
        }
        
        try {
            const newProductSale = await ProductSale.create({
                urunKodu, urunAdi, urunStokAdeti, urunSatisAdeti, satisFiyati, tarih
            });
    
            const product = await Product.findOne({ where: { urunKodu } });
            if (!product) {
                return res.status(404).json({ error: 'Ürün bulunamadı.' });
            }
    
            if (product.urunAdeti < urunSatisAdeti) {
                return res.status(400).json({ error: 'Yeterli stok bulunmamaktadır.' });
            }
    
            product.urunAdeti -= urunSatisAdeti;
            await product.save();
    
            res.status(201).json({ message: 'Ürün satışı başarıyla eklendi.', id: newProductSale.id });
        } catch (err) {
            res.status(500).json({ error: 'Ürün satışı eklenemedi.' });
        }
    }
    
};

module.exports = productSalesController;
