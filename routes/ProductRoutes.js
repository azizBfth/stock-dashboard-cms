const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement'); // Import StockMovement model

// 🔹 Récupérer tous les produits
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 Ajouter un produit
router.post('/', async (req, res) => {
  try {
    const { name, category, quantity, alertThreshold } = req.body;
    const newProduct = new Product({ name, category, quantity, alertThreshold });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🔹 Modifier un produit
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: 'Produit non trouvé' });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🔹 Supprimer un produit
router.delete('/:id', async (req, res) => {
    try {
      // Delete all stock movements related to the product
      await StockMovement.deleteMany({ product: req.params.id });
  
      // Delete the product
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) return res.status(404).json({ message: 'Produit non trouvé' });
  
      res.json({ message: 'Produit et ses mouvements supprimés avec succès' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
