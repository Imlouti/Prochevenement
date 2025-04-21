import React, { Component } from 'react';
import { Button, Box, TextField } from '@mui/material';

class ModifierEvenement extends Component {
    state = {
        nomevenement: "",
        description: "",
        prix: "",
        date: "",
        billets: "",
        loading: true,
        error: null,
    };

    // Récupérer les informations de l'événement depuis l'API lors du montage du composant
    async componentDidMount() {
        const eventId = this.props.match.params.id;  // Récupérer l'ID de l'événement depuis les paramètres de l'URL

        try {
            const response = await fetch(`http://localhost:4001/api/events/${eventId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des informations de l\'événement');
            }

            const eventData = await response.json();

            // Mettre à jour l'état avec les informations de l'événement
            this.setState({
                nomevenement: eventData.nom,
                description: eventData.description,
                prix: eventData.prix,
                date: eventData.date,
                billets: eventData.billets,
                loading: false,
            });
        } catch (error) {
            this.setState({ error: error.message, loading: false });
        }
    }

    // Gestion du formulaire de modification
    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    // Soumission des modifications
    async handleSubmit(event) {
        event.preventDefault();
        const { nomevenement, description, prix, date, billets } = this.state;

        // Validation des données (si nécessaire)
        if (!nomevenement || !description || !prix || !date || !billets) {
            alert("Tous les champs doivent être remplis.");
            return;
        }

        // Logique pour envoyer les données mises à jour à l'API ou au backend
        const updatedEvent = {
            nomevenement,
            description,
            prix,
            date,
            billets,
        };

        try {
            const response = await fetch(`http://localhost:4001/api/events/${this.props.match.params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedEvent),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Événement mis à jour avec succès:', data);
                alert('Événement mis à jour!');
                // Vous pouvez rediriger ou rafraîchir la page selon le besoin
            } else {
                console.error('Erreur lors de la mise à jour de l\'événement:', data);
                alert('Une erreur est survenue.');
            }
        } catch (error) {
            console.error('Erreur de connexion:', error);
            alert('Une erreur de connexion est survenue.');
        }
    }

    render() {
        const { nomevenement, description, prix, date, billets, loading, error } = this.state;

        // Affichage d'un message de chargement si les données ne sont pas encore disponibles
        if (loading) {
            return <div>Chargement...</div>;
        }

        // Affichage d'un message d'erreur si une erreur s'est produite lors de la récupération des données
        if (error) {
            return <div>Erreur: {error}</div>;
        }

        return (
            <div id="background">
                <h1>Modifier un événement</h1>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Nom de l'événement"
                            variant="outlined"
                            fullWidth
                            name="nomevenement"
                            value={nomevenement}
                            onChange={this.handleChange}
                        />
                        <TextField
                            label="Description"
                            variant="outlined"
                            fullWidth
                            name="description"
                            value={description}
                            onChange={this.handleChange}
                        />
                        <TextField
                            label="Prix"
                            variant="outlined"
                            fullWidth
                            name="prix"
                            value={prix}
                            onChange={this.handleChange}
                        />
                        <TextField
                            label="Date"
                            variant="outlined"
                            fullWidth
                            name="date"
                            value={date}
                            onChange={this.handleChange}
                        />
                        <TextField
                            label="Billets Restants"
                            variant="outlined"
                            fullWidth
                            name="billets"
                            value={billets}
                            onChange={this.handleChange}
                        />
                    </Box>

                    <Box textAlign='center' sx={{ mt: 2 }}>
                        <Button variant='contained' size='large' type="submit">
                            Confirmer les modifications
                        </Button>
                    </Box>
                </form>
            </div>
        );
    }
}

export default ModifierEvenement;
