import React, { useState, useEffect } from 'react';
import axios from 'axios';

const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    try {
        const date = new Date(isoString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return 'Invalid';
    }
};

const AdminLogs = ({adminLogs}) => {

    //filter
    const [searchTerm, setSearchTerm] = useState('');
    const filteredLogs = adminLogs.filter(log => {
        return (
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
            formatDate(log.timestamp).toLowerCase().includes(searchTerm.toLowerCase())
        );
    });


    //sorting
    const [sortField, setSortField] = useState('timestamp');
    const [sortOrder, setSortOrder] = useState('desc');

    const sortedLogs = [...filteredLogs].sort((a, b) => {
        let valA, valB;
        if (sortField === 'timestamp') {
            valA = new Date(a.timestamp);
            valB = new Date(b.timestamp);
        } else {
            valA = (a[sortField] || '').toLowerCase();
            valB = (b[sortField] || '').toLowerCase();
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
    const [currentPage, setCurrentPage] = useState(1);
    const LOGS_PER_PAGE = 10;

    const totalPages = Math.ceil(sortedLogs.length / LOGS_PER_PAGE);
    const paginatedLogs = sortedLogs.slice(
        (currentPage - 1) * LOGS_PER_PAGE,
        currentPage * LOGS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    if (!adminLogs) return <p className="text-gray-500">Loading logs...</p>;

    return (
        <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Admin Logs</h2>

            <input
                type="text"
                placeholder="Search logs by action, time, or details..."
                className="mb-4 p-2 border border-gray-300 rounded w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />


            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 table-fixed">
                    <thead className="bg-gray-50">
                    <tr>
                        {['timestamp', 'action', 'details'].map(header => (
                            <th
                                key={header}
                                className="px-6 py-3 cursor-pointer text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                onClick={() => handleSort(header)}
                            >
                                {header === 'timestamp' ? 'Timestamp' : header.charAt(0).toUpperCase() + header.slice(1)}
                                {sortField === header ? (sortOrder === 'asc' ? '▲' : '▼') : ' '}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedLogs.map(log => (
                        <tr key={log._id}>
                            <td className="w-1/4 px-6 py-4 text-sm text-gray-500 break-words whitespace-pre-wrap">{formatDate(log.timestamp)}</td>
                            <td className="w-1/4 px-6 py-4 text-sm text-gray-700 font-semibold break-words whitespace-pre-wrap">{log.action}</td>
                            <td className="w-2/4 px-6 py-4 text-sm text-gray-600 break-words whitespace-pre-wrap">{log.details}</td>
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
        </section>
    );
};

export default AdminLogs;