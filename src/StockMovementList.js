import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const StockMovementList = () => {
    const [stockMovements, setStockMovements] = useState([]);
    const navigate = useNavigate();

    // Fetch stock movements
    useEffect(() => {
      axios.get('http://192.168.1.99/api/mvt')
        .then(response => setStockMovements(response.data))
        .catch(error => console.error('Error fetching stock movements:', error));
    }, []);

    const handleDelete = (id) => {
        axios.delete(`http://192.168.1.99/api/mvt/${id}`)
          .then(() => {
            // Handle the UI update after deletion
            setStockMovements(stockMovements.filter((movement) => movement._id !== id));
          })
          .catch(error => console.error('Error deleting stock movement:', error));
    };
    
    // Navigate to the Add New Stock Movement page
    const handleAddNew = () => {
        navigate('/add'); // Adjust the route to match your app's add page
    };

    return (
      <Container>
        <Typography variant="h4">Stock Movements</Typography>
        
        {/* Add New Movement Button */}
        <Button variant="contained" color="primary" component={Link} to="/add-stockmovement" style={{ marginBottom: '20px' }}>
              Add mvt
            </Button>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Operator</TableCell>
              <TableCell>Datetime</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stockMovements.map((movement) => (
              <TableRow key={movement._id}>
                <TableCell>{movement.product.name}</TableCell> {/* Assuming product is an object */}
                <TableCell>{movement.type}</TableCell>
                <TableCell>{movement.quantity}</TableCell>
                <TableCell>{movement.location}</TableCell>
                <TableCell>{movement.operator}</TableCell>
                <TableCell>{new Date(movement.datetime).toLocaleString()}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => navigate(`/edit-stockmovement/${movement._id}`)}>Edit</Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(movement._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    );
};

export default StockMovementList;
