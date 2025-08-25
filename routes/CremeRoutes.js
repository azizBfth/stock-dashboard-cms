const express = require('express');
const Creme = require('../models/Creme'); // Assurez-vous que le chemin est correct

const router = express.Router();

// ➤ Récupérer toutes les crèmes
router.get('/', async (req, res) => {
  try {
    const cremes = await Creme.find();
    res.status(200).json(cremes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

// ➤ Récupérer une crème par ID
router.get('/:id', async (req, res) => {
  try {
    const creme = await Creme.findById(req.params.id);
    if (!creme) return res.status(404).json({ message: 'Crème non trouvée' });
    res.status(200).json(creme);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

// ➤ Ajouter une nouvelle crème
router.post('/', async (req, res) => {
  try {
    const { name, enterDateTime, openDateTime, expirationDate, expirationDateAfterOpen } = req.body;
    const newCreme = new Creme({ name, enterDateTime, openDateTime, expirationDate, expirationDateAfterOpen });
    await newCreme.save();
    res.status(201).json(newCreme);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de l\'ajout', error });
  }
});

// ➤ Mettre à jour une crème par ID
router.put('/:id', async (req, res) => {
  try {
    const updatedCreme = await Creme.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCreme) return res.status(404).json({ message: 'Crème non trouvée' });
    res.status(200).json(updatedCreme);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour', error });
  }
});

// ➤ Supprimer une crème par ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedCreme = await Creme.findByIdAndDelete(req.params.id);
    if (!deletedCreme) return res.status(404).json({ message: 'Crème non trouvée' });
    res.status(200).json({ message: 'Crème supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

module.exports = router;