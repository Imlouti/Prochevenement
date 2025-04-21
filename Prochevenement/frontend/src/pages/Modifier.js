import React, { Component } from 'react';
import { Navigator } from '../components/Navigator';
//import './App.css';
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Button, Box, Link } from "@mui/material";


class Modifier extends Component {
    state = {
        nom: "",
        courriel: "",
        postal: "",
    };

    componentDidMount() {
        // Récupérer les informations de l'utilisateur à partir de localStorage
        const nom = localStorage.getItem('nom');
        const courriel = localStorage.getItem('courriel');
        const postal = localStorage.getItem('postal');

        // Mettre à jour l'état avec les informations de l'utilisateur
        this.setState({ nom, courriel, postal });
    }

    async Submit(event) {
        if (event) {
            event.preventDefault(); 
            // Collecter les nouvelles données
            const modifier = {
                nom: this.state.nom,
                courriel: this.state.courriel,
                postal: this.state.postal,
            };

            // Votre logique pour envoyer ces données au backend
        }
    }

    render() { 
        return (
            <div>
                <input 
                    type="text" 
                    value={this.state.nom} 
                    onChange={(e) => this.setState({ nom: e.target.value })} 
                    placeholder="Nom" 
                />
                <input 
                    type="text" 
                    value={this.state.courriel} 
                    onChange={(e) => this.setState({ courriel: e.target.value })} 
                    placeholder="Courriel" 
                />
                <input 
                    type="text" 
                    value={this.state.postal} 
                    onChange={(e) => this.setState({ postal: e.target.value })} 
                    placeholder="Code postal" 
                />
                <button onClick={this.Submit}>Confirmer</button>
            </div>
        );
    }
}

 
export default Modifier;