import React, { useState } from "react";

const AddProduct = ({ setShowModal, products, setProducts, setSalesData }) => {
    const [newProduct, setNewProduct] = useState({
        code: "",
        name: "",
        stock: "",
        price: "",
        company: "",
    });

    const [errorMessage, setErrorMessage] = useState(""); // Hata mesajı durumu

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const handleAddProduct = () => {
        // Boş alanları kontrol et
        if (!newProduct.code || !newProduct.name || !newProduct.stock || !newProduct.price || !newProduct.company) {
            setErrorMessage("Lütfen tüm alanları doldurunuz.");
            return; // Eksik alan varsa fonksiyonu sonlandır
        }

        // Yeni ürün ekleme işlemi
        setProducts([...products, newProduct]);

        // Satış verilerini güncellemek için
        setSalesData(prevSalesData => [
            ...prevSalesData,
            {
                product: newProduct.name,
                stock: newProduct.stock,
                price: newProduct.price,
                company: newProduct.company,
            }
        ]);

        // Modal'ı kapatma
        setShowModal(false);

        // Formu sıfırlama
        setNewProduct({ code: "", name: "", stock: "", price: "", company: "" });
    };

    // Ürün adı için sadece harf kontrolü
    const isValidName = /^[a-zA-Z\s]*$/.test(newProduct.name);

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Ürün Ekle</h2>
                <input
                    className="input"
                    type="text"
                    name="code"
                    placeholder="Ürün Kodu"
                    value={newProduct.code}
                    onChange={handleInputChange}
                    required
                />
                <input
                    className="input"
                    type="text"
                    name="name"
                    placeholder="Ürün Adı"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    required
                    pattern="^[a-zA-Z\s]*$"  // Sadece harf ve boşluk
                    title="Ürün adı sadece harflerden oluşmalıdır"
                />
                <input
                    className="input"
                    type="number"
                    name="stock"
                    placeholder="Stok Adedi"
                    value={newProduct.stock}
                    onChange={handleInputChange}
                    required
                    min="0"  // Negatif stok girmeyi engeller
                />
                <input
                    className="input"
                    type="number"
                    name="price"
                    placeholder="Ürün Fiyatı"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                />
                <input
                    className="input"
                    type="text"
                    name="company"
                    placeholder="Aldığı Firma"
                    value={newProduct.company}
                    onChange={handleInputChange}
                    required
                />
                {errorMessage && (
                    <div className="error-message" style={{ color: "red" }}>
                        {errorMessage}
                    </div>
                )}
                <div className="modal-actions">
                    <button className="addButton" onClick={handleAddProduct} disabled={!isValidName}>Kaydet</button>
                    <button className="cancelButton" onClick={() => setShowModal(false)}>İptal</button>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
