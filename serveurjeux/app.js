const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require('mongoose');

//routes et quelle port
const port = process.env.PORT || 4001;
const index = require("./routes/index.js");
const app = express();
app.use(index);

const question = require('./routes/question');
app.use('/question', question);

const gagnant = require('./routes/gagnant');
app.use('/gagnant', gagnant);

//creer le serveur
const server = http.createServer(app);

const io = socketIo(server);

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
        );*/



});


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
}


server.listen(port, () => console.log(`Listening on port ${port}`));