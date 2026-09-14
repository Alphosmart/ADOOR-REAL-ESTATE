import React from 'react';
import AddProduct from './AddProduct';

// Editing uses the Add Property form in edit mode, so both always have the same fields
const EditProduct = () => <AddProduct mode="edit" />;

export default EditProduct;
