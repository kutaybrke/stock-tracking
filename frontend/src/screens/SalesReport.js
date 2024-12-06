import React, { useState, useEffect } from "react";

const SalesReport = () => {
    // Bugünün tarihini almak ve formatlamak (yerel zaman dilimi)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Saat kısmını sıfırlıyoruz
    const formattedToday = today.toLocaleDateString("en-CA"); // YYYYY-MM-DD format dönüşümü

    const [startDate, setStartDate] = useState(formattedToday);  // Başlangıç tarihi bugünden başlasın
    const [endDate, setEndDate] = useState(formattedToday);      // Bitiş tarihi bugünden başlasın
    const [salesData, setSalesData] = useState([]); // Satış verilerini saklamak için state
    const [loading, setLoading] = useState(true);  // Yükleniyor durumunu takip etmek için

    // Fetch sales data from the backend
    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const response = await fetch("http://localhost:5000/product-sales");
                if (response.ok) {
                    const data = await response.json();
                    setSalesData(data); // Sales data state'ini güncelle
                } else {
                    console.error("Satış verileri alınamadı.");
                }
            } catch (error) {
                console.error("Satış verileri alınırken bir hata oluştu:", error);
            } finally {
                setLoading(false); // Veriler alındığında yükleniyor durumunu sonlandır
            }
        };

        fetchSalesData();
    }, []);

    // Filtreleme işlemi
    const filteredSales = salesData.filter(sale => {
        const saleDate = new Date(sale.tarih);  // Satış tarihini al
        const isAfterStart = startDate ? saleDate >= new Date(startDate) : true;
        const isBeforeEnd = endDate ? saleDate <= new Date(endDate) : true;
        return isAfterStart && isBeforeEnd;
    });

    // Eğer veriler yükleniyorsa, yükleniyor mesajı göster
    if (loading) {
        return <div>Yükleniyor...</div>;
    }

    return (
        <div>
            <h2>Satış Raporu</h2>
            <div className="start-date">
                <div>
                    <label htmlFor="start-date">Başlangıç Tarihi: </label>
                    <input
                        id="start-date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="end-date">Bitiş Tarihi: </label>
                    <input
                        id="end-date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Tarih</th>
                        <th>Ürün Adı</th>
                        <th>Miktar</th>
                        <th>Birim Fiyat</th>
                        <th>Toplam Fiyat</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSales.map((sale, index) => (
                        <tr key={index}>
                            <td>{sale.tarih}</td>
                            <td>{sale.urunAdi}</td>
                            <td>{sale.urunSatisAdeti}</td>
                            <td>{sale.satisFiyati}</td>
                            <td>{sale.urunSatisAdeti * sale.satisFiyati} ₺</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SalesReport;
