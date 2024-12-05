import React, { useState } from "react";
import "./App.css";
import Sales from "./screens/Sales";
import SalesReport from "./screens/SalesReport";
import StockControl from "./screens/StockControl";
import AddProduct from "./Components/AddProduct";

const App = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSalesReportModal, setShowSalesReportModal] = useState(false);
  const [showStockControlModal, setShowStockControlModal] = useState(false);
  const [salesData, setSalesData] = useState([]); // salesData state

  const addSale = (sale) => {
    setSalesData([...salesData, sale]); // salesData'yı güncelle
  };

  const handleShowSalesReport = () => {
    setShowSalesReportModal(true);
  };

  const handleCloseSalesReport = () => {
    setShowSalesReportModal(false);
  };

  const handleShowStockControl = () => {
    setShowStockControlModal(true); // StockControl modal'ını aç
  };

  const handleCloseStockControl = () => {
    setShowStockControlModal(false); // StockControl modal'ını kapat
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Stok Takip Programı V1.01</h1>
      </div>
      <div className="main-container">
        <div className="sidebar">
          <button>Ürün Kayıt</button>
          <Sales products={products} updateProducts={setProducts} addSale={addSale} />
          <button onClick={handleShowSalesReport}>Tarihe Göre Satış Rapor</button>
          <button onClick={handleShowStockControl}>Stokta Eksik Olan Ürünlerin Bilgisi</button>
          <button className="exit-button">Programdan Çık</button>
        </div>
        <div className="content">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Ürün Kodu</th>
                  <th>Ürün Adı</th>
                  <th>Stok Adedi</th>
                  <th>Ürün Fiyatı</th>
                  <th>Aldığı Firma</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index}>
                    <td>{product.code}</td>
                    <td>{product.name}</td>
                    <td>{product.stock}</td>
                    <td>{product.price}</td>
                    <td>{product.company}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="footer">
            <p>Stokta 150 adet'e kadar olan ürünler listelenmiştir..</p>
            <div className="footer-actions">
              <input type="number" placeholder="Adet Giriniz: 150" />
              <button>Listele</button>
              <button onClick={() => setShowModal(true)}>Ürün Ekle</button>
              <button>Raporla ve Yazdır</button>
            </div>
          </div>
        </div>
      </div>

      {/* Ürün Ekle Modal */}
      {showModal && (
        <AddProduct
          setShowModal={setShowModal}
          products={products}
          setProducts={setProducts}
          setSalesData={setSalesData} // Burada setSalesData'yı da prop olarak geçtim
        />
      )}

      {/* Satış Raporu Modal */}
      {showSalesReportModal && (
        <div className="modal">
          <div className="modalContentSalesReport">
            <SalesReport salesData={salesData} />
            <div className="modal-actions">
              <button className="closeButton" onClick={handleCloseSalesReport}>Kapat</button>
            </div>
          </div>
        </div>
      )}

      {/* StockControl Modal */}
      {showStockControlModal && (
        <div className="modal">
          <div className="modalContentSalesReport">
            <StockControl products={products} goBack={handleCloseStockControl} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
