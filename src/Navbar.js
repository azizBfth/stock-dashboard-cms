// Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Stock Management
        </Typography>
        <Button color="inherit" component={Link} to="/products">
          Products
        </Button>
     
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
