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

        const { urunKodu, urunSatisAdeti, satisFiyati, tarih } = req.body;

        // 1. Gerekli alanlar kontrolü
        if (!urunKodu || !urunSatisAdeti || !satisFiyati || !tarih) {
            return res.status(400).json({ error: 'Tüm alanlar doldurulmalıdır.' });
        }

        try {
            // 2. Ürün kontrolü: `urunler` tablosunda ürün var mı?
            const product = await Product.findOne({ where: { urunKodu } });
            if (!product) {
                return res.status(404).json({ error: 'Ürün bulunamadı.' });
            }

            // 3. Stok kontrolü: Satış için yeterli stok var mı?
            if (product.urunAdeti < urunSatisAdeti) {
                return res.status(400).json({ error: 'Yeterli stok bulunmamaktadır.' });
            }

            // 4. `urun_satis` tablosunda aynı `urunKodu` var mı kontrolü
            const existingSale = await ProductSale.findOne({ where: { urunKodu } });

            if (existingSale) {
                // 5. Eğer mevcut satış kaydı varsa: `urunSatisAdeti` artırılır
                existingSale.urunSatisAdeti += urunSatisAdeti;
                existingSale.satisFiyati = satisFiyati; // Satış fiyatını güncelle
                existingSale.tarih = tarih; // Tarihi güncelle
                await existingSale.save();
            } else {
                // 6. Eğer mevcut değilse: Yeni satış kaydı eklenir
                await ProductSale.create({
                    urunKodu,
                    urunAdi: product.urunAdi, // `urunler` tablosundan adı al
                    urunStokAdeti: product.urunAdeti, // Stok adeti kaydedilir
                    urunSatisAdeti,
                    satisFiyati,
                    tarih,
                });
            }

            // 7. Stok miktarını güncelle: `urunler` tablosunda
            product.urunAdeti -= urunSatisAdeti;
            await product.save();

            res.status(201).json({ message: 'Ürün satışı başarıyla eklendi.' });
        } catch (err) {
            res.status(500).json({ error: 'Ürün satışı eklenemedi.' });
            console.error("Backend Hatası:", err);
        }
    },

    
};

module.exports = productSalesController;
