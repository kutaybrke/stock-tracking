import { jsPDF } from "jspdf";
import "jspdf-autotable";

const exportToPDF = (data, title = "Rapor") => {
    const doc = new jsPDF();

    // Başlık
    doc.setFontSize(16);
    doc.text(title, 14, 22);

    // Dinamik sütunlar ve satırlar
    let columns = [];
    let rows = [];

    // Eğer SalesReport sayfası ise
    if (data.length > 0 && data[0].hasOwnProperty('tarih')) {
        columns = ["Tarih", "Ürün Adı", "Miktar", "Birim Fiyat", "Toplam Fiyat"];
        rows = data.map((item) => [
            item.tarih,
            item.urunAdi,
            item.urunSatisAdeti,
            item.satisFiyati,
            item.urunSatisAdeti * item.satisFiyati + " ₺",
        ]);
    }
    // Eğer StockControl sayfası ise
    else if (data.length > 0 && data[0].hasOwnProperty('urunKodu')) {
        columns = ["Ürün Kodu", "Ürün Adi", "Stok Adedi"];
        rows = data.map((item) => [
            item.urunKodu,
            item.urunAdi,
            item.urunAdeti,
        ]);
    }

    // Tabloyu ekle
    doc.autoTable({
        startY: 30,
        head: [columns],
        body: rows,
    });

    // Pdf Kaydet
    doc.save(`${title.replace(/\s+/g, "_").toLowerCase()}.pdf`);
};

export default exportToPDF;
