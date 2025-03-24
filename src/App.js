// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import ProductList from './ProductList';
import StockMovementList from './StockMovementList';
import AddEditProduct from './AddEditProduct';
import AddEditStockMovement from './AddEditStockMovement';
import ProductMovements from './ProductMovement';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/add-product" element={<AddEditProduct />} />
        <Route path="/edit-product/:id" element={<AddEditProduct />} />
        <Route path="/stockmovements" element={<StockMovementList />} />
        <Route path="/add-stockmovement" element={<AddEditStockMovement />} />
        <Route path="/edit-stockmovement/:id" element={<AddEditStockMovement />} />
        <Route path="/product/:productId/movements" element={<ProductMovements />} />

      </Routes>
    </Router>
  );
};

export default App;
