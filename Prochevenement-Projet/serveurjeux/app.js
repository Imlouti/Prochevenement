const express = require("express");
const http = require("http");
const mongoose = require('mongoose');
const cors = require("cors");
const nodemailer  = require("nodemailer");
const bodyParser = require("body-parser");
require("dotenv").config();

//routes et quelle port
const port = process.env.PORT || 4001;
const index = require("./routes/index.js");
const app = express();
app.use(index);

app.use(bodyParser.json());  // Pour analyser les requêtes JSON



// Autoriser les requêtes provenant de localhost:3000 (votre frontend)
app.use(cors({
    origin: 'http://localhost:3000', // Permet les requêtes de ce domaine
    methods: ['GET', 'POST'], // Autorise les méthodes GET et POST
    allowedHeaders: ['Content-Type'], // Permet d'envoyer le Content-Type dans les en-têtes
}));


//creer le serveur
const server = http.createServer(app);


app.use(bodyParser.json());

const contactEmail = nodemailer.createTransport({
  service:'gmail',
  auth: {
    user: 'prochevenement@gmail.com',
    pass: 'cnvd gpun oupu pdbu'
  }
});
contactEmail.verify((error)=>{
  if(error){
    console.log(error);

  }
  else{
    console.log("Ready to send");
  }
})

var joueurs; //collection joueurs
mongoose.connect('mongodb://127.0.0.1:27017/Prochevenement');
  joueurs = mongoose.model('joueurs', new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    nom: String,
    courriel:String,
    postal:String,
    motpasse:String,
    vendeur:Number

  }));


var evenements; //collection evenements 

evenements = mongoose.model('evenements', new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  nom: String,
  description: String,
  prix: Number,
  date: String,
  location: String,
  billets: Number
}));

var panier; //collection evenements 

panier = mongoose.model('panier', new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  nom: String,
  description: String,
  prix: Number,
  date: String,
  location: String,
  billets: Number
}));



// Route de création d'un compte
app.post('/auth/register', async (req, res) => {
  const { nom, courriel, postal, motpasse, vendeur } = req.body;

  // Vérifier si un utilisateur avec le même courriel existe déjà
  const existingUser = await joueurs.findOne({ courriel });
  if (existingUser) {
      return res.status(400).json({ message: "Cet utilisateur existe déjà" });
  }

  // Créer un nouveau joueur
  const newUser = new joueurs({
      _id: new mongoose.Types.ObjectId(),
      nom,
      courriel,
      postal,
      motpasse,
      vendeur
  });

  try {
      await newUser.save();
      res.status(201).json({ message: "Compte créé avec succès" });
      //Enovye un courriel lorsque le compte a ete creer
      const mail ={
      from: "Prochévénement",
      to: courriel,
      subject: "Message de bienvenue",
      html: `<h1>Bienvenue a prochevenement ${nom}</h1>`
    }
    contactEmail.sendMail(mail, (error)=>{
  if(error){
    console.log(error);

  }
});
  } catch (error) {
      res.status(500).json({ message: "Erreur lors de la création du compte", error });
  }
});


// Route de connexion
app.post('/auth/login', async (req, res) => {
  const { courriel, motpasse } = req.body;

  // Recherche de l'utilisateur dans la base de données
  const joueur = await joueurs.findOne({ courriel });

  if (!joueur) { //s'il n'existe pas le message d'erreur va s'afficher au frontend (voire Connexion.js pour plus de details)
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
  }

  // Vérification du mot de passe, sinon le message d'erreur va s'afficher au frontend (voire Connexion.js pour plus de details)
  if (joueur.motpasse !== motpasse) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
  }

  // Si la connexion réussit, redirige l'utilisateur selon son rôle
  const route = joueur.vendeur === 1 ? "/Vendeur" : "/Magasiner";
  res.status(200).json({
      message: "Connexion réussie",
      nom: joueur.nom,  // Renvoie le nom de l'utilisateur
      courriel: joueur.courriel,
      role: joueur.vendeur === 1 ? 'Vendeur' : 'Utilisateur',  // Renvoie le rôle (Vendeur ou Utilisateur)
      route: route  // Envoi de la route de redirection
  });
});


