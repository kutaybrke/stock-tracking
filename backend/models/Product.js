const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Product modeli
const Product = sequelize.define('Product', {
    urunKodu: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    urunAdi: {
        type: DataTypes.STRING,
        allowNull: false
    },
    urunAdeti: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    adetFiyati: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    alinanFirma: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'urunler',
    timestamps: false
});


module.exports = Product;

/*
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Product modeli
const Product = sequelize.define('Product', {
    urunKodu: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    urunAdi: {
        type: DataTypes.STRING,
        allowNull: false
    },
    urunAdeti: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true, // Tamsayı kontrolü
            min: 0 // Minimum değer 0
        }
    },
    adetFiyati: {
        type: DataTypes.DECIMAL(10, 2), // 10 toplam basamak, 2 ondalıklı basamak
        allowNull: false
    },
    alinanFirma: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'urunler',
    timestamps: false
});

module.exports = Product;

*/
