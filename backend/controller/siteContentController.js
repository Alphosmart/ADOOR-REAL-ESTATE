const express = require('express');
const fs = require('fs').promises;
const path = require('path');

// Site content management controller
const getSiteContent = async (req, res) => {
    try {
        const contentFilePath = path.join(__dirname, '../data/siteContent.json');
        
        // Default content structure
        const defaultContent = {
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
                    address: "123 E-Commerce Street\\nBusiness District\\nCity, State 12345",
                    phone: "+1 (555) 123-4567",
                    email: "support@ashamsmart.com",
                    hours: "Mon-Fri 9am-6pm"
                },
                responseInfo: {
                    emailResponse: "24-48 hours",
                    phoneHours: "Mon-Fri 9AM-6PM",
                    liveChatHours: "Mon-Fri 9AM-6PM"
                }
            },
            homePage: {
                hero: {
                    title: "Find Your Dream Home",
                    subtitle: "Discover our exclusive collection of premium residential and commercial properties. From modern minimalist to classic elegant designs, professionally curated by Adoor Real Estate.",
                    primaryButtonText: "View Properties",
                    primaryButtonLink: "/products",
                    secondaryButtonText: "Learn More",
                    secondaryButtonLink: "/about-us"
                },
                featuredSection: {
                    title: "Featured Property Types",
                    subtitle: "Explore our most sought-after real estate categories",
                    categories: [
                        { name: "Luxury Villas", image: "", description: "Premium properties with exclusive features" },
                        { name: "Modern Apartments", image: "", description: "Contemporary living in prime locations" },
                        { name: "Family Homes", image: "", description: "Perfect spaces for growing families" },
                        { name: "Commercial Spaces", image: "", description: "Investment opportunities for businesses" }
                    ]
                },
                testimonials: {
                    title: "What Our Clients Say",
                    subtitle: "Join thousands of satisfied property investors and homeowners",
                    reviews: [
                        { name: "Sarah Johnson", rating: 5, comment: "Found my dream home with excellent support!", location: "Lagos, Nigeria" },
                        { name: "Mike Chen", rating: 5, comment: "Professional service and quality properties.", location: "Abuja, Nigeria" },
                        { name: "Emma Davis", rating: 5, comment: "Great investment opportunities and transparent process.", location: "Port Harcourt, Nigeria" }
                    ]
                },
                stats: {
                    title: "Trusted by Thousands",
                    items: [
                        { number: "50,000+", label: "Happy Clients" },
                        { number: "10,000+", label: "Properties Sold" },
                        { number: "20+", label: "Years Experience" },
                        { number: "99%", label: "Client Satisfaction" }
                    ]
                }
            },
            aboutUs: {
                hero: {
                    title: "About Adoor Real Estate",
                    subtitle: "Your premier destination for premium real estate properties and comprehensive property services",
                    description: "We are a leading real estate company providing quality properties, professional services, and expert guidance to help you find your perfect space."
                },
                mission: {
                    title: "Our Mission",
                    description: "To provide exceptional real estate services and quality properties that exceed our clients' expectations while maintaining the highest standards of professionalism and integrity.",
                    values: [
                        { title: "Quality First", description: "We maintain the highest quality standards in every property we offer." },
                        { title: "Client Focused", description: "Every decision we make puts our clients' satisfaction and experience first." },
                        { title: "Professional Service", description: "We provide expert guidance and professional service throughout your property journey." },
                        { title: "Trust & Integrity", description: "We build lasting relationships through honest, transparent, and ethical business practices." }
                    ]
                },
                story: {
                    title: "Our Story",
                    content: "Founded in 2020, Adoor Real Estate was built on a vision to provide exceptional real estate services in Nigeria. Starting with a small portfolio of quality properties in Lagos, we've grown into a trusted name in the industry.\n\nToday, we're proud to serve thousands of satisfied clients across Nigeria, offering premium properties, professional services, and expert guidance for all your real estate needs."
                },
                team: {
                    title: "Leadership Team",
                    members: [
                        { name: "Alex Johnson", role: "CEO & Founder", bio: "Real estate expert with 15 years of industry experience." },
                        { name: "Sarah Williams", role: "CTO", bio: "Technology leader passionate about creating seamless user experiences." },
                        { name: "Michael Brown", role: "Head of Operations", bio: "Operations specialist ensuring quality and reliability." }
                    ]
                }
            },
            footer: {
                companyInfo: {
                    name: "Adoor Real Estate",
                    description: "Your premier real estate company offering quality properties and comprehensive property services. Transform your future with our expertly curated property portfolio.",
                    address: "123 Design Street, Creative District, NY 10001",
                    phone: "+1 (555) 123-4567",
                    email: "info@adoorrealestate.com"
                },
                businessHours: {
                    title: "Business Hours",
                    hours: [
                        { days: "Monday - Friday", time: "9:00 AM - 6:00 PM" },
                        { days: "Saturday", time: "10:00 AM - 4:00 PM" },
                        { days: "Sunday", time: "Closed" }
                    ]
                },
                socialMedia: [
                    { platform: "Facebook", url: "https://facebook.com/adoorrealestate", icon: "FaFacebook", color: "#1877F2" },
                    { platform: "Instagram", url: "https://instagram.com/adoorrealestate", icon: "FaInstagram", color: "#E4405F" },
                    { platform: "Twitter", url: "https://twitter.com/adoorrealestate", icon: "FaTwitter", color: "#1DA1F2" },
                    { platform: "Pinterest", url: "https://pinterest.com/adoorrealestate", icon: "FaPinterest", color: "#BD081C" }
                ],
                quickLinks: {
                    shop: [
                        { label: "All Properties", path: "/products" },
                        { label: "Property Types", path: "/categories" },
                        { label: "New Listings", path: "/new-arrivals" },
                        { label: "Featured", path: "/sale" }
                    ],
                    support: [
                        { label: "Help Center", path: "/help-center" },
                        { label: "Contact Us", path: "/contact-us" },
                        { label: "Track Order", path: "/track-order" },
                        { label: "Returns", path: "/returns-refunds" }
                    ],
                    company: [
                        { label: "About Us", path: "/about-us" },
                        { label: "Privacy Policy", path: "/privacy-policy" },
                        { label: "Terms of Service", path: "/terms-of-service" },
                        { label: "Cookie Policy", path: "/cookie-policy" }
                    ]
                },
                paymentMethods: {
                    title: "We Accept",
                    methods: [
                        { name: "Visa", icon: "visa" },
                        { name: "Mastercard", icon: "mastercard" },
                        { name: "American Express", icon: "amex" },
                        { name: "PayPal", icon: "paypal" },
                        { name: "Stripe", icon: "stripe" }
                    ]
                },
                certifications: {
                    title: "Trusted & Secure",
                    items: [
                        { text: "SSL Secured", icon: "shield" },
                        { text: "PCI Compliant", icon: "certificate" },
                        { text: "Money Back Guarantee", icon: "guarantee" },
                        { text: "24/7 Support", icon: "support" }
                    ]
                }
            },
            header: {
                announcementBanners: [
                    {
                        text: "🔥 Limited Time: 25% Off Premium Properties!",
                        link: "/sale",
                        backgroundColor: "#EF4444",
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
                        { 
                            label: "Home", 
                            path: "/", 
                            dropdown: null,
                            isActive: true
                        },
                        { 
                            label: "Properties", 
                            path: "/products",
                            dropdown: {
                                items: [
                                    { label: "All Properties", path: "/products" },
                                    { label: "New Listings", path: "/products?filter=new" },
                                    { label: "Featured", path: "/products?filter=popular" },
                                    { label: "Price Reduced", path: "/products?filter=sale" }
                                ]
                            },
                            isActive: true
                        },
                        { 
                            label: "Property Types", 
                            path: "/categories",
                            dropdown: {
                                items: [
                                    { label: "Houses", path: "/categories/houses" },
                                    { label: "Apartments", path: "/categories/apartments" },
                                    { label: "Villas", path: "/categories/villas" },
                                    { label: "Commercial", path: "/categories/commercial" }
                                ]
                            },
                            isActive: true
                        },
                        { 
                            label: "About", 
                            path: "/about-us", 
                            dropdown: null,
                            isActive: true
                        },
                        { 
                            label: "Contact", 
                            path: "/contact-us", 
                            dropdown: null,
                            isActive: true
                        }
                    ]
                },
                searchPlaceholder: "Search for properties, locations, types..."
            },
            siteSettings: {
                siteName: "Adoor Real Estate",
                siteDescription: "Your premier real estate company for quality properties, professional services, and expert property guidance",
                supportEmail: "support@adoorrealestate.com",
                maintenanceMode: false,
                lastUpdated: new Date().toISOString()
            }
        };

        try {
            // Try to read existing content file
            const data = await fs.readFile(contentFilePath, 'utf8');
            const content = JSON.parse(data);
            
            res.json({
                success: true,
                message: "Site content retrieved successfully",
                data: content
            });
        } catch (error) {
            // If file doesn't exist, return default content
            res.json({
                success: true,
                message: "Default site content returned",
                data: defaultContent
            });
        }
    } catch (error) {
        console.error('Error getting site content:', error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve site content",
            error: error.message
        });
    }
};

