import React, { Component } from 'react';
<<<<<<< HEAD
//import './App.css';

import { FormControlLabel, Checkbox, Paper, Grid2, Button, OutlinedInput, InputLabel, InputAdornment, IconButton, FormControl } from '@mui/material';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import socketIOClient from "socket.io-client";
const ENDPOINT = "http://192.168.37.1:4001";
=======
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {  Link, Grid2 } from "@mui/material";
import RegisterComp from '../components/RegisterComp';
>>>>>>> 69fa7b0d5ef83c70fb546c6f4e82d6e5871a1d16


function RegisterComp() {

    const [nom, setNom] = React.useState();
    const [courriel, setCourriel] = React.useState();
    const [postal, setPostal] = React.useState();
    const [password, setPassword] = React.useState();
    const [confPass, setConfPass] = React.useState();
    const [vendor, setVendor] = React.useState(false);

    const [passMatch, setPassMatch] = React.useState(true);

    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
    const handleMouseDownConfirmPassword = (event) => {event.preventDefault();};
    const handleMouseUpConfirmPassword = (event) => {event.preventDefault();};

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {event.preventDefault();};
    const handleMouseUpPassword = (event) => {event.preventDefault();};

    const handleVendorCheckbox = () => setVendor(!vendor);

    const Submit = (event) => {
        
        if (event) {

            event.preventDefault();

            if (password == confPass && password != null) {

                setPassMatch(true)

                     
                const socket = socketIOClient(ENDPOINT);
                //client donne le surnom de l'utilisateur au serveur
                var slider=2;

                if(document.getElementById("slider").checked==true){
                    slider=1;
                }
                else{
                    slider=0;
                }

                var user=[nom, courriel, postal, password, vendor];
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
                                        localStorage.setItem("nom", arg[1]);
                                        document.location.href=arg[0];
                                    }
                                });
                    }, 1000);
                }
                

            }

            else {

                setPassMatch(false)

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

            <FormControl
                sx={{
                    m: 1,
                    width: '500px',
                    alignSelf: 'center',
                    backgroundColor: "transparent"
                }}
                variant="outlined"
                error={nom === ""}
            >

            <InputLabel htmlFor="nom">Nom*</InputLabel>
            <OutlinedInput
            id="nom"
            label="nom"
            required
            onInput={e=> setNom(e.target.value)}
            error={nom === ""}
            
            />

            </FormControl>

            <FormControl
                sx={{
                    m: 1, 
                    width: '500px',
                    alignSelf: 'center',
                    backgroundColor: "transparent"
                }}
                variant="outlined"
                error={courriel === ""}
            >

                <InputLabel htmlFor="email">Couriel*</InputLabel>
                <OutlinedInput
                id="email"
                required
                error={courriel === ""}
                onInput={e => setCourriel(e.target.value)}
                />

            </FormControl>

            <FormControl
                sx={{
                    m: 1,
                    width: '500px',
                    alignSelf: 'center',
                    backgroundColor: "transparent"
                }}
                variant="outlined"
                error={postal === ""}
            >

                <InputLabel htmlFor="postal">Code Postal*</InputLabel>
                <OutlinedInput
                id="postal"
                required
                inputProps={{ maxLength: 6}}
                error={postal === ""}
                onInput={e => setPostal(e.target.value)}
                />

            </FormControl>

            <FormControl
                sx={{
                    m: 1,
                    width: '500px',
                    alignSelf: 'center',
                    backgroundColor: "transparent"
                }}
                variant="outlined"
                error={password === ""}
            >

                <InputLabel htmlFor="password">Mot de Passe*</InputLabel>
                <OutlinedInput
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    onInput={e => setPassword(e.target.value)}
                    error={password === ""}
                    endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                        aria-label={
                            showPassword ? 'hide the password' : 'display the password'
                        }
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                        >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                    }
                />

            </FormControl>

            <FormControl
                sx={{
                    m: 1,
                    width: '500px',
                    alignSelf: 'center',
                    backgroundColor: "transparent"
                }}
                variant="outlined"
                error={confPass === "" & confPass == password}
            >

                <InputLabel htmlFor="confirm-password">Confirme Mot de Passe*</InputLabel>
                <OutlinedInput
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    onInput={e => {
                        setConfPass(e.target.value);
                        
                    }}
                    endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                        aria-label={
                            showConfirmPassword ? 'hide the password' : 'display the password'
                        }
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownConfirmPassword}
                        onMouseUp={handleMouseUpConfirmPassword}
                        edge="end"
                        >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                    }
                    error={passMatch === false}
                />

            </FormControl>

            <FormControl sx={{ m: 1, width: '500px', alignSelf: 'center', backgroundColor: "transparent" }}>

                <FormControlLabel control={<Checkbox onChange={handleVendorCheckbox} />} label="Vendeur" />

            </FormControl>

            <Button 
                sx={{ 
                    m: 1,
                    alignSelf: 'center',
                    width:"25%" 
                }}
                variant="contained"
                type='submit'
                onClick={Submit}
            >
                Registre
            </Button>

        </Grid2>

        </Paper>
    );

}


class Creation extends Component {
<<<<<<< HEAD
    async Submit(event) {
        if (event) {
            event.preventDefault(); 
            const socket = socketIOClient(ENDPOINT);
            //client donne le surnom de l'utilisateur au serveur
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
                                    localStorage.setItem("nom", arg[1]);
                                    document.location.href=arg[0];
                                }
                            });
                }, 1000);
            }
        }
    }
=======
>>>>>>> 69fa7b0d5ef83c70fb546c6f4e82d6e5871a1d16

        //Va afficher une fleche de retour a la page d'acceuil, le titre de la page, le formulaire de creation (voire le fichier components/RegisterComp pour plus d'explication) et un lien si le compte a deja ete creer
    render() { 
        return <div id="background">
                <IconButton href="/" sx={{color:"black", padding: 0}} size="large">
<ArrowBackIosIcon/>
</IconButton>
                <h1>
        Creation d’un compte
        </h1>
<<<<<<< HEAD

        <Grid2
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
        >
            <RegisterComp/>
        </Grid2>

        {/*<form onSubmit={this.Submit}>
        <input type="text" id="nom" class='input' placeholder="Nom"/>
            <input type="text" id="courriel" class='input' placeholder="Courriel"/>
            <input type="text" id="postal" class='input' placeholder="Code postale"/>
            <input type="text" id="password" class='input' placeholder="Mot de passe"/>
                        <button id="submit" color="primary" type="submit" class='button'>Créer le compte</button>
                        <div id="switch">
            <label class="container">Vendeur
  <input type="radio" id="slider"></input>
  <span class="checkmark"></span>
</label>

</div>
                </form>*/}
        <a id="hidden">Vous devez remplir tous les champs.</a>
=======
        <Grid2
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        >
            <RegisterComp/>
        </Grid2>

        <a id="hidden">Les mots de passe sont different.</a>
        <a id="hidden2">Vous devez remplir tous les champs.</a>
        <Link href="Connexion">Déja un compte? Connectez-vous.</Link>
>>>>>>> 69fa7b0d5ef83c70fb546c6f4e82d6e5871a1d16


</div>
  }
}
 
export default Creation;