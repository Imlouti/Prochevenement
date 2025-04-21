import React, { Component } from 'react';
import { Navigator } from '../components/Navigator';
import { Button, Box, Link } from "@mui/material";

// Vérification de l'existence du nom dans le localStorage
let nomUtilisateur = localStorage.getItem("nom");
if (nomUtilisateur) {
    nomUtilisateur = nomUtilisateur.split(",");
    nomUtilisateur = nomUtilisateur[0].split(" ");
    nomUtilisateur = nomUtilisateur[0]; // Utilisation du nom
} else {
    console.log("Nom d'utilisateur introuvable dans le localStorage.");
}

function Parametres() {
    return (
        <div id="background">
            <Box sx={{ display: 'flex', gap: 2 }}>
                <section id="user">
                    <p id="user">Bonjour, {nomUtilisateur} </p>
                </section>
                <section id="bar">
                    <Navigator />
                </section>
            </Box>

            <Box textAlign='center'>
                <Button
                    variant='contained'
                    size='large'
                    onClick={() => {
                        document.location.href = "Modifier";
                    }}
                >
                    Modifier le compte
                </Button>
                <Link href="Annuler">Annuler un événement</Link>
            </Box>
        </div>
    );
}

export default Parametres;