const updateSiteContent = async (req, res) => {
    try {
        const { section, data } = req.body;
        
        if (!section || !data) {
            return res.status(400).json({
                success: false,
                message: "Section and data are required"
            });
        }

        const contentFilePath = path.join(__dirname, '../data/siteContent.json');
        const dataDir = path.dirname(contentFilePath);
        
        // Ensure data directory exists
        try {
            await fs.access(dataDir);
        } catch {
            await fs.mkdir(dataDir, { recursive: true });
        }

        let currentContent = {};
        
        // Try to read existing content
        try {
            const existingData = await fs.readFile(contentFilePath, 'utf8');
            currentContent = JSON.parse(existingData);
        } catch (error) {
            // File doesn't exist, start with empty object
            console.log('Creating new site content file');
        }

        // Update the specific section
        currentContent[section] = {
            ...data,
            lastUpdated: new Date().toISOString()
        };

        // Special handling for siteSettings section - also update database
        if (section === 'siteSettings' && data.maintenanceMode !== undefined) {
            try {
                const settingsModel = require('../models/settingsModel');
                
                console.log('🔧 Updating database maintenance mode:', {
                    maintenanceMode: data.maintenanceMode,
                    systemId: 'main_settings'
                });
                
                // Find or create settings document
                let settings = await settingsModel.findOne({ systemId: 'main_settings' });
                
                if (!settings) {
                    // Create new settings document if it doesn't exist
                    console.log('Creating new settings document...');
                    settings = new settingsModel({
                        systemId: 'main_settings',
                        general: {
                            siteName: data.siteName || 'AshAmSmart',
                            siteDescription: data.siteDescription || 'Your trusted e-commerce marketplace for quality products',
                            maintenanceMode: data.maintenanceMode
                        }
                    });
                } else {
                    // Update existing settings
                    console.log('Updating existing settings document...');
                    settings.general = settings.general || {};
                    settings.general.maintenanceMode = data.maintenanceMode;
                    if (data.siteName) settings.general.siteName = data.siteName;
                    if (data.siteDescription) settings.general.siteDescription = data.siteDescription;
                }
                
                await settings.save();
                console.log('✅ Database settings updated successfully:', {
                    systemId: 'main_settings',
                    maintenanceMode: data.maintenanceMode,
                    documentId: settings._id
                });
                
            } catch (dbError) {
                console.error('❌ Error updating database settings:', dbError);
                // Continue with file update even if database update fails
            }
        }

        // Write updated content back to file
        await fs.writeFile(contentFilePath, JSON.stringify(currentContent, null, 2), 'utf8');

        res.json({
            success: true,
            message: `${section} content updated successfully`,
            data: currentContent[section]
        });

    } catch (error) {
        console.error('Error updating site content:', error);
        res.status(500).json({
            success: false,
            message: "Failed to update site content",
            error: error.message
        });
    }
};

const getAllSiteContent = async (req, res) => {
    try {
        const contentFilePath = path.join(__dirname, '../data/siteContent.json');
        
        try {
            const data = await fs.readFile(contentFilePath, 'utf8');
            const content = JSON.parse(data);
            
            res.json({
                success: true,
                message: "All site content retrieved successfully",
                data: content
            });
        } catch (error) {
            // Return empty object if file doesn't exist
            res.json({
                success: true,
                message: "No site content found",
                data: {}
            });
        }
    } catch (error) {
        console.error('Error getting all site content:', error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve site content",
            error: error.message
        });
    }
};

const resetSiteContent = async (req, res) => {
    try {
        const contentFilePath = path.join(__dirname, '../data/siteContent.json');
        
        // Delete the content file to reset to defaults
        try {
            await fs.unlink(contentFilePath);
        } catch (error) {
            // File might not exist, that's okay
        }

        res.json({
            success: true,
            message: "Site content reset to defaults successfully"
        });

    } catch (error) {
        console.error('Error resetting site content:', error);
        res.status(500).json({
            success: false,
            message: "Failed to reset site content",
            error: error.message
        });
    }
};

module.exports = {
    getSiteContent,
    updateSiteContent,
    getAllSiteContent,
    resetSiteContent
};
