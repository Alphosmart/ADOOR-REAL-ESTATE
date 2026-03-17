import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaEdit, FaToggleOn, FaToggleOff, FaSave, FaTimes, FaCloudUploadAlt } from 'react-icons/fa';
import SummaryApi from '../common';

const FeaturedPropertiesManagement = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.adminFeaturedProperties.url, {
        method: SummaryApi.adminFeaturedProperties.method,
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        setProperties(data.data || []);
      } else {
        toast.error(data.message || 'Failed to fetch properties');
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Error fetching properties');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = async (propertyId) => {
    try {
      const response = await fetch(
        `${SummaryApi.adminTogglePropertyFeatured.url}/${propertyId}/toggle`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        fetchFeaturedProperties();
      } else {
        toast.error(data.message || 'Failed to update featured status');
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast.error('Error updating featured status');
    }
  };

  const handleEditClick = (property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      description: property.description,
      pricing: { ...property.pricing },
      status: property.status,
      isFeatured: property.isFeatured
    });
    setShowEditModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('pricing.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        pricing: {
          ...prev.pricing,
          [field]: field === 'amount' ? parseFloat(value) || 0 : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSaveProperty = async () => {
    try {
      setSubmitting(true);
      const response = await fetch(
        `${SummaryApi.adminUpdateFeaturedProperty.url}/${editingProperty._id}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success('Property updated successfully');
        setShowEditModal(false);
        fetchFeaturedProperties();
      } else {
        toast.error(data.message || 'Failed to update property');
      }
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Error updating property');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProperties = properties.filter(property =>
    property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredCount = properties.filter(p => p.isFeatured).length;

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Featured Properties Management</h1>
        <p className="text-gray-600">Manage properties displayed on the home page</p>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">
            Featured Properties: <strong>{featuredCount}</strong> / <strong>{properties.length}</strong>
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search properties by title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
        />
      </div>

      {/* Properties Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Property</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Featured</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <tr key={property._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-800">{property.title}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{property.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800">
                      ₦{property.pricing?.amount?.toLocaleString() || '0'}
                    </p>
                    <p className="text-sm text-gray-600">{property.pricing?.currency || 'NGN'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      property.status === 'Available'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {property.isFeatured ? (
                      <FaToggleOn className="text-green-600 text-xl mx-auto" />
                    ) : (
                      <FaToggleOff className="text-gray-400 text-xl mx-auto" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => handleEditClick(property)}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                      title="Edit property details"
                    >
                      <FaEdit size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleFeatured(property._id)}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded text-sm font-medium ${
                        property.isFeatured
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                      title={property.isFeatured ? 'Unfeature property' : 'Feature property'}
                    >
                      {property.isFeatured ? 'Unfeature' : 'Feature'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-600">
                  No properties found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingProperty && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Edit Property</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleFormChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
              </div>

              {/* Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Amount
                  </label>
                  <input
                    type="number"
                    name="pricing.amount"
                    value={formData.pricing?.amount || ''}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <input
                    type="text"
                    name="pricing.currency"
                    value={formData.pricing?.currency || ''}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status || ''}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                >
                  <option value="Available">Available</option>
                  <option value="Pending">Pending</option>
                  <option value="Sold">Sold</option>
                  <option value="Rented">Rented</option>
                  <option value="Off Market">Off Market</option>
                </select>
              </div>

              {/* Featured Toggle */}
              <div className="border-t pt-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="w-5 h-5"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Feature this property on home page
                  </span>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t p-6 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProperty}
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                <FaSave size={14} />
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedPropertiesManagement;
