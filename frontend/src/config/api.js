const PRODUCTION_API_URL = 'https://adoor-real-estate.onrender.com';

const getConfiguredUrl = () => {
  const value = process.env.REACT_APP_API_URL?.trim().replace(/\/+$/, '');
  if (!value) return '';
  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.origin : '';
  } catch (error) {
    console.error('Ignoring invalid REACT_APP_API_URL:', value);
    return '';
  }
};

const configuredUrl = getConfiguredUrl();

const API_BASE_URL = configuredUrl || (
  process.env.NODE_ENV === 'production' ? PRODUCTION_API_URL : 'http://localhost:8080'
);

export default API_BASE_URL;
