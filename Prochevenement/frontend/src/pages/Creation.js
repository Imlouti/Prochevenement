import React, { Component } from 'react';
//import './App.css';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://192.168.37.1:4001";


class Creation extends Component {
    async Submit(event) {
        if (event) {
            event.preventDefault(); 
            const socket = socketIOClient(ENDPOINT);
            //client donne le surnom de l<utilisateur au serveur
            var slider=2;
            if(document.getElementById("slider").checked==true){
                slider=1;
            }
            else{
                slider=0;
            }
            var user=[document.getElementById("nom").value,document.getElementById("courriel").value, document.getElementById("postal").value, document.getElementById("password").value, slider];
            socket.on("utilisateur", (arg, callback) => {
                callback(user);
            });
            //serbeur donne la route pour changer de page
            setInterval(() => {
                const socket = socketIOClient(ENDPOINT);
                        socket.on("utilisateur", (arg, callback) => {
                            console.log(arg);
                            if(arg!=undefined){
                                localStorage.setItem("nom", user);
                                document.location.href=arg;
                                //clearInterval();
                            }
                        });
            }, 1000);
        }
    }

    render() { 
        return <div id="background">
                <section id="back">
        <a href="/" id="img"><img src="fleche.png"></img></a>
        </section>
                <h1>
        Creation d’un compte
        </h1>
        <form onSubmit={this.Submit}>
        <input type="text" id="nom" class='input' placeholder="Nom"/>
            <input type="text" id="courriel" class='input' placeholder="Courriel"/>
            <input type="text" id="postal" class='input' placeholder="Code postale"/>
            <input type="text" id="password" class='input' placeholder="Mot de passe"/>
                        <button id="submit" color="primary" type="submit" class='button'>Créer le compte</button>
                        <div id="switch">
            <label class="container">Vendeur
  <input type="radio" id="slider"></input>
  <span class="checkmark"></span>
</label>

</div>
                </form>

        <a href="Connexion">Déja un compte? Connectez-vous.</a>

</div>
  }
}
 
export default Creation;