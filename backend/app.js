const express    = require('express');
const https      = require('https');
const crypto     = require('crypto');
const http       = require('http');
const mongoose   = require('mongoose');
const cors       = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const bcrypt     = require('bcrypt');
const jwt        = require('jsonwebtoken');
require('dotenv').config();

const BCRYPT_ROUNDS = 12;

const app  = express();
const port = process.env.PORT;

console.log(`[init] Démarrage — port: ${port}`);
console.log(`[init] MONGO_URI: ${process.env.MONGO_URI}`);
console.log(`[init] JWT_SECRET défini: ${!!process.env.JWT_SECRET}`);
console.log(`[init] GMAIL_USER: ${process.env.GMAIL_USER}`);

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(bodyParser.json());

console.log(`[db] Connexion à MongoDB — URI: ${process.env.MONGO_URI}`);
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('[db] Connexion MongoDB réussie'))
    .catch(err => console.error('[db] Erreur de connexion:', err));

mongoose.connection.on('error',        err => console.error('[db] Erreur MongoDB:', err));
mongoose.connection.on('disconnected', ()  => console.warn('[db] MongoDB déconnecté'));
mongoose.connection.on('reconnected',  ()  => console.log('[db] MongoDB reconnecté'));

// ── Schemas ───────────────────────────────────────────────────────────────────

const joueurs = mongoose.model('joueurs', new mongoose.Schema({
    _id:         mongoose.Types.ObjectId,
    nom:         String,
    courriel:    String,
    postal:      String,
    motpasse:    String,
    vendeur:     Number,
    resetCode:   String,
    resetExpiry: Date,
    panier:      [{ id: String, nom: String, quantity: { type: Number, default: 1 } }],
    achats: [{
        eventId:          String,
        confirmationCode: String,   // unique purchase receipt code
        eventNom:         String,
        date:             String,
        location:         String,
        dateISO:     String,
        startHour:   Number,
        startMinute: Number,
        endHour:     Number,
        endMinute:   Number,
        prix:        Number,
        acheteLe:    Date,
    }],
}));

const evenements = mongoose.model('evenements', new mongoose.Schema({
    _id:         mongoose.Types.ObjectId,
    nom:         String,
    description: String,
    prix:        Number,
    date:        String,
    dateISO:     String,
    startHour:   Number,
    startMinute: Number,
    endHour:     Number,
    endMinute:   Number,
    location:    String,
    endDateISO:  String,   // for multi-day events; same as dateISO if single-day
    vendeurNom:  String,   // display name of the vendor who created it
    lat:         Number,
    lng:         Number,
    billetsTotal: Number,  // original ticket count at creation
    billets:      Number,
}));

// ── Email ─────────────────────────────────────────────────────────────────────

const contactEmail = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
});

contactEmail.verify(err => {
    if (err) console.error('[email] Erreur de transport:', err);
    else     console.log('[email] Prêt à envoyer');
});

function sendMail(to, subject, html) {
    contactEmail.sendMail({ from: 'Prochévénements', to, subject, html },
        err => { if (err) console.error('[email] Erreur envoi:', err); }
    );
}

// ── JWT ───────────────────────────────────────────────────────────────────────

function requireAuth(req, res, next) {
    const header = req.headers['authorization'];
    const token  = header && header.startsWith('Bearer ') ? header.slice(7) : null;
    console.log(`[auth] ${req.method} ${req.path} — token présent: ${!!token}`);
    if (!token) return res.status(401).json({ message: 'Authentification requise' });
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        console.log(`[auth] Valide — ${req.user.courriel} (${req.user.role})`);
        next();
    } catch (err) {
        console.warn(`[auth] Token invalide (${req.path}):`, err.message);
        return res.status(401).json({ message: 'Session expirée ou invalide' });
    }
}

// ── Schedule conflict helper ──────────────────────────────────────────────────

function eventsConflict(a, b) {
    // Convert event to absolute minutes from epoch-day for comparison
    const toMins = (dateISO, h, m) => {
        const d = new Date(dateISO);
        return d.getFullYear() * 525960 + (d.getMonth() * 44640) + (d.getDate() * 1440) + h * 60 + m;
    };
    const aStart = toMins(a.dateISO,    a.startHour, a.startMinute);
    const aEnd   = toMins(a.endDateISO || a.dateISO, a.endHour,   a.endMinute);
    const bStart = toMins(b.dateISO,    b.startHour, b.startMinute);
    const bEnd   = toMins(b.endDateISO || b.dateISO, b.endHour,   b.endMinute);
    return aStart < bEnd && bStart < aEnd;
}


