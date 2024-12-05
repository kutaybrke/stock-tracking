import React, { useState, useEffect } from "react";
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

  // Backend'den ürünleri çekmek için useEffect
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/allproducts"); // Backend URL
        if (response.ok) {
          const data = await response.json(); // JSON formatında yanıt
          setProducts(data); // Gelen veriyi state'e kaydet
        } else {
          console.error("Ürünler getirilemedi.");
        }
      } catch (error) {
        console.error("Ürünleri getirirken bir hata oluştu:", error);
      }
    };

    fetchProducts(); // Fonksiyonu çağır
  }, []); // Sadece bir kez çalışması için boş bir bağımlılık dizisi

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
                    <td>{product.urunKodu}</td>
                    <td>{product.urunAdi}</td>
                    <td>{product.urunAdeti}</td>
                    <td>{product.adetFiyati}</td>
                    <td>{product.alinanFirma}</td>
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