// Route de création d'un evenement
app.post('/auth/event', async (req, res) => {
  const {vendeurID, nom, description, prix, date, location,billets } = req.body;

  // Vérifier si un evenement avec le même nom existe déjà
  const existingEvent = await evenements.findOne({ nom });
  if (existingEvent) {
      return res.status(400).json({ message: "Cet evenement existe déjà" });
  }

  // Créer un nouveau evenement
  const newEvent = new evenements({
      _id: new mongoose.Types.ObjectId(),
      vendeurID,
      nom,
      description,
      prix,
      date,
      location,
      billets
  });

  try {
      await newEvent.save();
      res.status(201).json({ message: "Evenement créé avec succès" });
  } catch (error) {
      res.status(500).json({ message: "Erreur lors de la création de l'événement", error });
  }
});


// Route de création d'un evenement
app.post('/auth/panier', async (req, res) => {
  const {nom, description, prix, date, location,billets } = req.body;

  // Vérifier si un evenement avec le même nom existe déjà
  const existingEvent = await panier.findOne({ nom });
  if (existingEvent) {
      return res.status(400).json({ message: "Cet evenement existe déjà" });
  }

  // Créer un nouveau evenement
  const newPanier = new panier({
      _id: new mongoose.Types.ObjectId(),
      nom,
      description,
      prix,
      date,
      location,
      billets
  });

  try {
      await newPanier.save();
      res.status(201).json({ message: "Evenement créé avec succès" });
  } catch (error) {
      res.status(500).json({ message: "Erreur lors de la création de l'événement", error });
  }
});


let verification;
// Route de création d'un courriel avec code de verification
app.post('/auth/forgot', async (req, res) => {
  const { courriel } = req.body;

  // Vérifier si un utilisateur avec le même courriel existe déjà
  const existingUser = await joueurs.findOne({ courriel });
  if (!existingUser) {
      return res.status(400).json({ message: "Ce compte n'existe pas" });
  }

  verification=Math.floor(Math. random() * (9999 - 1000 + 1)) + 1000;

  //envoyer un courriel avec le code de verification
  const mail ={
    from: "Prochévénement",
    to: courriel,
    subject: "Code de verification",
    html: `<h1>Votre code de verification est ${verification}</h1>`
  }
  contactEmail.sendMail(mail, (error)=>{
if(error){
  console.log(error);

}
});
res.status(201).json({ message: "Courriel envoyer avec succès" });

});

//Route pour reinitialiser
app.post('/auth/reinitialize', async (req, res) => {
  const { courriel, verificationfe, password } = req.body;
  //le code de vérification doit correspondre à l'ancien
  if(verificationfe!=verification){
    return res.status(400).json({ message: "Ce compte n'existe pas" });
  }
  //le compte est mis à jour
  const filter = { courriel: courriel };
  const update = { motpasse: password };
  doc = await joueurs.findOneAndUpdate(filter, update);
  res.status(201).json({ message: "Compte modifier avec succès" });




});

app.post('/auth/search', async (req, res) => {
  const { courriel } = req.body;

  // Recherche de l'utilisateur dans la base de données
  const event = await joueurs.findOne({ courriel: courriel });

  if (!event) { //s'il n'existe pas le message d'erreur va s'afficher au frontend (voire Connexion.js pour plus de details)
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
  }

  // Vérification du mot de passe, sinon le message d'erreur va s'afficher au frontend (voire Connexion.js pour plus de details)
  res.status(200).json({
      message: "Connexion réussie",
      nom: event.nom,  // Renvoie le nom de l'utilisateur
      postal: event.postal,  // Renvoie le rôle (Vendeur ou Utilisateur)

  });
});


