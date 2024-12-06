import React, { useState } from "react";
import "../style/Sales.css";

const Sales = ({ products, updateProducts, addSale }) => {
    const [showModal, setShowModal] = useState(false);
    const [saleProduct, setSaleProduct] = useState({
        code: "",
        name: "",
        stock: "",
        price: "",
    });
    const [saleQuantity, setSaleQuantity] = useState(1); // Satış adedi
    const [salePrice, setSalePrice] = useState("");
    const [saleDate, setSaleDate] = useState(""); // Satış tarihi
    const [filteredProducts, setFilteredProducts] = useState([]); // Ürünleri filtrelemek için state
    const [errorMessage, setErrorMessage] = useState(""); // Hata mesajı durumu

    // Set today's date as default for saleDate
    const today = new Date().toISOString().split("T")[0];

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "code") {
            setSaleProduct({ ...saleProduct, code: value });

            // Filter products by code or name, making sure they exist and are non-empty
            const foundProducts = products.filter((product) =>
                (product.urunKodu && product.urunKodu.toLowerCase().includes(value.toLowerCase())) ||
                (product.urunAdi && product.urunAdi.toLowerCase().includes(value.toLowerCase()))
            );
            setFilteredProducts(foundProducts);
        } else {
            setSaleProduct({ ...saleProduct, [name]: value });
        }
    };

    const handleProductSelect = (product) => {
        setSaleProduct({
            code: product.urunKodu,
            name: product.urunAdi,
            stock: product.urunAdeti,
            price: product.adetFiyati,
        });
        setFilteredProducts([]); // Seçilen ürünü aldıktan sonra öneri listesini temizle
    };

    const addProductSale = async (saleData) => {
        try {
            const response = await fetch("http://localhost:5000/product-sales", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(saleData),

            });
            console.log("Gönderilen Veri:", saleData);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Satış eklenemedi.");
            }

            const data = await response.json();
            return data; // Satış ekleme işlemi başarılıysa dönen yanıt
        } catch (error) {
            console.error("Satış eklenirken hata oluştu:", error.message);

            throw error;
        }
    };

    const handleSale = async () => {
        const saleQty = parseInt(saleQuantity, 10); // Kullanıcının girdiği satış adedi

        if (saleQty > 0) {
            const saleData = {
                urunKodu: saleProduct.code,
                urunAdi: saleProduct.name,
                urunStokAdeti: saleProduct.stock,
                urunSatisAdeti: saleQty,
                satisFiyati: salePrice,
                tarih: saleDate || today,
            };
            console.log("Gönderilen Veri:", saleData);
            try {
                // Backend API'ye satış ekleme isteği gönder
                const response = await addProductSale(saleData);

                console.log("Satış başarıyla kaydedildi:", response);

                // Güncel ürün listesini backend'den çekin
                const updatedResponse = await fetch("http://localhost:5000/allproducts");
                if (updatedResponse.ok) {
                    const updatedProducts = await updatedResponse.json();
                    updateProducts(updatedProducts); // Parent'daki ürün listesini güncelle
                } else {
                    console.error("Güncellenmiş ürünler getirilemedi.");
                }



                // Modal'ı kapat ve formu sıfırla
                setShowModal(false);
                setSaleProduct({ code: "", name: "", stock: "", price: "" });
                setSaleQuantity(1);
                setSalePrice("");
                setSaleDate("");
                setErrorMessage("");
            } catch (error) {
                setErrorMessage(error.message);
            }
        } else {
            setErrorMessage("Lütfen satış adedini kontrol edin.");
        }
    };



    return (
        <div>
            <button onClick={() => setShowModal(true)}>Satış</button>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Satış</h2>
                        <input
                            className="input"
                            type="text"
                            name="code"
                            placeholder="Ürün Kodu"
                            value={saleProduct.code}
                            onChange={handleInputChange}
                        />
                        {/* Ürün kodu veya adı ile filtreleme ve öneri listesi */}
                        {filteredProducts.length > 0 && (
                            <ul className="suggestions-list">
                                {filteredProducts.map((product) => (
                                    <li
                                        key={product.urunKodu}
                                        onClick={() => handleProductSelect(product)}
                                    >
                                        {product.urunKodu} - {product.urunAdi}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <input
                            className="input"
                            type="text"
                            name="name"
                            placeholder="Ürün Adı"
                            value={saleProduct.name}
                            readOnly
                        />
                        <input
                            className="input"
                            type="number"
                            name="stock"
                            placeholder="Stok Adedi"
                            value={saleProduct.stock}
                            readOnly
                        />
                        <input
                            className="input"
                            type="number"
                            name="quantity"
                            placeholder="Satış Adedi"
                            value={saleQuantity}
                            onChange={(e) => setSaleQuantity(e.target.value)}
                        />
                        <input
                            className="input"
                            type="number"
                            name="price"
                            placeholder="Satış Fiyatı"
                            value={salePrice}
                            onChange={(e) => setSalePrice(e.target.value)}
                        />
                        <input
                            className="input"
                            type="date"
                            name="saleDate"
                            value={saleDate || today} // Default to today's date
                            min={today} // Disable previous dates
                            onChange={(e) => setSaleDate(e.target.value)}
                        />
                        {errorMessage && (
                            <div className="error-message" style={{ color: "red" }}>
                                {errorMessage}
                            </div>
                        )}
                        <div className="modal-actions">
                            <button className="modalButton" onClick={handleSale}>Kaydet</button>
                            <button className="modalButton2" onClick={() => setShowModal(false)}>İptal</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sales;
