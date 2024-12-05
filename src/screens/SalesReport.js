import React, { useState } from "react";

const SalesReport = ({ salesData }) => {
    // Bugünün tarihini almak ve formatlamak (yerel zaman dilimi)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Saat kısmını sıfırlıyoruz
    const formattedToday = today.toLocaleDateString("en-CA"); // YYYYY-MM-DD format dönüşümü

    const [startDate, setStartDate] = useState(formattedToday);  // Başlangıç tarihi bugünden başlasın
    const [endDate, setEndDate] = useState(formattedToday);      // Bitiş tarihi bugünden başlasın

    const filteredSales = salesData.filter(sale => {
        // Başlangıç ve bitiş tarihleri arasındaki satışları filtreleme
        const saleDate = new Date(sale.date);
        const isAfterStart = startDate ? saleDate >= new Date(startDate) : true;
        const isBeforeEnd = endDate ? saleDate <= new Date(endDate) : true;
        return isAfterStart && isBeforeEnd;
    });

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
                            <td>{sale.date}</td>
                            <td>{sale.productName}</td>
                            <td>{sale.quantity}</td>
                            <td>{sale.unitPrice}</td>
                            <td>{sale.totalPrice}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SalesReport;
