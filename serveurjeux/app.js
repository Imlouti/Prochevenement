const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongodb = require("mongodb");
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
let intervalReponse; //nombre de reponses

let routeCreation; //route pour changer de creation a magasiner ou vendeur
let routeConnexion; //route pour changer de creation a magasiner ou vendeur

let trouver;
let trouverFind;


let listeBonne; //liste avec les bonnes repsonses
let listeFausse; //liste avec les fausse repsonses
let listeGagnant; //liste avec la page gagnante et linformation du joueur gagnant
let listeTemps; //temps des utilisateurs

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


var questions; //collection questions
questions = mongoose.model('questions', new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  question: String,
  reponse: Boolean
}));

io.on("connection", (socket) => {

    //creation dun compte
    if(vendeur==1){
      routeCreation="/Vendeur";
    }
    else if(vendeur==0){
      routeCreation="/Connexion";
    }

      socket.emit("utilisateur", routeCreation, (callback)=>{
        vendeur=callback[4];
        create(callback);
        
      });

      //connexion dun compte
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
/*
      var promise=trouverQuestion("66eb1c42b3dd1ad002c4fc41");
      var listeQuestionTrouver;
      promise.then((data)=>{
        listeQuestionTrouver=data;
      
    const messageQuestion=listeQuestionTrouver[0]; //question du serveur
      socket.emit("connection", messageQuestion, (callbackMessage)=>{
      });

    let bonneReponse=listeQuestionTrouver[1]; //bonne reponse du serveur
    if(intervalReponse>1){
      if (listeBonne!=undefined){
        listeTemps=creerTemps(listeBonne);
        listeGagnant=["/gagnant", listeBonne[findIndex(listeTemps)],bonneReponse]; //message gagnant est un string avec le message qui contient le gagnant, la bonne reponse et le temps de reponse
      }

      else if (listeFausse!=undefined){
        listeTemps=creerTemps(listeFausse);
        listeGagnant=["/gagnant", listeFausse[findIndex(listeTemps)],bonneReponse]; //message gagnant est un string avec le message qui contient le gagnant, la bonne reponse et le temps de reponse
      }
    }
      socket.emit("repondu", listeGagnant, (callbackRepondu)=>{
        console.log(callbackRepondu); //mettre le temps [1] et la reponse [2] de l'utilisateur [0]
        verifieReponse(callbackRepondu, bonneReponse);
      });
    })*/


});

function verifieReponse(callbackRepondu,bonneReponse){
  if (intervalReponse==undefined){
    intervalReponse=1;
  }
  else {
    intervalReponse=intervalReponse+1;
}
  if (callbackRepondu[2]==bonneReponse){ //si utilisateur a la bonne reponse donc ajoute le a une liste de bonne reponses
    if(listeBonne==undefined){
      listeBonne=[callbackRepondu];
    }
    else{
    listeBonne[intervalReponse-1]=callbackRepondu;
    }
  }
  else{
    if(listeFausse==undefined){
      listeFausse=[callbackRepondu];
    }
    else{
      listeFausse[intervalReponse-1]=callbackRepondu;
  }
}
}

function creerTemps(liste){
  var n=0;
  for (element in liste){
    n++;
  }
  for(let i=0;i<n;i++){
    if (i==0){
      listeTemps=[liste[0][1]];
    }
    else{
    listeTemps[i]=liste[i][1];
    }
  }
      return listeTemps
    }

function findIndex(listeTemps){
  var n=0;
    var minTemps;
    for (element in listeTemps){
      n++;
    }
    for(let i=0;i<n;i++){
      if (minTemps==undefined){
        minTemps=listeTemps[i];
      }
      else if (minTemps>listeTemps[i]){
        minTemps=listeTemps[i];
      }
    }
  for(let i=0;i<n;i++){
    if(minTemps==listeTemps[i]){
      return i;
    }
  }
}

/*async function connection(){
  return new Promise((resolve, reject) => {
    mongoose.connect('mongodb://127.0.0.1:27017/Jeux');
    if (joueurs==undefined){
      joueurs = mongoose.model('joueurs', new mongoose.Schema({
        _id: mongodb.ObjectId,
        nom: String
      }));
      resolve(joueurs);
    }
    else{
      resolve(joueurs);
    }
  })
}*/

async function create(user) {
  //await connection();
  const nouveauJoueur = new joueurs({ _id: new mongoose.Types.ObjectId(), nom: user[0], courriel:user[1], postal:user[2], motpasse:user[3], vendeur:user[4]
 });
  await nouveauJoueur.save();
  console.log(nouveauJoueur.nom);
}

async function trouverCompte(user){

// find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
const joueur = await joueurs.findOne({ 'courriel': user[1] }, 'nom courriel postal motpasse vendeur');
// Prints "Space Ghost is a talk show host".
userFind=[joueur.nom, joueur.courriel, joueur.postal, joueur.motpasse, joueur.vendeur];
if(user[0]==userFind[0] && user[1]==userFind[1] && user[2]==userFind[3]){
  return [true, userFind]
}
else{
  return [false, 0]
}
}

/*
async function 
trouverQuestion et comparer a la reponse de l<utilisateur
*/


server.listen(port, () => console.log(`Listening on port ${port}`));