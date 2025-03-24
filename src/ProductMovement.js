import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const ProductMovements = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const [movements, setMovements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [movementForm, setMovementForm] = useState({
    date: '',
    type: '',
    quantity: '',
    location: '',
    operator: ''
  });
  const [editingMovement, setEditingMovement] = useState(null);

  // Fetch product movements from the API
  useEffect(() => {
    axios.get(`http://192.168.1.99/api/mvt/product/${productId}`)
      .then(response => {
        setMovements(response.data);
      })
      .catch(error => {
        console.error('Error fetching product movements:', error);
      });
  }, [productId]);

  // Handle Search Change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter movements based on search term
  const filteredMovements = movements.filter((movement) =>
    movement.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movement.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open Add/Edit Dialog
  const handleOpenDialog = (movement = null) => {
    if (movement) {
      setEditingMovement(movement);
      setMovementForm({
        date: movement.date,
        type: movement.type,
        quantity: movement.quantity,
        location: movement.location,
        operator: movement.operator
      });
    } else {
      setEditingMovement(null);
      setMovementForm({
        date: '',
        type: '',
        quantity: '',
        location: '',
        operator: ''
      });
    }
    setOpenDialog(true);
  };

  // Close Dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle Form Change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setMovementForm({ ...movementForm, [name]: value });
  };

  // Handle Submit (Add/Edit Movement)
const handleSubmit = (e) => {
    e.preventDefault();
  
    // Convert quantity to a number
    const formWithParsedQuantity = {
      ...movementForm,
      quantity: parseFloat(movementForm.quantity) || 0, // Ensure it's a number (default to 0 if invalid)
    };
  
    if (editingMovement) {
      // Update Movement
      axios.put(`http://192.168.1.99/api/mvt/${editingMovement._id}`, formWithParsedQuantity)
        .then(() => {
          setMovements(prev => prev.map(mv => mv._id === editingMovement._id ? { ...mv, ...formWithParsedQuantity } : mv));
          setOpenDialog(false);
        })
        .catch(error => console.error('Error updating movement:', error));
    } else {
      // Add Movement, include productId
      axios.post(`http://192.168.1.99/api/mvt`, { ...formWithParsedQuantity, product: productId })
        .then(response => {
          setMovements(prev => [...prev, response.data]);
          setOpenDialog(false);
        })
        .catch(error => console.error('Error adding movement:', error));
    }
  };
  

  // Handle Delete Movement
  const handleDelete = (id) => {
    axios.delete(`http://192.168.1.99/api/mvt/${id}`)
      .then(() => {
        setMovements(prev => prev.filter(mv => mv._id !== id));
      })
      .catch(error => console.error('Error deleting movement:', error));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Product Movements</Typography>

      {/* Search Bar */}
      <TextField
        label="Search by Type or Location"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: '20px' }}
      />

      {/* Add New Movement Button */}
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} style={{ marginBottom: '20px' }}>
        Add Movement
      </Button>

      {/* Table of Movements */}
      {filteredMovements.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Movement Type</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Operator</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMovements.map((movement) => (
                <TableRow key={movement._id}>
                  <TableCell>{new Date(movement.date).toLocaleString()}</TableCell>
                  <TableCell>{movement.type}</TableCell>
                  <TableCell>{movement.quantity}</TableCell>
                  <TableCell>{movement.location}</TableCell>
                  <TableCell>{movement.operator}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleOpenDialog(movement)} color="primary">Edit</Button>
                    <Button onClick={() => handleDelete(movement._id)} color="secondary">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1">No movements found for this product.</Typography>
      )}

      {/* Dialog for Add/Edit Movement */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingMovement ? 'Edit Movement' : 'Add Movement'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Date and Time"
            variant="outlined"
            type="datetime-local"
            name="date"
            value={movementForm.date}
            onChange={handleFormChange}
            fullWidth
            style={{ marginBottom: '15px' }}
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth style={{ marginBottom: '15px' }}>
            <InputLabel>Movement Type</InputLabel>
            <Select
              name="type"
              value={movementForm.type}
              onChange={handleFormChange}
              label="Movement Type"
            >
              <MenuItem value="entree">Entree</MenuItem>
              <MenuItem value="sortie">Sortie</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Quantity"
            variant="outlined"
            name="quantity"
            type="number"
            value={movementForm.quantity}
            onChange={handleFormChange}
            fullWidth
            style={{ marginBottom: '15px' }}
          />
          <TextField
            label="Location"
            variant="outlined"
            name="location"
            value={movementForm.location}
            onChange={handleFormChange}
            fullWidth
            style={{ marginBottom: '15px' }}
          />
          <TextField
            label="Operator"
            variant="outlined"
            name="operator"
            value={movementForm.operator}
            onChange={handleFormChange}
            fullWidth
            style={{ marginBottom: '15px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary">{editingMovement ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductMovements;
