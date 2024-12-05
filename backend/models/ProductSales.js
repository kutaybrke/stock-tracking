const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// ProductSales modeli
const ProductSales = sequelize.define('ProductSale', {
    urunKodu: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    urunAdi: {
        type: DataTypes.STRING,
        allowNull: false
    },
    urunStokAdeti: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    urunSatisAdeti: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    satisFiyati: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    tarih: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'urun_satis',
    timestamps: false
});

module.exports = ProductSales;
