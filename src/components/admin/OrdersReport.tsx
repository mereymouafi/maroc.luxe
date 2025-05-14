import React, { useState } from 'react';
import { 
  generateDailyOrdersCSV, 
  formatDateForFilename,
  getOrdersForDay
} from '../../lib/orderService';

interface OrdersReportProps {
  selectedDate: Date | null;
}

const OrdersReport: React.FC<OrdersReportProps> = ({ selectedDate }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to download a file
  const downloadFile = (data: string, filename: string, type: string) => {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download as CSV
  const handleDownloadCSV = async () => {
    if (!selectedDate) {
      setError('Please select a date to generate the report');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await generateDailyOrdersCSV(selectedDate);
      
      if (error) {
        console.error('Error generating CSV report:', error);
        setError('Failed to generate report. Please try again.');
        return;
      }
      
      if (!data) {
        setError('No orders found for the selected date');
        return;
      }

      // Download the CSV file
      if (selectedDate) {
        downloadFile(
          data, 
          `orders-${formatDateForFilename(selectedDate)}.csv`, 
          'text/csv;charset=utf-8;'
        );
      }
    } catch (err) {
      console.error('Failed to download CSV report:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Download as Excel
  const handleDownloadExcel = async () => {
    if (!selectedDate) {
      setError('Please select a date to generate the report');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Import xlsx dynamically to avoid SSR issues
      const XLSX = await import('xlsx');
      
      // Get the orders data
      const { orders, itemsByOrderId, error } = await getOrdersForDay(selectedDate);
      
      if (error || !orders || !itemsByOrderId) {
        console.error('Error fetching orders:', error);
        setError('Failed to generate report. Please try again.');
        return;
      }
      
      // Prepare data for Excel
      const excelData = orders.map(order => {
        const items = itemsByOrderId[order.id] || [];
        const productsStr = items.map(item => 
          `${item.name} (${item.size}) x${item.quantity} - ${item.price} MAD`
        ).join(' | ');
        
        return {
          'Order ID': order.id,
          'Date': new Date(order.created_at).toLocaleString(),
          'Customer Name': order.customer_name,
          'Phone': order.phone,
          'Address': order.address,
          'Total Amount': `${order.total_amount} MAD`,
          'Payment Method': order.payment_method,
          'Payment Status': order.payment_status,
          'Products': productsStr
        };
      });
      
      // Create a worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // Create a workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
      
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      
      // Convert to Blob and download
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      if (selectedDate) {
        link.setAttribute('download', `orders-${formatDateForFilename(selectedDate)}.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Failed to download Excel report:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Download as PDF (HTML-based approach)
  const handleDownloadPDF = async () => {
    if (!selectedDate) {
      setError('Please select a date to generate the report');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get the orders data
      const { orders, itemsByOrderId, error } = await getOrdersForDay(selectedDate);
      
      if (error || !orders || !itemsByOrderId) {
        console.error('Error fetching orders:', error);
        setError('Failed to generate report. Please try again.');
        return;
      }
      
      // Calculate total revenue
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      
      // Create HTML content for the report
      let htmlContent = `
        <html>
        <head>
          <title>Orders Report - ${selectedDate.toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
            .header { background-color: #4F46E5; color: white; padding: 15px; text-align: center; }
            .content { padding: 20px; }
            .summary { background-color: #f0f0f0; padding: 10px; margin-bottom: 20px; border-radius: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #4F46E5; color: white; padding: 8px; text-align: left; }
            td { padding: 8px; border-bottom: 1px solid #ddd; }
            tr:nth-child(even) { background-color: #f9fafb; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #888; }
            .status-paid { color: #22c55e; } /* green */
            .status-pending { color: #eab308; } /* yellow */
            .status-cancelled { color: #ef4444; } /* red */
            .status-processing { color: #3b82f6; } /* blue */
          </style>
        </head>
        <body>
          <div class="header">
            <h1>MarocLuxe</h1>
            <h2>Daily Orders Report</h2>
          </div>
          <div class="content">
            <h3>Date: ${selectedDate.toLocaleDateString()}</h3>
            
            <div class="summary">
              <p><strong>Total Orders:</strong> ${orders.length}</p>
              <p><strong>Total Revenue:</strong> ${totalRevenue.toLocaleString()} MAD</p>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Products</th>
                </tr>
              </thead>
              <tbody>
      `;
      
      // Add table rows
      orders.forEach(order => {
        const items = itemsByOrderId[order.id] || [];
        const productsStr = items.map(item => 
          `${item.name} (${item.size}) x${item.quantity} - ${item.price} MAD`
        ).join('<br>');
        
        // Determine status class
        let statusClass = '';
        switch(order.payment_status.toLowerCase()) {
          case 'paid': statusClass = 'status-paid'; break;
          case 'pending': statusClass = 'status-pending'; break;
          case 'cancelled': statusClass = 'status-cancelled'; break;
          case 'processing': statusClass = 'status-processing'; break;
        }
        
        htmlContent += `
          <tr>
            <td>${order.id.substring(0, 8)}...</td>
            <td>${new Date(order.created_at).toLocaleString()}</td>
            <td>${order.customer_name}</td>
            <td>${order.phone}</td>
            <td>${order.total_amount} MAD</td>
            <td class="${statusClass}">${order.payment_status}</td>
            <td>${productsStr}</td>
          </tr>
        `;
      });
      
      // Close the HTML
      htmlContent += `
              </tbody>
            </table>
            
            <div class="footer">
              MarocLuxe - Generated on ${new Date().toLocaleString()}
            </div>
          </div>
        </body>
        </html>
      `;
      
      // Create a Blob from the HTML content
      const blob = new Blob([htmlContent], { type: 'text/html' });
      
      // Create a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `orders-${formatDateForFilename(selectedDate)}.html`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Open the report in a new tab for printing
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } catch (err) {
      console.error('Failed to generate HTML report:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Daily Orders Report</h3>
        <p className="text-sm text-gray-600 mb-4">
          {selectedDate 
            ? `Download orders report for ${selectedDate.toLocaleDateString()}`
            : 'Select a date to download the daily orders report'}
        </p>
        
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleDownloadCSV}
            disabled={loading || !selectedDate}
            className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
              loading || !selectedDate
                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {loading ? (
              <span>Processing...</span>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>CSV</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleDownloadExcel}
            disabled={loading || !selectedDate}
            className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
              loading || !selectedDate
                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? (
              <span>Processing...</span>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Excel</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleDownloadPDF}
            disabled={loading || !selectedDate}
            className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
              loading || !selectedDate
                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {loading ? (
              <span>Processing...</span>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Print Report</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersReport;