//Route pour modifier
app.post('/auth/modify', async (req, res) => {
  
  const { courriel, newcourriel, nom, postal } = req.body;
  // Recherche de l'utilisateur dans la base de données
  const existingUser = await joueurs.findOne({ courriel: courriel });
    if (!existingUser) {
        return res.status(400).json({ message: "Ce compte n'existe pas" });
    }
  //le compte est mis à jour

  const filter = { courriel: courriel };
  const update = { nom: nom, courriel: newcourriel, postal: postal };
  doc = await joueurs.findOneAndUpdate(filter, update);
  res.status(201).json({ message: "Compte modifier avec succès" });




});

app.post('/auth/delete', async (req, res) => {
  const { courriel } = req.body;
  // Recherche de l'utilisateur dans la base de données
  const existingEvent = await joueurs.findOne({ courriel: courriel });
    if (!existingEvent) {
        return res.status(400).json({ message: "Ce compte n'existe pas" });
    }
  //le compte est supprimer

  doc = await joueurs.deleteOne({courriel: courriel});
  res.status(201).json({ message: "Compte modifier avec succès" });

});


//Route pour afficher tous les evenements
app.get('/auth/eventTable', async (req, res) => {
  const events = await evenements.find();
    if (!events) {
        return res.status(400).json({ message: "Pas d'evenements" });
    }
    res.send(events);

});

//Route pour afficher tous les evenements
app.get('/auth/panierTable', async (req, res) => {
  const events = await panier.find();
    if (!events) {
        return res.status(400).json({ message: "Pas d'evenements" });
    }
    res.send(events);

});


app.post('/auth/vendorTable', async (req, res) => {
  const { vendeurID } = req.body;
  const events = await evenements.find({vendeurID: vendeurID});
    if (!events) {
        return res.status(400).json({ message: "Pas d'evenements" });
    }
    res.send(events);

});



app.post('/auth/eventSearch', async (req, res) => {
  const { nom } = req.body;

  // Recherche de l'utilisateur dans la base de données
  const event = await evenements.findOne({ nom: nom });

  if (!event) { //s'il n'existe pas le message d'erreur va s'afficher au frontend (voire Connexion.js pour plus de details)
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
  }

  // Vérification du mot de passe, sinon le message d'erreur va s'afficher au frontend (voire Connexion.js pour plus de details)
  res.status(200).json({
      message: "Connexion réussie",
      description: event.description,  // Renvoie le nom de l'utilisateur
      prix: event.prix,  // Renvoie le rôle (Vendeur ou Utilisateur)
      date: event.date,  // Envoi de la route de redirection
      location: event.location,  // Envoi de la route de redirection
      billets: event.billets  // Envoi de la route de redirection

  });
});

app.post('/auth/eventModify', async (req, res) => {
  const { nom, description, prix, date, location, billets } = req.body;
  // Recherche de l'utilisateur dans la base de données
  const existingEvent = await evenements.findOne({ nom: nom });
    if (!existingEvent) {
        return res.status(400).json({ message: "Ce compte n'existe pas" });
    }
  //le compte est mis à jour

  const filter = { nom: nom };
  const update = { description: description, prix: prix, date: date, location: location , billets: billets};
  doc = await evenements.findOneAndUpdate(filter, update);
  res.status(201).json({ message: "Compte modifier avec succès" });

});

app.post('/auth/eventDelete', async (req, res) => {
  const { nom } = req.body;
  // Recherche de l'utilisateur dans la base de données
  const existingEvent = await evenements.findOne({ nom: nom });
    if (!existingEvent) {
        return res.status(400).json({ message: "Ce compte n'existe pas" });
    }
  //le compte est supprimer

  doc = await evenements.deleteOne({nom: nom});
  res.status(201).json({ message: "Compte modifier avec succès" });

});






server.listen(port, () => console.log(`Listening on port ${port}`));


