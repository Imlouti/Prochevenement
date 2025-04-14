import React, { Component } from 'react';
//import './App.css';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://192.168.37.1:4001";

class Creation extends Component {
    async Submit(event) {
        if (event) {
            event.preventDefault(); 
            const socket = socketIOClient(ENDPOINT);
            //date only in format of "2025-03-12"
            var event=[document.getElementById("nomevenement").value,document.getElementById("description").value, document.getElementById("prix").value, document.getElementById("date").value, document.getElementById("billets").value];
            console.log(event);
            var isAtLeastOneNull =event.some(function(i) { return i === ""; })
            if(isAtLeastOneNull===true){
                document.getElementById("hidden").style.display="block";
            }
            else{
            socket.on("evenement", (arg, callback) => {
                callback(event);
            });
            //serbeur donne la route pour changer de page
            setInterval(() => {
                const socket = socketIOClient(ENDPOINT);
                        socket.on("evenement", (arg, callback) => {
                            console.log(arg);
                            if(arg!=undefined){
                                localStorage.setItem("event", event);
                                document.location.href=arg;
                            }
                        });
            }, 1000);
        }
    }
    }


    render() { 
        return <div id="background">
                <section id="back">
        <a href="Vendeur" id="img"><img src="fleche.png"></img></a>
        </section>
                <h1>
        Creation d’un événement
        </h1>
        <form onSubmit={this.Submit}>
        <input type="text" id="nomevenement" class='input' placeholder="Nom"/>
            <input type="text" id="description" class='input' placeholder="Description"/>
            <input type="text" id="prix" class='input' placeholder="Prix"/>
            <input type="text" id="date" class='input' placeholder="YYYY-MM-DD"/>
            <input type="text" id="billets" class='input' placeholder="Billets totale"/>
                        <button id="submit" color="primary" type="submit" class='button'>Confirmer</button>
                </form>
                <a id="hidden">Vous devez remplir tous les champs.</a>


</div>
  }
}
 
export default Creation;