// ── Nominatim geocoding helper ─────────────────────────────────────────────────
// Calls OpenStreetMap Nominatim to get lat/lng for a given address string.
// Returns { lat, lng } or null on failure.
// Rate limit: 1 req/sec — only called on event create/modify, so this is fine.
function geocodeAddress(address) {
    return new Promise((resolve) => {
        const encoded = encodeURIComponent(address);
        const options = {
            hostname: 'nominatim.openstreetmap.org',
            path: `/search?q=${encoded}&format=json&limit=1`,
            headers: {
                'User-Agent': 'Prochevenements/1.0 (class-project)',
                'Accept-Language': 'fr',
            },
        };
        https.get(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const results = JSON.parse(data);
                    if (results.length > 0) {
                        console.log(`[geocode] "${address}" → lat:${results[0].lat} lng:${results[0].lon}`);
                        resolve({ lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) });
                    } else {
                        console.warn(`[geocode] No results for: "${address}"`);
                        resolve(null);
                    }
                } catch (err) {
                    console.error('[geocode] Parse error:', err);
                    resolve(null);
                }
            });
        }).on('error', (err) => {
            console.error('[geocode] Request error:', err);
            resolve(null);
        });
    });
}

// ── Public routes ──────────────────────────────────────────────────────────────

app.post('/auth/register', async (req, res) => {
    const { nom, courriel, postal, motpasse, vendeur } = req.body;
    console.log(`[register] Tentative — courriel: ${courriel}`);
    try {
        const existing = await joueurs.findOne({ courriel });
        if (existing) {
            console.warn(`[register] Compte déjà existant: ${courriel}`);
            return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
        }
        const hash = await bcrypt.hash(motpasse, BCRYPT_ROUNDS);
        await new joueurs({
            _id: new mongoose.Types.ObjectId(),
            nom, courriel, postal, motpasse: hash, vendeur,
            panier: [], achats: [],
        }).save();
        console.log(`[register] Compte créé: ${courriel}`);
        res.status(201).json({ message: 'Compte créé avec succès' });
        sendMail(courriel, 'Bienvenue à Prochévénements !',
            `<h1>Bienvenue, ${nom} !</h1>
             <p>Votre compte a été créé avec succès.</p>
             <p>Vous pouvez maintenant parcourir et acheter des billets pour des événements locaux.</p>`
        );
    } catch (err) {
        console.error('[register] Erreur:', err);
        res.status(500).json({ message: 'Erreur lors de la création du compte' });
    }
});

