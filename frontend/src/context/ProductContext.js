import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import SummaryApi from '../common';

const ProductContext = createContext();
const CACHE_DURATION = 5 * 60 * 1000;

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const user = useSelector(state => state?.user?.user);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const allProductsRef = useRef([]);
  const lastFetchRef = useRef(null);
  const [currentCurrency, setCurrentCurrency] = useState('NGN');

  // Load user's preferred currency on mount
  useEffect(() => {
    const loadUserCurrency = async () => {
      // Only fetch user preferences if user is authenticated
      if (!user || !user._id) {
        // Fallback to localStorage or default for unauthenticated users
        const savedCurrency = localStorage.getItem('userCurrency');
        if (savedCurrency) {
          setCurrentCurrency(savedCurrency);
        }
        return;
      }

      try {
        const response = await fetch(SummaryApi.getUserPreferences.url, {
          method: SummaryApi.getUserPreferences.method,
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.currency) {
            setCurrentCurrency(data.data.currency);
          }
        } else if (response.status === 401) {
          // User is no longer authenticated, fallback to localStorage
          const savedCurrency = localStorage.getItem('userCurrency');
          if (savedCurrency) {
            setCurrentCurrency(savedCurrency);
          }
        }
      } catch (error) {
        console.log('Could not load user currency preferences:', error);
        // Fallback to localStorage or default
        const savedCurrency = localStorage.getItem('userCurrency');
        if (savedCurrency) {
          setCurrentCurrency(savedCurrency);
        }
      }
    };
    
    loadUserCurrency();
  }, [user]);

  const fetchAllProducts = useCallback(async (forceRefresh = false, currency = null) => {
    // Get user's preferred currency
    const userCurrency = currency || currentCurrency;
    
    // Check if we have recent data and don't need to refetch
    if (!forceRefresh && allProductsRef.current.length > 0 && lastFetchRef.current &&
        (Date.now() - lastFetchRef.current < CACHE_DURATION)) {
      return allProductsRef.current;
    }

    try {
      setLoading(true);
      setError(null);
      
      const url = new URL(SummaryApi.allProduct.url);
      if (userCurrency) {
        url.searchParams.append('currency', userCurrency);
      }
      
      const response = await fetch(url.toString(), {
        method: SummaryApi.allProduct.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const dataResponse = await response.json();

      if (dataResponse.success) {
        setAllProducts(dataResponse.data);
        allProductsRef.current = dataResponse.data;
        lastFetchRef.current = Date.now();
        if (dataResponse.currency) {
          setCurrentCurrency(dataResponse.currency);
        }
        return dataResponse.data;
      } else {
        setError(dataResponse.message || 'Failed to fetch products');
        return [];
      }
    } catch (error) {
      console.error('ProductContext fetch error:', error);
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [currentCurrency]);

  const getProductsByCategory = useCallback((category) => {
    if (!category || category === 'all') {
      return allProductsRef.current;
    }
    return allProductsRef.current.filter(product =>
      product.category?.toLowerCase() === category?.toLowerCase()
    );
  }, []);

  const getProductById = useCallback((id) => {
    return allProductsRef.current.find(product => product._id === id);
  }, []); // No dependencies needed since we use ref

  // Auto-fetch on mount and when currency changes
  useEffect(() => {
    if (allProductsRef.current.length === 0) {
      fetchAllProducts();
    }
  }, [fetchAllProducts]);

  const changeCurrency = useCallback(async (newCurrency) => {
    if (newCurrency !== currentCurrency) {
      setCurrentCurrency(newCurrency);
      
      // Save to localStorage for immediate persistence
      localStorage.setItem('userCurrency', newCurrency);
      
      // Save to database
      try {
        await fetch(SummaryApi.updateUserPreferences.url, {
          method: SummaryApi.updateUserPreferences.method,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            currency: newCurrency
          })
        });
      } catch (error) {
        console.log('Could not save currency preference to database:', error);
      }
      
      // Refresh products with new currency
      fetchAllProducts(true, newCurrency);
    }
  }, [currentCurrency, fetchAllProducts]);

  const value = {
    allProducts,
    loading,
    error,
    currentCurrency,
    fetchAllProducts,
    getProductsByCategory,
    getProductById,
    changeCurrency,
    refreshProducts: () => fetchAllProducts(true)
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
