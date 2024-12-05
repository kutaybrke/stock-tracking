const Product = require('../models/Product');  // Sequelize modelini import et

const productController = {
    // Ürünleri getir
    getAllProducts: async (req, res) => {
        try {
            const products = await Product.findAll();  // Sequelize ile ürünleri getir
            res.json(products);
        } catch (err) {
            res.status(500).json({ error: 'Ürünler getirilemedi.' });
        }
    },

    getAllProductsSalesFind: async (req, res) => {
        try {
            const { query } = req.query; 

            const whereCondition = query
                ? {
                    [Sequelize.Op.or]: [
                        { urunKodu: { [Sequelize.Op.iLike]: `%${query}%` } },
                        { urunAdi: { [Sequelize.Op.iLike]: `%${query}%` } }
                    ]
                }
                : {};  
            
            const products = await Product.findAll({ where: whereCondition });

            res.json(products); 
        } catch (err) {
            res.status(500).json({ error: 'Ürünler getirilemedi.' });
        }
    },

    // Yeni ürün ekle
    addProduct: async (req, res) => {
        const { urunKodu, urunAdi, urunAdeti, adetFiyati, alinanFirma } = req.body;

        if (!urunKodu || !urunAdi || !urunAdeti || !adetFiyati || !alinanFirma) {
            return res.status(400).json({ error: 'Tüm alanlar doldurulmalıdır.' });
        }

        try {

            const newProduct = await Product.create({ urunKodu, urunAdi, urunAdeti, adetFiyati, alinanFirma });
            res.status(201).json(newProduct); // Direkt olarak oluşturulan ürünü dön
        } catch (err) {
            console.error('Ürün eklenemedi:', err);  // Hata detaylarını logla
            res.status(500).json({ error: 'Ürün eklenemedi.', details: err.message });
        }
    },

    // Ürün koduna göre ürün getir
    getProductByCode: async (req, res) => {
        const { urunKodu } = req.params;

        if (!urunKodu) {
            return res.status(400).json({ error: 'Ürün kodu belirtilmelidir.' });
        }

        try {
            const product = await Product.findOne({ where: { urunKodu } });  // Ürünü bul
            if (!product) {
                return res.status(404).json({ error: 'Ürün bulunamadı.' });
            }

            res.json(product);
        } catch (err) {
            res.status(500).json({ error: 'Ürün getirilemedi.' });
        }
    },

    // Ürün sil
    deleteProduct: async (req, res) => {
        const { urunKodu } = req.params;

        if (!urunKodu) {
            return res.status(400).json({ error: 'Ürün kodu belirtilmelidir.' });
        }

        try {
            const product = await Product.findOne({ where: { urunKodu } });  // Ürünü bul
            if (!product) {
                return res.status(404).json({ error: 'Ürün bulunamadı.' });
            }

            await product.destroy();  // Ürünü sil
            res.json({ message: 'Ürün başarıyla silindi.' });
        } catch (err) {
            res.status(500).json({ error: 'Ürün silinemedi.' });
        }
    }
};

module.exports = productController;
