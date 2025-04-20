import React from "react";
import { FormControlLabel, Checkbox, Paper, Grid2, Button, OutlinedInput, InputLabel, InputAdornment, IconButton, FormControl } from '@mui/material';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useTheme } from '@mui/material/styles';

export default function RegisterComp() {

    const [showPassword, setShowPassword] = React.useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

    const handleMouseDownConfirmPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpConfirmPassword = (event) => {
        event.preventDefault();
    };
    

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

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

            <InputLabel htmlFor="email">Nom</InputLabel>
            <OutlinedInput
            id="nom"
            label="nom"
            />

            </FormControl>

            <FormControl sx={{ m: 1, width: '500px', alignSelf: 'center', backgroundColor: "transparent" }} variant="outlined">

                <InputLabel htmlFor="email">Email</InputLabel>
                <OutlinedInput
                id="email"
                label="Email"
                />

            </FormControl>

            <FormControl sx={{ m: 1, width: '500px', alignSelf: 'center', backgroundColor: "transparent" }} variant="outlined">

                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-password"
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
                        edge="end"
                        >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                    }
                    label="Password"
                />

            </FormControl>

            <FormControl sx={{ m: 1, width: '500px', alignSelf: 'center', backgroundColor: "transparent" }} variant="outlined">

                <InputLabel htmlFor="outlined-adornment-confirm-password">Confirme Password</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
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
                    label="Password"
                />

            </FormControl>

            <FormControl sx={{ m: 1, width: '500px', alignSelf: 'center', backgroundColor: "transparent" }}>

                <FormControlLabel control={<Checkbox/>} label="Vendeur" />

            </FormControl>

            <Button 
                label="Login" 
                sx={{ 
                m: 1,
                alignSelf: 'center',
                width:"25%" 
                }}
                variant="contained"
                onClick={() => {
                alert('clicked');
                }}>
                Registre
                </Button>

        </Grid2>

        </Paper>
    );

}