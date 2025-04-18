const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require('mongoose');
const path = require("path");
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

const io = socketIo(server);

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

//get fields for email
const mail ={
  from: "Prochévénement",
  to: "kevinburger2000@gmail.com",
  subject: "Reinitialiser votre mot de passe",
  html: `<p>hi</p>`
}
contactEmail.sendMail(mail, (error)=>{
  if(error){
    console.log(error);

  }
});
let vendeur; //vendeur ou non
let nonvalide; //compte pas creer et si vendeur

let routeCreation; //route pour changer de creation a magasiner ou vendeur
let routeConnexion; //route pour changer de creation a magasiner ou vendeur

let trouver;
let trouverFind;

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
  billets: Number
}));
/*
io.on("connection", (socket) => {

    //creation dun compte
    if(vendeur==1){
      routeCreation=["/Vendeur", user];
    }
    else if(vendeur==0){
      routeCreation=["/Connexion", user];
    }

      socket.emit("utilisateur", routeCreation, (callback)=>{
        vendeur=callback[4];
        user=callback;
        create(callback);
        
      });


      //creation dun evenement
  

      socket.emit("evenement", "/Vendeur", (callback)=>{
        createEvent(callback);
        
      });

      /*connexion dun compte doesnt work yet
      if(nonvalide==1){
        routeConnexion=["/Vendeur",trouverFind];
      }
      else if(nonvalide==0){
        routeConnexion=["/Magasiner",trouverFind];
      }
      else if(nonvalide==2){
        routeConnexion="/Connexion";
      }
  
        socket.emit("connexion", routeConnexion, (callback)=>{
          trouver=trouverCompte(callback)
          if(trouver[0]==false){
            nonvalide=2;
          }
          else{
            trouverFind=trouver[1] //pour liste de tous les info de lutilisateur
            nonvalide=callback[1][4]; //pour savoir si vendeur ou non
          }
          
          }
        );



});
*/

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

/*
async function create(user) {
  const nouveauJoueur = new joueurs({ _id: new mongoose.Types.ObjectId(), nom: user[0], courriel:user[1], postal:user[2], motpasse:user[3], vendeur:user[4]
 });
  await nouveauJoueur.save();
  console.log(nouveauJoueur.nom);
}

async function createEvent(event) {

  const nouveauEvent = new evenements({ _id: new mongoose.Types.ObjectId(), nom: event[0], description:event[1], prix:event[2], date:event[3], billets:event[4]
 });
  await nouveauEvent.save();
  console.log(nouveauEvent.nom);
}


async function trouverCompte(user){

const joueur = await joueurs.findOne({ 'courriel': user[1] }, 'nom courriel postal motpasse vendeur');
userFind=[joueur.nom, joueur.courriel, joueur.postal, joueur.motpasse, joueur.vendeur];
if(user[0]==userFind[0] && user[1]==userFind[1] && user[2]==userFind[3]){
  return [true, userFind]
}
else{
  return [false, 0]
}
}*/


server.listen(port, () => console.log(`Listening on port ${port}`));