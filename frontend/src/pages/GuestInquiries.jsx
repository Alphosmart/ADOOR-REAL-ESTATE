import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import { FaUser, FaEnvelope, FaPhone, FaHome, FaClock, FaTag, FaExclamationCircle, FaCheckCircle, FaSearch, FaFilter } from 'react-icons/fa';

const GuestInquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [filters, setFilters] = useState({
        status: 'all',
        priority: 'all',
        search: ''
    });

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const response = await fetch(SummaryApi.getAllInquiries.url, {
                method: SummaryApi.getAllInquiries.method,
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success) {
                // Filter only guest inquiries (those without user account)
                const guestInquiries = data.inquiries.filter(inq => !inq.inquirer && inq.guestInfo);
                setInquiries(guestInquiries);
            } else {
                toast.error(data.message || 'Failed to fetch inquiries');
            }
        } catch (error) {
            console.error('Error fetching inquiries:', error);
            toast.error('Failed to load guest inquiries');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (inquiryId, newStatus) => {
        try {
            const response = await fetch(SummaryApi.updateInquiryStatus.url, {
                method: SummaryApi.updateInquiryStatus.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inquiryId,
                    status: newStatus
                })
            });

            const data = await response.json();
            
            if (data.success) {
                toast.success('Status updated successfully');
                fetchInquiries();
            } else {
                toast.error(data.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const handlePriorityUpdate = async (inquiryId, newPriority) => {
        try {
            const response = await fetch(SummaryApi.updateInquiryPriority.url, {
                method: SummaryApi.updateInquiryPriority.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inquiryId,
                    priority: newPriority
                })
            });

            const data = await response.json();
            
            if (data.success) {
                toast.success('Priority updated successfully');
                fetchInquiries();
            } else {
                toast.error(data.message || 'Failed to update priority');
            }
        } catch (error) {
            console.error('Error updating priority:', error);
            toast.error('Failed to update priority');
        }
    };

    const handleRespond = async () => {
        if (!responseMessage.trim()) {
            toast.error('Please enter a response message');
            return;
        }

        try {
            const response = await fetch(SummaryApi.respondToInquiry.url, {
                method: SummaryApi.respondToInquiry.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inquiryId: selectedInquiry._id,
                    message: responseMessage
                })
            });

            const data = await response.json();
            
            if (data.success) {
                toast.success('Response sent successfully');
                setShowModal(false);
                setResponseMessage('');
                setSelectedInquiry(null);
                fetchInquiries();
            } else {
                toast.error(data.message || 'Failed to send response');
            }
        } catch (error) {
            console.error('Error sending response:', error);
            toast.error('Failed to send response');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-800';
            case 'In Progress': return 'bg-yellow-100 text-yellow-800';
            case 'Replied': return 'bg-green-100 text-green-800';
            case 'Resolved': return 'bg-gray-100 text-gray-800';
            case 'Closed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Low': return 'bg-gray-100 text-gray-600';
            case 'Medium': return 'bg-blue-100 text-blue-600';
            case 'High': return 'bg-orange-100 text-orange-600';
            case 'Urgent': return 'bg-red-100 text-red-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const filteredInquiries = inquiries.filter(inquiry => {
        if (filters.status !== 'all' && inquiry.status !== filters.status) return false;
        if (filters.priority !== 'all' && inquiry.priority !== filters.priority) return false;
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            return (
                inquiry.guestInfo.name.toLowerCase().includes(searchLower) ||
                inquiry.guestInfo.email.toLowerCase().includes(searchLower) ||
                inquiry.subject.toLowerCase().includes(searchLower) ||
                inquiry.message.toLowerCase().includes(searchLower)
            );
        }
        return true;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Guest Inquiries</h1>
                <p className="text-gray-600">Manage inquiries from visitors without accounts</p>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, subject..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="all">All Status</option>
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Replied">Replied</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                    </select>

                    <select
                        value={filters.priority}
                        onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="all">All Priority</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                    </select>

                    <button
                        onClick={fetchInquiries}
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2"
                    >
                        <FaFilter />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-600 font-medium">New Inquiries</p>
                            <p className="text-2xl font-bold text-blue-700">
                                {inquiries.filter(i => i.status === 'New').length}
                            </p>
                        </div>
                        <FaExclamationCircle className="text-3xl text-blue-500" />
                    </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-yellow-600 font-medium">In Progress</p>
                            <p className="text-2xl font-bold text-yellow-700">
                                {inquiries.filter(i => i.status === 'In Progress').length}
                            </p>
                        </div>
                        <FaClock className="text-3xl text-yellow-500" />
                    </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-600 font-medium">Replied</p>
                            <p className="text-2xl font-bold text-green-700">
                                {inquiries.filter(i => i.status === 'Replied').length}
                            </p>
                        </div>
                        <FaCheckCircle className="text-3xl text-green-500" />
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Total Guest Inquiries</p>
                            <p className="text-2xl font-bold text-gray-700">{inquiries.length}</p>
                        </div>
                        <FaUser className="text-3xl text-gray-500" />
                    </div>
                </div>
            </div>

            {/* Inquiries List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {filteredInquiries.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <FaEnvelope className="mx-auto text-5xl mb-4 text-gray-300" />
                        <p className="text-lg">No guest inquiries found</p>
                        <p className="text-sm mt-2">Guest inquiries will appear here when visitors submit inquiries without logging in</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Info</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredInquiries.map((inquiry) => (
                                    <tr key={inquiry._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <div className="flex items-center text-sm font-medium text-gray-900">
                                                    <FaUser className="mr-2 text-gray-400" />
                                                    {inquiry.guestInfo.name}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                                    <FaEnvelope className="mr-2 text-gray-400" />
                                                    {inquiry.guestInfo.email}
                                                </div>
                                                {inquiry.guestInfo.phone && (
                                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                                        <FaPhone className="mr-2 text-gray-400" />
                                                        {inquiry.guestInfo.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{inquiry.subject}</div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                <FaTag className="inline mr-1" />
                                                {inquiry.inquiryType}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-900">
                                                <FaHome className="mr-2 text-gray-400" />
                                                {inquiry.property?.title || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={inquiry.status}
                                                onChange={(e) => handleStatusUpdate(inquiry._id, e.target.value)}
                                                className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(inquiry.status)}`}
                                            >
                                                <option value="New">New</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Replied">Replied</option>
                                                <option value="Resolved">Resolved</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={inquiry.priority}
                                                onChange={(e) => handlePriorityUpdate(inquiry._id, e.target.value)}
                                                className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(inquiry.priority)}`}
                                            >
                                                <option value="Low">Low</option>
                                                <option value="Medium">Medium</option>
                                                <option value="High">High</option>
                                                <option value="Urgent">Urgent</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(inquiry.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => {
                                                    setSelectedInquiry(inquiry);
                                                    setShowModal(true);
                                                }}
                                                className="text-primary-600 hover:text-primary-900 font-medium"
                                            >
                                                View & Respond
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Response Modal */}
            {showModal && selectedInquiry && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Inquiry Details</h2>
                            
                            <div className="space-y-4 mb-6">
                                <div className="border-b pb-4">
                                    <h3 className="font-semibold text-gray-700 mb-2">Guest Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Name</p>
                                            <p className="text-gray-900">{selectedInquiry.guestInfo.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="text-gray-900">{selectedInquiry.guestInfo.email}</p>
                                        </div>
                                        {selectedInquiry.guestInfo.phone && (
                                            <div>
                                                <p className="text-sm text-gray-500">Phone</p>
                                                <p className="text-gray-900">{selectedInquiry.guestInfo.phone}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm text-gray-500">Preferred Contact</p>
                                            <p className="text-gray-900">{selectedInquiry.preferredContact}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-b pb-4">
                                    <h3 className="font-semibold text-gray-700 mb-2">Inquiry Details</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-sm text-gray-500">Subject</p>
                                            <p className="text-gray-900">{selectedInquiry.subject}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Type</p>
                                            <p className="text-gray-900">{selectedInquiry.inquiryType}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Message</p>
                                            <p className="text-gray-900 whitespace-pre-wrap">{selectedInquiry.message}</p>
                                        </div>
                                        {selectedInquiry.proposedBudget && (
                                            <div>
                                                <p className="text-sm text-gray-500">Proposed Budget</p>
                                                <p className="text-gray-900">
                                                    {selectedInquiry.proposedBudget.currency} {selectedInquiry.proposedBudget.amount?.toLocaleString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {selectedInquiry.responses && selectedInquiry.responses.length > 0 && (
                                    <div className="border-b pb-4">
                                        <h3 className="font-semibold text-gray-700 mb-2">Previous Responses</h3>
                                        <div className="space-y-2">
                                            {selectedInquiry.responses.map((response, index) => (
                                                <div key={index} className="bg-gray-50 p-3 rounded">
                                                    <p className="text-sm text-gray-600">
                                                        {new Date(response.responseDate).toLocaleString()}
                                                    </p>
                                                    <p className="text-gray-900 mt-1">{response.message}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-2">Send Response</h3>
                                    <textarea
                                        value={responseMessage}
                                        onChange={(e) => setResponseMessage(e.target.value)}
                                        placeholder="Type your response here..."
                                        rows="4"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setResponseMessage('');
                                        setSelectedInquiry(null);
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRespond}
                                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                                >
                                    Send Response
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuestInquiries;
