import React, { useEffect, useState } from "react";
import "../style/StockControl.css";
import exportToPDF from "../Components/exportToPDF";

const StockControl = ({ goBack }) => {
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchLowStockProducts = async () => {
            try {
                const response = await fetch("http://localhost:5000/product-stock");
                if (response.ok) {
                    const data = await response.json();
                    setLowStockProducts(data);
                } else {
                    console.error("Stok bilgileri alınamadı.");
                }
            } catch (error) {
                console.error("Bir hata oluştu:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLowStockProducts();
    }, []);

    if (loading) {
        return <div>Yükleniyor...</div>;
    }
    const handleExportToPDF = () => {
        exportToPDF(lowStockProducts, "Stok Durumu Raporu");
    };

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
                    {lowStockProducts.map((product, index) => (
                        <tr key={index}>
                            <td>{product.urunKodu}</td>
                            <td>{product.urunAdi}</td>
                            <td>{product.urunAdeti}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* "Raporla ve Yazdır" butonu */}
            <div style={{ marginTop: "20px", textAlign: "center" }}>
                <button style={{ backgroundColor: '#007bff', border: 'none', padding: 10, color: 'white', borderRadius: 10 }} onClick={handleExportToPDF}>Raporla ve Yazdır</button>
            </div>
            <button className="closeButton" onClick={goBack}>Kapat</button>
        </div>
    );
};

export default StockControl;
