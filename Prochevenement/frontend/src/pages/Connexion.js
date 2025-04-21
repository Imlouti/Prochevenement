
import React, { Component } from 'react';
//import './App.css';

//import LoginComp from '../components/LoginComp';
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Button, Box, Link } from "@mui/material";


class Connexion extends Component {
    async Submit(event) {

        if (event) {
            event.preventDefault(); 
            localStorage.setItem('courriel',document.getElementById("courriel").value);

            const user = {
                courriel: document.getElementById("courriel").value,
                motpasse: document.getElementById("password").value
            };
            
             // Envoi des données de connexion au backend pour vérifier les identifiants
             try {
                const response = await fetch('http://localhost:4001/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(user)
                });

                const data = await response.json();
                console.log(data);

                if (response.ok) {
                    // Si la connexion est réussie, 
                    // Enregistrez les informations de l'utilisateur dans le localStorage
                    localStorage.setItem('user', JSON.stringify({
                        nom: data.nom, // renvoyer le nom depuis le backend
                        role: data.role // Renvoie le rôle de l'utilisateur (vendeur ou utilisateur)
                    }));

                    // Rediriger vers la page appropriée

                    document.location.href = data.route; // Utilise la route retournée par le serveur
                } else {
                    // En cas d'échec, afficher un message d'erreur
                    document.getElementById("hidden").style.display = "block";
                }
            } catch (error) {
                console.error('There was an error logging in:', error);
            }
          
        }
    }
        
    render() { 

                return <div id="background">


                <IconButton href="/" sx={{color:"black", padding: 0}} size="large">
<ArrowBackIosIcon/>
</IconButton>
        <h1>
        Connexion
        </h1>
        <form onSubmit={this.Submit}>
            <input type="text" id="courriel" class="input" placeholder="Courriel"/>
            <input type="text" id="password" class="input" placeholder="Mot de passe"/>
                        <button id="submit" class="button" color="primary" type="submit">Connexion</button>
                        

                </form>
                <a id="hidden">Ce compte n'existe pas.</a>

    
<Box sx={{display: 'flex', gap: 2}}>
<Link href="Creation">Pas de compte? Créer un compte.</Link>
<Link href="Oublier" id='oublier'>Oublier le mot de passe</Link>

</Box>


</div>

    

  }

}

 
export default Connexion;
