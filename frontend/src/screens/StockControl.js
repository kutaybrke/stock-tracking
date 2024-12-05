import React from "react";
import '../style/StockControl.css'
const StockControl = ({ products, goBack }) => {
    const outOfStockProducts = products.filter((product) => product.stock === 0);

    return (
        <div className="stock-control-container">
            <h2>Stokta Eksik Olan Ürünler</h2>
            <table>
                <thead>

                    <tr>
                        <th>Ürün Kodu</th>
                        <th>Ürün Adı</th>
                        <th>Stok Adedi</th>
                    </tr>
                </thead>
                <tbody>
                    {outOfStockProducts.map((product, index) => (
                        <tr key={index}>
                            <td>{product.code}</td>
                            <td>{product.name}</td>
                            <td>{product.stock}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="closeButton" onClick={goBack}>Kapat</button>
        </div>
    );
};

export default StockControl;
