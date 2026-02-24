import React from "react";
import {  Paper, Grid2, Button, TextField, OutlinedInput, InputLabel, InputAdornment, IconButton, FormControl } from '@mui/material';

import dayjs from 'dayjs';


import { useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


var idx = document.URL.indexOf('@');
var list = document.URL.split("");
var params = new Array();
  for (var i=idx+1; i<list.length; i++) {
    params.push(list[i]);
     }
  
  params=params.join("");

  var eventInfo=[];
  eventInfo.push(params);

  const event = {
    nom: params
};



 // Envoi des données de connexion au backend (voire app.js route de connexion pour plus de detail) pour vérifier les identifiants
 try {
    const response = await fetch('http://localhost:4001/auth/eventSearch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
        // Si la connexion est réussie, 
        // Enregistrez les informations de l'utilisateur dans le localStorage
        eventInfo.push(data.description);
        eventInfo.push(data.prix);
        eventInfo.push(data.date);
        eventInfo.push(data.location);
        eventInfo.push(data.billets);
    } 
} catch (error) { //pour toute autre erreurs
    console.error('There was an error logging in:', error);
}







export default function ModifyEvent() {
    const [value, setValue] = React.useState(dayjs(eventInfo[3]));
  
  //le formulaire de modification a le nom, courriel et le mot de passe (la modification du courriel nest pas possible)
    const theme = useTheme();
    return (
        <Paper sx={{ textAlign: "center" }}>

        <Grid2
            container
            spacing={0}
            direction="column"
            sx={{backgroundColor: "transparent"}}
        >

           

            <FormControl sx={{ m: 1, width: '500px', alignSelf: 'center', backgroundColor: "transparent" }} variant="outlined">

                <TextField id='description' label="Description" defaultValue={eventInfo[1]} variant="outlined"/>

            </FormControl>

            <FormControl sx={{ m: 1, width: '500px', alignSelf: 'center', backgroundColor: "transparent" }} variant="outlined">
            <TextField id='prix' label="Prix" defaultValue={eventInfo[2]} variant="outlined"/>


</FormControl>


<FormControl sx={{ m: 1, width: '500px', alignSelf: 'center', backgroundColor: "transparent" }} variant="outlined">

<LocalizationProvider dateAdapter={AdapterDayjs}>

<DatePicker label="Date"           value={value}
          onChange={(newValue) => setValue(newValue)} />
</LocalizationProvider>
</FormControl>

<FormControl sx={{ m: 1, width: '500px', alignSelf: 'center', backgroundColor: "transparent" }} variant="outlined">
<TextField id='addresse' label="Addresse" defaultValue={eventInfo[4]} variant="outlined"/>


</FormControl>

<FormControl sx={{ m: 1, width: '500px', alignSelf: 'center', backgroundColor: "transparent" }} variant="outlined">

<TextField id='billets' label="Billets" defaultValue={eventInfo[5]} variant="outlined"/>

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

                    console.log('Form Submitted');  // Débogage
            // Donnees a modifier du formulaire
            const modifier = {
                nom: eventInfo[0],
                description: document.getElementById("description").value,
                prix: document.getElementById("prix").value,
                date: value.toString(),
                location: document.getElementById("addresse").value,
                billets: document.getElementById("billets").value
            };

            // Voire si un des champs est vide
            const isAtLeastOneNull = Object.values(modifier).some(i => i === "");
            if (isAtLeastOneNull) {
                document.getElementById("hidden").style.display = "block"; // Message d'erreur si vide
                return;
            }


            // Envoie les donnees au backend pour le mettre a jour
            try {
                const response = await fetch('http://localhost:4001/auth/eventModify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(modifier) 
                });

                const data = await response.json();
                console.log(data);    

                if (response.ok) {
                    // Redirection vers la page parametres apres une modification reussi
                    document.location.href = "Vendeur";
                } else {
                    // Gerer les erreurs du serveur 
                    console.error('Error:', data);
                }
            } catch (error) {
                console.error('There was an error reinitializing the password:', error);
            }
                }}>
                Modifier
                </Button>

                <Button 
                label="Login" 
                sx={{ 
                m: 1,
                alignSelf: 'center',
                width:"25%" 
                }}
                variant="contained"
                onClick={async() => {

                    console.log('Form Submitted');  // Débogage
            // Donnees a modifier du formulaire
            const supprimer = {
                nom: eventInfo[0]
                        };

            // Voire si un des champs est vide


            // Envoie les donnees au backend pour le mettre a jour
            try {
                const response = await fetch('http://localhost:4001/auth/eventDelete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(supprimer) 
                });

                const data = await response.json();
                console.log(data);    

                if (response.ok) {
                    // Redirection vers la page parametres apres une modification reussi
                    document.location.href = "Vendeur";
                } else {
                    // Gerer les erreurs du serveur 
                    console.error('Error:', data);
                }
            } catch (error) {
                console.error('There was an error reinitializing the password:', error);
            }
                }}>
                Supprimer
                </Button>

        </Grid2>

        </Paper>
    );

}