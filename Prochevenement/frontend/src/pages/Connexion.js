
import React, { Component } from 'react';
<<<<<<< HEAD
//import './App.css';
import { Paper, Grid2, Button, OutlinedInput, InputLabel, InputAdornment, IconButton, FormControl } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import socketIOClient from "socket.io-client";
const ENDPOINT = "http://192.168.37.1:4001";


function LoginComp() {

    const [courriel, setCourriel] = React.useState('');
    const [password, setPassword] = React.useState('');

    const [nonExist, setNonExist] = React.useState(false);
  
    const [showPassword, setShowPassword] = React.useState(false);

    const handleNonExisting = () => setNonExist((show) => !show);
  
    const handleClickShowPassword = () => setShowPassword((show) => !show);
  
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
  
    const handleMouseUpPassword = (event) => {
      event.preventDefault();
    };

    const Submit = (event) => {

        event.preventDefault();

        if (event) {
            var user=courriel;
            console.log(user);
            var user2=[courriel, password];
            if(user==''){
                setNonExist(false);
            }
            
            else{
                user=user.split(",");
                if(user[0]==user2[0] && user[1]==user2[1] && user[3]==user2[2]){
                    if(user[4==1]){
                        document.location.href="Vendeur";
                    }
                    else{
                        document.location.href="Magasiner";
                    }
                }
                else{
                    document.getElementById("oublier").style.color="red";
                }
            }
          
        }

    }
  
    return (
      <Paper sx={{ textAlign: "center" }}>
  
        <Grid2
          container
          spacing={0}
          direction="column"
          sx={{backgroundColor: "transparent"}}
          
        >
  
        <FormControl sx={{ m: 1, width: '500px', alignSelf: 'center', backgroundColor: "transparent" }} variant="outlined">
  
          <InputLabel htmlFor="courriel">Couriel</InputLabel>
          <OutlinedInput
            id="courriel"
            label="Courriel"
            onInput={e=>setCourriel(e.target.value)}
        />
  
        </FormControl>
  
        <FormControl sx={{ m: 1, width: '500px', alignSelf: 'center', backgroundColor: "transparent" }} variant="outlined">
  
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              id="password"
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword ? 'hide the password' : 'display the password'
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    onInput={e => setPassword(e.target.value)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />

            
  
        </FormControl>
        
        <p
        hidden={!nonExist}>Ce compte n'existe pas.</p>
  
            <Button 
              label="Login" 
              sx={{ 
                m: 1,
                alignSelf: 'center',
                width:"25%" 
              }}
              variant="contained"
              type="submit"
              onClick={Submit}
              >
                Login
            </Button>
  
        </Grid2>
  
      </Paper>
    );
  }

class Connexion extends Component {
        
=======
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Box, Link, Grid2 } from "@mui/material";
import LoginComp from '../components/LoginComp';



class Connexion extends Component {
   
        //Va afficher une fleche de retour a la page d'acceuil, le titre de la page, le formulaire de connexion (voire le fichier components/LoginComp pour plus d'explication) et deux liens pour creer un compte et pour le mot de passe oublier
>>>>>>> 69fa7b0d5ef83c70fb546c6f4e82d6e5871a1d16
    render() { 

                return <div id="background">


                <IconButton href="/" sx={{color:"black", padding: 0}} size="large">
<ArrowBackIosIcon/>
</IconButton>
        <h1>
        Connexion
        </h1>
<<<<<<< HEAD

        <Grid2
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
        >
            <LoginComp/>
        </Grid2>

        {//<form onSubmit={this.Submit}>
            //<input type="text" id="courriel" class="input" placeholder="Courriel"/>
            //<input type="text" id="password" class="input" placeholder="Mot de passe"/>
                        //<button id="submit" class="button" color="primary" type="submit">Connexion</button>
                        

                //</form>
                //<a id="hidden">Ce compte n'existe pas.</a>
        }
        <p id="two">
        
=======
        <Grid2
  container
  spacing={0}
  direction="column"
  alignItems="center"
  justifyContent="center"
>
    <LoginComp/>
</Grid2>

                <a id="hidden">Ce compte n'existe pas.</a>
                <a id="hidden2">Vous devez remplir tous les champs.</a>
>>>>>>> 69fa7b0d5ef83c70fb546c6f4e82d6e5871a1d16


    
<Box sx={{display: 'flex', gap: 2}}>
<Link href="Creation">Pas de compte? Créer un compte.</Link>
<Link href="Oublier" id='oublier'>Oublier le mot de passe</Link>

</Box>


</div>

    

  }

}

 
export default Connexion;
