const express = require('express');
const router = express.Router();
const MslProduct = require('../models/MslProduct'); // Assure-toi que le chemin est correct

// GET - Récupérer tous les produits
router.get('/', async (req, res) => {
  try {
    const mslproducts = await MslProduct.find();
    res.status(200).json(mslproducts);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

// GET - Récupérer un produit par ID
router.get('/:id', async (req, res) => {
  try {
    const mslproduct = await MslProduct.findById(req.params.id);
    if (!mslproduct) return res.status(404).json({ message: 'Produit non trouvé' });

    res.status(200).json(mslproduct);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

// POST - Ajouter un nouveau produit
router.post('/', async (req, res) => {
  try {
    const { ref, category, level } = req.body;
    
    // Vérifier si le produit existe déjà
    const existingMslProduct = await MslProduct.findOne({ ref });
    if (existingMslProduct) return res.status(400).json({ message: 'Ce produit existe déjà' });

    const newMslProduct = new MslProduct({ ref, category, level });
    await newMslProduct.save();
    
    res.status(201).json(newMslProduct);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

// PUT - Mettre à jour un produit
router.put('/:id', async (req, res) => {
  try {
    const updatedMslProduct = await MslProduct.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedMslProduct) return res.status(404).json({ message: 'Produit non trouvé' });

    res.status(200).json(updatedMslProduct);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

// DELETE - Supprimer un produit
router.delete('/:id', async (req, res) => {
  try {
    const deletedMslProduct = await MslProduct.findByIdAndDelete(req.params.id);
    if (!deletedMslProduct) return res.status(404).json({ message: 'Produit non trouvé' });

    res.status(200).json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

// Route to check Mslproduct references
router.post("/check", async (req, res) => {
  try {
    const { references } = req.body;

    // Find mslproducts matching the references
    const mslproducts = await MslProduct.find({ ref: { $in: references } });

    // Map results to match the input order
    const result = references.map((ref) => {
      const mslproduct = mslproducts.find((p) => p.ref === ref);
      return mslproduct ? mslproduct : { ref, category: null, level: null };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur." });
  }
});

module.exports = router;