app.post('/auth/login', async (req, res) => {
    const { courriel, motpasse } = req.body;
    console.log(`[login] Tentative — courriel: ${courriel}`);
    try {
        const joueur = await joueurs.findOne({ courriel });
        if (!joueur) {
            console.warn(`[login] Utilisateur non trouvé: ${courriel}`);
            return res.status(400).json({ message: 'Utilisateur non trouvé' });
        }
        console.log('[login] Utilisateur trouvé, vérification du mot de passe...');
        const match = await bcrypt.compare(motpasse, joueur.motpasse);
        if (!match) {
            console.warn(`[login] Mot de passe incorrect pour: ${courriel}`);
            return res.status(400).json({ message: 'Mot de passe incorrect' });
        }
        const role  = joueur.vendeur === 1 ? 'Vendeur' : 'Utilisateur';
        const token = jwt.sign(
            { id: joueur._id, courriel: joueur.courriel, role },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );
        console.log(`[login] Connexion réussie — ${courriel} (${role})`);
        res.status(200).json({
            message: 'Connexion réussie',
            nom: joueur.nom, role,
            postal: joueur.postal || '',
            route: role === 'Vendeur' ? '/Vendeur' : '/Magasiner',
            token,
        });
    } catch (err) {
        console.error('[login] Erreur:', err);
        res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
});

app.post('/auth/forgot', async (req, res) => {
    const { courriel } = req.body;
    console.log(`[forgot] Demande — courriel: ${courriel}`);
    try {
        const joueur = await joueurs.findOne({ courriel });
        if (!joueur) return res.status(400).json({ message: "Ce compte n'existe pas" });
        const code   = String(Math.floor(Math.random() * 9000) + 1000);
        const expiry = new Date(Date.now() + 15 * 60 * 1000);
        await joueurs.findOneAndUpdate({ courriel }, { resetCode: code, resetExpiry: expiry });
        console.log(`[forgot] Code généré: ${code}, expire: ${expiry.toISOString()}`);
        sendMail(courriel, 'Code de vérification — Prochévénements',
            `<h1>Votre code de vérification est <strong>${code}</strong></h1>
             <p>Ce code expire dans 15 minutes.</p>
             <p>Si vous n'avez pas demandé de réinitialisation, ignorez ce message.</p>`
        );
        res.status(200).json({ message: 'Courriel envoyé avec succès' });
    } catch (err) {
        console.error('[forgot] Erreur:', err);
        res.status(500).json({ message: "Erreur lors de l'envoi du courriel" });
    }
});

app.post('/auth/reinitialize', async (req, res) => {
    const { courriel, verificationfe, password } = req.body;
    console.log(`[reinitialize] Tentative — courriel: ${courriel}, code reçu: ${verificationfe}`);
    try {
        const joueur = await joueurs.findOne({ courriel });
        if (!joueur) return res.status(400).json({ message: "Ce compte n'existe pas" });
        console.log(`[reinitialize] Code enregistré: ${joueur.resetCode}, expiry: ${joueur.resetExpiry}`);
        if (!joueur.resetCode || joueur.resetCode !== verificationfe)
            return res.status(400).json({ message: 'Code de vérification invalide' });
        if (!joueur.resetExpiry || joueur.resetExpiry < new Date())
            return res.status(400).json({ message: 'Code de vérification expiré' });
        const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
        await joueurs.findOneAndUpdate({ courriel }, { motpasse: hash, resetCode: null, resetExpiry: null });
        console.log(`[reinitialize] Mot de passe réinitialisé: ${courriel}`);
        res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
    } catch (err) {
        console.error('[reinitialize] Erreur:', err);
        res.status(500).json({ message: 'Erreur lors de la réinitialisation' });
    }
});

app.get('/auth/eventTable', async (req, res) => {
    console.log('[eventTable] Récupération de tous les événements');
    try {
        const todayISO = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        // Only return events whose end date (or start date for single-day) is today or future
        const events = await evenements.find({
            $or: [
                { endDateISO: { $gte: todayISO } },
                { endDateISO: { $exists: false }, dateISO: { $gte: todayISO } },
                { endDateISO: '' }, { endDateISO: null }, // fallback for legacy events
            ]
        });
        console.log(`[eventTable] ${events.length} événement(s) trouvé(s)`);
        res.status(200).json(events.map(e => ({
            _id: e._id, nom: e.nom, description: e.description,
            prix: e.prix, date: e.date, dateISO: e.dateISO, endDateISO: e.endDateISO,
            startHour: e.startHour, startMinute: e.startMinute,
            endHour: e.endHour, endMinute: e.endMinute,
            location: e.location, billets: e.billets, billetsTotal: e.billetsTotal, vendeurNom: e.vendeurNom,
            lat: e.lat, lng: e.lng,
        })));
    } catch (err) {
        console.error('[eventTable] Erreur:', err);
        res.status(500).json({ message: 'Erreur lors de la récupération des événements' });
    }
});

app.post('/auth/eventSearch', async (req, res) => {
    const { id, nom } = req.body;
    console.log(`[eventSearch] Recherche: id=${id} nom=${nom}`);
    try {
        // Accept lookup by _id (preferred) or by nom (legacy fallback)
        const query = id ? { _id: id } : { nom };
        const event = await evenements.findOne(query);
        if (!event) {
            console.warn('[eventSearch] Non trouvé');
            return res.status(404).json({ message: 'Événement non trouvé' });
        }
        console.log(`[eventSearch] Trouvé: ${event.nom}`);
        res.status(200).json({
            id: event._id, nom: event.nom, description: event.description,
            prix: event.prix, date: event.date, dateISO: event.dateISO,
            endDateISO: event.endDateISO, vendeurNom: event.vendeurNom,
            startHour: event.startHour, startMinute: event.startMinute,
            endHour: event.endHour, endMinute: event.endMinute,
            location: event.location, billets: event.billets,
        });
    } catch (err) {
        console.error('[eventSearch] Erreur:', err);
        res.status(500).json({ message: "Erreur lors de la recherche de l'événement" });
    }
});

// ── Protected routes ───────────────────────────────────────────────────────────

app.post('/auth/search', requireAuth, async (req, res) => {
    console.log(`[search] Recherche compte: ${req.user.courriel}`);
    try {
        const joueur = await joueurs.findOne({ courriel: req.user.courriel });
        if (!joueur) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        res.status(200).json({ nom: joueur.nom, postal: joueur.postal });
    } catch (err) {
        console.error('[search] Erreur:', err);
        res.status(500).json({ message: 'Erreur lors de la recherche' });
    }
});

app.post('/auth/modify', requireAuth, async (req, res) => {
    const { nom, postal } = req.body;
    console.log(`[modify] Modification: ${req.user.courriel}`);
    try {
        await joueurs.findOneAndUpdate({ courriel: req.user.courriel }, { nom, postal });
        res.status(200).json({ message: 'Compte modifié avec succès' });
    } catch (err) {
        console.error('[modify] Erreur:', err);
        res.status(500).json({ message: 'Erreur lors de la modification' });
    }
});

app.post('/auth/delete', requireAuth, async (req, res) => {
    const { motpasse } = req.body;
    console.log(`[delete] Suppression: ${req.user.courriel}`);
    try {
        if (!motpasse) return res.status(400).json({ message: 'Mot de passe requis pour supprimer le compte.' });
        const joueur = await joueurs.findOne({ courriel: req.user.courriel });
        if (!joueur) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        const match = await bcrypt.compare(motpasse, joueur.motpasse);
        if (!match) return res.status(400).json({ message: 'Mot de passe incorrect.' });
        await joueurs.deleteOne({ courriel: req.user.courriel });
        res.status(200).json({ message: 'Compte supprimé avec succès' });
    } catch (err) {
        console.error('[delete] Erreur:', err);
        res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
});

// ── Cart ───────────────────────────────────────────────────────────────────────

app.get('/auth/cart', requireAuth, async (req, res) => {
    console.log(`[cart] Récupération panier: ${req.user.courriel}`);
    try {
        const joueur = await joueurs.findOne({ courriel: req.user.courriel });
        if (!joueur) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        const panierItems = joueur.panier || [];
        const events = await Promise.all(panierItems.map(item =>
            item.id ? evenements.findOne({ _id: item.id }) : evenements.findOne({ nom: item.nom })
        ));
        const valid = events.map((e, i) => e ? {
            nom: e.nom, date: e.date, dateISO: e.dateISO,
            startHour: e.startHour, startMinute: e.startMinute,
            endHour: e.endHour, endMinute: e.endMinute,
            prix: e.prix, location: e.location, billets: e.billets,
            quantity: panierItems[i].quantity || 1,
        } : null).filter(Boolean);
        console.log(`[cart] ${valid.length} article(s)`);
        res.status(200).json(valid);
    } catch (err) {
        console.error('[cart] Erreur:', err);
        res.status(500).json({ message: 'Erreur lors de la récupération du panier' });
    }
});

app.post('/auth/cart/add', requireAuth, async (req, res) => {
    const { nom, quantity = 1 } = req.body;
    const qty = Math.max(1, parseInt(quantity) || 1);
    console.log(`[cart/add] Ajout: ${nom} x${qty} — ${req.user.courriel}`);
    try {
        const event = await evenements.findOne({ nom });
        if (!event) return res.status(404).json({ message: 'Événement non trouvé' });
        if (event.billets <= 0) return res.status(400).json({ message: 'Cet événement est complet' });
        if (event.billets < qty) return res.status(400).json({ message: `Seulement ${event.billets} billet(s) disponible(s)` });

        // Add to cart — no conflict check here; cart is for browsing.
        // Conflicts are warned about at purchase time only.
        const eventId = String(event._id);
        const joueur  = await joueurs.findOne({ courriel: req.user.courriel });
        if (!joueur) return res.status(404).json({ message: 'Utilisateur non trouvé' });

        const existing = joueur.panier && joueur.panier.find(p => p.id === eventId || p.nom === nom);
        if (existing) {
            await joueurs.findOneAndUpdate(
                { courriel: req.user.courriel, 'panier.id': eventId },
                { $inc: { 'panier.$.quantity': qty } }
            );
        } else {
            await joueurs.findOneAndUpdate(
                { courriel: req.user.courriel },
                { $push: { panier: { id: eventId, nom, quantity: qty } } }
            );
        }
        console.log(`[cart/add] Ajouté: ${nom} x${qty}`);
        res.status(200).json({ message: 'Événement ajouté au panier' });
    } catch (err) {
        console.error('[cart/add] Erreur:', err);
        res.status(500).json({ message: "Erreur lors de l'ajout au panier" });
    }
});

app.post('/auth/cart/remove', requireAuth, async (req, res) => {
    const { nom } = req.body;
    console.log(`[cart/remove] Retrait: ${nom} — ${req.user.courriel}`);
    try {
        const { id: removeId, nom: removeNom } = req.body;
        const pullQuery = removeId ? { id: removeId } : { nom: removeNom };
        await joueurs.findOneAndUpdate(
            { courriel: req.user.courriel },
            { $pull: { panier: pullQuery } }
        );
        console.log(`[cart/remove] Retiré: ${nom}`);
        res.status(200).json({ message: 'Événement retiré du panier' });
    } catch (err) {
        console.error('[cart/remove] Erreur:', err);
        res.status(500).json({ message: 'Erreur lors du retrait du panier' });
    }
});

// ── Purchase ───────────────────────────────────────────────────────────────────

app.post('/auth/purchase', requireAuth, async (req, res) => {
    console.log(`[purchase] Achat initié par: ${req.user.courriel}`);
    try {
        const joueur = await joueurs.findOne({ courriel: req.user.courriel });
        if (!joueur) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        if (!joueur.panier || joueur.panier.length === 0)
            return res.status(400).json({ message: 'Le panier est vide' });

        const panierItems = joueur.panier || [];
        const cartEvents  = await Promise.all(panierItems.map(item =>
            item.id ? evenements.findOne({ _id: item.id }) : evenements.findOne({ nom: item.nom })
        ));
        const valid       = cartEvents.map((e, i) => e ? { ...e._doc, quantity: panierItems[i].quantity || 1 } : null).filter(Boolean);

        // Check availability
        for (const e of valid) {
            if (e.billets <= 0)
                return res.status(400).json({ message: `${e.nom} est maintenant complet` });
            if (e.billets < e.quantity)
                return res.status(400).json({ message: `Seulement ${e.billets} billet(s) disponible(s) pour ${e.nom}` });
        }

        // Collect schedule conflicts — warn only, do not block
        const conflictWarnings = [];
        for (let i = 0; i < valid.length; i++) {
            for (let j = i + 1; j < valid.length; j++) {
                if (eventsConflict(valid[i], valid[j]))
                    conflictWarnings.push(`"${valid[i].nom}" et "${valid[j].nom}"`);
            }
        }
        for (const e of valid) {
            const conflits = (joueur.achats || []).filter(a => eventsConflict(a, e));
            if (conflits.length > 0)
                conflictWarnings.push(`"${e.nom}" chevauche : ${conflits.map(c => c.eventNom).join(', ')}`);
        }
        if (conflictWarnings.length > 0)
            console.warn(`[purchase] Conflits (avertissement): ${conflictWarnings.join(' | ')}`);

        // Create one achat entry per ticket (quantity > 1 = multiple entries)
        const newAchats = valid.flatMap(e =>
            Array.from({ length: e.quantity || 1 }, () => ({
                eventId:          String(e._id || ''),
                confirmationCode: crypto.randomUUID().toUpperCase().replace(/-/g, '').slice(0, 12),
                eventNom:         e.nom, date: e.date, dateISO: e.dateISO,
                location:         e.location || '',
                startHour: e.startHour, startMinute: e.startMinute,
                endHour: e.endHour, endMinute: e.endMinute,
                prix: e.prix, acheteLe: new Date(),
            }))
        );

        // Decrement billets, save purchases, clear cart
        await Promise.all(valid.map(e => evenements.findOneAndUpdate({ nom: e.nom }, { $inc: { billets: -(e.quantity || 1) } })));
        await joueurs.findOneAndUpdate(
            { courriel: req.user.courriel },
            { $push: { achats: { $each: newAchats } }, $set: { panier: [] } }
        );

        const total = valid.reduce((s, e) => s + (e.prix || 0) * (e.quantity || 1), 0);
        console.log(`[purchase] Confirmé — ${valid.length} billet(s), total: $${total}`);

        const rows = valid.map(e =>
            `<tr><td style="padding:8px;border-bottom:1px solid #eee">${e.nom}</td>
                 <td style="padding:8px;border-bottom:1px solid #eee">${e.date}</td>
                 <td style="padding:8px;border-bottom:1px solid #eee">x${e.quantity || 1}</td>
                 <td style="padding:8px;border-bottom:1px solid #eee">${e.prix === 0 ? 'Gratuit' : `$${((e.prix || 0) * (e.quantity || 1)).toFixed(2)}`}</td></tr>`
        ).join('');

        sendMail(req.user.courriel, 'Confirmation de votre achat — Prochévénements',
            `<h1>Merci pour votre achat !</h1>
             <p>Voici le récapitulatif de votre commande :</p>
             <table style="border-collapse:collapse;width:100%;max-width:500px">
               <thead><tr style="background:#1A1A1A;color:#FAF7F2">
                 <th style="padding:8px;text-align:left">Événement</th>
                 <th style="padding:8px;text-align:left">Date</th>
                 <th style="padding:8px;text-align:left">Prix</th>
               </tr></thead>
               <tbody>${rows}</tbody>
               <tfoot><tr>
                 <td colspan="2" style="padding:8px;font-weight:bold">Total</td>
                 <td style="padding:8px;font-weight:bold">${total === 0 ? 'Gratuit' : `$${total}`}</td>
               </tr></tfoot>
             </table>
             <p>Bonne journée !</p>`
        );

        res.status(200).json({
            message: 'Achat confirmé avec succès',
            achats: newAchats,
            ...(conflictWarnings.length > 0 ? { warnings: conflictWarnings } : {}),
        });
    } catch (err) {
        console.error('[purchase] Erreur:', err);
        res.status(500).json({ message: "Erreur lors de l'achat" });
    }
});

// ── User tickets ───────────────────────────────────────────────────────────────

app.get('/auth/userTickets', requireAuth, async (req, res) => {
    console.log(`[userTickets] Récupération billets: ${req.user.courriel}`);
    try {
        const joueur = await joueurs.findOne({ courriel: req.user.courriel });
        if (!joueur) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        console.log(`[userTickets] ${(joueur.achats || []).length} billet(s)`);
        res.status(200).json((joueur.achats || []).map(a => ({
            eventId:          a.eventId,
            confirmationCode: a.confirmationCode,
            eventNom:         a.eventNom,
            date:             a.date,
            dateISO:          a.dateISO,
            location:         a.location,
            startHour:        a.startHour,
            startMinute:      a.startMinute,
            endHour:          a.endHour,
            endMinute:        a.endMinute,
            prix:             a.prix,
            acheteLe:         a.acheteLe,
        })));
    } catch (err) {
        console.error('[userTickets] Erreur:', err);
        res.status(500).json({ message: 'Erreur lors de la récupération des billets' });
    }
});

// ── Vendor routes ──────────────────────────────────────────────────────────────

app.post('/auth/event', requireAuth, async (req, res) => {
    console.log(`[event] Création par: ${req.user.courriel}`);
    try {
        if (req.user.role !== 'Vendeur') return res.status(403).json({ message: 'Accès refusé' });
        const { nom, description, prix, date, dateISO, endDateISO, startHour, startMinute, endHour, endMinute, location, billets } = req.body;
        console.log(`[event] nom: ${nom}, date: ${date}, dateISO: ${dateISO}, endDateISO: ${endDateISO}, ${startHour}:${startMinute}–${endHour}:${endMinute}`);
        if (!nom || !dateISO || startHour === undefined || endHour === undefined) {
            return res.status(400).json({ message: 'Champs obligatoires manquants (nom, date, heures)' });
        }
        const existing = await evenements.findOne({ nom });
        if (existing) return res.status(400).json({ message: 'Cet événement existe déjà' });
        // Get vendor's name and geocode the address
        const vendeur = await joueurs.findOne({ courriel: req.user.courriel });
        const coords  = location ? await geocodeAddress(location) : null;
        await new evenements({
            _id: new mongoose.Types.ObjectId(),
            nom, description, prix: Number(prix),
            date, dateISO, endDateISO: endDateISO || dateISO,
            startHour: Number(startHour), startMinute: Number(startMinute),
            endHour:   Number(endHour),   endMinute:   Number(endMinute),
            location,
            billetsTotal: Number(billets),
            billets:      Number(billets),
            vendeurNom: vendeur ? vendeur.nom : 'Vendeur',
            lat: coords ? coords.lat : null,
            lng: coords ? coords.lng : null,
        }).save();
        console.log(`[event] Créé: ${nom}`);
        res.status(201).json({ message: 'Événement créé avec succès' });
    } catch (err) {
        console.error('[event] Erreur:', err);
        res.status(500).json({ message: "Erreur lors de la création de l'événement" });
    }
});

app.post('/auth/eventModify', requireAuth, async (req, res) => {
    const { id, nom, description, prix, date, dateISO, endDateISO, startHour, startMinute, endHour, endMinute, location, billets } = req.body;
    console.log(`[eventModify] Modification: id=${id} nom=${nom} par: ${req.user.courriel}`);
    try {
        if (req.user.role !== 'Vendeur') return res.status(403).json({ message: 'Accès refusé' });
        const query = id ? { _id: id } : { nom };
        const existing = await evenements.findOne(query);
        if (!existing) return res.status(404).json({ message: 'Événement non trouvé' });

        // Block modification of ended events
        const todayISO = new Date().toISOString().split('T')[0];
        const eventEnd = existing.endDateISO || existing.dateISO || '';
        if (eventEnd && eventEnd < todayISO) {
            return res.status(403).json({ message: 'Cet événement est terminé et ne peut plus être modifié.' });
        }

        if (!dateISO || startHour === undefined || endHour === undefined) {
            return res.status(400).json({ message: 'Champs obligatoires manquants (date, heures)' });
        }
        // Re-geocode if location was provided
        const modCoords = location ? await geocodeAddress(location) : null;
        const geoUpdate = modCoords ? { lat: modCoords.lat, lng: modCoords.lng } : {};
        await evenements.findOneAndUpdate(query, {
            description, prix: Number(prix),
            date, dateISO, endDateISO: endDateISO || dateISO,
            startHour: Number(startHour), startMinute: Number(startMinute),
            endHour:   Number(endHour),   endMinute:   Number(endMinute),
            location, billets: Number(billets),
            ...geoUpdate,
        });
        console.log(`[eventModify] Modifié: ${existing.nom}`);
        res.status(200).json({ message: 'Événement modifié avec succès' });
    } catch (err) {
        console.error('[eventModify] Erreur:', err);
        res.status(500).json({ message: "Erreur lors de la modification de l'événement" });
    }
});

app.post('/auth/eventDelete', requireAuth, async (req, res) => {
    const { nom } = req.body;
    console.log(`[eventDelete] Suppression: ${nom} par: ${req.user.courriel}`);
    try {
        if (req.user.role !== 'Vendeur') return res.status(403).json({ message: 'Accès refusé' });
        const query = req.body.id ? { _id: req.body.id } : { nom };
        const existing = await evenements.findOne(query);
        if (!existing) return res.status(404).json({ message: 'Événement non trouvé' });
        await evenements.deleteOne(query);
        console.log(`[eventDelete] Supprimé: ${existing.nom}`);
        res.status(200).json({ message: 'Événement supprimé avec succès' });
    } catch (err) {
        console.error('[eventDelete] Erreur:', err);
        res.status(500).json({ message: "Erreur lors de la suppression de l'événement" });
    }
});


// Vendor's own events
app.get('/auth/vendorEvents', requireAuth, async (req, res) => {
    console.log(`[vendorEvents] Récupération pour: ${req.user.courriel}`);
    try {
        if (req.user.role !== 'Vendeur') return res.status(403).json({ message: 'Accès refusé' });
        const vendeur = await joueurs.findOne({ courriel: req.user.courriel });
        const events  = await evenements.find({ vendeurNom: vendeur ? vendeur.nom : null });
        console.log(`[vendorEvents] ${events.length} événement(s)`);
        res.status(200).json(events.map(e => ({
            _id: e._id, nom: e.nom, description: e.description,
            prix: e.prix, date: e.date, dateISO: e.dateISO, endDateISO: e.endDateISO,
            startHour: e.startHour, startMinute: e.startMinute,
            endHour: e.endHour, endMinute: e.endMinute,
            location: e.location, billets: e.billets, billetsTotal: e.billetsTotal,
        })));
    } catch (err) {
        console.error('[vendorEvents] Erreur:', err);
        res.status(500).json({ message: 'Erreur lors de la récupération' });
    }
});

// Change password (requires current password)
app.post('/auth/changePassword', requireAuth, async (req, res) => {
    const { motpasseActuel, motpasseNouveau } = req.body;
    console.log(`[changePassword] Tentative: ${req.user.courriel}`);
    try {
        const joueur = await joueurs.findOne({ courriel: req.user.courriel });
        if (!joueur) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        const match = await bcrypt.compare(motpasseActuel, joueur.motpasse);
        if (!match) return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
        const hash = await bcrypt.hash(motpasseNouveau, BCRYPT_ROUNDS);
        await joueurs.findOneAndUpdate({ courriel: req.user.courriel }, { motpasse: hash });
        console.log(`[changePassword] Succès: ${req.user.courriel}`);
        res.status(200).json({ message: 'Mot de passe modifié avec succès' });
    } catch (err) {
        console.error('[changePassword] Erreur:', err);
        res.status(500).json({ message: 'Erreur lors du changement de mot de passe' });
    }
});

// Cancel a ticket (remove from achats, restore one billet)
app.post('/auth/cancelTicket', requireAuth, async (req, res) => {
    const { eventNom, dateISO } = req.body;
    console.log(`[cancelTicket] ${req.user.courriel} annule: ${eventNom}`);
    try {
        const joueur = await joueurs.findOne({ courriel: req.user.courriel });
        if (!joueur) return res.status(404).json({ message: 'Utilisateur non trouvé' });

        // Find the first matching achat
        const idx = (joueur.achats || []).findIndex(
            a => a.eventNom === eventNom && a.dateISO === dateISO
        );
        if (idx === -1) return res.status(404).json({ message: 'Billet non trouvé' });

        const achat = joueur.achats[idx];

        // Refund window: block cancellations within 48 hours of event start
        const REFUND_WINDOW_HOURS = 48;
        if (achat.dateISO) {
            const eventStart = new Date(achat.dateISO);
            eventStart.setHours(achat.startHour || 0, achat.startMinute || 0, 0, 0);
            const hoursUntilEvent = (eventStart - new Date()) / (1000 * 60 * 60);
            if (hoursUntilEvent < REFUND_WINDOW_HOURS) {
                const h = Math.max(0, Math.round(hoursUntilEvent));
                return res.status(403).json({
                    message: hoursUntilEvent <= 0
                        ? 'Cet événement est déjà passé.'
                        : `Les annulations ne sont plus acceptées à moins de ${REFUND_WINDOW_HOURS}h de l'événement (${h}h restantes).`
                });
            }
        }

        // Remove the one achat entry
        const newAchats = [...joueur.achats];
        newAchats.splice(idx, 1);
        await joueurs.findOneAndUpdate({ courriel: req.user.courriel }, { $set: { achats: newAchats } });

        // Restore one billet to the event
        await evenements.findOneAndUpdate({ nom: eventNom }, { $inc: { billets: 1 } });

        console.log(`[cancelTicket] Annulé: ${eventNom} pour ${req.user.courriel}`);
        res.status(200).json({ message: 'Billet annulé avec succès' });
    } catch (err) {
        console.error('[cancelTicket] Erreur:', err);
        res.status(500).json({ message: "Erreur lors de l'annulation" });
    }
});


// Vendor dashboard stats
app.get('/auth/vendorStats', requireAuth, async (req, res) => {
    console.log(`[vendorStats] Récupération pour: ${req.user.courriel}`);
    try {
        if (req.user.role !== 'Vendeur') return res.status(403).json({ message: 'Accès refusé' });

        // Get this vendor's events
        const vendeur  = await joueurs.findOne({ courriel: req.user.courriel });
        const myEvents = await evenements.find({ vendeurNom: vendeur ? vendeur.nom : '__none__' });
        const myNoms   = new Set(myEvents.map(e => e.nom));

        // Scan all users' achats for purchases of this vendor's events
        const allUsers  = await joueurs.find({ 'achats.0': { $exists: true } });
        const salesMap  = {}; // nom -> { billetsSold, revenu }

        myEvents.forEach(e => {
            salesMap[e.nom] = {
                eventNom:     e.nom,
                date:         e.date,
                billetsTotal: e.billets,
                billetsSold:  0,
                revenu:       0,
            };
        });

        allUsers.forEach(user => {
            (user.achats || []).forEach(achat => {
                if (myNoms.has(achat.eventNom)) {
                    salesMap[achat.eventNom].billetsSold += 1;
                    salesMap[achat.eventNom].revenu     += achat.prix || 0;
                }
            });
        });

        const stats = Object.values(salesMap);
        const totals = {
            totalBillets:  stats.reduce((s, e) => s + e.billetsSold, 0),
            totalRevenu:   stats.reduce((s, e) => s + e.revenu,      0),
            totalEvenements: myEvents.length,
        };

        console.log(`[vendorStats] ${myEvents.length} événement(s), ${totals.totalBillets} billets vendus`);
        res.status(200).json({ stats, totals });
    } catch (err) {
        console.error('[vendorStats] Erreur:', err);
        res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
    }
});


http.createServer(app).listen(port, () => console.log(`[init] Serveur en écoute sur le port ${port}`));
