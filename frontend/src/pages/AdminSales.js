import React, { useState, useEffect } from 'react';
import axios from 'axios';

const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    try {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch (error) {
        console.error("Error formatting date:", error);
        return 'Invalid Date';
    }
};

const AdminSales = ({sales}) => {

    //filter
    const [searchTerm, setSearchTerm] = useState('');


    const filteredSales = sales.filter(sale => {
        const buyerName = sale.user ? `${sale.user.firstname} ${sale.user.lastname}`.toLowerCase() : '';
        const items = sale.items.map(item => item.phone?.title || '').join(' ').toLowerCase();
        const timestamp = formatDate(sale.createdAt).toLowerCase();

        return (
            buyerName.includes(searchTerm.toLowerCase()) ||
            items.includes(searchTerm.toLowerCase()) ||
            timestamp.includes(searchTerm.toLowerCase())
        );
    });


    //sorting

    const [sortField, setSortField] = useState('timestamp');
    const [sortOrder, setSortOrder] = useState('desc');

    const sortedSales = [...filteredSales].sort((a, b) => {
        let valA, valB;

        if (sortField === 'timestamp') {
            valA = new Date(a.createdAt);
            valB = new Date(b.createdAt);
        } else if (sortField === 'buyer') {
            valA = a.user ? `${a.user.firstname} ${a.user.lastname}`.toLowerCase() : '';
            valB = b.user ? `${b.user.firstname} ${b.user.lastname}`.toLowerCase() : '';
        } else if (sortField === 'items') {
            valA = a.items.map(i => i.phone?.title || '').join(', ').toLowerCase();
            valB = b.items.map(i => i.phone?.title || '').join(', ').toLowerCase();
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    //pagination
    const SALES_PER_PAGE = 5; //to demo the pagination
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(sortedSales.length / SALES_PER_PAGE);
    const paginatedSales = sortedSales.slice(
        (currentPage - 1) * SALES_PER_PAGE,
        currentPage * SALES_PER_PAGE
    );



    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleExportSales = (format) => {
        if (!sales || sales.length === 0) {
            alert("no sales data to export");
            return;
        }

        //click 'Export as Json' button
        if (format === 'JSON') {
            const jsonString = JSON.stringify(sales, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "sales_record.json";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }

        //click 'Export as CSV' button
        if (format === 'CSV') {
            const headers = ["Timestamp", "Buyer", "Items", "Total"];
            const rows = sales.map(sale => {
                const timestamp = new Date(sale.createdAt).toLocaleString();
                const buyer = sale.user ? `${sale.user.firstname} ${sale.user.lastname}` : "N/A";
                const items = sale.items.map(item =>
                    `${item.phone?.title || 'Unknown'} (Qty: ${item.quantity})`
                ).join("; ");
                const total = sale.total.toFixed(2);
                return [timestamp, buyer, items, total];
            });

            const csvContent = [headers, ...rows]
                .map(row => row.map(val => `"${val}"`).join(","))
                .join("\n");

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "sales_record.csv";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }

        alert(`Sales data export completed as ${format}.`);
    };


    return (
        <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Sales and Activity Logs</h2>
            <div className="mb-4 flex space-x-2">
                <button
                    onClick={() => handleExportSales('CSV')}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-150 ease-in-out"
                >
                    Export as CSV
                </button>
                <button
                    onClick={() => handleExportSales('JSON')}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-150 ease-in-out"
                >
                    Export as JSON
                </button>
            </div>


            <input
                type="text"
                placeholder="Search sales by buyer, items, or time..."
                className="mb-4 p-2 border border-gray-300 rounded w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="overflow-x-auto">
                <table className="min-w-full table-fixed bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        {['timestamp', 'buyer', 'items'].map(header => (
                            <th
                                key={header}
                                className={
                                    "px-6 py-3 cursor-pointer text-left text-xs font-medium text-gray-500 uppercase tracking-wider " +
                                    (header === 'timestamp' ? 'w-1/4' : header === 'buyer' ? 'w-1/4' : 'w-2/4')
                                }
                                onClick={() => handleSort(header)}
                            >
                                {header === 'timestamp' ? 'Timestamp' :
                                    header === 'buyer' ? 'Buyer' : 'Items Purchased'}
                                <span className="inline-block w-3">
                                    {sortField === header && (sortOrder === 'asc' ? '▲' : '▼')}
                                 </span>
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedSales.map(sale => (
                        <tr key={sale._id}>
                            <td className="px-6 py-4 text-sm text-gray-500 break-words whitespace-pre-wrap w-1/4">
                                {formatDate(sale.createdAt)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 break-words whitespace-pre-wrap w-1/4">
                                {sale.user ? `${sale.user.firstname} ${sale.user.lastname}` : `${sale.userSnapshot.name}`}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 break-words whitespace-pre-wrap w-2/4">
                                {sale.items.map(item => `${item.titleSnapshot} (Qty: ${item.quantity})`).join(', ')}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div className="flex items-center justify-center gap-4 mt-6">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded ${
                            currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    >
                        Previous
                    </button>

                    <span className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded ${
                            currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    >
                        Next
                    </button>
                </div>
            </div>
            <div className="mt-6 p-4 border border-gray-200 rounded bg-gray-50">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Recent Activity / Notifications</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {sales.slice(0, 3).map(sale => (
                        <li key={sale._id}>
                            Order #{sale._id.slice(-4)} placed by{' '}
                            {sale.user ? `${sale.user.firstname} ${sale.user.lastname}` : `${sale.userSnapshot.name}`} for{' '}
                            {sale.items.map(item => item.phone?.title || 'an item').join(', ')} on{' '}
                            {new Date(sale.createdAt).toLocaleString()}.
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default AdminSales;