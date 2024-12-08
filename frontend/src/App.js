import React, { useState, useEffect } from "react";
import "./App.css";
import Sales from "./screens/Sales";
import SalesReport from "./screens/SalesReport";
import StockControl from "./screens/StockControl";
import AddProduct from "./Components/AddProduct";
import ProductFilter from "./Components/ProductFilter";
import { deleteProduct, editProduct, EditProductForm, DeleteProductButton } from "./Components/Action";
import Pagination from "./Components/Pagination";

const App = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSalesReportModal, setShowSalesReportModal] = useState(false);
  const [showStockControlModal, setShowStockControlModal] = useState(false);
  const [salesData, setSalesData] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [filterValue, setFilterValue] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
    setCurrentPage(1);
  };

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/allproducts");
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error("Ürünler getirilemedi.");
        }
      } catch (error) {
        console.error("Ürünleri getirirken bir hata oluştu:", error);
      }
    };

    fetchProducts();
  }, []);


  const handleEditProduct = (index) => {
    const realIndex = (currentPage - 1) * itemsPerPage + index;
    const product = products[realIndex];
    setProductToEdit({ ...product, index: realIndex });
    setEditModalOpen(true);
  };

  // Düzenlenen Ürünü Kaydet backend için burayı kullanabilirsin
  const handleSaveEdit = (editedProduct) => {
    if (productToEdit) {
      const updatedProduct = {
        ...productToEdit,
        ...editedProduct,
      };
      const updatedProducts = editProduct(products, productToEdit.index, updatedProduct);
      setProducts(updatedProducts);
      setEditModalOpen(false);
      setProductToEdit(null);
    }
  };

  // ürün sil  backend için burayı kullanabilirsin
  const handleDeleteProduct = (index) => {
    const realIndex = (currentPage - 1) * itemsPerPage + index;
    const updatedProducts = deleteProduct(products, realIndex);
    setProducts(updatedProducts);
  };

  // Filter
  const filteredProducts = products.filter((product) =>
    product.urunKodu.toLowerCase().includes(filterValue.toLowerCase())
  );

  // Sayfalama 
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="app-container">
      <div className="header">
        <h1>Stok Takip Programı V1.01</h1>
      </div>
      <div className="main-container">
        <div className="sidebar">
          <button>Ürün Kayıt</button>
          <Sales products={products} updateProducts={setProducts} addSale={(sale) => setSalesData([...salesData, sale])} />
          <button onClick={() => setShowSalesReportModal(true)}>Tarihe Göre Satış Rapor</button>
          <button onClick={() => setShowStockControlModal(true)}>Stokta Eksik Olan Ürünlerin Bilgisi</button>
          <button className="exit-button" onClick={() => window.close()}>Programdan Çık</button>
        </div>
        <div className="content">
          <div className="table-container">
            <ProductFilter filterValue={filterValue} setFilterValue={handleFilterChange} />
            <table>
              <thead>
                <tr>
                  <th>Ürün Kodu</th>
                  <th>Ürün Adı</th>
                  <th>Stok Adedi</th>
                  <th>Ürün Fiyatı</th>
                  <th>Aldığı Firma</th>
                  <th>Aksiyonlar</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product, index) => (
                  <tr key={index}>
                    <td>{product.urunKodu}</td>
                    <td>{product.urunAdi}</td>
                    <td>{product.urunAdeti}</td>
                    <td>{product.adetFiyati}</td>
                    <td>{product.alinanFirma}</td>
                    <td>
                      <button className="icon" onClick={() => handleEditProduct(index)}>✏️</button>
                      <DeleteProductButton index={index} handleDeleteProduct={handleDeleteProduct} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={filteredProducts.length}
            currentPage={currentPage}
            paginate={paginate}
          />
          <div className="footer-actions">
            <button style={{ backgroundColor: '#007bff', border: 'none', padding: 10, color: 'white', borderRadius: 10 }} onClick={() => setShowModal(true)}>Ürün Ekle</button>
          </div>
        </div>
      </div>
      {showModal && (
        <AddProduct setShowModal={setShowModal} products={products} setProducts={setProducts} />
      )}
      {showSalesReportModal && (
        <div className="modal">
          <div className="modalContentSalesReport">
            <SalesReport salesData={salesData} />
            <button className="closeButton" onClick={() => setShowSalesReportModal(false)}>Kapat</button>
          </div>
        </div>
      )}
      {showStockControlModal && (
        <div className="modal">
          <div className="modalContentSalesReport">
            <StockControl products={products} goBack={() => setShowStockControlModal(false)} />
          </div>
        </div>
      )}
      {editModalOpen && (
        <EditProductForm
          productToEdit={productToEdit}
          setProductToEdit={setProductToEdit}
          handleSaveEdit={handleSaveEdit}
          setEditModalOpen={setEditModalOpen}
        />
      )}
    </div>
  );
};

export default App;
