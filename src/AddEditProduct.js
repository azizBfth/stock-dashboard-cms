import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const AddEditProduct = () => {
  const [product, setProduct] = useState({ name: '', category: '', quantity: 0 });
  const { id } = useParams(); // For editing an existing product
  const navigate = useNavigate();

  // Fetch product details if editing
  useEffect(() => {
    if (id) {
      axios.get(`http://192.168.1.99:/api/products/${id}`)
        .then(response => setProduct(response.data))
        .catch(error => console.error('Error fetching product:', error));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If the field is quantity, ensure it's treated as a number
    if (name === 'quantity') {
      setProduct({ ...product, [name]: value ? Number(value) : '' });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      // Edit product
      axios.put(`http://192.168.1.99:/api/products/${id}`, product)
        .then(() => {
          navigate('/products');
        })
        .catch(error => console.error('Error updating product:', error));
    } else {
      // Add new product
      axios.post('http://192.168.1.99:/api/products', product)
        .then(() => {
          navigate('/products');
        })
        .catch(error => console.error('Error adding product:', error));
    }
  };

  return (
    <Container>
      <Typography variant="h4">{id ? 'Edit Product' : 'Add Product'}</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Product Name"
          variant="outlined"
          fullWidth
          name="name"
          value={product.name}
          onChange={handleChange}
          style={{ marginBottom: '10px' }}
        />
        <TextField
          label="Category"
          variant="outlined"
          fullWidth
          name="category"
          value={product.category}
          onChange={handleChange}
          style={{ marginBottom: '10px' }}
        />
        <TextField
          label="Quantity"
          variant="outlined"
          fullWidth
          name="quantity" // Corrected to match the field name
          value={product.quantity}
          onChange={handleChange}
          type="number" // Ensures input is numeric
          style={{ marginBottom: '20px' }}
        />
        <Button variant="contained" color="primary" type="submit" fullWidth>
          {id ? 'Update Product' : 'Add Product'}
        </Button>
      </form>
    </Container>
  );
};

export default AddEditProduct;
