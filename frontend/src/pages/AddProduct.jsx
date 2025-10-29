import React, { useState, useEffect } from 'react';
import { IoCloudUpload } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import imageTobase64 from '../helper/imageTobase64';

const AddProduct = () => {
    const user = useSelector(state => state?.user?.user);
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [states, setStates] = useState([]);
    const [lgas, setLgas] = useState([]);

    const [data, setData] = useState({
        // Property Details
        productName: "",
        listingType: "For Sale",
        price: "",
        sellingPrice: "",
        currency: "NGN",
        category: "",
        description: "",
        
        // Location
        country: "Nigeria",
        address: "",
        city: "",
        state: "",
        lga: "",
        latitude: "",
        longitude: "",
        
        // Residential Fields
        bedrooms: "",
        bathrooms: "",
        toilets: "",
        parking: "",
        furnishing: "Unfurnished",
        condition: "Newly Built",
        size: "",
        amenities: [],
        
        // Land Fields
        landSize: "",
        landType: "Residential",
        topography: "Flat",
        fencing: false,
        accessibility: "",
        documents: [],
        
        // Commercial Fields
        propertyType: "Office",
        totalArea: "",
        floors: "",
        facilities: [],
        
        // Short Let Fields
        pricePerNight: "",
        pricePerWeek: "",
        checkInTime: "",
        checkOutTime: "",
        
        // Agricultural Fields
        soilType: "Loamy",
        waterSource: "",
        
        // Images
        productImage: [],
        
        // Agent Information
        agentName: "",
        agentPhone: "",
        agentEmail: "",
        agency: "",
        
        // Metadata
        status: "Active",
        slug: "",
        tags: ""
    });

    const [uploadProductImageInput, setUploadProductImageInput] = useState("");

    // Location loading functions
    const loadStatesForCountry = (country) => {
        const countryData = locationData[country];
        if (countryData) {
            const statesList = Object.keys(countryData.states || countryData.regions || countryData.provinces || {});
            setStates(statesList);
            // Reset state and LGA when country changes
            setData(prev => ({ ...prev, state: "", lga: "" }));
            setLgas([]);
        }
    };

    const loadLGAsForState = (country, state) => {
        const countryData = locationData[country];
        if (countryData) {
            const stateData = countryData.states || countryData.regions || countryData.provinces || {};
            const lgasList = stateData[state] || [];
            setLgas(lgasList);
            // Reset LGA when state changes
            setData(prev => ({ ...prev, lga: "" }));
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(SummaryApi.adminCategories.url, {
                method: SummaryApi.adminCategories.method,
                credentials: 'include'
            });
            const result = await response.json();
            
            if (result.success && result.categories) {
                setCategories(result.categories);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Fallback to empty array
            setCategories([]);
        }
    };

    // Fetch categories from Category Management API
    useEffect(() => {
        fetchCategories();
        // Load states/regions when country changes
        if (data.country) {
            loadStatesForCountry(data.country);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.country]);

    // Load LGAs when state changes
    useEffect(() => {
        if (data.state && data.country) {
            loadLGAsForState(data.country, data.state);
        } else {
            setLgas([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.state, data.country]);
    const locationData = {
        Nigeria: {
            states: {
                "Lagos": ["Alimosho", "Ajeromi-Ifelodun", "Kosofe", "Mushin", "Oshodi-Isolo", "Ojo", "Ikorodu", "Surulere", "Agege", "Ifako-Ijaiye", "Shomolu", "Amuwo-Odofin", "Lagos Mainland", "Ikeja", "Eti-Osa", "Badagry", "Apapa", "Lagos Island", "Epe", "Ibeju-Lekki"],
                "Abuja FCT": ["AMAC", "Bwari", "Gwagwalada", "Kuje", "Abaji", "Kwali"],
                "Kano": ["Kano Municipal", "Fagge", "Dala", "Gwale", "Tarauni", "Nassarawa", "Ungogo", "Kumbotso"],
                "Rivers": ["Port Harcourt", "Obio-Akpor", "Okrika", "Ogu–Bolo", "Eleme", "Tai", "Gokana", "Khana", "Oyigbo", "Emohua"],
                "Oyo": ["Ibadan North", "Ibadan North-East", "Ibadan North-West", "Ibadan South-East", "Ibadan South-West", "Akinyele", "Lagelu", "Ona Ara", "Egbeda", "Oluyole"],
                "Kaduna": ["Kaduna North", "Kaduna South", "Chikun", "Igabi", "Ikara", "Zaria", "Sabon Gari", "Soba"],
                "Ogun": ["Abeokuta South", "Abeokuta North", "Ado-Odo/Ota", "Ewekoro", "Ifo", "Ijebu East", "Ijebu North", "Ijebu North East", "Ijebu Ode", "Ikenne"],
                "Anambra": ["Awka North", "Awka South", "Onitsha North", "Onitsha South", "Nnewi North", "Nnewi South", "Aguata", "Anambra East", "Anambra West", "Anaocha"],
                "Enugu": ["Enugu East", "Enugu North", "Enugu South", "Nsukka", "Udenu", "Udi", "Nkanu East", "Nkanu West", "Ezeagu", "Igbo Etiti"],
                "Delta": ["Warri South", "Warri North", "Warri South-West", "Uvwie", "Udu", "Ughelli North", "Ughelli South", "Sapele", "Okpe", "Ethiope East"]
            }
        },
        "United States": {
            states: {
                "California": ["Los Angeles County", "San Diego County", "Orange County", "Riverside County", "San Bernardino County", "Santa Clara County", "Alameda County", "Sacramento County", "Contra Costa County", "Fresno County"],
                "Texas": ["Harris County", "Dallas County", "Tarrant County", "Bexar County", "Travis County", "Collin County", "Denton County", "El Paso County", "Fort Bend County", "Hidalgo County"],
                "New York": ["New York County", "Kings County", "Queens County", "Bronx County", "Richmond County", "Nassau County", "Suffolk County", "Westchester County", "Erie County", "Monroe County"],
                "Florida": ["Miami-Dade County", "Broward County", "Palm Beach County", "Hillsborough County", "Orange County", "Pinellas County", "Duval County", "Lee County", "Polk County", "Brevard County"],
                "Illinois": ["Cook County", "DuPage County", "Lake County", "Will County", "Kane County", "McHenry County", "Winnebago County", "Madison County", "St. Clair County", "Champaign County"]
            }
        },
        "United Kingdom": {
            regions: {
                "England": ["Greater London", "West Midlands", "Greater Manchester", "West Yorkshire", "South Yorkshire", "Tyne and Wear", "Merseyside", "Essex", "Kent", "Hampshire"],
                "Scotland": ["Glasgow City", "City of Edinburgh", "Fife", "North Lanarkshire", "South Lanarkshire", "Aberdeenshire", "Highland", "West Lothian", "Renfrewshire", "Falkirk"],
                "Wales": ["Cardiff", "Swansea", "Rhondda Cynon Taf", "Carmarthenshire", "Caerphilly", "Neath Port Talbot", "Bridgend", "Flintshire", "Newport", "Wrexham"],
                "Northern Ireland": ["Belfast", "Armagh, Banbridge and Craigavon", "Derry and Strabane", "Newry, Mourne and Down", "Lisburn and Castlereagh", "Mid Ulster", "Ards and North Down", "Mid and East Antrim", "Causeway Coast and Glens", "Antrim and Newtownabbey"]
            }
        },
        "Canada": {
            provinces: {
                "Ontario": ["Toronto", "Ottawa", "Mississauga", "Brampton", "Hamilton", "London", "Markham", "Vaughan", "Kitchener", "Windsor"],
                "Quebec": ["Montreal", "Quebec City", "Laval", "Gatineau", "Longueuil", "Sherbrooke", "Saguenay", "Levis", "Three Rivers", "Terrebonne"],
                "British Columbia": ["Vancouver", "Surrey", "Burnaby", "Richmond", "Abbotsford", "Coquitlam", "Kelowna", "Saanich", "Delta", "Langley"],
                "Alberta": ["Calgary", "Edmonton", "Red Deer", "Lethbridge", "St. Albert", "Medicine Hat", "Grande Prairie", "Airdrie", "Spruce Grove", "Okotoks"],
                "Manitoba": ["Winnipeg", "Brandon", "Steinbach", "Thompson", "Portage la Prairie", "Winkler", "Selkirk", "Morden", "Dauphin", "The Pas"]
            }
        },
        "South Africa": {
            provinces: {
                "Gauteng": ["City of Johannesburg", "City of Tshwane", "Ekurhuleni", "Sedibeng", "West Rand"],
                "Western Cape": ["City of Cape Town", "Cape Winelands", "Overberg", "Garden Route", "Central Karoo", "West Coast"],
                "KwaZulu-Natal": ["eThekwini", "uMgungundlovu", "iLembe", "Ugu", "uMzinyathi", "Amajuba"],
                "Eastern Cape": ["Nelson Mandela Bay", "Buffalo City", "OR Tambo", "Amathole", "Chris Hani", "Alfred Nzo"],
                "Limpopo": ["Capricorn", "Mopani", "Vhembe", "Waterberg", "Sekhukhune"]
            }
        }
    };

    // Fetch categories from Category Management API
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Category type helpers
    const getPropertyCategoryType = (category) => {
        const residential = ['houses', 'apartments', 'villas', 'condos', 'townhouses', 'duplexes', 'penthouses', 'studios', 'bungalow', 'mansion'];
        const land = ['land'];
        const commercial = ['commercial'];
        const shortLet = ['short-let', 'shortlet'];
        const agricultural = ['agricultural', 'farm'];
        
        const lowerCategory = category.toLowerCase();
        
        if (residential.some(type => lowerCategory.includes(type))) return 'residential';
        if (land.some(type => lowerCategory.includes(type))) return 'land';
        if (commercial.some(type => lowerCategory.includes(type))) return 'commercial';
        if (shortLet.some(type => lowerCategory.includes(type))) return 'shortlet';
        if (agricultural.some(type => lowerCategory.includes(type))) return 'agricultural';
        
        return 'residential'; // default
    };

    const categoryType = getPropertyCategoryType(data.category);

    // Handle array inputs (amenities, facilities, documents)
    const handleArrayInput = (fieldName, value) => {
        const array = value.split(',').map(item => item.trim()).filter(item => item !== '');
        setData(prev => ({
            ...prev,
            [fieldName]: array
        }));
    };

    const handleUploadProduct = async (e) => {
        const file = e.target.files[0];
        
        if (file) {
            // Check file size (max 5MB per file)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size too large. Please upload images smaller than 5MB.");
                return;
            }
            
            // Check total number of images
            if (data.productImage.length >= 5) {
                toast.error("You can upload maximum 5 images per product.");
                return;
            }
            
            try {
                const uploadImageCloudinary = await imageTobase64(file);
                
                setData(prev => ({
                    ...prev,
                    productImage: [...prev.productImage, uploadImageCloudinary]
                }));
                
                toast.success("Image uploaded successfully!");
            } catch (error) {
                toast.error("Failed to process image. Please try again.");
                console.error("Image processing error:", error);
            }
        }
    };

    const handleDeleteProductImage = (index) => {
        const newProductImage = [...data.productImage];
        newProductImage.splice(index, 1);
        
        setData(prev => ({
            ...prev,
            productImage: newProductImage
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user?._id) {
            toast.error("Please login to add a product");
            navigate('/login');
            return;
        }

        // Check if user is admin (only admins can add properties in single company model)
        if (user.role !== 'ADMIN') {
            toast.error("Only administrators can add properties");
            navigate('/admin-panel');
            return;
        }

        if (!data.productName || !data.category || !data.price || !data.sellingPrice) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (data.productImage.length === 0) {
            toast.error("Please upload at least one product image");
            return;
        }

        try {
            const response = await fetch(SummaryApi.addProduct.url, {
                method: SummaryApi.addProduct.method,
                credentials: 'include',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();

            if (responseData.success) {
                toast.success(responseData.message);
                setData({
                    productName: "",
                    brandName: "",
                    category: "",
                    productImage: [],
                    description: "",
                    price: "",
                    sellingPrice: "",
                    stock: "",
                    condition: "new",
                    location: "",
                    tags: "",
                    currency: "NGN"
                });
                // Navigate based on user role
                if (user.role === 'ADMIN') {
                    navigate('/admin-panel/all-products');
                } else {
                    navigate('/my-products');
                }
            } else {
                toast.error(responseData.message);
            }
        } catch (error) {
            console.error("Error adding product:", error);
            if (error.message.includes("fetch")) {
                toast.error("Network error. Please check your connection and try again.");
            } else if (error.message.includes("too large")) {
                toast.error("Images are too large. Please compress your images and try again.");
            } else {
                toast.error(error.message || "Failed to add property. Please try again.");
            }
        }
    };

    return (
        <div className='p-4'>
            <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden mx-auto'>
                
                <div className='flex justify-between items-center pb-4'>
                    <h2 className='font-bold text-lg'>Add New Property</h2>
                    <button 
                        className='w-fit ml-auto block py-1 px-3 rounded-full hover:bg-red-600 text-red-600 hover:text-white'
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>
                </div>

                <form className='grid p-4 gap-2 overflow-y-scroll h-full pb-5' onSubmit={handleSubmit}>
                    
                    {/* 🏡 Property Details Section */}
                    <h3 className='font-bold text-md mt-4 mb-2 text-blue-600'>🏡 Property Details</h3>
                    
                    <label htmlFor='productName'>Property Title <span className='text-red-600'>*</span>:</label>
                    <input 
                        type='text' 
                        id='productName' 
                        placeholder='e.g., 3-Bedroom Duplex in Gwarinpa' 
                        name='productName' 
                        value={data.productName} 
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />

                    <label htmlFor='listingType' className='mt-3'>Listing Type <span className='text-red-600'>*</span>:</label>
                    <select 
                        required 
                        value={data.listingType} 
                        name='listingType' 
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                    >
                        <option value="For Sale">For Sale</option>
                        <option value="For Rent">For Rent</option>
                        <option value="For Lease">For Lease</option>
                        <option value="Shortlet">Shortlet</option>
                    </select>

                    <label htmlFor='currency' className='mt-3'>Currency <span className='text-red-600'>*</span>:</label>
                    <select 
                        required 
                        value={data.currency} 
                        name='currency' 
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                    >
                        <option value="NGN">₦ Nigerian Naira (NGN)</option>
                        <option value="USD">$ US Dollar (USD)</option>
                        <option value="EUR">€ Euro (EUR)</option>
                        <option value="GBP">£ British Pound (GBP)</option>
                    </select>

                    <label htmlFor='price' className='mt-3'>Price <span className='text-red-600'>*</span>:</label>
                    <input 
                        type='number' 
                        id='price' 
                        placeholder='e.g., 45000000'
                        value={data.price} 
                        name='price' 
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />

                    <label htmlFor='category' className='mt-3'>Property Category <span className='text-red-600'>*</span>:</label>
                    <select 
                        required 
                        value={data.category} 
                        name='category' 
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                    >
                        <option value="">Select Category</option>
                        {categories.map((category, index) => (
                            <option value={category.name} key={category._id || index}>
                                {category.displayName || category.name}
                            </option>
                        ))}
                    </select>

                    <label htmlFor='description' className='mt-3'>Description <span className='text-red-600'>*</span>:</label>
                    <textarea 
                        className='h-28 bg-slate-100 border resize-none p-2 rounded' 
                        placeholder='Spacious 3-bedroom duplex with fitted kitchen and 24-hour security...'
                        rows={3} 
                        onChange={handleOnChange} 
                        name='description'
                        value={data.description}
                        required
                    >
                    </textarea>

                    {/* 📍 Location Section */}
                    <h3 className='font-bold text-md mt-4 mb-2 text-blue-600'>📍 Location</h3>
                    
                    <label htmlFor='country'>Country <span className='text-red-600'>*</span>:</label>
                    <select
                        id='country'
                        name='country'
                        value={data.country}
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    >
                        <option value="">Select Country</option>
                        {Object.keys(locationData).map(country => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                    </select>

                    <label htmlFor='address' className='mt-3'>Address <span className='text-red-600'>*</span>:</label>
                    <input 
                        type='text' 
                        id='address' 
                        placeholder='Plot 12, Gwarinpa Estate' 
                        value={data.address} 
                        name='address' 
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />

                    <label htmlFor='city' className='mt-3'>City <span className='text-red-600'>*</span>:</label>
                    <input 
                        type='text' 
                        id='city' 
                        placeholder='Abuja' 
                        value={data.city} 
                        name='city' 
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />

                    <label htmlFor='state' className='mt-3'>State/Region <span className='text-red-600'>*</span>:</label>
                    <select
                        id='state'
                        name='state'
                        value={data.state}
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                        disabled={!data.country || states.length === 0}
                    >
                        <option value="">Select State/Region</option>
                        {states.map(state => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>

                    <label htmlFor='lga' className='mt-3'>LGA/County:</label>
                    <select
                        id='lga'
                        name='lga'
                        value={data.lga}
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        disabled={!data.state || lgas.length === 0}
                    >
                        <option value="">Select LGA/County</option>
                        {lgas.map(lga => (
                            <option key={lga} value={lga}>{lga}</option>
                        ))}
                    </select>

                    <div className='grid grid-cols-2 gap-2 mt-3'>
                        <div>
                            <label htmlFor='latitude'>Latitude:</label>
                            <input 
                                type='text' 
                                id='latitude' 
                                placeholder='9.083' 
                                value={data.latitude} 
                                name='latitude' 
                                onChange={handleOnChange}
                                className='p-2 bg-slate-100 border rounded w-full'
                            />
                        </div>
                        <div>
                            <label htmlFor='longitude'>Longitude:</label>
                            <input 
                                type='text' 
                                id='longitude' 
                                placeholder='7.483' 
                                value={data.longitude} 
                                name='longitude' 
                                onChange={handleOnChange}
                                className='p-2 bg-slate-100 border rounded w-full'
                            />
                        </div>
                    </div>

                    {/* 🏠 Property-Specific Features Section */}
                    <h3 className='font-bold text-md mt-4 mb-2 text-blue-600'>🏠 Property Features</h3>
                    
                    {/* RESIDENTIAL FIELDS */}
                    {categoryType === 'residential' && (
                        <>
                            <div className='grid grid-cols-3 gap-2'>
                                <div>
                                    <label htmlFor='bedrooms'>Bedrooms <span className='text-red-600'>*</span>:</label>
                                    <input 
                                        type='number' 
                                        id='bedrooms' 
                                        placeholder='3' 
                                        value={data.bedrooms} 
                                        name='bedrooms' 
                                        onChange={handleOnChange}
                                        className='p-2 bg-slate-100 border rounded w-full'
                                        required
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label htmlFor='bathrooms'>Bathrooms <span className='text-red-600'>*</span>:</label>
                                    <input 
                                        type='number' 
                                        id='bathrooms' 
                                        placeholder='4' 
                                        value={data.bathrooms} 
                                        name='bathrooms' 
                                        onChange={handleOnChange}
                                        className='p-2 bg-slate-100 border rounded w-full'
                                        required
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label htmlFor='toilets'>Toilets:</label>
                                    <input 
                                        type='number' 
                                        id='toilets' 
                                        placeholder='4' 
                                        value={data.toilets} 
                                        name='toilets' 
                                        onChange={handleOnChange}
                                        className='p-2 bg-slate-100 border rounded w-full'
                                        min="0"
                                    />
                                </div>
                            </div>

                            <label htmlFor='parking' className='mt-3'>Parking Spaces:</label>
                            <input 
                                type='number' 
                                id='parking' 
                                placeholder='3' 
                                value={data.parking} 
                                name='parking' 
                                onChange={handleOnChange}
                                className='p-2 bg-slate-100 border rounded'
                                min="0"
                            />

                            <label htmlFor='furnishing' className='mt-3'>Furnishing <span className='text-red-600'>*</span>:</label>
                            <select 
                                value={data.furnishing} 
                                name='furnishing' 
                                onChange={handleOnChange}
                                className='p-2 bg-slate-100 border rounded'
                                required
                            >
                                <option value="Unfurnished">Unfurnished</option>
                                <option value="Partly Furnished">Partly Furnished</option>
                                <option value="Furnished">Furnished</option>
                            </select>

                            <label htmlFor='condition' className='mt-3'>Condition <span className='text-red-600'>*</span>:</label>
                            <select 
                                value={data.condition} 
                                name='condition' 
                                onChange={handleOnChange}
                                className='p-2 bg-slate-100 border rounded'
                                required
                            >
                                <option value="Newly Built">Newly Built</option>
                                <option value="Renovated">Renovated</option>
                                <option value="Old">Old</option>
                            </select>

                            <label htmlFor='size' className='mt-3'>Size (sqm) <span className='text-red-600'>*</span>:</label>
                            <input 
                                type='text' 
                                id='size' 
                                placeholder='500 sqm' 
                                value={data.size} 
                                name='size' 
                                onChange={handleOnChange}
                                className='p-2 bg-slate-100 border rounded'
                                required
                            />

                            <label htmlFor='amenities' className='mt-3'>Amenities (comma-separated):</label>
                            <input 
                                type='text' 
                                id='amenities' 
                                placeholder='Swimming Pool, Security, Water Heater, CCTV, POP Ceiling' 
                                value={data.amenities.join(', ')} 
                                onChange={(e) => handleArrayInput('amenities', e.target.value)}
                                className='p-2 bg-slate-100 border rounded'
                            />
                        </>
                    )}

                    {/* LAND FIELDS */}
                    {categoryType === 'land' && (
                        <>
                            <label htmlFor='landSize'>Land Size <span className='text-red-600'>*</span>:</label>
                            <input 
                                type='text' 
                                id='landSize' 
                                placeholder='1000 sqm or 1 hectare' 
                                value={data.landSize} 
                                name='landSize' 
                                onChange={handleOnChange}
                                className='p-2 bg-slate-100 border rounded'
                                required
                            />

                            <label htmlFor='landType' className='mt-3'>Land Type <span className='text-red-600'>*</span>:</label>
                            <select 
                                value={data.landType} 
                                name='landType' 
                                onChange={handleOnChange}
                                className='p-2 bg-slate-100 border rounded'
                                required
                            >
                                <option value="Residential">Residential</option>
                                <option value="Commercial">Commercial</option>
                                <option value="Agricultural">Agricultural</option>
                            </select>

                            <label htmlFor='topography' className='mt-3'>Topography <span className='text-red-600'>*</span>:</label>
                            <select 
                                value={data.topography} 
                                name='topography' 
                                onChange={handleOnChange}
                                className='p-2 bg-slate-100 border rounded'
                                required
                            >
                                <option value="Flat">Flat</option>
                                <option value="Sloppy">Sloppy</option>
                                <option value="Rocky">Rocky</option>
                            </select>

                            <div className='mt-3 flex items-center gap-2'>
                                <input 
                                    type='checkbox' 
                                    id='fencing' 
                                    name='fencing' 
                                    checked={data.fencing}
                                    onChange={(e) => setData(prev => ({...prev, fencing: e.target.checked}))}
                                    className='w-4 h-4'
                                />
                                <label htmlFor='fencing'>Fenced</label>
                            </div>

                            <label htmlFor='accessibility' className='mt-3'>Accessibility:</label>
                            <input 
                                type='text' 
                                id='accessibility' 
                                placeholder='Good road access, 5 minutes from highway' 
                                value={data.accessibility} 
                                name='accessibility' 
                                onChange={handleOnChange}
                                className='p-2 bg-slate-100 border rounded'
                            />

                            <label htmlFor='documents' className='mt-3'>Documents (comma-separated):</label>
                            <input 
                                type='text' 
                                id='documents' 
                                placeholder='C of O, Deed of Assignment, Survey Plan' 
                                value={data.documents.join(', ')} 
                                onChange={(e) => handleArrayInput('documents', e.target.value)}
                                className='p-2 bg-slate-100 border rounded'
                            />
                        </>
                    )}

                    {/* COMMERCIAL FIELDS */}
                    {categoryType === 'commercial' && (
                        <>
                            <label htmlFor='propertyType'>Property Type <span className='text-red-600'>*</span>:</label>
                            <select 
                                value={data.propertyType} 
                                name='propertyType' 
                                onChange={handleOnChange}
                                className='p-2 bg-slate-100 border rounded'
                                required
                            >
                                <option value="Office">Office</option>
                                <option value="Shop">Shop</option>
                                <option value="Warehouse">Warehouse</option>
                                <option value="Event Center">Event Center</option>
                                <option value="Hotel">Hotel</option>
                            </select>

                            <label htmlFor='totalArea' className='mt-3'>Total Area <span className='text-red-600'>*</span>:</label>
                            <input 
                                type='text' 
                                id='totalArea' 
                                placeholder='2000 sqm' 
                                value={data.totalArea} 
                                name='totalArea' 
                                onChange={handleOnChange}
                                className='p-2 bg-slate-100 border rounded'
                                required
                            />

                            <div className='grid grid-cols-2 gap-2 mt-3'>
                                <div>
                                    <label htmlFor='floors'>Number of Floors:</label>
                                    <input 
                                        type='number' 
                                        id='floors' 
                                        placeholder='3' 
                                        value={data.floors} 
                                        name='floors' 
                                        onChange={handleOnChange}
                                        className='p-2 bg-slate-100 border rounded w-full'
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label htmlFor='parking'>Parking Spaces:</label>
                                    <input 
                                        type='number' 
                                        id='parking' 
                                        placeholder='20' 
                                        value={data.parking} 
                                        name='parking' 
                                        onChange={handleOnChange}
                                        className='p-2 bg-slate-100 border rounded w-full'
                                        min="0"
                                    />
                                </div>
                            </div>

                            <label htmlFor='facilities' className='mt-3'>Facilities (comma-separated):</label>
                            <input 
                                type='text' 
                                id='facilities' 
                                placeholder='Elevator, Security, Generator, Air Conditioning' 
                                value={data.facilities.join(', ')} 
                                onChange={(e) => handleArrayInput('facilities', e.target.value)}
                                className='p-2 bg-slate-100 border rounded'
                            />

                            <label htmlFor='accessibility' className='mt-3'>Accessibility:</label>
                            <input 
                                type='text' 
                                id='accessibility' 
                                placeholder='Direct highway access, near business district' 
                                value={data.accessibility} 
                                name='accessibility' 
                                onChange={handleOnChange}
                                className='p-2 bg-slate-100 border rounded'
                            />

                            <label htmlFor='condition' className='mt-3'>Condition:</label>
                            <input 
                                type='text' 
                                id='condition' 
                                placeholder='Newly renovated, excellent condition' 
                                value={data.condition} 
                                name='condition' 
                                onChange={handleOnChange}
                                className='p-2 bg-slate-100 border rounded'
                            />
                        </>
                    )}

                    {/* SHORT LET FIELDS */}
                    {categoryType === 'shortlet' && (
                        <>
                            <div className='grid grid-cols-2 gap-2'>
                                <div>
                                    <label htmlFor='pricePerNight'>Price Per Night ({data.currency}) <span className='text-red-600'>*</span>:</label>
                                    <input 
                                        type='number' 
                                        id='pricePerNight' 
                                        placeholder='50000' 
                                        value={data.pricePerNight} 
                                        name='pricePerNight' 
                                        onChange={handleOnChange}
                                        className='p-2 bg-slate-100 border rounded w-full'
                                        required
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label htmlFor='pricePerWeek'>Price Per Week ({data.currency}):</label>
                                    <input 
                                        type='number' 
                                        id='pricePerWeek' 
                                        placeholder='300000' 
                                        value={data.pricePerWeek} 
                                        name='pricePerWeek' 
                                        onChange={handleOnChange}
                                        className='p-2 bg-slate-100 border rounded w-full'
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-2 mt-3'>
                                <div>
                                    <label htmlFor='bedrooms'>Bedrooms <span className='text-red-600'>*</span>:</label>
                                    <input 
                                        type='number' 
                                        id='bedrooms' 
                                        placeholder='2' 
                                        value={data.bedrooms} 
                                        name='bedrooms' 
                                        onChange={handleOnChange}
                                        className='p-2 bg-slate-100 border rounded w-full'
                                        required
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label htmlFor='bathrooms'>Bathrooms <span className='text-red-600'>*</span>:</label>
                                    <input 
                                        type='number' 
                                        id='bathrooms' 
                                        placeholder='2' 
                                        value={data.bathrooms} 
                                        name='bathrooms' 
                                        onChange={handleOnChange}
                                        className='p-2 bg-slate-100 border rounded w-full'
                                        required
                                        min="0"
                                    />
                                </div>
                            </div>

                            <label htmlFor='amenities' className='mt-3'>Amenities (comma-separated) <span className='text-red-600'>*</span>:</label>
                            <input 
                                type='text' 
                                id='amenities' 
                                placeholder='WiFi, Swimming Pool, Kitchen, Air Conditioning, TV' 
                                value={data.amenities.join(', ')} 
                                onChange={(e) => handleArrayInput('amenities', e.target.value)}
                                className='p-2 bg-slate-100 border rounded'
                                required
                            />

                            <div className='grid grid-cols-2 gap-2 mt-3'>
                                <div>
                                    <label htmlFor='checkInTime'>Check-In Time:</label>
                                    <input 
                                        type='time' 
                                        id='checkInTime' 
                                        value={data.checkInTime} 
                                        name='checkInTime' 
                                        onChange={handleOnChange}
                                        className='p-2 bg-slate-100 border rounded w-full'
                                    />
                                </div>
                                <div>
                                    <label htmlFor='checkOutTime'>Check-Out Time:</label>
                                    <input 
                                        type='time' 
                                        id='checkOutTime' 
                                        value={data.checkOutTime} 
                                        name='checkOutTime' 
                                        onChange={handleOnChange}
                                        className='p-2 bg-slate-100 border rounded w-full'
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* AGRICULTURAL FIELDS */}
                    {categoryType === 'agricultural' && (
                        <>
                            <label htmlFor='landSize'>Land Size <span className='text-red-600'>*</span>:</label>
                            <input 
                                type='text' 
                                id='landSize' 
                                placeholder='5 hectares or 50,000 sqm' 
                                value={data.landSize} 
                                name='landSize' 
                                onChange={handleOnChange}
                                className='p-2 bg-slate-100 border rounded'
                                required
                            />

                            <label htmlFor='soilType' className='mt-3'>Soil Type <span className='text-red-600'>*</span>:</label>
                            <select 
                                value={data.soilType} 
                                name='soilType' 
                                onChange={handleOnChange}
                                className='p-2 bg-slate-100 border rounded'
                                required
                            >
                                <option value="Loamy">Loamy</option>
                                <option value="Clay">Clay</option>
                                <option value="Sandy">Sandy</option>
                            </select>

                            <label htmlFor='waterSource' className='mt-3'>Water Source:</label>
                            <input 
                                type='text' 
                                id='waterSource' 
                                placeholder='Borehole, River, Stream' 
                                value={data.waterSource} 
                                name='waterSource' 
                                onChange={handleOnChange}
                                className='p-2 bg-slate-100 border rounded'
                            />

                            <label htmlFor='accessibility' className='mt-3'>Accessibility:</label>
                            <input 
                                type='text' 
                                id='accessibility' 
                                placeholder='Accessible via farm road, 10km from main road' 
                                value={data.accessibility} 
                                name='accessibility' 
                                onChange={handleOnChange}
                                className='p-2 bg-slate-100 border rounded'
                            />

                            <label htmlFor='documents' className='mt-3'>Documents (comma-separated):</label>
                            <input 
                                type='text' 
                                id='documents' 
                                placeholder='C of O, Survey Plan, Land Receipt' 
                                value={data.documents.join(', ')} 
                                onChange={(e) => handleArrayInput('documents', e.target.value)}
                                className='p-2 bg-slate-100 border rounded'
                            />
                        </>
                    )}

                    {!data.category && (
                        <div className='p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800'>
                            Please select a property category above to see relevant fields.
                        </div>
                    )}

                    {/* 🖼️ Images Section */}
                    <h3 className='font-bold text-md mt-4 mb-2 text-blue-600'>🖼️ Property Images</h3>
                    
                    <label htmlFor='productImage'>Upload Images <span className='text-red-600'>*</span>:</label>
                    <label htmlFor='uploadImageInput'>
                        <div className='p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer'>
                            <div className='text-slate-500 flex justify-center items-center flex-col gap-2'>
                                <span className='text-4xl'><IoCloudUpload/></span>
                                <p className='text-sm'>Upload Property Images (Max 5)</p>
                                <input 
                                    type='file' 
                                    id='uploadImageInput' 
                                    className='hidden' 
                                    onChange={handleUploadProduct}
                                    accept="image/*"
                                />
                            </div>
                        </div>
                    </label>

                    <div>
                        {data?.productImage[0] ? (
                            <div className='flex items-center gap-2 flex-wrap'>
                                {data.productImage.map((el, index) => (
                                    <div className='relative group' key={index}>
                                        <img 
                                            src={el} 
                                            alt={el} 
                                            width={80} 
                                            height={80} 
                                            className='bg-slate-100 border cursor-pointer' 
                                            onClick={() => {
                                                setUploadProductImageInput(el)
                                            }}
                                        />
                                        <div 
                                            className='absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer' 
                                            onClick={() => handleDeleteProductImage(index)}
                                        >
                                            <MdDelete/>  
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className='text-red-600 text-xs'>*Please upload at least one property image</p>
                        )}
                    </div>

                    {/* 👤 Agent Information Section */}
                    <h3 className='font-bold text-md mt-4 mb-2 text-blue-600'>👤 Agent Information</h3>
                    
                    <label htmlFor='agentName'>Agent Name:</label>
                    <input 
                        type='text' 
                        id='agentName' 
                        placeholder='Alphonsus Gabriel' 
                        value={data.agentName} 
                        name='agentName' 
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                    />

                    <label htmlFor='agentPhone' className='mt-3'>Agent Phone:</label>
                    <input 
                        type='tel' 
                        id='agentPhone' 
                        placeholder='+2348012345678' 
                        value={data.agentPhone} 
                        name='agentPhone' 
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                    />

                    <label htmlFor='agentEmail' className='mt-3'>Agent Email:</label>
                    <input 
                        type='email' 
                        id='agentEmail' 
                        placeholder='alphonsus@agency.com' 
                        value={data.agentEmail} 
                        name='agentEmail' 
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                    />

                    <label htmlFor='agency' className='mt-3'>Agency Name:</label>
                    <input 
                        type='text' 
                        id='agency' 
                        placeholder='OKSA Realty' 
                        value={data.agency} 
                        name='agency' 
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                    />

                    {/* ⚙️ Additional Metadata */}
                    <h3 className='font-bold text-md mt-4 mb-2 text-blue-600'>⚙️ Additional Metadata</h3>
                    
                    <label htmlFor='status'>Status:</label>
                    <select 
                        value={data.status} 
                        name='status' 
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                    >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Sold">Sold</option>
                        <option value="Rented">Rented</option>
                    </select>

                    <label htmlFor='slug' className='mt-3'>URL Slug (optional):</label>
                    <input 
                        type='text' 
                        id='slug' 
                        placeholder='3-bedroom-duplex-gwarinpa' 
                        value={data.slug} 
                        name='slug' 
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                    />
                    <p className='text-xs text-gray-500'>Leave empty to auto-generate from title</p>

                    <button 
                        className='px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700 rounded mt-5'
                        type='submit'
                    >
                        Add Property
                    </button>
                </form>
            </div>

            {/* Display Image full screen */}
            {uploadProductImageInput && (
                <div className='absolute bottom-0 top-0 right-0 left-0 flex justify-center items-center bg-slate-200 bg-opacity-80' onClick={() => setUploadProductImageInput("")}>
                    <div className='bg-white p-4 max-w-5xl mx-auto'>
                        <img src={uploadProductImageInput} className='w-full h-full max-w-[80vh] max-h-[80vh] object-scale-down mix-blend-multiply' alt=""/>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddProduct;
