import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, Filler, BarElement } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import exportToPDF from "../Components/exportToPDF";

ChartJS.register(ArcElement, Tooltip, Legend, Title, Filler, BarElement, ChartDataLabels);

const SalesReport = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const formattedToday = today.toLocaleDateString("en-CA");

    const [startDate, setStartDate] = useState(formattedToday);
    const [endDate, setEndDate] = useState(formattedToday);
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const response = await fetch("http://localhost:5000/product-sales");
                if (response.ok) {
                    const data = await response.json();
                    setSalesData(data);
                } else {
                    console.error("Satış verileri alınamadı.");
                }
            } catch (error) {
                console.error("Satış verileri alınırken bir hata oluştu:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSalesData();
    }, []);

    const filteredSales = salesData.filter(sale => {
        const saleDate = new Date(sale.tarih);
        const isAfterStart = startDate ? saleDate >= new Date(startDate) : true;
        const isBeforeEnd = endDate ? saleDate <= new Date(endDate) : true;
        return isAfterStart && isBeforeEnd;
    });

    if (loading) {
        return <div>Yükleniyor...</div>;
    }

    // Net kar ve toplam kazancı hesaplama
    const totalRevenue = filteredSales.reduce((acc, sale) => acc + sale.urunSatisAdeti * sale.satisFiyati, 0);
    const totalCost = filteredSales.reduce((acc, sale) => acc + sale.maliyet * sale.urunSatisAdeti, 0);
    const netProfit = totalRevenue - totalCost;

    // Daire grafiği verisi
    const chartData = {
        labels: ['Net Kar', 'Toplam Kazanç'],
        datasets: [{
            data: [netProfit, totalRevenue],
            backgroundColor: ['#36A2EB', '#FF6384'],
            hoverBackgroundColor: ['#36A2EB', '#FF6384']
        }]
    };

    // Datalabels plugin seçenekleri ile yüzdeleri göster
    const chartOptions = {
        plugins: {
            datalabels: {
                formatter: (value, context) => {
                    const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                    const percentage = ((value / total) * 100).toFixed(2); // Yüzde hesaplama
                    return `${percentage}%`; // Yüzdeyi döndür
                },
                color: '#fff', // Yazı rengi
                font: {
                    weight: 'bold',
                    size: 16
                }
            }
        },
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const label = tooltipItem.label || '';
                        return `${label}: ${tooltipItem.raw.toLocaleString()} ₺`;
                    }
                }
            }
        }
    };

    // PDF'ye rapor aktarılacak fonksiyon
    const handleExportToPDF = () => {
        exportToPDF(filteredSales, "Satis Raporu");
    };

    return (
        <div>
            <h2>Satış Raporu</h2>

            {/* Daire Grafik */}
            <div style={{ width: '300px', height: '300px', margin: '20px auto' }}>
                <Pie data={chartData} options={chartOptions} />
            </div>

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

            {/* "Raporla ve Yazdır" butonu */}
            <div style={{ marginTop: "20px", textAlign: "center" }}>
                <button style={{ backgroundColor: '#007bff', border: 'none', padding: 10, color: 'white', borderRadius: 10 }} onClick={handleExportToPDF}>Raporla ve Yazdır</button>
            </div>
        </div>
    );
};

export default SalesReport;
