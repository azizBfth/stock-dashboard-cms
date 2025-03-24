const express = require('express');
const router = express.Router();
const StockMovement = require('../models/StockMovement');
const Product = require('../models/Product');

// 🔹 Récupérer tous les mouvements de stock
router.get('/', async (req, res) => {
  try {
    const movements = await StockMovement.find().populate('product'); // Récupérer aussi les infos du produit
    res.json(movements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 Récupérer les mouvements de stock pour un produit spécifique par ID
router.get('/product/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const movements = await StockMovement.find({ product: productId }).populate('product'); // Récupérer aussi les infos du produit
    if (!movements || movements.length === 0) {
      return res.status(404).json({ message: 'Aucun mouvement trouvé pour ce produit' });
    }
    res.json(movements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 Ajouter un mouvement (entrée/sortie)
router.post('/', async (req, res) => {
  try {
    const { product, type, quantity, location, operator } = req.body;

    // Vérifier si le produit existe
    const existingProduct = await Product.findById(product);
    if (!existingProduct) return res.status(404).json({ message: 'Produit non trouvé' });

    // Vérifier si la quantité est suffisante en cas de sortie
    if (type === 'sortie' && existingProduct.quantity < quantity) {
      return res.status(400).json({ message: 'Quantité insuffisante en stock' });
    }

    // Créer le mouvement
    const newMovement = new StockMovement({ product, type, quantity, location, operator });
    await newMovement.save();

    // Mettre à jour le stock du produit
    if (type === 'entree') {
      existingProduct.quantity += quantity;
    } else if (type === 'sortie') {
      existingProduct.quantity -= quantity;
    }
    await existingProduct.save();

    res.status(201).json(newMovement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🔹 Modifier un mouvement existant
router.put('/:id', async (req, res) => {
    try {
      const { type, quantity, location, operator } = req.body;
      const movement = await StockMovement.findById(req.params.id);
  
      if (!movement) return res.status(404).json({ message: 'Mouvement non trouvé' });
  
      const product = await Product.findById(movement.product);
      if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
  
      // 🔹 1. Revert the previous movement
      if (movement.type === 'entree') {
        product.quantity -= movement.quantity; // Undo the previous "entree" (incoming)
      } else if (movement.type === 'sortie') {
        product.quantity += movement.quantity; // Undo the previous "sortie" (outgoing)
      }
  
      // 🔹 2. Apply the new movement
      if (type === 'entree') {
        product.quantity += quantity; // Apply the new "entree" (incoming)
      } else if (type === 'sortie') {
        if (product.quantity < quantity) {
          return res.status(400).json({ message: 'Quantité insuffisante en stock' });
        }
        product.quantity -= quantity; // Apply the new "sortie" (outgoing)
      }
      movement.type = type;
      movement.quantity = quantity;
      movement.location = location;
      movement.operator = operator;
      await movement.save();
      // 🔹 3. Save the updated product with the correct quantity
      const updatedProduct = await product.save(); // Save the updated product
  
      // 🔹 4. Update the movement details

  
      // 🔹 5. Return the updated movement and product info
      res.json({ movement: movement, product: updatedProduct }); // Return both the movement and the updated product
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  
  
// 🔹 Supprimer un mouvement
router.delete('/:id', async (req, res) => {
  try {
    const movement = await StockMovement.findById(req.params.id);
    if (!movement) return res.status(404).json({ message: 'Mouvement non trouvé' });

    const product = await Product.findById(movement.product);
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });

    // 🔹 Reverse movement before deletion
    if (movement.type === 'entree') {
      product.quantity -= movement.quantity;
    } else if (movement.type === 'sortie') {
      product.quantity += movement.quantity;
    }

    await product.save();
    await StockMovement.findByIdAndDelete(req.params.id);

    res.json({ message: 'Mouvement supprimé et stock mis à jour' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
