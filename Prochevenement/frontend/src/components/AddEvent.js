import React from "react";
import { Paper, Grid2, Button, OutlinedInput, InputLabel, FormControl } from '@mui/material';
import dayjs from 'dayjs';


import { useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


export default function AddEvent() {

  const [value, setValue] = React.useState(dayjs('2025-04-21'));

    const theme = useTheme();
      //le formulaire de creation dun evenement a le nom, courriel, postal, le mot de passe, mot de passe encore et une case à cocher
    return (
        <Paper sx={{ textAlign: "center" }}>

        <Grid2
            container
            spacing={0}
            direction="column"
            sx={{backgroundColor: "transparent"}}
        >

            <FormControl sx={{ m: 1, width: '500px', alignSelf: 'center', backgroundColor: "transparent" }} variant="outlined">

            <InputLabel htmlFor="nomevenement">Titre</InputLabel>
            <OutlinedInput
            id="nomevenement"
            label="nomevenement"
            />

            </FormControl>

            <FormControl sx={{ m: 1, width: '500px', alignSelf: 'center', backgroundColor: "transparent" }} variant="outlined">

                <InputLabel htmlFor="description">Description</InputLabel>
                <OutlinedInput
                id="description"
                label="description"
                />

            </FormControl>

            <FormControl sx={{ m: 1, width: '500px', alignSelf: 'center', backgroundColor: "transparent" }} variant="outlined">

<InputLabel htmlFor="prix">Prix</InputLabel>
<OutlinedInput
id="prix"
label="prix"
/>

</FormControl>


<FormControl sx={{ m: 1, width: '500px', alignSelf: 'center', backgroundColor: "transparent" }} variant="outlined">

<LocalizationProvider dateAdapter={AdapterDayjs}>

<DatePicker label="Date"           value={value}
          onChange={(newValue) => setValue(newValue)} />
</LocalizationProvider>
</FormControl>

<FormControl sx={{ m: 1, width: '500px', alignSelf: 'center', backgroundColor: "transparent" }} variant="outlined">

<InputLabel htmlFor="addresse">Addresse</InputLabel>
<OutlinedInput
id="addresse"
label="addresse"
/>

</FormControl>

<FormControl sx={{ m: 1, width: '500px', alignSelf: 'center', backgroundColor: "transparent" }} variant="outlined">

<InputLabel htmlFor="billets">Billets</InputLabel>
<OutlinedInput
id="billets"
label="billets"
/>

</FormControl>



            <Button 
                label="Login" 
                sx={{ 
                m: 1,
                alignSelf: 'center',
                width:"25%" 
                }}
                variant="contained"
                onClick={async() => {
                                  //quand que le boutton est cliquer pour ce connecter les messages d'erreurs s'efface
                    document.getElementById("hidden").style.display = "none";
                    
                    console.log('Form Submitted');  // Débogage
            // Collecting event data from the form
            const evenement = {
                nom: document.getElementById("nomevenement").value,
                description: document.getElementById("description").value,
                prix: document.getElementById("prix").value,
                date: value.toString(),
                location: document.getElementById("addresse").value,
                billets: document.getElementById("billets").value,
                vendeurId: JSON.parse(localStorage.getItem("user"))?.vendeurId // Ajouter l'ID du vendeur
            };
            console.log("Objet événement à envoyer:", evenement);  // Vérifiez ce qui est envoyé
            // Check if any fields are empty
            const isAtLeastOneNull = Object.values(evenement).some(i => i === "");
            if (isAtLeastOneNull) {
                document.getElementById("hidden").style.display = "block"; // Show error if fields are empty
                return;
            }

            // Sending the user data to the backend to create the account
            try {
                const response = await fetch('http://localhost:4001/auth/event', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(evenement) // Converting user object to JSON string
                });

                const data = await response.json();
                console.log(data);

                if (response.ok) {
                    // Redirect to vendor page after successful addition
                    document.location.href = "Vendeur";
                } else {
                    // Handle errors from the server 
                    console.error('Error:', data);
                }
            } catch (error) {
                console.error('There was an error creating the account:', error);
            }
                }}>
                Creation
                </Button>

        </Grid2>

        </Paper>
    );

}