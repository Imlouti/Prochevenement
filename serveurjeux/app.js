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

  if (!joueur) {
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
  }

  // Vérification du mot de passe
  if (joueur.motpasse !== motpasse) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
  }

  // Si la connexion réussit, redirige l'utilisateur selon son rôle
  const route = joueur.vendeur === 1 ? "/Vendeur" : "/Magasiner";
  res.status(200).json({
      message: "Connexion réussie",
      nom: joueur.nom,  // Renvoie le nom de l'utilisateur
      role: joueur.vendeur === 1 ? 'Vendeur' : 'Utilisateur',  // Renvoie le rôle (Vendeur ou Utilisateur)
      route: route  // Envoi de la route de redirection
  });
});


// Route de création d'un evenement
app.post('/auth/event', async (req, res) => {
  const { nom, description, prix, date, location,billets } = req.body;

  // Vérifier si un utilisateur avec le même courriel existe déjà
  const existingEvent = await evenements.findOne({ nom });
  if (existingEvent) {
      return res.status(400).json({ message: "Cet evenement existe déjà" });
  }

  // Créer un nouveau evenement
  const newEvent = new evenements({
      _id: new mongoose.Types.ObjectId(),
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
      res.status(500).json({ message: "Erreur lors de la création de levenement", error });
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
    //verification code matches old one and email updated with new password findOneAndUpdate
  if(verificationfe!=verification){
    return res.status(400).json({ message: "Ce compte n'existe pas" });
  }
  //update it
  const filter = { courriel: courriel };
  const update = { motpasse: password };
  doc = await joueurs.findOneAndUpdate(filter, update);
  res.status(201).json({ message: "Compte modifier avec succès" });




});

//Route pour modifier
app.post('/auth/modify', async (req, res) => {
  
  const { courriel, newcourriel, nom, postal } = req.body;
  // Recherche de l'utilisateur dans la base de données
  const existingUser = await joueurs.findOne({ courriel: courriel });
    if (!existingUser) {
        return res.status(400).json({ message: "Ce compte n'existe pas" });
    }
    //update it

  const filter = { courriel: courriel };
  const update = { nom: nom, courriel: newcourriel, postal: postal };
  doc = await joueurs.findOneAndUpdate(filter, update);
  res.status(201).json({ message: "Compte modifier avec succès" });




});

//Route pour afficher tous les evenements
app.get('/auth/eventTable', async (req, res) => {
    
  const events = await evenements.find();
    if (!events) {
        return res.status(400).json({ message: "Pas d'evenements" });
    }
    res.send(events);

//                const response = await fetch('http://localhost:4001/auth/eventTable') // Converting user object to JSON string



});




server.listen(port, () => console.log(`Listening on port ${port}`));


