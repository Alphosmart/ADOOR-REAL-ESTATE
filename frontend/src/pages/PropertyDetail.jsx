import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaCar, 
    FaHeart, FaShare, FaPhone, FaEnvelope, FaCalendar, FaWhatsapp 
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const PropertyDetail = () => {
    const { propertyId } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [showInquiryForm, setShowInquiryForm] = useState(false);
    const [showAppointmentForm, setShowAppointmentForm] = useState(false);

    useEffect(() => {
        fetchPropertyDetails();
    }, [propertyId]);

    const fetchPropertyDetails = async () => {
        try {
            const response = await fetch(`/api/properties/${propertyId}`);
            const data = await response.json();
            
            if (data.success) {
                setProperty(data.data);
            } else {
                toast.error('Property not found');
                navigate('/properties');
            }
        } catch (error) {
            console.error('Error fetching property:', error);
            toast.error('Failed to load property');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (amount, currency = 'NGN', rentPeriod = null) => {
        const formatted = new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0
        }).format(amount);

        return rentPeriod ? `${formatted}/${rentPeriod}` : formatted;
    };

    const handleInquiry = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        try {
            const response = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    property: propertyId,
                    subject: formData.get('subject'),
                    message: formData.get('message'),
                    guestInfo: {
                        name: formData.get('name'),
                        email: formData.get('email'),
                        phone: formData.get('phone')
                    }
                })
            });

            const data = await response.json();
            
            if (data.success) {
                toast.success('Inquiry sent successfully!');
                setShowInquiryForm(false);
                e.target.reset();
            } else {
                toast.error(data.message || 'Failed to send inquiry');
            }
        } catch (error) {
            console.error('Error sending inquiry:', error);
            toast.error('Failed to send inquiry');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600"></div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-center text-gray-600">Property not found</p>
            </div>
        );
    }

    const images = property.images?.length > 0 
        ? property.images 
        : property.productImage?.map((url, i) => ({ url, isPrimary: i === 0 })) || [];

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="mb-4 text-sm text-gray-600">
                <span className="cursor-pointer hover:text-accent-600" onClick={() => navigate('/')}>Home</span>
                {' / '}
                <span className="cursor-pointer hover:text-accent-600" onClick={() => navigate('/properties')}>Properties</span>
                {' / '}
                <span>{property.title}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Images and Details */}
                <div className="lg:col-span-2">
                    {/* Image Gallery */}
                    <div className="mb-6">
                        <div className="relative h-96 mb-4 rounded-lg overflow-hidden">
                            <img 
                                src={images[activeImage]?.url || '/placeholder-property.jpg'} 
                                alt={property.title}
                                className="w-full h-full object-cover"
                            />
                            
                            {/* Status Badge */}
                            <div className="absolute top-4 left-4">
                                <span className={`px-4 py-2 rounded-lg font-semibold ${
                                    property.status === 'Available' ? 'bg-green-500 text-white' :
                                    property.status === 'Pending' ? 'bg-yellow-500 text-white' :
                                    'bg-gray-500 text-white'
                                }`}>
                                    {property.status}
                                </span>
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {images.slice(0, 4).map((img, index) => (
                                    <img
                                        key={index}
                                        src={img.url}
                                        alt={`Property ${index + 1}`}
                                        onClick={() => setActiveImage(index)}
                                        className={`h-24 object-cover rounded cursor-pointer ${
                                            activeImage === index ? 'border-4 border-accent-600' : 'border border-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Title and Price */}
                    <div className="mb-6">
                        <div className="flex justify-between items-start mb-2">
                            <h1 className="text-3xl font-bold text-gray-800">{property.title}</h1>
                            <div className="flex space-x-2">
                                <button className="p-2 border rounded-lg hover:bg-gray-100">
                                    <FaHeart className="text-red-500" size={20} />
                                </button>
                                <button className="p-2 border rounded-lg hover:bg-gray-100">
                                    <FaShare className="text-accent-500" size={20} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex items-center text-gray-600 mb-4">
                            <FaMapMarkerAlt className="mr-2 text-red-500" />
                            <span>{property.location?.address}, {property.location?.city}, {property.location?.state}</span>
                        </div>

                        <div className="text-3xl font-bold text-accent-600">
                            {formatPrice(
                                property.pricing?.amount || 0,
                                property.pricing?.currency || 'NGN',
                                property.pricing?.rentPeriod
                            )}
                        </div>
                    </div>

                    {/* Key Features */}
                    <div className="grid grid-cols-4 gap-4 mb-6 bg-gray-50 p-6 rounded-lg">
                        {property.specifications?.bedrooms > 0 && (
                            <div className="text-center">
                                <FaBed className="mx-auto mb-2 text-gray-600" size={24} />
                                <p className="text-lg font-semibold">{property.specifications.bedrooms}</p>
                                <p className="text-sm text-gray-600">Bedrooms</p>
                            </div>
                        )}
                        
                        {property.specifications?.bathrooms > 0 && (
                            <div className="text-center">
                                <FaBath className="mx-auto mb-2 text-gray-600" size={24} />
                                <p className="text-lg font-semibold">{property.specifications.bathrooms}</p>
                                <p className="text-sm text-gray-600">Bathrooms</p>
                            </div>
                        )}
                        
                        {property.specifications?.area?.size && (
                            <div className="text-center">
                                <FaRulerCombined className="mx-auto mb-2 text-gray-600" size={24} />
                                <p className="text-lg font-semibold">
                                    {property.specifications.area.size} {property.specifications.area.unit}
                                </p>
                                <p className="text-sm text-gray-600">Area</p>
                            </div>
                        )}
                        
                        {property.specifications?.parkingSpaces > 0 && (
                            <div className="text-center">
                                <FaCar className="mx-auto mb-2 text-gray-600" size={24} />
                                <p className="text-lg font-semibold">{property.specifications.parkingSpaces}</p>
                                <p className="text-sm text-gray-600">Parking</p>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-4">Description</h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {property.description}
                        </p>
                    </div>

                    {/* Amenities */}
                    {property.amenities?.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {property.amenities.map((amenity, index) => (
                                    <div key={index} className="flex items-center">
                                        <span className="w-2 h-2 bg-accent-600 rounded-full mr-2"></span>
                                        <span className="text-gray-700">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Contact and Actions */}
                <div className="lg:col-span-1">
                    <div className="sticky top-4">
                        {/* Contact Admin */}
                        <div className="bg-white border rounded-lg p-6 mb-4 shadow-md">
                            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                            
                            <button 
                                onClick={() => {
                                    const propertyUrl = window.location.href;
                                    const propertyTitle = property.name || property.productName;
                                    const propertyPrice = property.pricing?.sellingPrice?.amount || property.sellingPrice || property.price;
                                    const propertyLocation = property.location?.city ? `${property.location.city}, ${property.location.state}` : (property.location?.address || '');
                                    
                                    const message = `Hi! I'm interested in this property:\n\n*${propertyTitle}*\nPrice: ₦${propertyPrice?.toLocaleString()}\nLocation: ${propertyLocation}\n\nProperty Link: ${propertyUrl}`;
                                    
                                    const whatsappNumber = '+2348012345678'; // Replace with your actual WhatsApp number
                                    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
                                    
                                    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                                }}
                                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 mb-2 flex items-center justify-center"
                            >
                                <FaWhatsapp className="mr-2 text-2xl" />
                                Chat on WhatsApp
                            </button>

                            <button 
                                onClick={() => setShowInquiryForm(!showInquiryForm)}
                                className="w-full bg-accent-600 text-white py-3 rounded-lg hover:bg-accent-700 mb-2 flex items-center justify-center"
                            >
                                <FaEnvelope className="mr-2" />
                                Send Message
                            </button>

                            <button 
                                onClick={() => setShowAppointmentForm(!showAppointmentForm)}
                                className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 flex items-center justify-center"
                            >
                                <FaCalendar className="mr-2" />
                                Schedule Viewing
                            </button>
                        </div>

                        {/* Inquiry Form */}
                        {showInquiryForm && (
                            <div className="bg-white border rounded-lg p-6 shadow-md">
                                <h3 className="text-xl font-bold mb-4">Send Inquiry</h3>
                                <form onSubmit={handleInquiry}>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Your Name"
                                        required
                                        className="w-full px-4 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Your Email"
                                        required
                                        className="w-full px-4 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Your Phone"
                                        className="w-full px-4 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        name="subject"
                                        placeholder="Subject"
                                        required
                                        className="w-full px-4 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <textarea
                                        name="message"
                                        placeholder="Your Message"
                                        rows="4"
                                        required
                                        className="w-full px-4 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    ></textarea>
                                    <button
                                        type="submit"
                                        className="w-full bg-accent-600 text-white py-2 rounded-lg hover:bg-accent-700"
                                    >
                                        Submit Inquiry
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetail;
