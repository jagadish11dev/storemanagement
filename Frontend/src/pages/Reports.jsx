import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSales } from "../features/sales/salesSlice";
import { fetchProducts } from "../features/products/productSlice";
import Table from "../components/Table";
import formatDate from "../utils/formatDate";

export default function Reports() {
  const dispatch = useDispatch();
  const { records: sales } = useSelector((s) => s.sales);
  const { items: products } = useSelector((s) => s.products);
  const [exportLoading, setExportLoading] = useState({});
  const [packagesInstalled, setPackagesInstalled] = useState(true);

  useEffect(() => {
    dispatch(fetchSales());
    dispatch(fetchProducts());
  }, [dispatch]);

  // Export to Excel using xlsx
  const exportToExcel = async (data, filename) => {
    setExportLoading((prev) => ({ ...prev, [filename]: true }));
    
    try {
      const XLSX = await import("xlsx");
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, `${filename}.xlsx`);
      setExportLoading((prev) => ({ ...prev, [filename]: false }));
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      setPackagesInstalled(false);
      setExportLoading((prev) => ({ ...prev, [filename]: false }));
    }
  };

  // Export to PDF using jsPDF and html2canvas
  const exportToPDF = async (data, filename) => {
    setExportLoading((prev) => ({ ...prev, [filename]: true }));
    
    try {
      const jsPDFModule = await import("jspdf");
      const html2canvasModule = await import("html2canvas");
      
      const jsPDF = jsPDFModule.default;
      const html2canvas = html2canvasModule.default;
      
      // Create a temporary table element
      const table = document.createElement("table");
      table.style.width = "100%";
      table.style.borderCollapse = "collapse";
      table.style.margin = "10px";
      
      // Add headers
      const thead = table.createTHead();
      const headerRow = thead.insertRow();
      if (data.length > 0) {
        Object.keys(data[0]).forEach((key) => {
          const th = document.createElement("th");
          th.style.border = "1px solid black";
          th.style.padding = "8px";
          th.style.textAlign = "left";
          th.style.backgroundColor = "#f2f2f2";
          th.style.fontSize = "12px";
          th.style.fontWeight = "bold";
          th.textContent = key;
          headerRow.appendChild(th);
        });
      }
      
      // Add rows
      const tbody = table.createTBody();
      data.forEach((row) => {
        const tr = tbody.insertRow();
        Object.values(row).forEach((cell) => {
          const td = document.createElement("td");
          td.style.border = "1px solid #ddd";
          td.style.padding = "6px";
          td.style.fontSize = "11px";
          td.textContent = cell || "-";
          tr.appendChild(td);
        });
      });
      
      document.body.appendChild(table);
      
      const canvas = await html2canvas(table, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4");
      const imgWidth = 280; // Landscape width
      const pageHeight = 190; // Landscape height
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 5, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 5, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${filename}.pdf`);
      document.body.removeChild(table);
      setExportLoading((prev) => ({ ...prev, [filename]: false }));
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      setPackagesInstalled(false);
      setExportLoading((prev) => ({ ...prev, [filename]: false }));
    }
  };

  // Prepare sales data for export
  const salesExportData = sales.map((sale) => ({
    "Invoice ID": sale.invoiceId,
    "Product": sale.product?.name || "N/A",
    "Quantity": sale.quantity,
    "Unit Price": `$${sale.pricePerUnit?.toFixed(2)}`,
    "Total": `$${sale.totalPrice?.toFixed(2)}`,
    "Cashier": sale.soldBy?.name || "N/A",
    "Date": formatDate(sale.soldAt),
  }));

  // Prepare products data for export
  const stockExportData = products.map((product) => ({
    "Product Name": product.name,
    "Part ID": product.partId || "N/A",
    "Price": `$${product.price?.toFixed(2)}`,
    "Quantity": product.quantity,
    "Supplier": product.supplier || "N/A",
  }));

  // Sales table columns
  const salesColumns = [
    { key: "invoiceId", title: "Invoice ID", dataIndex: "invoiceId" },
    { key: "product", title: "Product", render: (r) => r.product?.name || "N/A" },
    { key: "quantity", title: "Quantity", dataIndex: "quantity" },
    { key: "pricePerUnit", title: "Unit Price", render: (r) => `$${r.pricePerUnit?.toFixed(2)}` },
    { key: "totalPrice", title: "Total", render: (r) => `$${r.totalPrice?.toFixed(2)}` },
    { key: "soldBy", title: "Cashier", render: (r) => r.soldBy?.name || "N/A" },
    { key: "soldAt", title: "Date", render: (r) => formatDate(r.soldAt) },
  ];

  // Stock table columns
  const stockColumns = [
    { key: "name", title: "Product Name", dataIndex: "name" },
    { key: "partId", title: "Part ID", dataIndex: "partId" },
    { key: "price", title: "Price", render: (r) => `$${r.price?.toFixed(2)}` },
    { key: "quantity", title: "Quantity", dataIndex: "quantity" },
    { key: "supplier", title: "Supplier", dataIndex: "supplier" },
  ];

  return (
    <div className="space-y-8">
      {/* Package Installation Alert */}
      {!packagesInstalled && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-800">
                Export packages not installed
              </p>
              <p className="mt-2 text-sm text-yellow-700">
                To enable Excel and PDF export, please run the following command in the Frontend folder:
              </p>
              <code className="block mt-2 bg-yellow-100 p-2 rounded text-yellow-900 font-mono text-sm">
                npm install xlsx jspdf html2canvas
              </code>
              <p className="mt-2 text-sm text-yellow-700">
                After installation, refresh the page to enable export functionality.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sales Report */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">Sales Report</h2>
          <div className="flex gap-3">
            <button
              onClick={() => exportToExcel(salesExportData, "Sales_Report")}
              disabled={exportLoading["Sales_Report"] || sales.length === 0 || !packagesInstalled}
              title={!packagesInstalled ? "Run: npm install xlsx jspdf html2canvas" : ""}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {exportLoading["Sales_Report"] ? "Exporting..." : "📊 Export to Excel"}
            </button>
            <button
              onClick={() => exportToPDF(salesExportData, "Sales_Report")}
              disabled={exportLoading["Sales_Report"] || sales.length === 0 || !packagesInstalled}
              title={!packagesInstalled ? "Run: npm install xlsx jspdf html2canvas" : ""}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {exportLoading["Sales_Report"] ? "Exporting..." : "📄 Export to PDF"}
            </button>
          </div>
        </div>
        {sales.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <Table columns={salesColumns} data={sales} />
          </div>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow text-center text-gray-600">
            No sales data available
          </div>
        )}
      </div>

      {/* Stock Products Report */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">Stock Products Report</h2>
          <div className="flex gap-3">
            <button
              onClick={() => exportToExcel(stockExportData, "Stock_Products_Report")}
              disabled={exportLoading["Stock_Products_Report"] || products.length === 0 || !packagesInstalled}
              title={!packagesInstalled ? "Run: npm install xlsx jspdf html2canvas" : ""}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {exportLoading["Stock_Products_Report"] ? "Exporting..." : "📊 Export to Excel"}
            </button>
            <button
              onClick={() => exportToPDF(stockExportData, "Stock_Products_Report")}
              disabled={exportLoading["Stock_Products_Report"] || products.length === 0 || !packagesInstalled}
              title={!packagesInstalled ? "Run: npm install xlsx jspdf html2canvas" : ""}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {exportLoading["Stock_Products_Report"] ? "Exporting..." : "📄 Export to PDF"}
            </button>
          </div>
        </div>
        {products.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <Table columns={stockColumns} data={products} />
          </div>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow text-center text-gray-600">
            No products data available
          </div>
        )}
      </div>
    </div>
  );
}

