
import React, { Component } from 'react';
import { Navigator } from '../components/Navigator';
let nomUtilisateur = localStorage.getItem("nom");
if (nomUtilisateur) {
    nomUtilisateur = nomUtilisateur.split(",");
    nomUtilisateur = nomUtilisateur[0].split(" ");
    nomUtilisateur = nomUtilisateur[0]; // Utilisation du nom
} else {
    console.log("Aucun nom trouvé dans localStorage.");
}

function Propos() {
    return <div id="background">
        <section id="user">
            <p id="user">Bonjour, {nomUtilisateur} </p>
        </section>
        <section id="bar">
            <Navigator/>
        </section>
        <a><img src="logo.png" alt="Logo Prochévénements" /></a>
        <h1>Qui sommes-nous ?</h1>
        <h3>
            Chez Prochévénements, nous travaillons premierement pour optimiser votre recherche d’événements locaux...
        </h3>
    </div>;
}

export default Propos;
    