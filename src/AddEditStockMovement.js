import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const AddEditStockMovement = () => {
    const [stockMovement, setStockMovement] = useState({
      product: '',
      type: '', // type will be set to either "entrée" or "sortie"
      quantity: 0,
      location: '',
      operator: '',
      datetime: '',
    });
    const [products, setProducts] = useState([]);
    const { id } = useParams(); // For editing an existing stock movement
    const navigate = useNavigate();
  
    // Fetch product list for selection
    useEffect(() => {
      axios.get('http://192.168.1.99/api/products')
        .then(response => setProducts(response.data))
        .catch(error => console.error('Error fetching products:', error));
  
      if (id) {
        axios.get(`http://192.168.1.99/api/mvt/${id}`)
          .then(response => setStockMovement(response.data))
          .catch(error => console.error('Error fetching stock movement:', error));
      }
    }, [id]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
  
      // Ensure quantity is treated as a number
      if (name === 'quantity') {
        setStockMovement({ ...stockMovement, [name]: value ? Number(value) : 0 });
      } else {
        setStockMovement({ ...stockMovement, [name]: value });
      }
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (id) {
        // Edit stock movement
        axios.put(`http://192.168.1.99/api/mvt/${id}`, stockMovement)
          .then(() => {
            navigate('/stockmovements');
          })
          .catch(error => console.error('Error updating stock movement:', error));
      } else {
        // Add new stock movement
        axios.post('http://192.168.1.99/api/mvt', stockMovement)
          .then(() => {
            navigate('/stockmovements');
          })
          .catch(error => console.error('Error adding stock movement:', error));
      }
    };
  
    return (
      <Container>
        <Typography variant="h4">{id ? 'Edit Stock Movement' : 'Add Stock Movement'}</Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth style={{ marginBottom: '10px' }}>
            <InputLabel>Product</InputLabel>
            <Select
              label="Product"
              name="product"
              value={stockMovement.product}
              onChange={handleChange}
            >
              {products.map((product) => (
                <MenuItem key={product._id} value={product._id}>
                  {product.name} {/* Render product name */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
  
          <FormControl fullWidth style={{ marginBottom: '10px' }}>
            <InputLabel>Movement Type</InputLabel>
            <Select
              label="Movement Type"
              name="type"
              value={stockMovement.type}
              onChange={handleChange}
            >
              <MenuItem value="entrée">Entrée</MenuItem>
              <MenuItem value="sortie">Sortie</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Quantity"
            variant="outlined"
            fullWidth
            name="quantity"
            value={stockMovement.quantity}
            onChange={handleChange}
            type="number" // Ensures quantity is a number
            style={{ marginBottom: '10px' }}
          />
          <FormControl fullWidth style={{ marginBottom: '10px' }}>
            <InputLabel>Location</InputLabel>
            <Select
              label="Location"
              name="location"
              value={stockMovement.location}
              onChange={handleChange}
            >
              <MenuItem value="armoire 01">Armoire 01</MenuItem>
              <MenuItem value="armoire 02">Armoire 02</MenuItem>
              <MenuItem value="armoire 03">Armoire 03</MenuItem>
            </Select>
          </FormControl>
  
          <TextField
            label="Operator"
            variant="outlined"
            fullWidth
            name="operator"
            value={stockMovement.operator}
            onChange={handleChange}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Datetime"
            variant="outlined"
            fullWidth
            name="datetime"
            type="datetime-local"
            value={stockMovement.datetime}
            onChange={handleChange}
            style={{ marginBottom: '20px' }}
          />
  
          <Button variant="contained" color="primary" type="submit" fullWidth>
            {id ? 'Update Stock Movement' : 'Add Stock Movement'}
          </Button>
        </form>
      </Container>
    );
};

export default AddEditStockMovement;
