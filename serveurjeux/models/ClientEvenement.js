const mongoose = require('mongoose');

// Schéma pour client_evenement
const clientEvenementSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ID du client
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true }, // ID de l'événement
    statut: { type: String, default: 'en attente' },  // Statut de l'achat (ex : 'acheté', 'en attente')
}, { timestamps: true });  // Ajoute des timestamps pour savoir quand la relation a été créée

// Créer et exporter le modèle
const ClientEvenement = mongoose.model('ClientEvenement', clientEvenementSchema);
module.exports = ClientEvenement;
