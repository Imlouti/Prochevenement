import React, { Component } from 'react';
//import './App.css';
import { Grid2 } from '@mui/material';
import socketIOClient from "socket.io-client";
import RegisterComp from '../components/RegisterComp';

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
            console.log(user);
            var isAtLeastOneNull =user.some(function(i) { return i === ""; })
            if(isAtLeastOneNull===true){
                document.getElementById("hidden").style.display="block";
            }
            else{
            socket.on("utilisateur", (arg, callback) => {
                callback(user);
            });
            //serbeur donne la route pour changer de page
            setInterval(() => {
                const socket = socketIOClient(ENDPOINT);
                        socket.on("utilisateur", (arg, callback) => {
                            console.log(arg);
                            if(arg!=undefined){
                                localStorage.setItem("nom", arg);
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
        <a href="/" id="img"><img src="fleche.png"></img></a>
        </section>
                <h1>
        Creation d’un compte
        </h1>

        <Grid2
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        >
            <RegisterComp/>
        </Grid2>

        <a id="hidden">Vous devez remplir tous les champs.</a>

        <a href="Connexion">Déja un compte? Connectez-vous.</a>

</div>
  }
}
 
export default Creation;