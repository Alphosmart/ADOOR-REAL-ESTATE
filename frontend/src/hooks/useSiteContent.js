import { useState, useEffect } from 'react';
import SummaryApi from '../common';

// Custom hook to fetch and cache site content
const useSiteContent = () => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                setLoading(true);
                
                // Try to get content from public endpoint first
                const response = await fetch(SummaryApi.getSiteContent.url);
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        setContent(data.data);
                    } else {
                        // Fallback to default content
                        setContent(getDefaultContent());
                    }
                } else {
                    // Fallback to default content
                    setContent(getDefaultContent());
                }
            } catch (err) {
                console.warn('Failed to fetch site content, using defaults:', err);
                setContent(getDefaultContent());
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
        
        // Return fetchContent for manual refetch
        return fetchContent;
    }, []);

    const refetch = async () => {
        try {
            setLoading(true);
            
            const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
            const response = await fetch(`${baseUrl}/api/site-content`);
            
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setContent(data.data);
                }
            }
        } catch (err) {
            console.warn('Failed to refetch site content:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return { content, loading, error, refetch };
};

// Default content fallbacks
const getDefaultContent = () => {
    const defaultContent = {
        homePage: {
            hero: {
                title: "Transform Your Space with Premium Properties",
                subtitle: "Discover thousands of premium real estate properties from trusted sellers worldwide. From modern minimalist to classic elegant designs.",
                primaryButtonText: "Shop Now",
                primaryButtonLink: "/products",
                secondaryButtonText: "Learn More",
                secondaryButtonLink: "/about-us"
            }
        },
        aboutUs: {
            hero: {
                title: "About Adoor Real Estate",
                subtitle: "Your premier destination for premium real estate properties and home décor solutions",
                description: "We connect homeowners with the world's finest real estate agents and suppliers, making it easy to transform any space into something extraordinary."
            }
        },
        footer: {
            companyInfo: {
                name: "Adoor Real Estate",
                description: "Your premier destination for premium real estate properties and home décor solutions.",
                address: "123 Design Street, Creative District, NY 10001",
                phone: "+1 (555) 123-4567",
                email: "info@adoorrealestate.com"
            }
        },
        header: {
            announcementBanners: [
                {
                    text: "🚀 Fast shipping available nationwide! Order today",
                    link: "/products",
                    backgroundColor: "#3B82F6",
                    textColor: "#FFFFFF",
                    isActive: false
                }
            ],
            logo: {
                text: "Adoor Real Estate",
                tagline: "Transform Your Space"
            },
            navigation: {
                items: [
                    { label: "Home", path: "/", dropdown: null, isActive: true },
                    { label: "Products", path: "/products", dropdown: null, isActive: true },
                    { label: "Categories", path: "/categories", dropdown: null, isActive: true },
                    { label: "About", path: "/about-us", dropdown: null, isActive: true },
                    { label: "Contact", path: "/contact-us", dropdown: null, isActive: true }
                ]
            },
            searchPlaceholder: "Search for properties, locations, types..."
        },
        errorPage: {
            title: "404",
            heading: "Oops! Page Not Found",
            description: "The page you're looking for doesn't exist or has been moved.",
            quickLinks: [
                { label: "Help Center", path: "/help-center" },
                { label: "Contact Us", path: "/contact-us" },
                { label: "Track Order", path: "/track-order" },
                { label: "Returns", path: "/returns-refunds" }
            ]
        },
        contactUs: {
            title: "Contact Us",
            subtitle: "We're here to help! Get in touch with our team for any questions, support, or feedback.",
            businessInfo: {
                address: "123 E-Commerce Street\nBusiness District\nCity, State 12345",
                phone: "+1 (555) 123-4567",
                email: "support@adoorrealestate.com",
                hours: "Mon-Fri 9am-6pm"
            },
            responseInfo: {
                emailResponse: "24-48 hours",
                phoneHours: "Mon-Fri 9AM-6PM",
                liveChatHours: "Mon-Fri 9AM-6PM"
            }
        },
        siteSettings: {
            siteName: "Adoor Real Estate",
            siteDescription: "Your premier destination for premium real estate properties and home décor solutions",
            supportEmail: "support@adoorrealestate.com",
            maintenanceMode: false
        }
    };

    return defaultContent;
};

export default useSiteContent;
