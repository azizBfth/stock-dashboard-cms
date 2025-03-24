const mongoose = require('mongoose');
const Product = require('./Product'); // Importation du modèle Product

const StockMovementSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  type: { type: String, enum: ['entree', 'sortie'], required: true },
  quantity: { type: Number, required: true },
  location: { type: String, enum: ['armoire 01', 'armoire 02', 'armoire 03'], required: true },
  operator: { type: String, required: true },
  datetime: { type: Date, default: Date.now }
});

// Middleware pour mettre à jour automatiquement la quantité du produit
StockMovementSchema.pre('save', async function (next) {
  try {
    const product = await Product.findById(this.product);
    if (!product) {
      return next(new Error('Produit non trouvé'));
    }

    // Mise à jour de la quantité du produit en fonction du type de mouvement
    if (this.type === 'entree') {
      product.quantity += this.quantity; // Ajouter la quantité
    } else if (this.type === 'sortie') {
      if (product.quantity < this.quantity) {
        return next(new Error('Quantité insuffisante en stock'));
      }
      product.quantity -= this.quantity; // Diminuer la quantité
    }

    await product.save(); // Enregistrer les modifications
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('StockMovement', StockMovementSchema);
