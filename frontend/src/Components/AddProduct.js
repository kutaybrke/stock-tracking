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

    const handleAddProduct = async () => {
        if (!newProduct.code || !newProduct.name || !newProduct.stock || !newProduct.price || !newProduct.company) {
            setErrorMessage("Lütfen tüm alanları doldurunuz.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/Products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    urunKodu: newProduct.code,
                    urunAdi: newProduct.name,
                    urunAdeti: parseInt(newProduct.stock, 10), // Stok adedini sayıya çevir
                    adetFiyati: parseFloat(newProduct.price), // Fiyatı sayıya çevir
                    alinanFirma: newProduct.company,
                }),
            });

            if (response.ok) {
                const addedProduct = await response.json();
                console.log("Yeni ürün eklendi:", addedProduct);

                // Backend'den gelen ürünü products'a ekle
                setProducts((prevProducts) => [...prevProducts, addedProduct]);



                setShowModal(false);
            } else {
                const error = await response.json();
                setErrorMessage(error.error || "Ürün eklenirken bir hata oluştu.");
            }
        } catch (error) {
            console.error("Ürün ekleme hatası:", error);
            setErrorMessage("Ürün eklenirken bir hata oluştu.");
        }
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
                    pattern="^[a-zA-Z\s]*$"
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
                    min="0"
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
                    <button className="addButton" onClick={handleAddProduct} disabled={!isValidName}>
                        Kaydet
                    </button>
                    <button className="cancelButton" onClick={() => setShowModal(false)}>
                        İptal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;