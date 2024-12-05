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

    const handleSale = () => {
        const saleQty = parseInt(saleQuantity, 10); // Kullanıcının girdiği satış adedi
        const totalSalePrice = salePrice * saleQty;

        if (saleQty > 0 && saleProduct.stock >= saleQty) {
            // Ürün satıldığında stok güncelleniyor
            const updatedProducts = products.map((product) =>
                product.urunKodu === saleProduct.code
                    ? { ...product, urunAdeti: product.urunAdeti - saleQty }
                    : product
            );
            updateProducts(updatedProducts);

            // Satış verisini kaydediyoruz
            addSale({
                date: saleDate,
                productName: saleProduct.name,
                quantity: saleQty,
                unitPrice: salePrice,
                totalPrice: totalSalePrice,
            });

            // Modal'ı kapatıyoruz ve input'ları sıfırlıyoruz
            setShowModal(false);
            setSaleProduct({ code: "", name: "", stock: "", price: "" });
            setSaleQuantity(1);
            setSalePrice("");
            setSaleDate("");
            setErrorMessage(""); // Hata mesajını sıfırla
        } else {
            setErrorMessage("Lütfen tüm alanları doldurduğunuzdan emin olun ve satış adedini kontrol edin.");
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
