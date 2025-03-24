import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://192.168.1.99/api/products')
      .then(response => {
        setProducts(response.data);
        setFilteredProducts(response.data); // Initially, show all products
      })
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    // Filter products based on the search query
    setFilteredProducts(
      products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, products]);

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      axios.delete(`http://192.168.1.99/api/products/${productId}`)
        .then(() => {
          setProducts(products.filter(product => product._id !== productId));
        })
        .catch(error => console.error('Error deleting product:', error));
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleViewMovements = (productId) => {
    // Redirect to the view movements page for the product
    navigate(`/product/${productId}/movements`);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Product List</Typography>
      
      <TextField
        label="Search Products"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ marginBottom: '20px' }}
      />
      
      <Button variant="contained" color="primary" component={Link} to="/add-product" style={{ marginBottom: '20px' }}>
        Add Product
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    component={Link}
                    to={`/edit-product/${product._id}`}
                    style={{ marginRight: '10px' }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleViewMovements(product._id)}
                    style={{ marginLeft: '10px' }}
                  >
                    View Movements
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ProductList;
