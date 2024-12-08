import React from 'react';

// Ürün silme fonksiyonu
export const deleteProduct = (products, index) => {
    return products.filter((_, i) => i !== index);
};

// Ürün düzenleme fonksiyonu
export const editProduct = (products, index, updatedProduct) => {
    const updatedProducts = [...products];
    updatedProducts[index] = updatedProduct;
    return updatedProducts;
};

// Ürün düzenleme formu 
export const EditProductForm = ({ productToEdit, setProductToEdit, handleSaveEdit, setEditModalOpen }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Ürün Düzenle</h2>
                <input
                    className="input"
                    type="text"
                    placeholder="Ürün Kodu"
                    value={productToEdit?.urunKodu || ""}
                    onChange={(e) => setProductToEdit({ ...productToEdit, urunKodu: e.target.value })}
                />
                <input
                    className="input"
                    type="text"
                    placeholder="Ürün Adı"
                    value={productToEdit?.urunAdi || ""}
                    onChange={(e) => setProductToEdit({ ...productToEdit, urunAdi: e.target.value })}
                />
                <input
                    className="input"
                    type="number"
                    placeholder="Stok Adedi"
                    value={productToEdit?.urunAdeti || ""}
                    onChange={(e) => setProductToEdit({ ...productToEdit, urunAdeti: e.target.value })}
                />
                <input
                    className="input"
                    type="number"
                    placeholder="Ürün Fiyatı"
                    value={productToEdit?.adetFiyati || ""}
                    onChange={(e) => setProductToEdit({ ...productToEdit, adetFiyati: e.target.value })}
                />
                <input
                    className="input"
                    type="text"
                    placeholder="Aldığı Firma"
                    value={productToEdit?.alinanFirma || ""}
                    onChange={(e) => setProductToEdit({ ...productToEdit, alinanFirma: e.target.value })}
                />
                <div className="modal-actions">
                    <button className="addButton" onClick={() => handleSaveEdit(productToEdit)}>Kaydet</button>
                    <button className="cancelButton" onClick={() => setEditModalOpen(false)}>İptal</button>
                </div>
            </div>
        </div>
    );
};

// Ürün silme butonu
export const DeleteProductButton = ({ index, handleDeleteProduct }) => {
    return (
        <button onClick={() => handleDeleteProduct(index)} className="deleteButton">
            🗑️
        </button>
    );
};
