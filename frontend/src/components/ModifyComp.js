import React from 'react';
import { Grid2, Button, TextField, FormControl } from '@mui/material';

var eventInfo = [];

const event = {
    courriel: localStorage.getItem('courriel')
};

try {
    const response = await fetch('http://localhost:5000/auth/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
    });
    const data = await response.json();
    if (response.ok) {
        eventInfo.push(data.nom);
        eventInfo.push(data.postal);
    }
} catch (error) {
    console.error('There was an error loading user info:', error);
}

export default function ModifyComp() {
    return (
        <Grid2
            container
            spacing={0}
            direction="column"
            sx={{ width: '100%' }}
        >
            <FormControl sx={{ mb: 2, width: '100%' }} variant="outlined">
                <TextField id="nom" label="Nom" defaultValue={eventInfo[0]} variant="outlined" fullWidth />
            </FormControl>

            <FormControl sx={{ mb: 2, width: '100%' }} variant="outlined">
                <TextField id="postal" label="Code postal" defaultValue={eventInfo[1]} variant="outlined" fullWidth />
            </FormControl>

            <Button
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 1, mb: 2 }}
                onClick={async () => {
                    document.getElementById('hidden').style.display = 'none';

                    let courriel = localStorage.getItem('courriel');
                    const modifier = {
                        courriel,
                        nom: document.getElementById('nom').value,
                        postal: document.getElementById('postal').value,
                    };

                    const isAtLeastOneNull = Object.values(modifier).some(i => i === '');
                    if (isAtLeastOneNull) {
                        document.getElementById('hidden').style.display = 'block';
                        return;
                    }

                    try {
                        const response = await fetch('http://localhost:5000/auth/modify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(modifier),
                        });
                        const data = await response.json();
                        if (response.ok) {
                            document.location.href = 'Parametres';
                        } else {
                            console.error('Error:', data);
                        }
                    } catch (error) {
                        console.error('There was an error modifying the account:', error);
                    }
                }}
            >
                Modifier
            </Button>

            <Button
                variant="outlined"
                fullWidth
                size="large"
                sx={{ borderColor: '#C0392B', color: '#C0392B', '&:hover': { backgroundColor: '#C0392B', color: '#FAF7F2', borderColor: '#C0392B', boxShadow: 'none' } }}
                onClick={async () => {
                    let courriel = localStorage.getItem('courriel');
                    const supprimer = { courriel };

                    try {
                        const response = await fetch('http://localhost:5000/auth/delete', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(supprimer),
                        });
                        const data = await response.json();
                        if (response.ok) {
                            document.location.href = '/';
                        } else {
                            console.error('Error:', data);
                        }
                    } catch (error) {
                        console.error('There was an error deleting the account:', error);
                    }
                }}
            >
                Supprimer le compte
            </Button>
        </Grid2>
    );
}
