const mongoose = require('mongoose');

// Schéma pour vendeur_evenement
const vendeurEvenementSchema = new mongoose.Schema({
    vendeurId: { type: mongoose.Schema.Types.ObjectId, ref: 'joueurs', required: true }, // ID du vendeur
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'evenements', required: true }, // ID de l'événement
}, { timestamps: true });  // Ajoute des timestamps pour savoir quand la relation a été créée

// Créer et exporter le modèle
const VendeurEvenement = mongoose.model('VendeurEvenement', vendeurEvenementSchema);
module.exports = VendeurEvenement;
