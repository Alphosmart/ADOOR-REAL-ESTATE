import React, { useEffect, useState, memo, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import { formatCurrency } from '../helper/settingsUtils'
import SocialFeatures from './SocialFeatures'

const VerticalCardProduct = memo(({ category, heading, featured = false }) => {
    console.log('🔍 VerticalCardProduct: Rendered with category:', category, 'heading:', heading, 'featured:', featured);
    console.log('🔍 VerticalCardProduct: Component mounted/updated at:', new Date().toISOString());
    
    const { getProductsByCategory, getFeaturedProducts, loading: globalLoading, allProducts, error } = useProducts()
    const [loading, setLoading] = useState(true)
    const [hoveredProduct, setHoveredProduct] = useState(null)
    const [currentImageIndex, setCurrentImageIndex] = useState({})

    console.log('🔍 VerticalCardProduct: Context state:', { 
        globalLoading, 
        allProductsLength: allProducts.length,
        category,
        featured,
        error,
        allProductsSample: allProducts.slice(0, 2).map(p => ({ id: p._id, name: p.productName }))
    });

    // Get filtered products from context instead of making API call
    const data = useMemo(() => {
        if (globalLoading || allProducts.length === 0) {
            console.log('🔍 VerticalCardProduct: No data available - globalLoading:', globalLoading, 'allProducts:', allProducts.length);
            return []
        }
        const products = featured ? getFeaturedProducts() : getProductsByCategory(category);
        console.log('🔍 VerticalCardProduct: Got', products.length, 'products for category:', category, 'featured:', featured);
        return products;
    }, [getProductsByCategory, getFeaturedProducts, category, featured, globalLoading, allProducts.length])

    // Update loading state based on context
    useEffect(() => {
        setLoading(globalLoading || allProducts.length === 0)
    }, [globalLoading, allProducts.length])

    // Memoized price formatter that uses user's currency settings
    const formatPrice = useMemo(() => (price) => {
        return formatCurrency(price)
    }, [])

    if (loading) {
        return (
            <div className='container mx-auto px-4 my-6 relative'>
                <h2 className='text-2xl font-semibold py-4'>{heading}</h2>
                <div className='grid grid-cols-[repeat(auto-fit,minmax(260px,300px))] justify-center md:justify-between md:gap-4 overflow-x-scroll scrollbar-none transition-all'>
                    {[1,2,3].map((item) => (
                        <div key={item} className='w-full min-w-[260px] md:min-w-[300px] max-w-[260px] md:max-w-[300px] bg-white rounded-sm shadow'>
                            <div className='bg-slate-200 h-48 p-4 min-w-[260px] md:min-w-[300px] flex justify-center items-center'>
                                <div className='w-full h-full bg-slate-300 rounded animate-pulse'></div>
                            </div>
                            <div className='p-4 grid gap-3'>
                                <div className='h-4 bg-slate-300 rounded w-full animate-pulse'></div>
                                <div className='h-3 bg-slate-300 rounded w-3/4 animate-pulse'></div>
                                <div className='flex gap-3'>
                                    <div className='h-4 bg-slate-300 rounded w-1/3 animate-pulse'></div>
                                    <div className='h-4 bg-slate-300 rounded w-1/3 animate-pulse'></div>
                                </div>
                                <div className='h-8 bg-slate-300 rounded w-full animate-pulse'></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const noData = !loading && (!data || data.length === 0)

    if (noData) {
        return (
            <div className='container mx-auto px-4 my-6 relative'>
                <h2 className='text-2xl font-semibold py-4'>{heading}</h2>
                <p className='text-center text-gray-500 py-8'>No properties are available in this category yet.</p>
            </div>
        )
    }

    return (
        <div className='container mx-auto px-4 my-6 relative'>
            <h2 className='text-2xl font-semibold py-4'>{heading}</h2>
            
            <div className='grid grid-cols-[repeat(auto-fit,minmax(260px,300px))] justify-center md:justify-between md:gap-4 overflow-x-scroll scrollbar-none transition-all'>
                {data.map((product, index) => (
                    <Link key={product._id} to={`/product/${product._id}`} className='group w-full min-w-[260px] md:min-w-[300px] max-w-[260px] md:max-w-[300px] bg-white border border-gray-200 hover:shadow-xl transition-all'>
                        <div 
                            className='bg-slate-200 h-56 min-w-[260px] md:min-w-[300px] flex justify-center items-center relative overflow-hidden'
                            onMouseEnter={() => setHoveredProduct(product._id)}
                            onMouseLeave={() => setHoveredProduct(null)}
                        >
                            <img 
                                src={hoveredProduct === product._id && product.productImage.length > 1 
                                    ? product.productImage[currentImageIndex[product._id] || 1] || product.productImage[0]
                                    : product.productImage[0]
                                } 
                                alt={product.productName}
                                loading="lazy"
                                className='object-cover w-full h-full group-hover:scale-105 transition-all duration-500'
                                onError={(e) => {
                                    e.target.src = '/placeholder-image.png'; // Fallback image
                                }}
                            />
                            
                            {/* Image indicators for products with multiple images */}
                            {product.productImage.length > 1 && (
                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {product.productImage.slice(0, 4).map((_, imgIndex) => (
                                        <div
                                            key={imgIndex}
                                            className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                                                (hoveredProduct === product._id ? currentImageIndex[product._id] || 0 : 0) === imgIndex
                                                    ? 'bg-red-600'
                                                    : 'bg-gray-400'
                                            }`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setCurrentImageIndex(prev => ({
                                                    ...prev,
                                                    [product._id]: imgIndex
                                                }));
                                            }}
                                        />
                                    ))}
                                    {product.productImage.length > 4 && (
                                        <span className="text-xs text-gray-600 ml-1">+{product.productImage.length - 4}</span>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className='p-4 grid gap-3'>
                            <div className='flex items-center gap-2 text-[10px] uppercase tracking-wider text-green-700 font-bold'><span>●</span> Verified property</div>
                            <h2 className='font-bold text-base md:text-lg text-ellipsis line-clamp-1 text-[#121f2f]'>
                                {product.productName}
                            </h2>
                            <p className='capitalize text-slate-500'>{product.category}</p>
                            <div className='flex gap-3'>
                                <p className='text-[#121f2f] text-lg font-bold'>
                                    {product.displayPricing?.formatted?.sellingPrice || formatPrice(product.sellingPrice)}
                                </p>
                            </div>
                            {product.originalCurrency && product.displayPricing?.currency && 
                             product.originalCurrency !== product.displayPricing.currency && (
                                <p className='text-xs text-gray-400'>
                                    Original: {product.originalCurrency} • Converted from seller's local price
                                </p>
                            )}
                            
                            {/* Social features */}
                            <SocialFeatures product={product} compact={true} />
                            
                            <button className='text-xs bg-[#121f2f] hover:bg-[#92bc1b] hover:text-[#121f2f] text-white px-4 py-3 font-bold transition-colors'>
                                View property details
                            </button>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
})

export default VerticalCardProduct
